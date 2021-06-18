import React, { useContext, useState } from 'react';
import SaveOutlined from '@material-ui/icons/SaveOutlined';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LanguageContext from '../../context/LanguageContext';
import CloseButton from '../components/CloseButton';
import getInputChange from '../../utils/input-change';
import TextInput from '../components/inputs/TextInput';

/**
 * Render create revision note dialog
 */
const CreateRevisionNote = ({ openDialog, onClose, onCreate }) => {
    const { language } = useContext(LanguageContext);
    const defaultFormValues = {
        note: '',
    };
    const [formValues, setFormValues] = useState(defaultFormValues);

    /**
     * Handle create revision
     *
     * @param {Object} e Event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        onCreate(formValues.note);
    };

    return (
        <Dialog onClose={() => onClose()} open={openDialog}>
            <form className="p-2" autoComplete="off" onSubmit={handleSubmit}>
                <DialogTitle>{language.dictionary.btnSaveChanges}</DialogTitle>
                <DialogContent>
                    <CloseButton onClick={() => onClose()} />
                    <p className="mb-4">{language.dictionary.sectionRevisionNote}</p>
                    <TextInput
                        name="note"
                        label={language.dictionary.labelNote}
                        value={formValues.note}
                        multitline
                        maxLength={255}
                        onChange={(e) => setFormValues(getInputChange(e, formValues))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        endIcon={<SaveOutlined />}
                        type="submit"
                    >
                        {language.dictionary.btnSave}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default CreateRevisionNote;
