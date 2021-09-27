import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import PostAdd from '@material-ui/icons/PostAdd';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LanguageContext from '../../context/LanguageContext';
import CloseButton from '../components/buttons/CloseButton';
import PremiseTable from '../components/tables/PremiseTable';

/**
 * Render dialog for creating logical premises for a character
 */
const CreatePremiseGroup = ({
    openDialog, character, characters, onClose,
    premises, onChangePremises, operator,
}) => {
    const { language } = useContext(LanguageContext);

    return (
        <Dialog
            fullWidth
            scroll="paper"
            open={openDialog}
            onClose={() => onClose(premises)}
        >
            <div className="p-2">
                <DialogTitle>
                    {language.dictionary.headerPremiseGroup}
                </DialogTitle>
                <DialogContent>
                    <CloseButton onClick={() => onClose(premises)} />
                    <p className="mb-8">{language.dictionary.sectionPremiseGroup}</p>
                    <PremiseTable
                        character={character}
                        characters={characters}
                        premises={premises}
                        operator={operator === 'AND' ? 'OR' : 'AND'}
                        onChangePremises={(arr) => onChangePremises(arr)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        endIcon={<PostAdd />}
                        type="submit"
                        onClick={() => onClose(premises)}
                    >
                        {language.dictionary.btnAdd}
                    </Button>
                </DialogActions>
            </div>
        </Dialog>
    );
};

export default CreatePremiseGroup;
