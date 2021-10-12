import React, { useContext } from 'react';
import LanguageContext from '../../context/LanguageContext';

/**
 * Render error page for no matching path
 */
const NoMatch = ({ content }) => {
    const { language } = useContext(LanguageContext);

    return (
        <div className="py-14 md:w-10/12 md:ml-56 m-auto text-center">
            <p className="px-2 mt-10">{content || language.dictionary.noMatch}</p>
        </div>
    );
};

export default NoMatch;
