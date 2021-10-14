import React, { useContext, useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import EditOutlined from '@material-ui/icons/EditOutlined';
import CompareArrows from '@material-ui/icons/CompareArrows';
import IconButton from '@material-ui/core/IconButton';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import LanguageContext from '../../../context/LanguageContext';
import { findName } from '../../../utils/translation';
import getInputChange from '../../../utils/input-change';
import TextInput from '../inputs/TextInput';
import ListAvatar from '../ListAvatar';
import AddButton from '../buttons/AddButton';

/**
 * Render character list
 */
const CharacterList = ({
    characters, selectedCharacter, onSelectCharacter,
    onEditCharacter, onMoveCharacter, onClickAdd, onChangeSort,
}) => {
    const { language } = useContext(LanguageContext);
    const defaultFormValues = {
        filter: '',
    };
    const [formValues, setFormValues] = useState(defaultFormValues);
    const [filter, setFilter] = useState(undefined);

    /**
     * Filter character list
     */
    useEffect(() => {
        if (characters) {
            let arr = characters;
            if (formValues.filter) {
                arr = characters.filter((character) => character.title[language.language.split('_')[0]] !== undefined && character.title[language.language.split('_')[0]].toUpperCase().includes(formValues.filter.toUpperCase()));
            }
            setFilter(arr);
        }
    }, [characters, formValues, language]);

    /**
     * Render character list item
     *
     * @param {Object} character Character object
     * @param {int} index Character index
     * @returns JSX
     */
    const renderCharacterItem = (character, index) => (
        <ListItem
            key={character.id}
            className={selectedCharacter && selectedCharacter.id === character.id ? 'bg-blue-200 rounded mt-4 cursor-pointer h-20' : 'rounded mt-4 cursor-pointer h-20'}
            onClick={() => onSelectCharacter(character)}
        >
            <span className="hidden lg:inline">
                <ListAvatar
                    media={character.media}
                    alt="State"
                />
            </span>
            <div className="absolute right-10">
                {selectedCharacter
                    && (selectedCharacter.id === character.id) && filter === characters && (
                        <>
                            <IconButton
                                disabled={index === 0}
                                onClick={() => onMoveCharacter(character.id, 'UP')}
                            >
                                <ArrowDropUp />
                            </IconButton>
                            <span className="mr-4">
                                <IconButton
                                    disabled={index === characters.length - 1}
                                    onClick={() => onMoveCharacter(character.id, 'DOWN')}
                                >
                                    <ArrowDropDown />
                                </IconButton>
                            </span>
                        </>
                    )}
            </div>
            <ListItemText
                primary={(
                    <p className="overflow-hidden overflow-ellipsis whitespace-nowrap w-40 xl:w-60">
                        {findName(character.title, language.language.split('_')[0]) || language.dictionary.unknown}
                    </p>
                )}
            />
            <ListItemSecondaryAction>
                <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => { onSelectCharacter(character); onEditCharacter(character.id); }}
                >
                    <EditOutlined />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );

    return (
        <div className="mr-4 border-r border-solid rounded h-full overflow-hidden pb-36">
            <div className="pl-2">
                <div className="flex mr-2">
                    <AddButton
                        label={language.dictionary.labelCharacters}
                        onClick={() => onClickAdd()}
                    />
                    <span className="ml-3">
                        <IconButton
                            edge="start"
                            aria-label="add"
                            color="primary"
                            title={language.dictionary.btnSwitchLists}
                            onClick={() => onChangeSort()}
                        >
                            <CompareArrows />
                        </IconButton>
                    </span>
                </div>
                <div className="w-80">
                    <TextInput
                        name="filter"
                        label={language.dictionary.labelSearch}
                        value={formValues.filter}
                        maxLength={280}
                        standard
                        onChange={(e) => setFormValues(getInputChange(e, formValues))}
                    />
                </div>
            </div>
            <hr />
            <div className="overflow-y-auto h-full mt-1">
                <List>
                    {filter
                        ? filter.map((character, index) => renderCharacterItem(character, index))
                        : characters
                        && characters.map(
                            (character, index) => renderCharacterItem(character, index),
                        )}
                </List>
            </div>
        </div>
    );
};

export default CharacterList;
