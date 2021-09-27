import React, { useContext, useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import PostAdd from '@material-ui/icons/PostAdd';
import SaveOutlined from '@material-ui/icons/SaveOutlined';
import DeleteOutlined from '@material-ui/icons/DeleteOutlined';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LanguageContext from '../../context/LanguageContext';
import ConfirmDelete from './ConfirmDelete';
import { createWorkgroup } from '../../utils/api/create';
import { updateWorkgroup } from '../../utils/api/update';
import { deleteWorkgroup } from '../../utils/api/delete';
import CloseButton from '../components/buttons/CloseButton';
import getInputChange from '../../utils/input-change';
import TextInput from '../components/inputs/TextInput';

/**
 * Render create workgroup dialog
 */
const CreateWorkgroup = ({
    openDialog, workgroup, onClose, onCreated,
}) => {
    const { language } = useContext(LanguageContext);
    const [defaultFormValues, setDefaultFormValues] = useState({
        name: '',
    });
    const [formValues, setFormValues] = useState(defaultFormValues);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [error, setError] = useState(undefined);

    /**
     * Set default values
     */
    useEffect(() => {
        if (workgroup) {
            setDefaultFormValues({ name: workgroup.name });
            setFormValues({ name: workgroup.name });
        }
    }, [workgroup]);

    /**
     * Submit to API
     *
     * @param {Object} e Event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (workgroup) {
                await updateWorkgroup(workgroup.id, formValues);
                onCreated();
            } else {
                const workgroupId = await createWorkgroup(formValues);
                onCreated(workgroupId);
            }
            setError(undefined);
            onClose();
        } catch (err) {
            if (err.response.status === 409) {
                setError(language.dictionary.errorWorkgroupConflict);
            } else setError(language.dictionary.internalAPIError);
        }
    };

    /**
     * Delete workgroup
     *
     * @param {boolean} confirm True if confirmation is required
     */
    const handleDelete = async (confirm) => {
        if (confirm) {
            setConfirmDelete(true);
        } else {
            try {
                await deleteWorkgroup(workgroup.id);
                onCreated();
                setError(undefined);
                onClose();
            } catch (err) {
                setError(language.dictionary.errorDeleteWorkgroup);
            }
        }
    };

    /**
     * Render dialog actions
     *
     * @returns JSX
     */
    const renderActions = () => (
        <DialogActions>
            {workgroup ? (
                <>
                    <IconButton
                        edge="start"
                        aria-label="delete"
                        onClick={() => handleDelete(true)}
                    >
                        <DeleteOutlined />
                    </IconButton>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        endIcon={<SaveOutlined />}
                        type="submit"
                    >
                        {language.dictionary.btnSaveChanges}
                    </Button>
                </>
            )
                : (
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        endIcon={<PostAdd />}
                        type="submit"
                    >
                        {language.dictionary.btnCreate}
                    </Button>
                )}
        </DialogActions>
    );

    return (
        <Dialog
            onClose={() => onClose(
                JSON.stringify(formValues) !== JSON.stringify(defaultFormValues),
            )}
            open={openDialog}
        >
            <form className="p-2" autoComplete="off" onSubmit={handleSubmit}>
                <DialogTitle>
                    {workgroup
                        ? language.dictionary.editWorkgroup
                        : language.dictionary.btnNewWorkgroup}
                </DialogTitle>
                <DialogContent>
                    <CloseButton
                        onClick={() => onClose(
                            JSON.stringify(formValues) !== JSON.stringify(defaultFormValues),
                        )}
                    />
                    <p className="mb-8">
                        {language.dictionary.sectionNewWorkgroup}
                        &nbsp;
                        {language.dictionary.sectionNewWorkgroupInfo}
                    </p>
                    <TextInput
                        name="name"
                        label={language.dictionary.labelGroupName}
                        value={formValues.name}
                        required
                        autoFocus
                        maxLength={60}
                        onChange={(e) => setFormValues(getInputChange(e, formValues))}
                    />
                    {error && <p className="text-red-600 mb-4">{error}</p>}
                </DialogContent>
                {renderActions()}
            </form>
            <ConfirmDelete
                openDialog={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                onConfirm={() => handleDelete()}
            />
        </Dialog>
    );
};

export default CreateWorkgroup;
