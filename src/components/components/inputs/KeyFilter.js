import React, { useContext } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import LanguageContext from '../../../context/LanguageContext';

/**
 * Render key filter section
 */
const KeyFilter = ({ filter, onChangeFilter }) => {
    const { language } = useContext(LanguageContext);

    return (
        <div className="flex mt-10">
            <div className="border border-solid rounded pl-4 py-2 w-80">
                <span className="font-semibold">
                    {language.dictionary.labelFilterCategory}
                    :
                </span>
                <RadioGroup
                    aria-label="key type"
                    name="keyType"
                    value={filter.keys}
                    onChange={(e) => onChangeFilter({ ...filter, keys: e.target.value })}
                >
                    <div>
                        <FormControlLabel value="MYKEYS" control={<Radio />} label={language.dictionary.myKeys} />
                        <FormControlLabel value="ALLKEYS" control={<Radio />} label={language.dictionary.allKeys} />
                    </div>
                </RadioGroup>
            </div>
            <div className="border border-solid rounded pl-8 py-2 w-96">
                <span className="font-semibold">
                    {language.dictionary.labelFilterLanguage}
                    :
                </span>
                <RadioGroup
                    aria-label="key type"
                    name="keyType"
                    value={filter.language}
                    onChange={(e) => onChangeFilter({ ...filter, language: e.target.value })}
                >
                    <div>
                        <FormControlLabel value="no" control={<Radio />} label={language.dictionary.norwegian} />
                        <FormControlLabel value="en" control={<Radio />} label={language.dictionary.english} />
                        <FormControlLabel value="all" control={<Radio />} label={language.dictionary.all} />
                    </div>
                </RadioGroup>
            </div>
        </div>
    );
};

export default KeyFilter;
