import React, { useContext } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import Switch from '@material-ui/core/Switch';
import LanguageContext from '../../../context/LanguageContext';

/**
 * Render switches for languages
 */
const LanguageSwitches = ({ switches, onSwitchUpdate }) => {
    const { language } = useContext(LanguageContext);

    /**
     * Handle switch changes
     *
     * @param {Object} e Event
     */
    const handleSwitchChange = (e) => {
        const { name, checked } = e.target;
        const values = {
            ...switches,
            [name]: checked,
        };
        onSwitchUpdate(values);
    };

    return (
        <FormControl>
            <FormLabel component="legend" className="mb-2">
                {language.dictionary.selectLanguages}
                :
            </FormLabel>
            <FormGroup row>
                <FormControlLabel
                    control={(
                        <Switch
                            checked={switches.no}
                            onChange={handleSwitchChange}
                            name="no"
                        />
                    )}
                    label={`${language.dictionary.norwegian} (${language.dictionary.norwegianShort})`}
                />
                <FormControlLabel
                    control={(
                        <Switch
                            checked={switches.en}
                            onChange={handleSwitchChange}
                            name="en"
                        />
                    )}
                    label={`${language.dictionary.english} (${language.dictionary.englishShort})`}
                />
            </FormGroup>
        </FormControl>
    );
};

export default LanguageSwitches;
