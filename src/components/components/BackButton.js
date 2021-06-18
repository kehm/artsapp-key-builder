import React from 'react';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import IconButton from '@material-ui/core/IconButton';

/**
 * Render back button
 */
const BackButton = ({ onClick }) => (
    <span className="absolute top-0">
        <IconButton
            edge="start"
            aria-label="back"
            onClick={() => onClick()}
        >
            <NavigateBefore color="primary" fontSize="large" />
        </IconButton>
    </span>
);

export default BackButton;
