import React, { useContext } from 'react';
import PostAdd from '@material-ui/icons/PostAdd';
import Button from '@material-ui/core/Button';
import NavigateNext from '@material-ui/icons/NavigateNext';
import SaveOutlined from '@material-ui/icons/SaveOutlined';
import DialogActions from '@material-ui/core/DialogActions';
import LanguageContext from '../../../context/LanguageContext';
import DeleteButton from './DeleteButton';

/**
 * Render dialog action buttons
 */
const DialogButtons = ({
    exists, disableSave, isForm, showNext, onNext, onDelete, onSubmit,
}) => {
    const { language } = useContext(LanguageContext);

    return (
        <DialogActions>
            {exists && <DeleteButton onClick={() => onDelete()} />}
            {showNext ? (
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    endIcon={<NavigateNext />}
                    onClick={() => onNext()}
                >
                    {language.dictionary.btnNext}
                </Button>
            ) : (
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    endIcon={exists ? <SaveOutlined /> : <PostAdd />}
                    type={isForm ? 'submit' : 'button'}
                    onClick={() => { if (!isForm) onSubmit(); }}
                    disabled={disableSave || false}
                >
                    {exists ? language.dictionary.btnSaveChanges : language.dictionary.btnAdd}
                </Button>
            )}
        </DialogActions>
    );
};

export default DialogButtons;
