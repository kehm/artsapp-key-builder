import React, { useContext, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LanguageContext from '../../context/LanguageContext';
import CloseButton from '../components/CloseButton';
import UserWorkgroupList from '../components/lists/UserWorkgroupList';
import ConfirmLeave from './ConfirmLeave';
import { deleteUserWorkgroup } from '../../utils/api/delete';

/**
 * Show the user's workgroups
 */
const UserWorkgroups = ({
    workgroups, openDialog, onClose, onLeave,
}) => {
    const { language } = useContext(LanguageContext);
    const [error, setError] = useState(undefined);
    const [openConfirm, setOpenConfirm] = useState({ open: false, workgroup: undefined });

    /**
     * Remove user from workgroup
     *
     * @param {Object} workgroup Workgroup object
     */
    const handleLeave = async (workgroup) => {
        try {
            await deleteUserWorkgroup(workgroup.id);
            onLeave(workgroup.id);
            setError(undefined);
        } catch (err) {
            setError(language.dictionary.internalAPIError);
        }
    };

    return (
        <Dialog onClose={() => onClose()} open={openDialog}>
            <div className="p-2">
                <DialogTitle>{language.dictionary.btnMyGroups}</DialogTitle>
                <DialogContent>
                    <p className="mb-6">{language.dictionary.sectionUserWorkgroups}</p>
                    <CloseButton onClick={() => onClose()} />
                    <UserWorkgroupList
                        workgroups={workgroups}
                        onLeave={(workgroup) => setOpenConfirm({ open: true, workgroup })}
                    />
                </DialogContent>
                {error && <p className="text-red-600 mt-4">{error}</p>}
            </div>
            <ConfirmLeave
                openDialog={openConfirm.open}
                workgroup={openConfirm.workgroup}
                onClose={() => setOpenConfirm({ open: false, workgroup: undefined })}
                onConfirm={(workgroup) => handleLeave(workgroup)}
            />
        </Dialog>
    );
};

export default UserWorkgroups;
