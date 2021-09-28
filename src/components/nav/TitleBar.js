import React from 'react';
import { useHistory } from 'react-router';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import LogoButton from '../components/buttons/LogoButton';

/**
 * Render top title bar
 */
const TitleBar = ({ title }) => {
    const history = useHistory();

    /**
     * Render toolbar
     *
     * @returns JSX
     */
    const renderToolbar = () => (
        <Toolbar>
            <span className="absolute lg:hidden top-0 left-2">
                <LogoButton onClick={() => history.push('/')} />
            </span>
            <h1 className="font-normal ml-10 w-48 lg:w-96 overflow-hidden overflow-ellipsis whitespace-nowrap">
                {title}
            </h1>
        </Toolbar>
    );

    return (
        <>
            <div className="fixed w-full z-20 lg:left-56 xl:left-64 lg:hidden">
                <AppBar
                    position="static"
                    color="primary"
                    variant="elevation"
                    className="pb-1"
                >
                    {renderToolbar()}
                </AppBar>
            </div>
            <div className="fixed w-full z-20 lg:left-56 xl:left-64 hidden lg:inline">
                <AppBar
                    position="static"
                    color="inherit"
                    variant="outlined"
                    className="pb-1"
                >
                    {renderToolbar()}
                </AppBar>
            </div>
        </>
    );
};

export default TitleBar;
