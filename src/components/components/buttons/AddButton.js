import React from 'react';
import Add from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';

/**
 * Render add button with title
 */
const AddButton = ({ label, onClick }) => (
    <div className="flex relative mt-3 mb-4 w-full">
        <h2>{label}</h2>
        <span className="absolute right-1 -top-3">
            <IconButton
                edge="start"
                aria-label="add"
                color="primary"
                title={label}
                onClick={() => onClick()}
            >
                <Add />
            </IconButton>
        </span>
    </div>
);

export default AddButton;
