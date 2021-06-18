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
import TextField from '@material-ui/core/TextField';
import Add from '@material-ui/icons/Add';
import Chip from '@material-ui/core/Chip';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DeleteOutlined from '@material-ui/icons/DeleteOutlined';
import LanguageContext from '../../../context/LanguageContext';
import ConfirmDelete from '../../dialogs/ConfirmDelete';
import { findName } from '../../../utils/translation';

/**
 * Render logical premises table
 */
const PremiseTable = ({
    character, characters, premises, onChangePremises, operator,
}) => {
    const { language } = useContext(LanguageContext);

    const [confirmDelete, setConfirmDelete] = useState(undefined);
    const [chars, setChars] = useState(undefined);
    const [selectedOperators, setSelectedOperators] = useState([]);
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
     * Create new premise
     */
    const addPremise = () => {
        const prems = [...premises];
        const nots = [...selectedNots];
        prems.push([]);
        nots.push(false);
        onChangePremises(prems);
        setSelectedNots(nots);
    };

    /**
     * Handle changes to characcter input
     *
     * @param {Object} char Character object
     * @param {int} index Table index
     */
    const handleCharacterInput = (char, index) => {
        const arr = [...premises];
        if (char) {
            const tmp = [];
            if (char.type === 'exclusive' || char.type === 'multistate') {
                char.states.forEach((state) => {
                    tmp.push({
                        index,
                        characterId: char.id,
                        stateId: state.id,
                        value: true,
                        condition: selectedNots[index] ? '!=' : '==',
                    });
                });
            } else {
                const nots = [...selectedNots];
                nots[index] = false;
                setSelectedNots(nots);
                tmp.push({
                    index,
                    characterId: char.id,
                    stateId: char.states.id,
                    value: char.states.min,
                    condition: '>=',
                });
                tmp.push({
                    index,
                    characterId: char.id,
                    stateId: char.states.id,
                    value: char.states.max,
                    condition: '<=',
                });
            }
            arr[index] = tmp;
        } else arr[index] = [];
        onChangePremises(arr);
    };

    /**
     * Handle changes to character states
     *
     * @param {Object} char Character object
     * @param {Array} states States
     * @param {int} index Table index
     */
    const handleStateInput = (char, states, index) => {
        const arr = [...premises];
        let charStates = char.states;
        if (states.length > 0) charStates = states;
        const tmp = [];
        if (char.type === 'exclusive' || char.type === 'multistate') {
            charStates.forEach((state) => {
                tmp.push({
                    index,
                    characterId: char.id,
                    stateId: state.id,
                    value: true,
                    condition: selectedNots[index] ? '!=' : '==',
                });
            });
        } else {
            tmp.push({
                index,
                characterId: char.id,
                stateId: states.length > 0 ? char.states.id : charStates.id,
                value: states.length > 0 ? `${charStates[0]}` : charStates.min,
                condition: '>=',
            });
            tmp.push({
                index,
                characterId: char.id,
                stateId: states.length > 0 ? char.states.id : charStates.id,
                value: states.length > 0 ? `${charStates[1]}` : charStates.max,
                condition: '<=',
            });
        }
        arr[index] = tmp;
        onChangePremises(arr);
    };

    /**
     * Handle NOT checkbox clicks
     *
     * @param {int} index Premise index
     * @param {boolean} checked True if checked
     */
    const handleChangeNots = (index, checked) => {
        const nots = [...selectedNots];
        nots[index] = checked;
        setSelectedNots(nots);
        const arr = [...premises];
        arr[index].forEach((element) => {
            if (checked) {
                element.condition = '!=';
            } else element.condition = '==';
        });
        onChangePremises(arr);
    };

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
            const prems = [...premises];
            const nots = [...selectedNots];
            const ops = [...selectedOperators];
            prems.splice(index, 1);
            nots.splice(index, 1);
            ops.splice(index - 1, 2);
            onChangePremises(prems);
            setSelectedNots(nots);
            setSelectedOperators(ops);
        }
    };

    /**
     * Find character object for premise
     *
     * @param {int} index Premise index
     * @returns {Object} Character object
     */
    const findCharacter = (index) => {
        let char;
        if (premises[index] && premises[index].length > 0) {
            if (chars) {
                char = chars.find(
                    (element) => element.id === premises[index][0].characterId,
                );
            }
        }
        return char;
    };

    /**
     * Render premise for character
     *
     * @param {int} index Character index
     * @returns JSX
     */
    const renderPremise = (index) => {
        const char = findCharacter(index);
        const type = char && char.states && char.type ? char.type.toUpperCase() : undefined;
        if (type === 'EXCLUSIVE' || type === 'MULTISTATE') {
            return (
                <Autocomplete
                    multiple
                    id={`states${index}`}
                    fullWidth
                    value={premises[index]
                        ? char.states.filter((element) => {
                            const state = premises[index].find(
                                (obj) => obj.stateId === element.id,
                            );
                            if (state) return true;
                            return false;
                        }) : []}
                    onChange={(e, val) => handleStateInput(char, val, index)}
                    options={char.states || []}
                    getOptionLabel={(state) => findName(state.title, language.language.split('_')[0]) || language.dictionary.unknown}
                    noOptionsText={language.dictionary.noAlternatives}
                    renderTags={(value, getTagProps) => value.map((state, i) => (
                        <Chip
                            key={state.id}
                            variant="outlined"
                            label={findName(state.title, language.language.split('_')[0]) || language.dictionary.unknown}
                            {...getTagProps({ i })}
                        />
                    ))}
                    renderInput={(params) => <TextField {...params} label={language.dictionary.headerStates} variant="outlined" />}
                />
            );
        }
        if (type === 'NUMERICAL') {
            let defaultState = [
                parseFloat(char.states.min),
                parseFloat(char.states.max),
            ];
            if (premises[index] && premises[index].length > 1) {
                defaultState = [
                    parseFloat(premises[index][0].value),
                    parseFloat(premises[index][1].value),
                ];
            }
            return (
                <>
                    <Slider
                        className="mt-6"
                        color="secondary"
                        value={char && char.value ? char.value : defaultState}
                        aria-labelledby="numerical-value-slider"
                        valueLabelDisplay="auto"
                        step={parseFloat(char.states.stepSize)}
                        min={parseFloat(char.states.min)}
                        max={parseFloat(char.states.max)}
                        marks
                        onChange={(e, val) => handleStateInput(char, val, index)}
                    />
                    <Typography id="discrete-slider" className="text-center pb-8" gutterBottom>
                        {findName(char.states.unit, language.language.split('_')[0]) || language.dictionary.unknown}
                    </Typography>
                </>
            );
        }
        return null;
    };

    /**
     * Render table row
     *
     * @param {int} index Premise index
     * @returns JSX
     */
    const renderTableRow = (index) => {
        const char = findCharacter(index);
        return (
            <TableRow key={index}>
                <TableCell component="th" scope="row">
                    <div className="relative">
                        {index !== 0 && <p className="text-primary mb-4">{operator}</p>}
                        <FormControlLabel
                            className="pl-2 mb-4"
                            control={(
                                <Checkbox
                                    checked={selectedNots[index] || false}
                                    onChange={(e) => handleChangeNots(index, e.target.checked)}
                                    disabled={char && char.type === 'numerical'}
                                />
                            )}
                            label={char && char.type === 'numerical' ? '' : language.dictionary.operatorNot}
                        />
                        <span className="absolute right-2">
                            <IconButton
                                disabled={premises.length < 2}
                                edge="end"
                                aria-label="delete"
                                onClick={() => handleRemovePremise(index, true)}
                            >
                                <DeleteOutlined />
                            </IconButton>
                        </span>
                    </div>
                    <Autocomplete
                        id={`character${index}`}
                        fullWidth
                        value={char || null}
                        onChange={(e, val) => handleCharacterInput(val, index)}
                        options={chars || []}
                        getOptionLabel={(element) => (element.title && findName(element.title, language.language.split('_')[0]))
                            || language.dictionary.unknown}
                        noOptionsText={language.dictionary.noAlternatives}
                        renderInput={(params) => <TextField {...params} required label={language.dictionary.labelCharacter} variant="outlined" />}
                    />
                    {renderPremise(index)}
                </TableCell>
            </TableRow>
        );
    };

    return (
        <>
            <TableContainer className="mb-6 p-2">
                <Table aria-label="state table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <h2 className="mr-2 font-light">
                                    {language.dictionary.headerPremise}
                                </h2>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {premises.length > 0
                            && premises.map((element, index) => renderTableRow(index))}
                        <TableRow>
                            <TableCell component="th" scope="row">
                                <IconButton
                                    color="primary"
                                    edge="end"
                                    aria-label="add"
                                    onClick={() => addPremise()}
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

export default PremiseTable;
