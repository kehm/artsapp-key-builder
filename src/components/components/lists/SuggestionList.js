import React, { useContext } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import LanguageContext from '../../../context/LanguageContext';

/**
 * Render suggestion list
 */
const SuggestionList = ({ suggestions, onClickListItem }) => {
    const { language } = useContext(LanguageContext);

    return (
        <div className="mb-8">
            <List>
                <p className="mb-4 font-semibold">{language.dictionary.headerSuggestions}</p>
                {suggestions.map((suggestion, index) => (
                    <ListItem
                        key={index}
                        className="mt-4 cursor-pointer"
                        onClick={() => onClickListItem(suggestion)}
                    >
                        <ListItemText primary={suggestion} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default SuggestionList;
