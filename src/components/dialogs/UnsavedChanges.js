import React, { useContext } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import LanguageContext from '../../context/LanguageContext';
import ConfirmButtons from '../components/buttons/ConfirmButtons';

/**
 * Render unsaved changes dialog
 */
const UnsavedChanges = ({
    openDialog, index, onClose, onConfirm, alternativeText,
}) => {
    const { language } = useContext(LanguageContext);

    return (
        <Dialog open={openDialog} onClose={() => onClose()}>
            <DialogContent>
                <p className="my-4 text-center">{alternativeText || language.dictionary.unsavedChanges}</p>
            </DialogContent>
            <ConfirmButtons
                yesNoLabels
                onConfirm={() => onConfirm(index)}
                onClose={() => onClose()}
            />
        </Dialog>
    );
};

export default UnsavedChanges;
