import React, { useContext } from 'react';
import ExitToApp from '@material-ui/icons/ExitToApp';
import LanguageContext from '../../../context/LanguageContext';

/**
 * Render exit app link
 */
const ExitApp = ({ placeBottom }) => {
    const { language } = useContext(LanguageContext);

    return (
        <a
            href="https://artsapp.uib.no"
            target="_self"
            rel="noopener noreferrer"
            className={`block ${placeBottom ? 'absolute bottom-5 left-0 right-0' : 'mt-8 text-white'}`}
        >
            <span className="align-middle mr-1">{language.dictionary.goArtsApp}</span>
            <ExitToApp color="primary" />
        </a>
    );
};

export default ExitApp;
