import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import LanguageContext from '../../context/LanguageContext';
import UserContext from '../../context/UserContext';

/**
 * Render error page for no matching path
 */
const NoMatch = ({ content }) => {
    const { language } = useContext(LanguageContext);
    const { user } = useContext(UserContext);

    return user.authenticated ? (
        <div className="py-14 md:w-10/12 md:ml-56 m-auto text-center">
            <p className="px-2 mt-10">{content || language.dictionary.noMatch}</p>
        </div>
    ) : <Redirect to="/signin" />;
};

export default NoMatch;
