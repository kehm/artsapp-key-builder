import React, {
    useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import debounce from 'lodash/debounce';
import PostAdd from '@material-ui/icons/PostAdd';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import SaveOutlined from '@material-ui/icons/SaveOutlined';
import DeleteOutlined from '@material-ui/icons/DeleteOutlined';
import IconButton from '@material-ui/core/IconButton';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LanguageContext from '../../context/LanguageContext';
import { createTaxon } from '../../utils/api/create';
import { getTaxonSuggestions, getVernacularName } from '../../utils/api/get';
import SuggestionList from '../components/lists/SuggestionList';
import RichEditor from '../components/inputs/RichEditor';
import { updateTaxon } from '../../utils/api/update';
import CloseButton from '../components/CloseButton';
import ConfirmDelete from './ConfirmDelete';
import { findTaxon } from '../../utils/taxon';
import SetMediaInfo from './SetMediaInfo';
import FileDrop from '../components/inputs/FileDrop';
import UnsavedChanges from './UnsavedChanges';
import { convertEditorToHtml, getTaxonInfoValues } from '../../utils/form-values';
import TextInput from '../components/inputs/TextInput';
import getInputChange from '../../utils/input-change';
import { handleUpdateRevisionMedia } from '../../utils/media';
import ProgressIndicator from '../components/ProgressIndicator';
import LanguageBar from '../components/LanguageBar';

/**
 * Render create taxon dialog
 */
const CreateTaxon = ({
    openDialog, revision, id, languages, onClose, onCreated, onRemove,
}) => {
    const { language } = useContext(LanguageContext);
    const [defaultFormValues, setDefaultFormValues] = useState({
        parentId: '',
        scientificName: '',
        vernacularNameNo: '',
        vernacularNameEn: '',
        descriptionNo: '',
        descriptionEn: '',
        keyId: revision && revision.keyId,
        revisionId: revision && revision.id,
        files: [],
        existingFiles: [],
        taxonMedia: undefined,
    });
    const [formValues, setFormValues] = useState(defaultFormValues);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [error, setError] = useState(undefined);
    const [tab, setTab] = useState(0);
    const [suggestions, setSuggestions] = useState([]);
    const [taxaOptions, setTaxaOptions] = useState(undefined);
    const [openMediaDialog, setOpenMediaDialog] = useState({ index: undefined, existing: false });
    const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
    const [showProgress, setShowProgress] = useState(false);
    const editorRef = useRef();

    /**
     * Create array of all available taxa
     *
     * @param {Array} taxa Taxa array
     * @param {Array} arr Empty array
     */
    const createTaxaOptions = (taxa, arr) => {
        taxa.forEach((taxon) => {
            if (id) {
                if (taxon.id !== id) arr.push(taxon);
            } else arr.push(taxon);
            if (taxon.children) arr.concat(createTaxaOptions(taxon.children, arr));
        });
    };

    /**
     * Set default values if edit
     */
    useEffect(() => {
        if (revision && revision.content && revision.content.taxa) {
            if (id) {
                const taxon = findTaxon(revision.content.taxa, id);
                getTaxonInfoValues(taxon, formValues, revision.media).then((values) => {
                    setDefaultFormValues(JSON.parse(JSON.stringify(values)));
                    setFormValues(values);
                }).catch(() => setError(language.dictionary.internalAPIError));
            }
            const arr = [];
            createTaxaOptions(revision.content.taxa, arr);
            setTaxaOptions(arr);
        }
    }, [id, revision]);

    /**
     * Query API for scientific name suggestions
     *
     * @param {string} value Query string
     */
    const checkAPISuggestions = useCallback(
        debounce(async (value) => {
            try {
                let apiSuggestions = await getTaxonSuggestions(value);
                apiSuggestions = apiSuggestions.map((val) => val.replace(/^\w/, (match) => match.toUpperCase()));
                setSuggestions(apiSuggestions);
            } catch { }
        }, 500), [],
    );

    /**
     * Set scientific name and get vernacular name from API
     *
     * @param {string} scientificName Scientific name
     */
    const setTaxonNames = async (scientificName) => {
        try {
            let vernacularName = await getVernacularName(scientificName);
            vernacularName = vernacularName.replace(/^\w/, (match) => match.toUpperCase());
            setFormValues({
                ...formValues,
                scientificName,
                vernacularNameNo: vernacularName,
            });
            setSuggestions([]);
            setError(undefined);
        } catch (err) {
            setError(language.dictionary.internalAPIError);
        }
    };

    /**
     * Validate input and set progress indicator
     *
     * @param {Object} e Event
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        if (tab === 0 && languages.langEn && formValues.vernacularNameEn === '') {
            setError(language.dictionary.errorTextEn);
        } else if (tab === 1 && languages.langNo && formValues.vernacularNameNo === '') {
            setError(language.dictionary.errorTextNo);
        } else setShowProgress(true);
    };

    /**
     * Submit to API
     */
    const submit = async () => {
        try {
            if (JSON.stringify(formValues) !== JSON.stringify(defaultFormValues)) {
                let revisionId;
                let values = { ...formValues };
                values = convertEditorToHtml(values);
                delete values.files;
                delete values.media;
                if (values.parentId === '') values.parentId = 0;
                let taxonId = id;
                if (id) {
                    revisionId = await updateTaxon(id, values);
                } else {
                    const created = await createTaxon(values);
                    taxonId = created.taxonId;
                    revisionId = created.revisionId;
                }
                await handleUpdateRevisionMedia(
                    formValues.keyId,
                    revisionId,
                    taxonId,
                    'taxon',
                    formValues.files,
                    formValues.taxonMedia,
                    formValues.existingFiles,
                );
                onCreated(revisionId);
            }
            setError(undefined);
            setShowProgress(false);
            onClose();
        } catch (err) {
            setShowProgress(false);
            if (err && err.response && err.response.status === 409) {
                setError(language.dictionary.errorTaxonConflict);
            } else setError(language.dictionary.internalAPIError);
        }
    };

    /**
     * Show progress indicator before starting submit process
     */
    useEffect(() => {
        if (showProgress) submit();
    }, [showProgress]);

    /**
      * Delete taxon
      *
      * @param {boolean} confirm True if confirmation is required
      */
    const handleDelete = async (confirm) => {
        if (confirm) {
            setConfirmDelete(true);
        } else onRemove(id, defaultFormValues.titleEn);
    };

    /**
     * Render text inputs for different languages
     *
     * @returns JSX
     */
    const renderTextInputs = () => (
        <>
            <TextInput
                name="vernacularNameNo"
                label={`${language.dictionary.labelVernacularName} (${language.dictionary.norwegianShort})`}
                value={formValues.vernacularNameNo}
                required={tab === 0 && languages.langNo}
                hidden={tab === 1}
                maxLength={120}
                onChange={(e) => setFormValues(getInputChange(e, formValues))}
            />
            <TextInput
                name="vernacularNameEn"
                label={`${language.dictionary.labelVernacularName} (${language.dictionary.englishShort})`}
                value={formValues.vernacularNameEn}
                required={tab === 1 && languages.langEn}
                hidden={tab === 0}
                maxLength={120}
                onChange={(e) => setFormValues(getInputChange(e, formValues))}
            />
            <RichEditor
                id="descriptionNo"
                ref={editorRef}
                hidden={tab === 1}
                defaultValue={formValues.descriptionNo}
                label={`${language.dictionary.labelDescription} (${language.dictionary.norwegianShort})...`}
                labelMaxLength={language.dictionary.maxLengthEditor}
                onSave={(data) => setFormValues({ ...formValues, descriptionNo: data })}
            />
            <RichEditor
                id="descriptionEn"
                ref={editorRef}
                hidden={tab === 0}
                defaultValue={formValues.descriptionEn}
                label={`${language.dictionary.labelDescription} (${language.dictionary.englishShort})...`}
                labelMaxLength={language.dictionary.maxLengthEditor}
                onSave={(data) => setFormValues({ ...formValues, descriptionEn: data })}
            />
        </>
    );

    /**
     * Render scientific name input
     *
     * @returns JSX
     */
    const renderScientificNameInput = () => (
        <>
            <TextInput
                name="scientificName"
                label={language.dictionary.labelScientificName}
                value={formValues.scientificName}
                required
                autoFocus
                maxLength={255}
                onChange={(e) => {
                    setFormValues(getInputChange(e, formValues));
                    if (e.target.value !== '') checkAPISuggestions(e.target.value);
                }}
            />
            {suggestions && suggestions.length > 0 && (
                <SuggestionList
                    suggestions={suggestions}
                    onClickListItem={(val) => setTaxonNames(val)}
                />
            )}
        </>
    );

    /**
     * Render dialog action buttons
     *
     * @returns JSX
     */
    const renderActions = () => (
        <DialogActions>
            {id && (
                <IconButton
                    edge="start"
                    aria-label="delete"
                    onClick={() => handleDelete(true)}
                >
                    <DeleteOutlined />
                </IconButton>
            )}
            <Button
                variant="contained"
                color="secondary"
                size="large"
                endIcon={id ? <SaveOutlined /> : <PostAdd />}
                type="submit"
            >
                {id ? language.dictionary.btnSaveChanges : language.dictionary.btnAdd}
            </Button>
        </DialogActions>
    );

    /**
     * Render dialogs
     *
     * @returns JSX
     */
    const renderDialogs = () => (
        <>
            {openMediaDialog.index !== undefined && (
                <SetMediaInfo
                    size="small"
                    openDialog={openMediaDialog.index !== undefined}
                    index={openMediaDialog.index}
                    fileName={openMediaDialog.existing
                        ? formValues.existingFiles[openMediaDialog.index].name
                        : formValues.files[openMediaDialog.index].name}
                    fileInfo={openMediaDialog.existing
                        ? formValues.existingFiles[openMediaDialog.index].fileInfo
                        : formValues.files[openMediaDialog.index].fileInfo}
                    onClose={(unsaved) => {
                        if (unsaved) {
                            setShowUnsavedDialog(true);
                        } else setOpenMediaDialog({ index: undefined, existing: false });
                    }}
                    onUpdate={(index, values) => {
                        if (openMediaDialog.existing) {
                            const arr = [...formValues.existingFiles];
                            arr[index].fileInfo = values;
                            setFormValues({ ...formValues, existingFiles: arr });
                        } else {
                            const arr = [...formValues.files];
                            arr[index].fileInfo = values;
                            setFormValues({ ...formValues, files: arr });
                        }
                    }}
                />
            )}
            <UnsavedChanges
                openDialog={showUnsavedDialog}
                onClose={() => setShowUnsavedDialog(false)}
                onConfirm={() => setOpenMediaDialog({ index: undefined, existing: false })}
            />
        </>
    );

    return (
        <Dialog
            fullWidth
            scroll="paper"
            open={openDialog}
            onClose={() => onClose(
                JSON.stringify(formValues) !== JSON.stringify(defaultFormValues),
            )}
        >
            <form className="p-2" autoComplete="off" onSubmit={handleSubmit}>
                <DialogTitle>
                    {id ? language.dictionary.editTaxon : language.dictionary.newTaxon}
                </DialogTitle>
                <DialogContent>
                    <CloseButton
                        onClick={() => onClose(
                            JSON.stringify(formValues) !== JSON.stringify(defaultFormValues),
                        )}
                    />
                    {renderScientificNameInput()}
                    <Autocomplete
                        id="parentId"
                        fullWidth
                        value={formValues.parentId && taxaOptions
                            ? taxaOptions.find((element) => element.id === formValues.parentId)
                            : null}
                        onChange={(e, val) => setFormValues({ ...formValues, parentId: val ? val.id : '' })}
                        options={taxaOptions || []}
                        getOptionLabel={(taxon) => taxon.scientificName}
                        noOptionsText={language.dictionary.noAlternatives}
                        renderInput={(params) => <TextField {...params} label={language.dictionary.labelParentTaxon} variant="outlined" />}
                    />
                    <p>
                        {language.dictionary.sectionNewTaxon}
                        &nbsp;
                        {language.dictionary.activeLanguages}
                        :
                    </p>
                    <ul className="font-semibold">
                        {languages.langNo && <li>{language.dictionary.norwegian}</li>}
                        {languages.langEn && <li>{language.dictionary.english}</li>}
                    </ul>
                    <p className="mb-8">{language.dictionary.changeLanguages}</p>
                    <LanguageBar
                        tab={tab}
                        requireNo={languages.langNo}
                        requireEn={languages.langEn}
                        onTabChange={(val) => setTab(val)}
                    />
                    {renderTextInputs()}
                    <hr className="mb-6" />
                    <FileDrop
                        maxFiles={6}
                        size="small"
                        existingFiles={formValues.existingFiles}
                        onUpdate={(files) => setFormValues({ ...formValues, files })}
                        onUpdateExisting={(files) => setFormValues({
                            ...formValues,
                            existingFiles: files,
                        })}
                        onClickOpen={(index, existing) => setOpenMediaDialog({
                            index,
                            existing,
                        })}
                    />
                    {error && <p className="text-red-600 mb-4">{error}</p>}
                </DialogContent>
                {renderActions()}
                <ConfirmDelete
                    openDialog={confirmDelete}
                    onClose={() => setConfirmDelete(false)}
                    onConfirm={() => handleDelete()}
                />
            </form>
            {renderDialogs()}
            <ProgressIndicator open={showProgress} />
        </Dialog>
    );
};

export default CreateTaxon;
