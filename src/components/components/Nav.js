import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import HelpOutline from '@material-ui/icons/HelpOutline';
import ExitToApp from '@material-ui/icons/ExitToApp';
import Button from '@material-ui/core/Button';
import logo from '../../images/artsapp-key-builder-logo.png';
import LanguageContext from '../../context/LanguageContext';
import UserContext from '../../context/UserContext';
import { dictionary, options } from '../../languages/language';
import Help from '../dialogs/Help';
import UnsavedChanges from '../dialogs/UnsavedChanges';
import BottomNav from './BottomNav';
import LanguageSelect from './inputs/LanguageSelect';
import { getOrganization, getRole } from '../../utils/api/get';

/**
 * Render navigation menu
 */
const Nav = ({ signOut }) => {
    const { language, setLanguage } = useContext(LanguageContext);
    const { user } = useContext(UserContext);
    const history = useHistory();
    const [selected, setSelected] = useState(0);
    const [showHelp, setShowHelp] = useState(false);
    const [unsavedDialog, setUnsavedDialog] = useState({ open: false, index: undefined });
    const [organization, setOrganization] = useState(undefined);
    const [role, setRole] = useState(undefined);

    /**
     * Check URL path and highlight correct navigation element
     */
    useEffect(() => {
        const path = window.location.pathname.split('/');
        if (path.length > 0) {
            switch (path[path.length - 1]) {
                case 'groups':
                    setSelected(1);
                    break;
                case 'workgroups':
                    setSelected(2);
                    break;
                default:
                    setSelected(0);
                    break;
            }
        } else setSelected(0);
    }, []);

    /**
     * Get organization and role name
     */
    useEffect(() => {
        if (!organization && user.organizationId) {
            getOrganization(user.organizationId, language.language.split('_')[0]).then((response) => {
                setOrganization(response.fullname);
            }).catch(() => { });
        }
        if (!role && user.roleId) {
            getRole(user.roleId, language.language.split('_')[0]).then((response) => {
                setRole(response.name);
            }).catch(() => { });
        }
    }, [user, organization, role]);

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

    /**
     * Check if page has a form before changing language
     *
     * @param {string} languageCode Language code
     * @param {boolean} confirmed True if user has actively confirmed to leave
     */
    const handleSetLanguage = (languageCode, confirmed) => {
        const path = window.location.pathname;
        if ((path === '/create' || path.includes('/edit/')) && !confirmed) {
            setUnsavedDialog({ open: true, index: languageCode });
        } else {
            setLanguage({ language: languageCode, dictionary: dictionary[languageCode] });
            localStorage.setItem('language', languageCode);
        }
    };

    return (
        <nav>
            {user.authenticated && (
                <span className="absolute top-2 right-8">
                    <Button
                        variant="text"
                        color="default"
                        size="medium"
                        type="button"
                        endIcon={<HelpOutline />}
                        onClick={() => setShowHelp(true)}
                    >
                        {language.dictionary.help}
                    </Button>
                </span>
            )}
            <div className="fixed h-full hidden md:inline w-56 xl:w-64 bg-artsapp-web bg-no-repeat bg-cover z-10 text-white">
                <button type="button" onClick={() => handleSelect(0)}>
                    <img className="mt-4 mr-4" src={logo} alt="ArtsApp logo" height={46} />
                </button>
                {user.authenticated && (
                    <ul className="xl:px-2 py-14 text-left">
                        <li>
                            <Button
                                variant="text"
                                size="small"
                                color={selected === 0 ? 'secondary' : 'inherit'}
                                onClick={() => handleSelect(0)}
                            >
                                <span className="text-lg py-3">{language.dictionary.keys}</span>
                            </Button>
                        </li>
                        <li>
                            <Button
                                variant="text"
                                size="small"
                                color={selected === 1 ? 'secondary' : 'inherit'}
                                onClick={() => handleSelect(1)}
                            >
                                <span className="py-3 text-lg">{language.dictionary.btnGroupCollections}</span>
                            </Button>
                        </li>
                        <li>
                            <Button
                                variant="text"
                                size="small"
                                color={selected === 2 ? 'secondary' : 'inherit'}
                                onClick={() => handleSelect(2)}
                            >
                                <span className="py-3 text-lg">{language.dictionary.workgroups}</span>
                            </Button>
                        </li>
                    </ul>
                )}
                <div className="fixed bottom-3 px-3 xl:px-6 text-sm">
                    <LanguageSelect
                        options={options}
                        onChangeLanguage={(val) => handleSetLanguage(val)}
                    />
                    {user.authenticated && (
                        <>
                            <p>{language.dictionary.signedIn}</p>
                            <ul className="font-light w-48">
                                <li className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                                    {user.name}
                                </li>
                                <li className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                                    {organization || ''}
                                </li>
                                <li className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                                    {role || ''}
                                </li>
                            </ul>
                            <button
                                type="button"
                                className="font-bold mt-4"
                                onClick={() => signOut()}
                            >
                                {language.dictionary.signOut}
                            </button>
                        </>
                    )}
                    <a href="https://artsapp.uib.no" target="_self" rel="noopener noreferrer" className="block mt-8 text-white">
                        <span className="align-middle">{language.dictionary.goArtsApp}</span>
                        &nbsp;
                        <ExitToApp color="primary" />
                    </a>
                </div>
            </div>
            <BottomNav />
            <Help openDialog={showHelp} onClose={() => setShowHelp(false)} />
            <UnsavedChanges
                openDialog={unsavedDialog.open}
                index={unsavedDialog.index}
                alternativeText={language.dictionary.confirmNav}
                onClose={() => setUnsavedDialog({ open: false, index: undefined })}
                onConfirm={(index) => {
                    if (typeof index === 'string') {
                        handleSetLanguage(index, true);
                    } else handleSelect(index, true);
                }}
            />
        </nav>
    );
};

export default Nav;
