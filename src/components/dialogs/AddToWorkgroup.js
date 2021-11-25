import React, { useContext, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PersonAddOutlined from '@material-ui/icons/PersonAddOutlined';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LanguageContext from '../../context/LanguageContext';
import ConfirmDelete from './ConfirmDelete';
import UserList from '../components/lists/UserList';
import CloseButton from '../components/buttons/CloseButton';
import getInputChange from '../../utils/input-change';
import { addUserToWorkgroup } from '../../utils/api/create';
import { getWorkgroupUsers } from '../../utils/api/get';
import { deleteWorkgroupUser } from '../../utils/api/delete';

/**
 * Render add/remove user from workgroup dialog
 */
const AddToWorkgroup = ({
    workgroup, openDialog, onClose,
}) => {
    const { language } = useContext(LanguageContext);
    const defaultFormValues = {
        email: '',
    };
    const [formValues, setFormValues] = useState(defaultFormValues);
    const [workgroupUsers, setWorkgroupUsers] = useState(undefined);
    const [tab, setTab] = useState(0);
    const [error, setError] = useState(undefined);
    const [confirmDelete, setConfirmDelete] = useState(undefined);

    /**
     * Get workgroup members
     */
    useEffect(() => {
        if (!workgroupUsers && workgroup) {
            getWorkgroupUsers(workgroup.id).then((response) => {
                setWorkgroupUsers(response);
            }).catch(() => setError(language.dictionary.internalAPIError));
        }
    }, [workgroupUsers, workgroup]);

    /**
     * Remove error message on change tab
     */
    useEffect(() => {
        setError(undefined);
    }, [tab]);

    /**
     * Submit to API
     *
     * @param {Object} e Event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addUserToWorkgroup({
                email: formValues.email,
                workgroupId: workgroup.id,
            });
            setTab(0);
            setFormValues(defaultFormValues);
            setWorkgroupUsers(undefined);
        } catch (err) {
            setError(language.dictionary.errorAddUser);
        }
    };

    /**
     * Remove user from workgroup
     *
     * @param {string} workgroupsId Workgroups ID
     */
    const handleDelete = async (workgroupsId, confirm) => {
        if (confirm) {
            setConfirmDelete(workgroupsId);
        } else {
            try {
                await deleteWorkgroupUser(workgroupsId);
                setError(undefined);
                setWorkgroupUsers(undefined);
            } catch (err) {
                setError(language.dictionary.internalAPIError);
            }
        }
    };

    /**
     * Render content for tabs
     *
     * @returns JSX
     */
    const renderTabs = () => {
        switch (tab) {
            case 0:
                return (
                    <>
                        {workgroupUsers && workgroupUsers.length > 0
                            ? <p className="mb-6">{language.dictionary.sectionUsersOverview}</p>
                            : <p className="mb-6">{language.dictionary.emptyWorkgroup}</p>}
                        <UserList
                            workgroupUsers={workgroupUsers}
                            onRemove={(id) => handleDelete(id, true)}
                        />
                    </>
                );
            case 1:
                return (
                    <>
                        <p className="mb-4">{language.dictionary.sectionAddUser}</p>
                        <p className="mb-6">{language.dictionary.sectionAddOrgUser}</p>
                        <TextField
                            autoFocus
                            required
                            id="email"
                            name="email"
                            type="email"
                            inputProps={{ maxLength: 255 }}
                            label={language.dictionary.labelEmail}
                            variant="outlined"
                            fullWidth
                            value={formValues.email}
                            onChange={(e) => setFormValues(getInputChange(e, formValues))}
                        />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog onClose={() => onClose()} open={openDialog}>
            <form className="p-2" autoComplete="off" onSubmit={handleSubmit}>
                <DialogTitle>{language.dictionary.headerWorkgroupUsers}</DialogTitle>
                <DialogContent>
                    <CloseButton onClick={() => onClose()} />
                    <AppBar
                        position="relative"
                        className="mb-6"
                        color="default"
                    >
                        <Tabs
                            value={tab}
                            onChange={(e, val) => setTab(val)}
                            aria-label="workgroup tabs"
                        >
                            <Tab label={language.dictionary.labelOverview} />
                            <Tab label={language.dictionary.btnAdd} />
                        </Tabs>
                    </AppBar>
                    {renderTabs()}
                    {error && <p className="text-red-600 mb-4">{error}</p>}
                    {tab === 1 && (
                        <DialogActions>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                endIcon={<PersonAddOutlined />}
                                type="submit"
                            >
                                {language.dictionary.btnAdd}
                            </Button>
                        </DialogActions>
                    )}
                </DialogContent>
            </form>
            <ConfirmDelete
                openDialog={confirmDelete !== undefined}
                onClose={() => setConfirmDelete(undefined)}
                onConfirm={() => handleDelete(confirmDelete)}
            />
        </Dialog>
    );
};

export default AddToWorkgroup;
