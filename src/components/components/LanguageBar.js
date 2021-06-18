import React, { useContext } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import LanguageContext from '../../context/LanguageContext';

/**
 * Render language bar
 */
const LanguageBar = ({
    tab, requireNo, requireEn, onTabChange,
}) => {
    const { language } = useContext(LanguageContext);

    return (
        <AppBar
            position="relative"
            className="mb-6"
            color="default"
        >
            <Tabs
                value={tab}
                onChange={(e, val) => onTabChange(val)}
                aria-label="language tabs"
            >
                <Tab label={`${language.dictionary.norwegian} (${language.dictionary.norwegianShort})${requireNo ? ' *' : ''}`} />
                <Tab label={`${language.dictionary.english} (${language.dictionary.englishShort})${requireEn ? ' *' : ''}`} />
            </Tabs>
        </AppBar>
    );
};

export default LanguageBar;
