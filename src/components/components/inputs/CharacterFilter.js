import React, { useContext } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import LanguageContext from '../../../context/LanguageContext';

/**
 * Render radio buttons for character filter
 */
const CharacterFilter = ({ filter, onChange }) => {
    const { language } = useContext(LanguageContext);

    return (
        <RadioGroup
            aria-label="character type"
            name="characterType"
            value={filter}
            onChange={onChange}
        >
            <div className="xl:flex mb-4 mt-5">
                <span className="mt-2 mr-6 font-semibold">
                    {language.dictionary.show}
                </span>
                <FormControlLabel value="ALL" control={<Radio />} label={language.dictionary.all} />
                <FormControlLabel value="CATEGORICAL" control={<Radio />} label={language.dictionary.categorical} />
                <FormControlLabel value="NUMERICAL" control={<Radio />} label={language.dictionary.numerical} />
            </div>
        </RadioGroup>
    );
};

export default CharacterFilter;
