import React, { useContext, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import Checkbox from '@material-ui/core/Checkbox';
import formatDate from '../../../utils/format-date';
import { findRevisionStatusName } from '../../../utils/translation';
import LanguageContext from '../../../context/LanguageContext';

/**
 * Render revision list
 */
const RevisionList = ({ revisions, selectable, onClickListItem }) => {
    const { language } = useContext(LanguageContext);
    const [checked, setChecked] = useState(undefined);

    /**
     * Handle list item click
     *
     * @param {Object} revision Revision
     * @param {int} index Item index
     */
    const handleListItemClick = (revision, index) => {
        if (selectable) {
            if (checked === index) {
                setChecked(undefined);
                onClickListItem(undefined);
            } else {
                setChecked(index);
                onClickListItem(revision);
            }
        } else onClickListItem(revision);
    };

    return (
        <List>
            {revisions && revisions.map((revision, index) => (
                <ListItem
                    key={revision.id}
                    className="cursor-pointer"
                    onClick={() => handleListItemClick(revision, index)}
                >
                    {selectable ? (
                        <ListItemIcon>
                            <Checkbox
                                edge="start"
                                checked={checked === index}
                                tabIndex={-1}
                                disableRipple
                            />
                        </ListItemIcon>
                    )
                        : (
                            <ListItemAvatar>
                                <Avatar>
                                    <ImageIcon />
                                </Avatar>
                            </ListItemAvatar>
                        )}
                    <ListItemText
                        primary={(
                            <p className={`${revision.createdBy ? 'font-bold' : ''} overflow-hidden overflow-ellipsis whitespace-nowrap w-96`}>
                                {revision.note ? revision.note : formatDate(revision.created_at)}
                            </p>
                        )}
                        secondary={revision.note ? `${formatDate(revision.created_at)} (${language.dictionary.labelStatus.toLowerCase()}: ${findRevisionStatusName(revision.status, language)})` : ''}
                    />
                </ListItem>
            ))}
        </List>
    );
};

export default RevisionList;
