import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CancelOutlined from '@material-ui/icons/CancelOutlined';
import IconButton from '@material-ui/core/IconButton';

/**
 * Render key title list
 */
const KeyTitleList = ({ keys, showActions, onRemove }) => (
    <List className="w-96">
        {keys && keys.map((key) => (
            <ListItem
                key={key.id}
                className="mt-4"
            >
                <ListItemText
                    primary={key.key_info
                        ? key.key_info.title : key.artsapp_key
                            ? key.artsapp_key.key_info.title : ''}
                />
                {showActions && (
                    <ListItemSecondaryAction>
                        <IconButton
                            edge="end"
                            aria-label="remove"
                            onClick={() => onRemove(key.id)}
                        >
                            <CancelOutlined />
                        </IconButton>
                    </ListItemSecondaryAction>
                )}
            </ListItem>
        ))}
    </List>
);

export default KeyTitleList;
