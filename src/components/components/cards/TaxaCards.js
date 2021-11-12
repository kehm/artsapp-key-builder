import React, { useContext, useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';
import LanguageContext from '../../../context/LanguageContext';
import { findName } from '../../../utils/translation';
import ListAvatar from '../ListAvatar';
import { findParentTaxa, findSubTaxa } from '../../../utils/taxon';
import { handleAlternativeCheck, handleSliderChange } from '../../../utils/character';

/**
 * Render taxa cards
 */
const TaxaCards = ({
    taxa, character, taxaSwitches, statements, onStateChange,
}) => {
    const { language } = useContext(LanguageContext);
    const [characterTaxa, setCharacterTaxa] = useState(undefined);

    /**
     * Set taxa available for selection on the character
     */
    useEffect(() => {
        let arr = taxa;
        const characterStatements = statements.filter(
            (statement) => statement.characterId === character.id,
        );
        arr = arr.filter((taxon) => {
            const parentTaxa = findParentTaxa(taxa, taxon.id);
            const subTaxa = findSubTaxa(taxon);
            const relatedTaxa = parentTaxa.concat(subTaxa);
            const exists = relatedTaxa.filter(
                (el) => characterStatements.find((statement) => statement.taxonId === el.id),
            );
            if (exists.length === 0) return true;
            return false;
        });
        setCharacterTaxa(arr);
    }, [character, taxa, statements]);

    /**
     * Handle switch changes
     *
     * @param {Object} e Event
     */
    const handleSwitchChange = (e) => {
        let arr = [...statements];
        if (e.target.checked) {
            let value;
            if (Array.isArray(character.states)) {
                value = character.states[0].id;
            } else value = [parseFloat(character.states.min), parseFloat(character.states.max)];
            arr.push({ characterId: character.id, taxonId: e.target.name, value });
        } else {
            arr = arr.filter(
                (element) => !(element.characterId === character.id
                    && element.taxonId === e.target.name),
            );
        }
        onStateChange(arr);
    };

    /**
     * Render state list item
     *
     * @param {Object} state State object
     * @param {Object} taxon Taxon object
     * @returns JSX
     */
    const renderStateItem = (state, taxon) => {
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
                        onClick={() => onStateChange(handleAlternativeCheck(
                            statements,
                            character,
                            state.id,
                            taxon.id,
                            checked,
                        ))}
                        disabled={Array.isArray(taxaSwitches[taxon.id])
                            && taxaSwitches[taxon.id].length < 1}
                        edge="start"
                        checked={Array.isArray(taxaSwitches[taxon.id])
                            && taxaSwitches[taxon.id].includes(state.id)}
                        tabIndex={-1}
                        disableRipple
                    />
                </ListItemIcon>
                <ListItemText primary={findName(state.title, language.language.split('_')[0]) || language.dictionary.unknown} />
                <ListItemSecondaryAction className="hidden lg:inline">
                    <ListItemAvatar>
                        <Avatar className="ml-4">
                            <ImageIcon />
                        </Avatar>
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
    const renderSlider = (state, taxonId) => {
        const defaultState = [parseFloat(state.min), parseFloat(state.max)];
        const statement = statements.find(
            (element) => element.characterId === character.id && element.taxonId === taxonId,
        );
        return (
            <>
                <Slider
                    className="mt-6"
                    disabled={taxaSwitches[taxonId] < 0}
                    color="secondary"
                    value={statement ? statement.value : defaultState}
                    aria-labelledby="numerical-value-slider"
                    valueLabelDisplay="auto"
                    step={parseFloat(state.stepSize)}
                    min={parseFloat(state.min)}
                    max={parseFloat(state.max)}
                    marks
                    onChange={(e, val) => onStateChange(handleSliderChange(
                        statements,
                        val,
                        character.id,
                        taxonId,
                    ))}
                />
                <Typography id="discrete-slider" className="text-center" gutterBottom>
                    {findName(state.unit, language.language.split('_')[0]) || language.dictionary.unknown}
                </Typography>
            </>
        );
    };

    /**
     * Render card label
     *
     * @param {Object} taxon Taxon object
     * @returns JSX
     */
    const renderLabel = (taxon) => {
        const vernacularName = taxon.vernacularName && taxon.vernacularName[language.language.split('_')[0]] ? taxon.vernacularName[language.language.split('_')[0]] : '';
        return (
            <div className="overflow-hidden overflow-ellipsis whitespace-nowrap w-40 xl:w-60">
                <span className="block overflow-hidden overflow-ellipsis whitespace-nowrap w-40 xl:w-60">
                    {`${taxon.scientificName}`}
                </span>
                <span className="font-light text-sm ml-1 text-gray-500">
                    {vernacularName || language.dictionary.unknown}
                </span>
            </div>
        );
    };

    /**
     * Render card
     *
     * @param {Object} taxon Taxon object
     * @returns JSX
     */
    const renderCard = (taxon) => (
        <Card key={taxon.id} variant="outlined">
            <div className="relative p-2">
                <div className="absolute left-3 hidden lg:inline">
                    <ListAvatar
                        media={taxon.media}
                        alt="State"
                        rightAlign
                    />
                </div>
                <span className="lg:ml-20">
                    <FormControlLabel
                        control={(
                            <Switch
                                checked={Array.isArray(taxaSwitches[taxon.id])
                                    && taxaSwitches[taxon.id].length > 0}
                                onChange={handleSwitchChange}
                                name={taxon.id.toString()}
                            />
                        )}
                        label={renderLabel(taxon)}
                    />
                </span>
                <CardContent>
                    {character.states && Array.isArray(character.states) ? (
                        <List dense>
                            {character.states.map((state) => renderStateItem(state, taxon))}
                        </List>
                    )
                        : renderSlider(character.states, taxon.id)}
                </CardContent>
            </div>
        </Card>
    );

    return characterTaxa ? (
        <div className="overflow-auto mt-1 h-full">
            {characterTaxa.map((taxon) => renderCard(taxon))}
        </div>
    ) : null;
};

export default TaxaCards;
