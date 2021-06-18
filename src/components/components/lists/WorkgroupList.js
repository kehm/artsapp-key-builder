import React, { useContext } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import EditOutlined from '@material-ui/icons/EditOutlined';
import GroupOutlined from '@material-ui/icons/GroupOutlined';
import IconButton from '@material-ui/core/IconButton';
import UserContext from '../../../context/UserContext';

/**
 * Render workgroup list
 */
const WorkgroupList = ({
    workgroups, isEditor, onEdit, onClickUsers,
}) => {
    const { user } = useContext(UserContext);

    return (
        <List className="w-96">
            {workgroups && workgroups.map((workgroup) => (
                <ListItem key={workgroup.id}>
                    <ListItemText primary={workgroup.name} />
                    <ListItemSecondaryAction>
                        <span className="mr-4">
                            <IconButton
                                edge="end"
                                aria-label="edit"
                                onClick={() => onEdit(workgroup)}
                                disabled={!isEditor || !user.workgroups.includes(workgroup.id)}
                            >
                                <EditOutlined />
                            </IconButton>
                        </span>
                        <IconButton
                            edge="end"
                            aria-label="add"
                            onClick={() => onClickUsers(workgroup)}
                            disabled={!isEditor || !user.workgroups.includes(workgroup.id)}
                        >
                            <GroupOutlined />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            ))}
        </List>
    );
};

export default WorkgroupList;
