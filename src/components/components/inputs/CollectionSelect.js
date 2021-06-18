import React, { useContext, useEffect, useState } from 'react';
import Add from '@material-ui/icons/Add';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LanguageContext from '../../../context/LanguageContext';

/**
 * Render collection select input and create new button
 */
const CollectionSelect = ({
    value, collections, isCreator, onChange, onClickNew,
}) => {
    const { language } = useContext(LanguageContext);
    const [options, setOptions] = useState([]);
    const [values, setValues] = useState([]);

    /**
     * Set options with specified language
     */
    useEffect(() => {
        if (collections && collections.length > 0) {
            const opts = collections.filter((collection) => collection && collection.language_code === language.language.split('_')[0]);
            const objects = [];
            opts.forEach((element) => { if (value.includes(element.id)) objects.push(element); });
            setOptions(opts);
            setValues(objects);
        }
    }, [collections, value, language]);

    return (
        <div className="flex">
            <Autocomplete
                multiple
                disableClearable
                id="collections"
                fullWidth
                value={values}
                onChange={(e, val) => onChange({ target: { name: 'collections', value: val.map((element) => element.id) } })}
                options={collections ? options : []}
                getOptionLabel={(option) => {
                    if (option) return option.name;
                    return '';
                }}
                noOptionsText={language.dictionary.noAlternatives}
                renderTags={(val, getTagProps) => val.map((option, index) => (
                    <Chip variant="outlined" label={option ? option.name : ''} {...getTagProps({ index })} />
                ))}
                renderInput={(params) => <TextField {...params} label={language.dictionary.labelCollections} variant="outlined" />}
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

export default CollectionSelect;
