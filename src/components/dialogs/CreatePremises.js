import React, { useContext, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import SaveOutlined from '@material-ui/icons/SaveOutlined';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import LanguageContext from '../../context/LanguageContext';
import CloseButton from '../components/buttons/CloseButton';
import { findName } from '../../utils/translation';
import CreatePremiseGroup from './CreatePremiseGroup';
import { updateCharacterPremise } from '../../utils/api/update';
import PremiseGroupTable from '../components/tables/PremiseGroupTable';

/**
 * Render dialog for creating logical premises for a character
 */
const CreatePremises = ({
    openDialog, character, characters, revision, onClose, onCreated,
}) => {
    const { language } = useContext(LanguageContext);
    const [premises, setPremises] = useState([]);
    const [openGroupDialog, setOpenGroupDialog] = useState({ open: false, index: undefined });
    const [error, setError] = useState(undefined);
    const [operator, setOperator] = useState('AND');

    /**
     * Parse existing premise
     */
    useEffect(() => {
        if (character && character.logicalPremise && character.logicalPremise.length > 0) {
            const arr = JSON.parse(JSON.stringify(character.logicalPremise));
            setOperator(arr[0]);
            arr.splice(0, 1);
            const tmp = [];
            arr.forEach((element) => {
                element.splice(0, 1);
                const inner = [];
                element.forEach((el) => {
                    if (!inner[el.index]) inner[el.index] = [];
                    inner[el.index].push(el);
                });
                element.push(inner);
                tmp.push(element.filter((el) => Array.isArray(el)));
            });
            setPremises(tmp.map((el) => el[0]));
        }
        setError(undefined);
    }, [character]);

    /**
     * Handle premise changes
     *
     * @param {Array} arr Premises
     */
    const handleChangePremises = (arr) => {
        const premiseArr = [...premises];
        premiseArr[openGroupDialog.index] = arr;
        setPremises(premiseArr);
    };

    /**
     * Delete premise group if empty
     *
     * @param {Array} arr Premises
     */
    const handleClosePremiseGroup = (arr) => {
        let empty = true;
        const prem = JSON.parse(JSON.stringify(premises));
        for (let i = 0; i < arr.length; i += 1) {
            if (Array.isArray(arr[i]) && arr[i].length !== 0) {
                empty = false;
            } else prem[openGroupDialog.index].splice(i, 1);
        }
        if (empty) prem.splice(openGroupDialog.index, 1);
        setPremises(prem);
        setOpenGroupDialog({ open: false, index: undefined });
    };

    /**
     * Format premises array
     *
     * @returns {Array} Premises
     */
    const formatPremises = () => {
        const arr = [];
        if (premises.length > 0) {
            arr.push(operator);
            premises.forEach((element) => {
                const inner = [];
                inner.push(operator === 'AND' ? 'OR' : 'AND');
                element.forEach((innerElement) => innerElement.forEach((el) => inner.push(el)));
                arr.push(inner);
            });
        }
        return arr;
    };

    /**
     * Submit to API and refresh revision
     */
    const handleSubmit = async () => {
        try {
            const logicalPremise = formatPremises();
            if (JSON.stringify(logicalPremise) !== JSON.stringify(character.logicalPremise)) {
                const data = {
                    keyId: revision && revision.keyId,
                    revisionId: revision && revision.id,
                    characterId: character.id,
                    logicalPremise,
                };
                const revisionId = await updateCharacterPremise(data);
                onCreated(revisionId);
            } else onClose();
        } catch (err) {
            setError(language.dictionary.internalAPIError);
        }
    };

    return (
        <Dialog fullWidth scroll="paper" open={openDialog} onClose={() => onClose()}>
            <div className="p-2">
                <DialogTitle>
                    {findName(character.title, language.language.split('_')[0]) || language.dictionary.unknown}
                </DialogTitle>
                <DialogContent>
                    <CloseButton onClick={() => onClose()} />
                    <p className="mb-4">{language.dictionary.sectionLogicalPremises}</p>
                    <p className="mb-4">{language.dictionary.sectionLogicalGroups}</p>
                    <PremiseGroupTable
                        character={character}
                        characters={characters}
                        premises={premises}
                        operator={operator}
                        onChangeOperator={(value) => setOperator(value)}
                        onChangePremises={(arr) => setPremises(arr)}
                        openPremise={(index) => setOpenGroupDialog({ open: true, index })}
                    />
                    {error && <p className="text-red-600 mb-4">{error}</p>}
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        endIcon={<SaveOutlined />}
                        type="submit"
                        onClick={() => handleSubmit()}
                    >
                        {character && character.logicalPremise
                            ? language.dictionary.btnSaveChanges : language.dictionary.btnSave}
                    </Button>
                </DialogActions>
                {openGroupDialog.open && (
                    <CreatePremiseGroup
                        openDialog={openGroupDialog.open}
                        premises={premises[openGroupDialog.index] || []}
                        operator={operator}
                        character={character}
                        characters={characters}
                        revision={revision}
                        onClose={(arr) => handleClosePremiseGroup(arr)}
                        onChangePremises={(arr) => handleChangePremises(arr)}
                    />
                )}
            </div>
        </Dialog>
    );
};

export default CreatePremises;
