import React, { useContext, useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import { makeStyles } from '@material-ui/core/styles';
import LanguageContext from '../../../context/LanguageContext';
import formatDate from '../../../utils/format-date';

const useStyles = makeStyles(() => ({
    large: {
        width: '5rem',
        height: '5rem',
        background: 'white',
    },
    small: {
        width: '3rem',
        height: '3rem',
        background: 'white',
    },
}));

/**
 * Render key list with search filter
 */
const KeyList = ({ keys, error, onClickListItem }) => {
    const { language } = useContext(LanguageContext);
    const classes = useStyles();
    const [filter, setFilter] = useState({ title: '' });
    const [filteredKeys, setFilteredKeys] = useState([]);

    /**
     * Scroll to top on launch
     */
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    /**
    * Filter keys
    */
    useEffect(() => {
        if (keys) {
            if (filter.title === '') {
                setFilteredKeys(keys);
            } else {
                let filtered = [...keys];
                filtered = filtered.filter((element) => {
                    let keyTitle = element.key_info ? element.key_info.title : '';
                    if (typeof keyTitle === 'string') {
                        keyTitle = keyTitle.toUpperCase();
                        if (keyTitle.includes(filter.title.toUpperCase())) return true;
                        return false;
                    }
                    return false;
                });
                setFilteredKeys(filtered);
            }
        }
    }, [keys, filter]);

    /**
     * Render search bar or error alert
     *
     * @returns JSX
     */
    const renderSearchBar = () => (
        <div className="fixed top-14 lg:top-0 lg:right-64 pt-2 lg:pt-1 mt-1 lg:mt-0 w-full md:w-96 px-2 h-16 bg-white z-10 lg:z-20">
            {error ? (
                <Alert elevation={6} variant="filled" severity="error">{error}</Alert>
            ) : (
                <TextField
                    id="outlined-full-width"
                    placeholder={language.dictionary.labelSearch}
                    fullWidth
                    autoComplete="off"
                    variant="outlined"
                    value={filter.title}
                    onChange={(e) => setFilter({ ...filter, title: e.target.value })}
                />
            )}
        </div>
    );

    return (
        <>
            {renderSearchBar()}
            <div className="overflow-y-auto lg:pb-0 px-2">
                <List>
                    {filteredKeys.map((key) => (
                        <ListItem
                            key={key.id + key.key_info.languageCode}
                            className="rounded cursor-pointer bg-gray-100 hover:bg-blue-100 h-24 mb-2 shadow-md"
                            onClick={() => onClickListItem(key)}
                        >
                            <ListItemAvatar>
                                {key.media && key.media.length > 0
                                    ? (
                                        <Avatar
                                            className={`${classes.large} cursor-pointer m-auto`}
                                            alt="Key"
                                            variant="rounded"
                                            src={`${process.env.REACT_APP_BUILDER_API_URL}/media/thumbnails/${key.media[0].mediaid}`}
                                        />
                                    )
                                    : (
                                        <Avatar
                                            className={classes.large}
                                            variant="rounded"
                                        >
                                            <ImageIcon color="primary" />
                                        </Avatar>
                                    )}
                            </ListItemAvatar>
                            <ListItemText
                                primary={(
                                    <span className="block w-full px-3">
                                        {key.key_info ? key.key_info.title : ''}
                                    </span>
                                )}
                                secondary={(
                                    <span className="block ml-3">
                                        {`${language.dictionary.created} ${formatDate(key.created_at, true)} ${formatDate(key.created_at, true) !== formatDate(key.updated_at, true) ? `(${language.dictionary.updated} ${formatDate(key.updated_at, true)})` : ''}`}
                                    </span>
                                )}
                            />
                        </ListItem>
                    ))}
                </List>
                {filteredKeys.length === 0 && <p>{language.dictionary.noMatchingKeys}</p>}
            </div>
        </>
    );
};

export default KeyList;
