import React, { useContext } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';
import LanguageContext from '../../context/LanguageContext';

const useStyles = makeStyles(() => ({
    bar: {
        zIndex: 0,
        marginBottom: '1.5rem',
        marginTop: '1.5rem',
    },
}));

/**
 * Render language bar
 */
const LanguageBar = ({
    tab, showNo, showEn, requireNo, requireEn, selectable, onChangeTab, onSelectLanguage,
}) => {
    const { language } = useContext(LanguageContext);
    const classes = useStyles();

    return (
        <AppBar
            position="relative"
            className={classes.bar}
            color="default"
        >
            <Tabs
                value={tab}
                onChange={(e, val) => onChangeTab(val)}
                aria-label="language tabs"
            >
                {showNo && (
                    <Tab
                        label={`${language.dictionary.norwegian} (${language.dictionary.norwegianShort})${requireNo ? ' *' : ''}`}
                        onClick={() => { if (selectable) onSelectLanguage('no'); }}
                    />
                )}
                {showEn && (
                    <Tab
                        label={`${language.dictionary.english} (${language.dictionary.englishShort})${requireEn ? ' *' : ''}`}
                        onClick={() => { if (selectable) onSelectLanguage('en'); }}
                    />
                )}
            </Tabs>
        </AppBar>
    );
};

export default LanguageBar;
