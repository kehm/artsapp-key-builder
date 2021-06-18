import React, {
    useContext, useEffect, useState, useRef,
} from 'react';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import PostAdd from '@material-ui/icons/PostAdd';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SaveOutlined from '@material-ui/icons/SaveOutlined';
import DeleteOutlined from '@material-ui/icons/DeleteOutlined';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LanguageContext from '../../context/LanguageContext';
import { createCollection } from '../../utils/api/create';
import { updateCollection } from '../../utils/api/update';
import { getCollection, getWorkgroups } from '../../utils/api/get';
import { deleteCollection } from '../../utils/api/delete';
import ConfirmDelete from './ConfirmDelete';
import FileDrop from '../components/inputs/FileDrop';
import RichEditor from '../components/inputs/RichEditor';
import CloseButton from '../components/CloseButton';
import TextInput from '../components/inputs/TextInput';
import SetMediaInfo from './SetMediaInfo';
import getInputChange from '../../utils/input-change';
import { convertEditorToHtml, getCollectionInfoValues } from '../../utils/form-values';
import { handleUpdateEntityMedia } from '../../utils/media';
import LanguageBar from '../components/LanguageBar';

/**
 * Render create/update collection dialog
 */
const CreateCollection = ({
    openDialog, id, onClose, onCreated,
}) => {
    const { language } = useContext(LanguageContext);
    const [defaultFormValues, setDefaultFormValues] = useState({
        nameNo: '',
        nameEn: '',
        descriptionNo: '',
        descriptionEn: '',
        workgroupId: '',
        files: [],
        existingFiles: [],
    });
    const [formValues, setFormValues] = useState(defaultFormValues);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
    const [openMediaDialog, setOpenMediaDialog] = useState({ index: undefined, existing: false });
    const [collection, setCollection] = useState(undefined);
    const [workgroups, setWorkgroups] = useState(undefined);
    const [error, setError] = useState(undefined);
    const [tab, setTab] = useState(0);
    const editorRef = useRef();

    /**
     * Get collection from API
     */
    useEffect(() => {
        if (id) {
            if (!collection || (collection[0].id !== id)) {
                getCollection(id).then((keyCollections) => {
                    const values = getCollectionInfoValues(keyCollections, formValues);
                    setCollection(keyCollections);
                    setDefaultFormValues(JSON.parse(JSON.stringify(values)));
                    setFormValues(values);
                }).catch(() => setError(language.dictionary.internalAPIError));
            }
        } else if (collection) {
            setCollection(undefined);
        }
    }, [collection, id, language]);

    /**
     * Get workgroups from API
     */
    useEffect(() => {
        if (!workgroups) {
            getWorkgroups().then((groups) => {
                setWorkgroups(groups);
            }).catch(() => setError(language.dictionary.internalAPIError));
        }
    }, [workgroups, language]);

    /**
     * Submit to API
     *
     * @param {Object} e Event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (tab === 0 && formValues.nameEn === '') {
            setError(language.dictionary.errorTextEn);
        } else if (tab === 1 && formValues.nameNo === '') {
            setError(language.dictionary.errorTextNo);
        } else {
            try {
                let values = { ...formValues };
                values = convertEditorToHtml(values);
                delete values.files;
                delete values.existingFiles;
                let collectionId;
                if (id) {
                    collectionId = id;
                    await updateCollection(id, values);
                } else collectionId = await createCollection(values);
                await handleUpdateEntityMedia(
                    collectionId,
                    'collection',
                    formValues.files,
                    collection && collection[0].media,
                    formValues.existingFiles,
                );
                onCreated(collectionId);
                setError(undefined);
                onClose();
            } catch (err) {
                if (err && err.response && err.response.status === 409) {
                    setError(language.dictionary.errorCollectionConflict);
                } else setError(language.dictionary.internalAPIError);
            }
        }
    };

    /**
     * Delete collection
     *
     * @param {boolean} confirm True if confirmation is required
     */
    const handleDelete = async (confirm) => {
        if (confirm) {
            setConfirmDelete(true);
        } else {
            try {
                await deleteCollection(id);
                onCreated();
                setError(undefined);
                onClose();
            } catch (err) {
                setError(language.dictionary.internalAPIError);
            }
        }
    };

    /**
     * Render inputs for different languages
     *
     * @returns JSX
     */
    const renderInputs = () => (
        <>
            <TextInput
                name="nameNo"
                label={`${language.dictionary.labelTitle} (${language.dictionary.norwegianShort})`}
                value={formValues.nameNo}
                required={tab === 0}
                autoFocus
                hidden={tab === 1}
                maxLength={120}
                onChange={(e) => setFormValues(getInputChange(e, formValues))}
            />
            <TextInput
                name="nameEn"
                label={`${language.dictionary.labelTitle} (${language.dictionary.englishShort})`}
                value={formValues.nameEn}
                required={tab === 1}
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
            {!id && (
                <>
                    <hr className="mb-6" />
                    <Autocomplete
                        id="workgroupId"
                        fullWidth
                        value={workgroups && formValues.workgroupId
                            ? workgroups.find(
                                (element) => element.id === formValues.workgroupId,
                            )
                            : null}
                        onChange={(e, val) => setFormValues({ ...formValues, workgroupId: val ? val.id : '' })}
                        options={workgroups || []}
                        getOptionLabel={(option) => {
                            if (option) return option.name;
                            return '';
                        }}
                        noOptionsText={language.dictionary.noAlternatives}
                        renderInput={(params) => <TextField {...params} required label={language.dictionary.labelWorkgroup} variant="outlined" />}
                    />
                </>
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
                {id ? language.dictionary.btnSaveChanges : language.dictionary.btnCreate}
            </Button>
        </DialogActions>
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
                    {id ? language.dictionary.btnEditCollection : language.dictionary.newCollection}
                </DialogTitle>
                <DialogContent>
                    <CloseButton
                        onClick={() => onClose(
                            JSON.stringify(formValues) !== JSON.stringify(defaultFormValues),
                        )}
                    />
                    <p className="mb-8">{language.dictionary.sectionCollection}</p>
                    <LanguageBar
                        tab={tab}
                        requireNo
                        requireEn
                        onTabChange={(val) => setTab(val)}
                    />
                    {renderInputs()}
                    {error && <p className="text-red-600 mb-4">{error}</p>}
                </DialogContent>
                {renderActions()}
                <ConfirmDelete
                    openDialog={confirmDelete}
                    onClose={() => setConfirmDelete(false)}
                    onConfirm={() => handleDelete()}
                />
            </form>
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
        </Dialog>
    );
};

export default CreateCollection;
