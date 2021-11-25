import React, { useContext, useEffect, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Add from '@material-ui/icons/Add';
import EditOutlined from '@material-ui/icons/EditOutlined';
import LanguageContext from '../../../context/LanguageContext';
import ConfirmDelete from '../../dialogs/ConfirmDelete';
import { findName } from '../../../utils/translation';
import DeleteButton from '../buttons/DeleteButton';

/**
 * Render logical premises table
 */
const PremiseGroupTable = ({
    character, characters, premises, onChangePremises,
    openPremise, onChangeOperator, operator,
}) => {
    const { language } = useContext(LanguageContext);
    const [confirmDelete, setConfirmDelete] = useState(undefined);
    const [chars, setChars] = useState(undefined);
    const [selectedNots, setSelectedNots] = useState([]);

    /**
     * Set available characters
     */
    useEffect(() => {
        if (!chars) {
            const arr = characters.filter((element) => element.id !== character.id);
            setChars(arr);
        }
    }, [character, characters]);

    /**
     * Remove premise
     *
     * @param {int} index Premise index
     * @param {boolean} confirm True if confirmation is required
     */
    const handleRemovePremise = (index, confirm) => {
        if (confirm) {
            setConfirmDelete(index);
        } else {
            const arr = [...premises];
            const nots = [...selectedNots];
            nots.splice(index, 1);
            arr.splice(index, 1);
            onChangePremises(arr);
            setSelectedNots(nots);
        }
    };

    /**
     * Render table rows for element
     *
     * @param {Array} element Premise array
     * @param {int} index Index
     * @returns JSX
     */
    const renderTableRow = (element, index) => {
        const premise = element[index];
        let char;
        if (chars && element && premise && Array.isArray(premise)
            && premise.length > 0 && premise[0]) {
            char = chars.find((obj) => obj.id === premise[0].characterId);
        }
        return (
            <div key={index} className="mb-4">
                {index !== 0 && <p className="text-primary mb-4">{operator === 'AND' ? 'OR' : 'AND'}</p>}
                <h2 className="text-lg text-yellow-500">{char ? (findName(char.title, language.language.split('_')[0]) || language.dictionary.unknown) : ''}</h2>
                {premise && Array.isArray(premise) && premise.map((obj, index) => {
                    if (obj) {
                        if (Array.isArray(char.states)) {
                            const state = char.states.find((el) => el.id === obj.stateId);
                            return (
                                <p key={index}>
                                    {obj.condition}
                                    &nbsp;
                                    {state ? (findName(state.title, language.language.split('_')[0]) || language.dictionary.unknown) : ''}
                                </p>
                            );
                        }
                        return <p key={index}>{`${obj.condition} ${obj.value}`}</p>;
                    }
                    return null;
                })}
            </div>
        );
    };

    /**
     * Render state rows for character premise
     *
     * @param {Array} premise Premise
     * @param {int} premiseIndex Premise index
     * @returns JSX
     */
    const renderTableRows = (premise, premiseIndex) => (
        <TableRow key={premiseIndex}>
            <TableCell className="relative" component="th" scope="row">
                {premise.map((obj, index) => renderTableRow(premise, index))}
                <span className="absolute right-2 top-2">
                    <span className="mr-4">
                        <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => openPremise(premiseIndex)}
                        >
                            <EditOutlined />
                        </IconButton>
                    </span>
                    <DeleteButton onClick={() => handleRemovePremise(premiseIndex, true)} />
                </span>
                {premiseIndex !== premises.length - 1 && <p className="text-primary pt-4">{operator}</p>}
            </TableCell>
        </TableRow>
    );

    return (
        <>
            <TableContainer className="mb-6 p-2">
                <Table aria-label="state table">
                    <TableHead>
                        <TableRow>
                            <TableCell className="relative">
                                <h2 className="mr-2 font-light">{language.dictionary.headerPremises}</h2>
                                <span className="absolute right-0 top-3">
                                    <FormControlLabel
                                        className="pl-2"
                                        control={(
                                            <Checkbox
                                                checked={operator === 'OR'}
                                                onChange={(e) => onChangeOperator(e.target.checked ? 'OR' : 'AND')}
                                                disabled={premises.length === 0}
                                            />
                                        )}
                                        label={language.dictionary.switchOperators}
                                    />
                                </span>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {premises.length > 0
                            ? premises.map((element, index) => renderTableRows(element, index))
                            : (
                                <TableRow>
                                    <TableCell component="th" scope="row">
                                        <p className="mt-6 text-sm">{language.dictionary.noPremiseGroups}</p>
                                    </TableCell>
                                </TableRow>
                            )}
                        <TableRow>
                            <TableCell component="th" scope="row">
                                <IconButton
                                    color="primary"
                                    edge="end"
                                    aria-label="add"
                                    onClick={() => openPremise(premises.length)}
                                >
                                    <Add />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <ConfirmDelete
                openDialog={confirmDelete !== undefined}
                index={confirmDelete}
                onClose={() => setConfirmDelete(undefined)}
                onConfirm={(index) => handleRemovePremise(index)}
            />
        </>
    );
};

export default PremiseGroupTable;
