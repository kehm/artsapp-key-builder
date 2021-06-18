import React, { useContext } from 'react';
import Add from '@material-ui/icons/Add';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LanguageContext from '../../../context/LanguageContext';

/**
 * Render creator select input
 */
const CreatorSelect = ({ creators, onChange, onClickNew }) => {
    const { language } = useContext(LanguageContext);

    return (
        <div className="flex">
            <Autocomplete
                multiple
                disableClearable
                id="creators"
                fullWidth
                value={creators || []}
                onChange={(e, val) => onChange({ target: { name: 'creators', value: val } })}
                options={creators || []}
                getOptionLabel={(creator) => creator}
                noOptionsText=""
                renderTags={(value, getTagProps) => value.map((creator, index) => (
                    <Chip variant="outlined" label={creator} {...getTagProps({ index })} />
                ))}
                renderInput={(params) => <TextField {...params} label={language.dictionary.labelCreators} variant="outlined" />}
            />
            <span className="flex-1 ml-4">
                <Button variant="contained" color="default" size="medium" endIcon={<Add />} type="button" onClick={() => onClickNew()}>
                    {language.dictionary.btnNew}
                </Button>
            </span>
        </div>
    );
};

export default CreatorSelect;
