import React, {
    useContext, useEffect, useState, useRef,
} from 'react';
import Dialog from '@material-ui/core/Dialog';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LanguageContext from '../../context/LanguageContext';
import { createCollection } from '../../utils/api/create';
import { updateCollection } from '../../utils/api/update';
import { getCollection, getWorkgroups } from '../../utils/api/get';
import { deleteCollection } from '../../utils/api/delete';
import ConfirmDelete from './ConfirmDelete';
import CloseButton from '../components/buttons/CloseButton';
import SetMediaInfo from './SetMediaInfo';
import { convertEditorToHtml, getCollectionInfoValues } from '../../utils/form-values';
import { handleUpdateEntityMedia } from '../../utils/media';
import InfoInputs from '../components/inputs/InfoInputs';
import LanguageBar from '../components/LanguageBar';
import DialogButtons from '../components/buttons/DialogButtons';

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
            <InfoInputs
                names={['nameNo', 'nameEn']}
                formValues={formValues}
                tab={tab}
                languages={{ langNo: true, langEn: true }}
                editorRef={editorRef}
                onChange={(val) => setFormValues(val)}
                onOpenFileDrop={(index, existing) => setOpenMediaDialog({
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
                        showNo
                        showEn
                        requireNo
                        requireEn
                        onChangeTab={(val) => setTab(val)}
                    />
                    {renderInputs()}
                    {error && <p className="text-red-600 mb-4">{error}</p>}
                </DialogContent>
                <DialogButtons
                    exists={id}
                    isForm
                    onDelete={() => handleDelete(true)}
                />
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
