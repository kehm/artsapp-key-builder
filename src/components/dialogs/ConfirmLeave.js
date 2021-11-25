import React, { useContext } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import LanguageContext from '../../context/LanguageContext';
import ConfirmButtons from '../components/buttons/ConfirmButtons';

/**
 * Render confirm leave workgroup dialog
 */
const ConfirmLeave = ({
    openDialog, workgroup, onClose, onConfirm,
}) => {
    const { language } = useContext(LanguageContext);

    return (
        <Dialog
            className="text-center"
            onClose={() => onClose()}
            open={openDialog}
        >
            <DialogTitle>{language.dictionary.pleaseConfirm}</DialogTitle>
            <DialogContent>
                <p className="pb-4">{language.dictionary.leaveWorkgroup}</p>
            </DialogContent>
            <ConfirmButtons
                onConfirm={() => onConfirm(workgroup)}
                onClose={() => onClose()}
            />
        </Dialog>
    );
};

export default ConfirmLeave;
