import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import ListAlt from '@material-ui/icons/ListAlt';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import Group from '@material-ui/icons/Group';
import UserContext from '../../context/UserContext';

/**
 * Render bottom navigation menu
 */
const BottomNav = () => {
    const { user } = useContext(UserContext);
    const history = useHistory();
    const [selected, setSelected] = useState(0);
    const [unsavedDialog, setUnsavedDialog] = useState({ open: false, index: undefined });

    /**
     * Check URL path and highlight correct navigation element
     */
    useEffect(() => {
        const path = window.location.pathname;
        switch (path) {
            case '/groups':
                setSelected(1);
                break;
            case '/workgroups':
                setSelected(2);
                break;
            default:
                setSelected(0);
                break;
        }
    }, []);

    /**
     * Show confirm dialog before setting new page if page has a form
     *
     * @param {int} index Nav index
     * @param {boolean} confirmed True if user has actively confirmed to leave
     */
    const handleSelect = (index, confirmed) => {
        const path = window.location.pathname;
        if ((path === '/create' || path.includes('/edit/') || path.includes('/build/')) && !confirmed) {
            setUnsavedDialog({ open: true, index });
        } else {
            setSelected(index);
            switch (index) {
                case 0:
                    history.push('/');
                    break;
                case 1:
                    history.push('/groups');
                    break;
                case 2:
                    history.push('/workgroups');
                    break;
                default:
                    break;
            }
        }
    };

    return (
        <div className="fixed w-full bottom-0 lg:hidden z-10">
            {user.authenticated && (
                <BottomNavigation
                    value={selected}
                    onChange={(e, val) => {
                        handleSelect(val);
                    }}
                    showLabels
                >
                    <BottomNavigationAction icon={<ListAlt />} />
                    <BottomNavigationAction icon={<LibraryBooks />} />
                    <BottomNavigationAction icon={<Group />} />
                </BottomNavigation>
            )}
        </div>
    );
};

export default BottomNav;
