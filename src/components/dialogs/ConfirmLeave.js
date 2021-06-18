import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import LanguageContext from '../../context/LanguageContext';

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
            <DialogActions>
                <div className="flex m-auto pb-6">
                    <span className="mr-4">
                        <Button
                            variant="contained"
                            color="primary"
                            size="medium"
                            type="button"
                            onClick={() => { onClose(); onConfirm(workgroup); }}
                        >
                            {language.dictionary.btnConfirm}
                        </Button>
                    </span>
                    <Button
                        variant="contained"
                        color="default"
                        size="medium"
                        type="button"
                        onClick={() => onClose()}
                    >
                        {language.dictionary.btnCancel}
                    </Button>
                </div>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmLeave;
