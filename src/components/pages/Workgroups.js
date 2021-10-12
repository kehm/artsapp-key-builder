import React, { useContext, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Add from '@material-ui/icons/Add';
import Group from '@material-ui/icons/Group';
import LanguageContext from '../../context/LanguageContext';
import { getUserWorkgroups, getWorkgroups } from '../../utils/api/get';
import UnsavedChanges from '../dialogs/UnsavedChanges';
import WorkgroupList from '../components/lists/WorkgroupList';
import CreateWorkgroup from '../dialogs/CreateWorkgroup';
import AddToWorkgroup from '../dialogs/AddToWorkgroup';
import UserWorkgroups from '../dialogs/UserWorkgroups';
import UserContext from '../../context/UserContext';
import MissingPermission from '../components/MissingPermission';
import isPermitted from '../../utils/is-permitted';
import ActionButton from '../components/buttons/ActionButton';

/**
 * Render workgroups page
 */
const Workgroups = ({ onSetTitle }) => {
    const { language } = useContext(LanguageContext);
    const { user } = useContext(UserContext);
    const [workgroups, setWorkgroups] = useState(undefined);
    const [userWorkgroups, setUserWorkgroups] = useState(undefined);
    const [error, setError] = useState(undefined);
    const [createDialog, setCreateDialog] = useState({ open: false, workgroup: undefined });
    const [openUsersDialog, setOpenUsersDialog] = useState(undefined);
    const [openUnsavedDialog, setOpenUnsavedDialog] = useState(false);
    const [openWorkgroups, setOpenWorkgroups] = useState(false);

    /**
     * Get workgroups from API
     */
    useEffect(() => {
        if (!workgroups) {
            onSetTitle(language.dictionary.workgroups);
            getWorkgroups().then((groups) => {
                setWorkgroups(groups);
            }).catch(() => setError(language.dictionary.internalAPIError));
        }
        if (!userWorkgroups) {
            getUserWorkgroups(language.language.split('_')[0]).then((groups) => {
                setUserWorkgroups(groups);
            }).catch(() => setError(language.dictionary.internalAPIError));
        }
    }, [workgroups, userWorkgroups, language]);

    /**
     * Show confirm dialog before closing the dialog if form has unsaved changes
     *
     * @param {boolean} unsaved True if unsaved changes
     */
    const handleCloseDialog = (unsaved) => {
        if (unsaved) {
            setOpenUnsavedDialog(true);
        } else {
            setCreateDialog({ open: false, workgroup: undefined });
            setOpenUsersDialog(undefined);
        }
    };

    /**
     * Render action buttons
     *
     * @returns JSX
     */
    const renderActions = () => {
        let label = language.dictionary.notCreateWorkgroup;
        if (!isPermitted(user, ['CREATE_WORKGROUP']) && !isPermitted(user, ['EDIT_WORKGROUP'])) {
            label = language.dictionary.notChangeWorkgroup;
        } else if (!isPermitted(user, ['EDIT_WORKGROUP'])) {
            label = language.dictionary.notEditWorkgroup;
        }
        return (
            <div className="mt-2">
                <ActionButton
                    label={language.dictionary.btnNewWorkgroup}
                    icon={<Add />}
                    onClick={() => setCreateDialog({ open: true, workgroup: undefined })}
                    disabled={!isPermitted(user, ['CREATE_WORKGROUP'])}
                />
                <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    endIcon={<Group />}
                    type="button"
                    onClick={() => setOpenWorkgroups(true)}
                >
                    {language.dictionary.btnMyGroups}
                </Button>
                <MissingPermission
                    show={!isPermitted(user, ['CREATE_WORKGROUP']) || !isPermitted(user, ['EDIT_WORKGROUP'])}
                    label={label}
                />
            </div>
        );
    };

    return (
        <div className="py-14 md:w-10/12 m-auto pb-28">
            <p className="px-2 mt-20 lg:mt-6">{language.dictionary.listWorkgroups}</p>
            {workgroups && workgroups.length > 0 ? (
                <>
                    {renderActions()}
                    <WorkgroupList
                        workgroups={workgroups}
                        isEditor={isPermitted(user, ['EDIT_WORKGROUP'])}
                        onEdit={(workgroup) => setCreateDialog({ open: true, workgroup })}
                        onClickUsers={(workgroup) => setOpenUsersDialog(workgroup)}
                    />
                </>
            )
                : <p className="my-4">{language.dictionary.noWorkgroups}</p>}
            {error && <p className="text-red-600 mt-4">{error}</p>}
            {createDialog.open && (
                <CreateWorkgroup
                    openDialog={createDialog.open}
                    workgroup={createDialog.workgroup}
                    onClose={(unsaved) => handleCloseDialog(unsaved)}
                    onCreated={() => setWorkgroups(undefined)}
                />
            )}
            <AddToWorkgroup
                workgroup={openUsersDialog}
                openDialog={openUsersDialog !== undefined}
                onClose={() => handleCloseDialog()}
            />
            <UserWorkgroups
                workgroups={userWorkgroups}
                openDialog={openWorkgroups}
                onClose={() => setOpenWorkgroups(false)}
                onLeave={(id) => {
                    const arr = [...userWorkgroups];
                    setUserWorkgroups(arr.filter((element) => element.id !== id));
                }}
            />
            <UnsavedChanges
                openDialog={openUnsavedDialog}
                onClose={() => setOpenUnsavedDialog(false)}
                onConfirm={() => setCreateDialog({ open: false, workgroup: false })}
            />
        </div>
    );
};

export default Workgroups;
