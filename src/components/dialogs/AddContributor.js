import React, { useContext, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import PostAdd from '@material-ui/icons/PostAdd';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LanguageContext from '../../context/LanguageContext';
import CloseButton from '../components/buttons/CloseButton';
import TextInput from '../components/inputs/TextInput';

/**
 * Render add contributor dialog
 */
const AddContributor = ({ openDialog, onClose, onUpdate }) => {
    const { language } = useContext(LanguageContext);
    const [name, setName] = useState('');

    /**
     * Handle on submit form
     *
     * @param {Object} e Event
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(name);
    };

    return (
        <Dialog
            fullWidth
            scroll="paper"
            open={openDialog}
            onClose={() => onClose(name !== '')}
        >
            <form className="p-2" autoComplete="off" onSubmit={handleSubmit}>
                <DialogTitle>{language.dictionary.headerAddContributor}</DialogTitle>
                <DialogContent>
                    <CloseButton onClick={() => onClose(name !== '')} />
                    <p className="mb-8">{language.dictionary.sectionContributors}</p>
                    <p className="mb-8">{language.dictionary.sectionContributorsNot}</p>
                    <TextInput
                        name="name"
                        label={language.dictionary.labelName}
                        value={name}
                        required
                        autoFocus
                        maxLength={60}
                        onChange={(e) => setName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        endIcon={<PostAdd />}
                        type="submit"
                    >
                        {language.dictionary.btnAdd}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddContributor;
