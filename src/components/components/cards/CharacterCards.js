import React, { useContext, useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import DashboardIcon from '@material-ui/icons/Dashboard';
import EditOutlined from '@material-ui/icons/EditOutlined';
import IconButton from '@material-ui/core/IconButton';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';
import CreatePremises from '../../dialogs/CreatePremises';
import LanguageContext from '../../../context/LanguageContext';
import { findParentTaxa, findSubTaxa } from '../../../utils/taxon';
import { findName } from '../../../utils/translation';

/**
 * Render character cards
 */
const CharacterCards = ({
    characters, taxa, characterSwitches, filter, statements,
    taxon, revision, onStateChange, onEditCharacter, onCreatedPremise,
}) => {
    const { language } = useContext(LanguageContext);
    const [switches, setSwitches] = useState({});
    const [openPremiseDialog, setOpenPremiseDialog] = useState(undefined);
    const [taxonCharacters, setTaxonCharacters] = useState(undefined);

    /**
     * Set characters available for selection on the taxon
     */
    useEffect(() => {
        let arr = characters;
        const parentTaxa = findParentTaxa(taxa, taxon.id);
        const subTaxa = findSubTaxa(taxon);
        const relatedTaxa = parentTaxa.concat(subTaxa);
        if (relatedTaxa.length > 0) {
            let taxaStatements = [];
            relatedTaxa.forEach((element) => {
                taxaStatements = taxaStatements.concat(
                    statements.filter((statement) => statement.taxonId === element.id),
                );
            });
            arr = arr.filter(
                (element) => !taxaStatements.find((obj) => obj.characterId === element.id),
            );
        }
        setTaxonCharacters(arr);
    }, [taxon, characters, statements]);

    /**
     * Set initial switch positions
     */
    useEffect(() => {
        if (characterSwitches) setSwitches(characterSwitches);
    }, [characterSwitches]);

    /**
     * Handle switch changes
     *
     * @param {Object} e Event
     */
    const handleSwitchChange = (e) => {
        const characterId = e.target.name;
        setSwitches({ ...switches, [characterId]: e.target.checked ? 0 : -1 });
        let arr = [...statements];
        if (e.target.checked) {
            const character = characters
                && characters.find((element) => element.id === characterId);
            if (character && character.states) {
                let value;
                if (Array.isArray(character.states)) {
                    value = character.states[0].id;
                } else value = [parseFloat(character.states.min), parseFloat(character.states.max)];
                arr.push({ taxonId: taxon.id, characterId, value });
            }
        } else {
            arr = arr.filter((element) => !(
                element.taxonId === taxon.id && element.characterId === characterId));
        }
        onStateChange(arr);
    };

    /**
     * Handle checkbox click
     *
     * @param {int} stateId State ID
     * @param {Object} character Character
     * @param {boolean} uncheck True if uncheck
     */
    const handleAlternativeCheck = (stateId, character, uncheck) => {
        let arr = [...statements];
        /*
          if (character.type.toUpperCase() === 'EXCLUSIVE') {
              const obj = arr.find(
                  (element) => element.taxonId === taxon.id && element.characterId === character.id,
              );
              if (obj) {
                  obj.value = stateId;
                  setSwitches({ ...switches, [character.id]: 0 });
              }
          } else if (character.type.toUpperCase() === 'MULTISTATE') {
              */
        if (uncheck) {
            if (arr.filter(
                (element) => element.taxonId === taxon.id
                    && element.characterId === character.id,
            ).length > 1) {
                arr = arr.filter(
                    (element) => !(element.taxonId === taxon.id
                        && element.characterId === character.id
                        && element.value === stateId),
                );
                setSwitches({ ...switches, [character.id]: -1 });
            }
        } else if (character.states.length > arr.filter(
            (element) => element.taxonId === taxon.id && element.characterId === character.id,
        ).length) {
            arr.push({ taxonId: taxon.id, characterId: character.id, value: stateId });
            setSwitches({ ...switches, [character.id]: 0 });
        }
        // }
        onStateChange(arr);
    };

    /**
     * Handle numerical character slider change
     *
     * @param {Array} val New values
     * @param {int} characterId Character ID
     */
    const handleSliderChange = (val, characterId) => {
        const arr = [...statements];
        const statement = arr.find(
            (element) => element.taxonId === taxon.id && element.characterId === characterId,
        );
        statement.value = val;
        onStateChange(arr);
    };

    /**
     * Render list item for state
     *
     * @param {Object} state State object
     * @param {Object} character Character object
     * @returns JSX
     */
    const renderStateItem = (state, character) => {
        let checked = false;
        const states = statements.filter(
            (element) => element.taxonId === taxon.id && element.characterId === character.id,
        );
        const checkedStates = states.find((element) => element.value === state.id);
        if (checkedStates) checked = true;
        return (
            <ListItem key={state.id} className="cursor-pointer">
                <ListItemIcon>
                    <Checkbox
                        onClick={() => handleAlternativeCheck(state.id, character, checked)}
                        disabled={switches[character.id] < 0}
                        edge="start"
                        checked={checked}
                        tabIndex={-1}
                        disableRipple
                    />
                </ListItemIcon>
                <ListItemText primary={findName(state.title, language.language.split('_')[0]) || language.dictionary.unknown} />
                <ListItemSecondaryAction>
                    <ListItemAvatar className="hidden lg:inline">
                        {state.media && state.media.length > 0
                            ? <Avatar className="ml-4" alt="State" src={`${process.env.REACT_APP_BUILDER_API_URL}/media/thumbnails/${state.media[0]}`} />
                            : (
                                <Avatar className="ml-4">
                                    <ImageIcon />
                                </Avatar>
                            )}
                    </ListItemAvatar>
                </ListItemSecondaryAction>
            </ListItem>
        );
    };

    /**
     * Render slider for numerical state
     *
     * @param {Object} state State object
     * @param {int} characterId Character ID
     * @returns JSX
     */
    const renderSlider = (state, characterId) => {
        const defaultState = [parseFloat(state.min), parseFloat(state.max)];
        const statement = statements.find(
            (element) => element.taxonId === taxon.id && element.characterId === characterId,
        );
        return (
            <>
                <Slider
                    className="mt-6"
                    disabled={switches[characterId] < 0}
                    color="secondary"
                    value={statement ? statement.value : defaultState}
                    aria-labelledby="numerical-value-slider"
                    valueLabelDisplay="auto"
                    step={parseFloat(state.stepSize)}
                    min={parseFloat(state.min)}
                    max={parseFloat(state.max)}
                    marks
                    onChange={(e, val) => handleSliderChange(val, characterId)}
                />
                <Typography id="discrete-slider" className="text-center" gutterBottom>
                    {findName(state.unit, language.language.split('_')[0]) || language.dictionary.unknown}
                </Typography>
            </>
        );
    };

    /**
     * Render card
     *
     * @param {Object} character Character object
     * @returns JSX
     */
    const renderCard = (character) => (
        <Card key={character.id} variant="outlined">
            <div className="relative p-2">
                <div className="absolute left-3 hidden lg:inline">
                    {character.media && character.media.length > 0
                        ? <Avatar className="ml-4" alt="State" src={`${process.env.REACT_APP_BUILDER_API_URL}/media/thumbnails/${character.media[0]}`} />
                        : (
                            <Avatar className="ml-4">
                                <ImageIcon />
                            </Avatar>
                        )}
                </div>
                <span className="lg:ml-20">
                    <FormControlLabel
                        control={(
                            <Switch
                                checked={switches[character.id] > -1}
                                onChange={handleSwitchChange}
                                name={character.id}
                            />
                        )}
                        label={(
                            <p className="overflow-hidden overflow-ellipsis whitespace-nowrap w-40 lg:w-32 xl:w-60">
                                {findName(character.title, language.language.split('_')[0]) || language.dictionary.unknown}
                            </p>
                        )}
                    />
                </span>
                <span className="absolute right-5">
                    <span className="mr-4">
                        <IconButton edge="end" aria-label="add" onClick={() => setOpenPremiseDialog(character.id)}>
                            <DashboardIcon color={`${character.logicalPremise && character.logicalPremise.length > 0 ? 'secondary' : 'inherit'}`} />
                        </IconButton>
                    </span>
                    <IconButton edge="end" aria-label="add" onClick={() => onEditCharacter(character.id)}>
                        <EditOutlined />
                    </IconButton>
                </span>
                <CardContent>
                    {character.states
                        && Array.isArray(character.states) ? (
                        <List dense>
                            {character.states.map((state) => renderStateItem(state, character))}
                        </List>
                    ) : renderSlider(character.states, character.id)}
                </CardContent>
            </div>
            {openPremiseDialog && (
                <CreatePremises
                    openDialog={openPremiseDialog === character.id}
                    character={character}
                    characters={characters}
                    revision={revision}
                    onClose={() => setOpenPremiseDialog(undefined)}
                    onCreated={(id) => onCreatedPremise(id)}
                />
            )}
        </Card>
    );

    /**
     * Filter and render character cards
     *
     * @returns JSX
     */
    const renderCards = () => {
        let arr;
        switch (filter) {
            case 'CATEGORICAL':
                arr = taxonCharacters.filter((character) => Array.isArray(character.states));
                break;
            case 'NUMERICAL':
                arr = taxonCharacters.filter((character) => !Array.isArray(character.states));
                break;
            default:
                arr = taxonCharacters;
        }
        return arr.map((character) => renderCard(character));
    };

    return taxonCharacters ? renderCards() : null;
};

export default CharacterCards;
