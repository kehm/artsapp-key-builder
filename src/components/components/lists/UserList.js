import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CancelOutlined from '@material-ui/icons/CancelOutlined';
import IconButton from '@material-ui/core/IconButton';

/**
 * Render user list
 */
const UserList = ({ workgroupUsers, onRemove }) => (
    <List className="w-96">
        {workgroupUsers && workgroupUsers.map((workgroupUser) => (
            <ListItem key={workgroupUser.id}>
                <ListItemText primary={workgroupUser.artsapp_user.name} />
                <ListItemSecondaryAction>
                    <IconButton
                        edge="end"
                        aria-label="remove"
                        onClick={() => onRemove(workgroupUser.id)}
                    >
                        <CancelOutlined />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        ))}
    </List>
);

export default UserList;
