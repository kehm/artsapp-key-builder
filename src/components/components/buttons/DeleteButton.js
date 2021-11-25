import React from 'react';
import DeleteOutlined from '@material-ui/icons/DeleteOutlined';
import IconButton from '@material-ui/core/IconButton';

/**
 * Render delete icon button
 */
const DeleteButton = ({ disabled, onClick }) => (
    <IconButton
        edge="start"
        aria-label="delete"
        onClick={() => onClick()}
        disabled={disabled || false}
    >
        <DeleteOutlined />
    </IconButton>
);

export default DeleteButton;
