import React from 'react';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

/**
 * Render floating action button
 */
const ActionButton = ({
    label, icon, disabled, onClick,
}) => (
    <>
        <div className="lg:hidden fixed bottom-16 right-2 z-50 h-16">
            <Fab
                variant="extended"
                color="secondary"
                onClick={() => onClick()}
                disabled={disabled}
            >
                {icon}
            </Fab>
        </div>
        <div className="hidden lg:inline fixed z-50 top-2 right-32 h-16">
            {label ? (
                <Button
                    variant="contained"
                    color="secondary"
                    size="medium"
                    endIcon={icon}
                    onClick={() => onClick()}
                    disabled={disabled}
                >
                    {label}
                </Button>
            ) : (
                <IconButton
                    edge="start"
                    aria-label="filter"
                    color="primary"
                    onClick={() => onClick()}
                    disabled={disabled}
                >
                    {icon}
                </IconButton>
            )}
        </div>
    </>
);

export default ActionButton;
