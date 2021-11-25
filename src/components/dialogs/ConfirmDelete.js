import React, { useContext } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import LanguageContext from '../../context/LanguageContext';
import ConfirmButtons from '../components/buttons/ConfirmButtons';

/**
 * Render confirm delete dialog
 */
const ConfirmDelete = ({
    openDialog, index, customText, onClose, onConfirm,
}) => {
    const { language } = useContext(LanguageContext);

    return (
        <Dialog
            open={openDialog}
            onClose={() => onClose()}
        >
            <DialogContent>
                <p className="my-4 text-center">{customText || language.dictionary.confirmDelete}</p>
            </DialogContent>
            <ConfirmButtons
                yesNoLabels
                onConfirm={() => onConfirm(index)}
                onClose={() => onClose()}
            />
        </Dialog>
    );
};

export default ConfirmDelete;
