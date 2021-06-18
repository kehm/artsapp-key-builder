import React, { useContext, useEffect, useState } from 'react';
import Add from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LanguageContext from '../../../context/LanguageContext';

/**
 * Render key group select input and create new button
 */
const KeyGroupSelect = ({
    value, groups, isCreator, onChange, onClickNew,
}) => {
    const { language } = useContext(LanguageContext);
    const [options, setOptions] = useState([]);

    /**
     * Set options with specified language
     */
    useEffect(() => {
        if (groups && groups.length > 0) {
            setOptions(groups.filter((group) => group && group.language_code === language.language.split('_')[0]));
        }
    }, [groups, language]);

    return (
        <div className="flex">
            <Autocomplete
                id="groupId"
                fullWidth
                value={value ? options.find((element) => element.id === value) || null : null}
                onChange={(e, val) => onChange({ target: { name: 'groupId', value: val ? val.id : '' } })}
                options={options || []}
                getOptionLabel={(option) => {
                    if (option) return option.name;
                    return '';
                }}
                noOptionsText={language.dictionary.noAlternatives}
                renderInput={(params) => <TextField {...params} label={language.dictionary.labelKeyGroup} variant="outlined" />}
            />
            {isCreator && (
                <span className="flex-1 ml-4">
                    <Button
                        variant="contained"
                        color="default"
                        size="medium"
                        endIcon={<Add />}
                        type="button"
                        onClick={() => onClickNew()}
                    >
                        {language.dictionary.btnNew}
                    </Button>
                </span>
            )}
        </div>
    );
};

export default KeyGroupSelect;
