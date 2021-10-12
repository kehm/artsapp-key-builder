import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import LaunchIcon from '@material-ui/icons/Launch';
import LanguageContext from '../../context/LanguageContext';
import UserContext from '../../context/UserContext';
import logo from '../../images/artsapp-key-builder-logo.png';
import LanguageSelect from '../components/inputs/LanguageSelect';
import { dictionary, options } from '../../languages/language';
import ExitApp from '../components/buttons/ExitApp';

/**
 * Render sign in page
 */
const SignIn = () => {
    const { language, setLanguage } = useContext(LanguageContext);
    const { user } = useContext(UserContext);

    /**
     * Change language and set preference in local storage
     *
     * @param {string} languageCode Language code
     */
    const handleSetLanguage = (languageCode) => {
        setLanguage({ language: languageCode, dictionary: dictionary[languageCode] });
        localStorage.setItem('language', languageCode);
    };

    return (user.authenticated ? <Redirect to="/" /> : (
        <div className="md:absolute right-0 left-0 md:left-48 lg:left-0 h-3/6 text-center">
            <div className="md:hidden bg-primary py-4">
                <img className="m-auto" src={logo} alt="ArtsApp logo" height={46} />
            </div>
            <form className="absolute right-0 left-0 md:top-1/3" action={`${process.env.REACT_APP_BUILDER_API_URL}/auth/oidc`}>
                <h1 className="my-10">{language.dictionary.artsappSignIn}</h1>
                <p className="my-10 px-4">{language.dictionary.loginFeide}</p>
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    type="submit"
                    startIcon={<LaunchIcon />}
                >
                    {language.dictionary.btnSignIn}
                </Button>
                <p className="mt-10 px-4">
                    {language.dictionary.problemContact}
                    <a href="mailto:artsapp@uib.no">{language.dictionary.contactEmail}</a>
                </p>
            </form>
            <div className="md:hidden absolute bottom-10 left-0 right-0">
                <LanguageSelect
                    options={options}
                    onChangeLanguage={(val) => handleSetLanguage(val)}
                />
                <ExitApp placeBottom />
            </div>
        </div>
    ));
};

export default SignIn;
