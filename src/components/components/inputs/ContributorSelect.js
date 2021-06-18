import React, { useContext } from 'react';
import Add from '@material-ui/icons/Add';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LanguageContext from '../../../context/LanguageContext';

/**
 * Render contributor select input
 */
const ContributorSelect = ({ contributors, onChange, onClickNew }) => {
    const { language } = useContext(LanguageContext);

    return (
        <div className="flex">
            <Autocomplete
                multiple
                disableClearable
                id="contributors"
                fullWidth
                value={contributors || []}
                onChange={(e, val) => onChange({ target: { name: 'contributors', value: val } })}
                options={contributors || []}
                getOptionLabel={(contributor) => contributor}
                noOptionsText=""
                renderTags={(value, getTagProps) => value.map((contributor, index) => (
                    <Chip variant="outlined" label={contributor} {...getTagProps({ index })} />
                ))}
                renderInput={(params) => <TextField {...params} label={language.dictionary.labelContributors} variant="outlined" />}
            />
            <span className="flex-1 ml-4">
                <Button variant="contained" color="default" size="medium" endIcon={<Add />} type="button" onClick={() => onClickNew()}>
                    {language.dictionary.btnNew}
                </Button>
            </span>
        </div>
    );
};

export default ContributorSelect;
