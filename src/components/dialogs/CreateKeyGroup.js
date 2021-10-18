import React, {
    useContext, useEffect, useState, useRef,
} from 'react';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import PostAdd from '@material-ui/icons/PostAdd';
import SaveOutlined from '@material-ui/icons/SaveOutlined';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DeleteOutlined from '@material-ui/icons/DeleteOutlined';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LanguageContext from '../../context/LanguageContext';
import { createKeyGroup } from '../../utils/api/create';
import { updateKeyGroup } from '../../utils/api/update';
import { getKeyGroup } from '../../utils/api/get';
import { deleteKeyGroup } from '../../utils/api/delete';
import ConfirmDelete from './ConfirmDelete';
import CloseButton from '../components/buttons/CloseButton';
import SetMediaInfo from './SetMediaInfo';
import UnsavedChanges from './UnsavedChanges';
import { handleUpdateEntityMedia } from '../../utils/media';
import { convertEditorToHtml, getGroupInfoValues } from '../../utils/form-values';
import LanguageBar from '../components/LanguageBar';
import InfoInputs from '../components/inputs/InfoInputs';

/**
 * Render create/update key group dialog
 */
const CreateKeyGroup = ({
    openDialog, groups, id, onClose, onCreated,
}) => {
    const { language } = useContext(LanguageContext);
    const [defaultFormValues, setDefaultFormValues] = useState({
        nameNo: '',
        nameEn: '',
        descriptionNo: '',
        descriptionEn: '',
        parentId: '',
        files: [],
        existingFiles: [],
    });
    const [formValues, setFormValues] = useState(defaultFormValues);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
    const [openMediaDialog, setOpenMediaDialog] = useState({ index: undefined, existing: false });
    const [group, setGroup] = useState(undefined);
    const [error, setError] = useState(undefined);
    const [tab, setTab] = useState(0);
    const editorRef = useRef();

    /**
     * Get key group from API
     */
    useEffect(() => {
        if (id) {
            if (!group || (group[0].id !== id)) {
                getKeyGroup(id).then((keyGroup) => {
                    const values = getGroupInfoValues(keyGroup, formValues);
                    setGroup(keyGroup);
                    setDefaultFormValues(JSON.parse(JSON.stringify(values)));
                    setFormValues(values);
                }).catch(() => setError(language.dictionary.internalAPIError));
            }
        } else if (group) {
            setGroup(undefined);
        }
    }, [group, id, language]);

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
                if (values.parentId === '') values.parentId = 0;
                let groupId;
                if (id) {
                    groupId = id;
                    await updateKeyGroup(id, values);
                } else groupId = await createKeyGroup(values);
                await handleUpdateEntityMedia(groupId, 'group', formValues.files, group && group[0].media, formValues.existingFiles);
                onCreated(groupId);
                setError(undefined);
                onClose();
            } catch (err) {
                if (err && err.response && err.response.status === 409) {
                    setError(language.dictionary.errorGroupConflict);
                } else setError(language.dictionary.internalAPIError);
            }
        }
    };

    /**
     * Delete key group
     *
     * @param {boolean} confirm True if confirmation is required
     */
    const handleDelete = async (confirm) => {
        if (confirm) {
            setConfirmDelete(true);
        } else {
            try {
                await deleteKeyGroup(id);
                onCreated();
                setError(undefined);
                onClose();
            } catch (err) {
                setError(language.dictionary.internalAPIError);
            }
        }
    };

    /**
     * Render text inputs for different languages
     *
     * @returns JSX
     */
    const renderTextInputs = () => (
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
            <hr className="mb-6" />
            <Autocomplete
                id="parentId"
                fullWidth
                value={groups && formValues.parentId
                    ? groups.find((element) => element.id === formValues.parentId)
                    : null}
                onChange={(e, val) => setFormValues({ ...formValues, parentId: val ? val.id : '' })}
                options={groups ? groups.filter((element) => element.id !== id) : []}
                getOptionLabel={(option) => {
                    if (option) return option.name;
                    return '';
                }}
                noOptionsText={language.dictionary.noAlternatives}
                renderInput={(params) => <TextField {...params} label={language.dictionary.labelParentGroup} variant="outlined" />}
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
            {openDialog && (
                <form className="p-2" autoComplete="off" onSubmit={handleSubmit}>
                    <DialogTitle>
                        {id ? language.dictionary.btnEditGroup : language.dictionary.newKeyGroup}
                    </DialogTitle>
                    <DialogContent>
                        <CloseButton
                            onClick={() => onClose(
                                JSON.stringify(formValues) !== JSON.stringify(defaultFormValues),
                            )}
                        />
                        <p className="mb-8">{language.dictionary.sectionKeyGroup}</p>
                        <LanguageBar
                            tab={tab}
                            requireNo
                            requireEn
                            onTabChange={(val) => setTab(val)}
                        />
                        {renderTextInputs()}
                        {error && <p className="text-red-600 mb-4">{error}</p>}
                    </DialogContent>
                    <DialogActions>
                        {id && (
                            <IconButton edge="start" aria-label="delete" onClick={() => handleDelete(true)}>
                                <DeleteOutlined />
                            </IconButton>
                        )}
                        <Button variant="contained" color="secondary" size="large" endIcon={id ? <SaveOutlined /> : <PostAdd />} type="submit">
                            {id
                                ? language.dictionary.btnSaveChanges
                                : language.dictionary.btnCreate}
                        </Button>
                    </DialogActions>
                    <ConfirmDelete
                        openDialog={confirmDelete}
                        onClose={() => setConfirmDelete(false)}
                        onConfirm={() => handleDelete()}
                    />
                </form>
            )}
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
        </Dialog>
    );
};

export default CreateKeyGroup;
