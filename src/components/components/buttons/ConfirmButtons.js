import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import LanguageContext from '../../../context/LanguageContext';

/**
 * Render dialog action buttons for confirm/cancel
 */
const ConfirmButtons = ({ yesNoLabels, onConfirm, onClose }) => {
    const { language } = useContext(LanguageContext);

    return (
        <DialogActions>
            <div className="flex m-auto pb-6">
                <span className="mr-4">
                    <Button
                        variant="contained"
                        color={yesNoLabels ? 'default' : 'primary'}
                        size="medium"
                        type="button"
                        onClick={() => { onClose(); onConfirm(); }}
                    >
                        {yesNoLabels ? language.dictionary.btnYes : language.dictionary.btnConfirm}
                    </Button>
                </span>
                <Button
                    variant="contained"
                    color="default"
                    size="medium"
                    type="button"
                    onClick={() => onClose()}
                >
                    {yesNoLabels ? language.dictionary.btnNo : language.dictionary.btnCancel}
                </Button>
            </div>
        </DialogActions>
    );
};

export default ConfirmButtons;
