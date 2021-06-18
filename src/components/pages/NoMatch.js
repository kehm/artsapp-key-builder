import React, { useContext } from 'react';
import LanguageContext from '../../context/LanguageContext';

/**
 * Render error page for no matching path
 */
const NoMatch = () => {
    const { language } = useContext(LanguageContext);

    return (
        <div className="py-14 px-4 md:w-10/12 m-auto text-center">
            <p>{language.dictionary.noMatch}</p>
        </div>
    );
};

export default NoMatch;
