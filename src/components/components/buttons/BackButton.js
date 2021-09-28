import React from 'react';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import IconButton from '@material-ui/core/IconButton';

/**
 * Render back button
 */
const BackButton = ({ onClick }) => (
    <span className="fixed lg:hidden top-0 left-2 z-20 text-white bg-primary">
        <IconButton
            edge="start"
            aria-label="back"
            color="inherit"
            onClick={() => onClick()}
        >
            <NavigateBefore color="inherit" fontSize="large" />
        </IconButton>
    </span>
);

export default BackButton;
