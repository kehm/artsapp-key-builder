import React, { useContext } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import LanguageContext from '../../../context/LanguageContext';
import formatDate from '../../../utils/format-date';

/**
 * Render key list
 */
const KeyList = ({ keys, onClickListItem }) => {
    const { language } = useContext(LanguageContext);

    return (
        <List>
            {keys && keys.map((key) => (
                <ListItem
                    key={key.id + key.key_info.languageCode}
                    className="mt-4 cursor-pointer"
                    onClick={() => onClickListItem(key)}
                >
                    <ListItemAvatar>
                        {key.media && key.media.length > 0
                            ? (
                                <Avatar
                                    className="mr-4"
                                    alt="Key"
                                    src={`${process.env.REACT_APP_BUILDER_API_URL}/media/thumbnails/${key.media[0].mediaid}`}
                                />
                            )
                            : (
                                <Avatar className="mr-4">
                                    <ImageIcon />
                                </Avatar>
                            )}
                    </ListItemAvatar>
                    <ListItemText
                        primary={key.key_info ? key.key_info.title : ''}
                        secondary={`${language.dictionary.created} ${formatDate(key.created_at, true)} ${formatDate(key.created_at, true) !== formatDate(key.updated_at, true) ? `(${language.dictionary.updated} ${formatDate(key.updated_at, true)})` : ''}`}
                    />
                </ListItem>
            ))}
        </List>
    );
};

export default KeyList;
