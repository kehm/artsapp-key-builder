import React, { useContext } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import EditOutlined from '@material-ui/icons/EditOutlined';
import ListOutlined from '@material-ui/icons/ListOutlined';
import IconButton from '@material-ui/core/IconButton';
import LanguageContext from '../../../context/LanguageContext';
import UserContext from '../../../context/UserContext';
import ListAvatar from '../ListAvatar';

/**
 * Render collection list
 */
const CollectionList = ({
    collections, isEditor, onOpenList, onEdit,
}) => {
    const { language } = useContext(LanguageContext);
    const { user } = useContext(UserContext);

    return (
        <List className="w-96">
            {collections && collections.map((collection) => (
                <ListItem key={collection.id}>
                    <ListItemAvatar>
                        <ListAvatar
                            media={collection.media}
                            alt="Collection"
                        />
                    </ListItemAvatar>
                    <span className="overflow-hidden overflow-ellipsis whitespace-nowrap w-52">
                        {collection ? collection.name : language.dictionary.noName}
                    </span>
                    <ListItemSecondaryAction>
                        <span className="mr-4">
                            <IconButton
                                edge="end"
                                aria-label="list"
                                onClick={() => onOpenList(collection)}
                            >
                                <ListOutlined />
                            </IconButton>
                        </span>
                        <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => onEdit(collection.id)}
                            disabled={!isEditor
                                || !user.workgroups.includes(collection.workgroup_id)}
                        >
                            <EditOutlined />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            ))}
        </List>
    );
};

export default CollectionList;
