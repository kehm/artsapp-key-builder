import React, { useContext } from 'react';
import LanguageContext from '../../context/LanguageContext';

/**
 * Render error message for missing permission
 */
const MissingPermission = ({ show, label }) => {
    const { language } = useContext(LanguageContext);

    if (show) {
        return (
            <p className="text-primary mt-2">
                {language.dictionary.missingPermissions}
                {label}
            </p>
        );
    }
    return null;
};

export default MissingPermission;
