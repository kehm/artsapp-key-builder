import React, { useContext } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import formatDate from '../../../utils/format-date';
import { findRevisionStatusName } from '../../../utils/translation';
import LanguageContext from '../../../context/LanguageContext';

/**
 * Render revision list
 */
const RevisionList = ({ revisions, onClickListItem }) => {
    const { language } = useContext(LanguageContext);

    return (
        <List>
            {revisions && revisions.map((revision) => (
                <ListItem
                    key={revision.id}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => onClickListItem(revision)}
                >
                    <ListItemText
                        primary={(
                            <p className={`${revision.createdBy ? 'font-bold' : ''} overflow-hidden overflow-ellipsis whitespace-nowrap w-96`}>
                                {revision.note ? revision.note : formatDate(revision.created_at)}
                            </p>
                        )}
                        secondary={revision.note
                            ? `${formatDate(revision.created_at)} (${language.dictionary.labelStatus.toLowerCase()}: ${findRevisionStatusName(revision.status, language)})`
                            : ''}
                    />
                </ListItem>
            ))}
        </List>
    );
};

export default RevisionList;
