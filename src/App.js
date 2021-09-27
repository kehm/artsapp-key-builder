import React, { StrictMode, useEffect, useState } from 'react';
import './styles/tailwind.css';
import {
  BrowserRouter, Switch, Route, Redirect,
} from 'react-router-dom';
import axios from 'axios';
import { ThemeProvider } from '@material-ui/core/styles';
import LanguageContext from './context/LanguageContext';
import { dictionary } from './languages/language';
import Nav from './components/nav/Nav';
import NoMatch from './components/pages/NoMatch';
import Keys from './components/pages/Keys';
import SignIn from './components/pages/SignIn';
import materialTheme from './styles/material-ui';
import CreateKey from './components/pages/CreateKey';
import UserContext from './context/UserContext';
import EditKeyInfo from './components/pages/EditKeyInfo';
import BuildKey from './components/pages/BuildKey';
import Key from './components/pages/Key';
import Groups from './components/pages/Groups';
import Workgroups from './components/pages/Workgroups';
import ProgressIndicator from './components/components/ProgressIndicator';
import Unauthorized from './components/pages/Unauthorized';
import isPermitted from './utils/is-permitted';

const App = () => {
  // Set default language
  const languageState = {
    language: 'no_bm',
    dictionary: dictionary.no_bm,
  };

  // Set initial user context
  const userState = {
    authenticated: false,
    name: undefined,
    organizationId: undefined,
    roleId: undefined,
    workgroups: [],
    permissions: [],
  };

  // Set context
  const [language, setLanguage] = useState(languageState);
  const languageValue = { language, setLanguage };
  const [user, setUser] = useState(userState);
  const userValue = { user, setUser };
  const [authenticated, setAuthenticated] = useState(false);
  const [showProgress, setShowProgress] = useState(true);
  const [pageTitle, setPageTitle] = useState('undefined');

  /**
   * Check for a valid user session
   */
  useEffect(() => {
    if (!authenticated && !user.authenticated) {
      const authenticate = async () => {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_BUILDER_API_URL}/auth`,
            {},
            { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
          );
          if (response.data && response.data.user) {
            setUser({
              authenticated: true,
              name: response.data.user.name,
              organizationId: response.data.user.organizationId,
              roleId: response.data.user.roleId,
              workgroups: response.data.user.workgroups,
              permissions: response.data.user.permissions,
            });
          } else setUser(userState);
        } catch (err) {
          setUser(userState);
        }
        setAuthenticated(true);
      };
      authenticate();
    } else setShowProgress(false);
  }, [user, authenticated]);

  /**
   * Check for previously selected language
   */
  useEffect(() => {
    const selectedLanguage = localStorage.getItem('language');
    if (selectedLanguage && (selectedLanguage !== language.language)) {
      setLanguage({ language: selectedLanguage, dictionary: dictionary[selectedLanguage] });
    }
  }, [language]);

  /**
   * Invalidate session
   */
  const invalidateSession = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BUILDER_API_URL}/auth/logout/url`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
      );
      if (response && response.data) {
        setUser(userState);
        window.location.href = response.data.logoutUrl;
      }
    } catch (err) { }
  };

  /**
   * Render page with component
   *
   * @param {Object} Component Component to render
   * @param {string} permission Required permission
   */
  const renderPage = (Component, permission) => (
    <div className="h-full lg:ml-56 mb-10 md:mb-0 bg-white z-50 text-darkGrey">
      <Component onSetTitle={(title) => setPageTitle(title)} />
    </div>
  );

  /*
  const renderPage = (Component, permission) => {
    if (!authenticated) return null;
    if (user.authenticated) {
      if (!permission || isPermitted(user, [permission])) {
        return (
          <div className="h-full md:ml-56 mb-10 md:mb-0 bg-white z-50 text-darkGrey">
            <Component onSetTitle={(title) => setPageTitle(title)} />
          </div>
        );
      }
      return <Redirect to="/unauthorized" />;
    }
    return <Redirect to="/signin" />;
  };
  */

  return (
    <StrictMode>
      <BrowserRouter basename={process.env.REACT_APP_URL_BASE}>
        <LanguageContext.Provider value={languageValue}>
          <UserContext.Provider value={userValue}>
            <ThemeProvider theme={materialTheme}>
              <ProgressIndicator open={showProgress} />
              <Nav
                title={pageTitle}
                signOut={() => invalidateSession()}
              />
              <Switch>
                <Route path="/signin" exact component={SignIn} />
                <Route path="/" exact component={() => renderPage(Keys, 'BROWSE_KEYS')} />
                <Route path="/create" exact component={() => renderPage(CreateKey, 'CREATE_KEY')} />
                <Route path="/build/:revisionId" exact component={() => renderPage(BuildKey, 'EDIT_KEY')} />
                <Route path="/keys/:keyId" exact component={() => renderPage(Key, 'BROWSE_KEYS')} />
                <Route path="/edit/:keyId" exact component={() => renderPage(EditKeyInfo, 'EDIT_KEY_INFO')} />
                <Route path="/groups" exact component={() => renderPage(Groups, 'BROWSE_GROUPS')} />
                <Route path="/workgroups" exact component={() => renderPage(Workgroups, 'BROWSE_WORKGROUPS')} />
                <Route path="/unauthorized" exact component={() => renderPage(Unauthorized)} />
                <Route component={() => renderPage(NoMatch)} />
              </Switch>
            </ThemeProvider>
          </UserContext.Provider>
        </LanguageContext.Provider>
      </BrowserRouter>
    </StrictMode>
  );
};

export default App;
