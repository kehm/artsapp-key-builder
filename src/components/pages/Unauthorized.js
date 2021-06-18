import React, { useContext } from 'react';
import LanguageContext from '../../context/LanguageContext';

/**
 * Render error page for uanuthorized access
 */
const Unauthorized = () => {
    const { language } = useContext(LanguageContext);

    return (
        <div className="py-14 px-4 md:w-10/12 m-auto text-center">
            <p>{language.dictionary.unauthorized}</p>
        </div>
    );
};

export default Unauthorized;
