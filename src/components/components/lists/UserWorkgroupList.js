import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CancelOutlined from '@material-ui/icons/CancelOutlined';
import IconButton from '@material-ui/core/IconButton';

/**
 * Render user workgroup list
 */
const UserWorkgroupList = ({ workgroups, onLeave }) => (
    <List className="w-96">
        {workgroups && workgroups.map((workgroup) => (
            <ListItem key={workgroup.id}>
                <ListItemText primary={workgroup.name} />
                <ListItemSecondaryAction>
                    <IconButton
                        edge="end"
                        aria-label="leave"
                        onClick={() => onLeave(workgroup)}
                    >
                        <CancelOutlined />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        ))}
    </List>
);

export default UserWorkgroupList;
