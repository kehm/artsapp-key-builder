import React, { useContext } from 'react';
import Add from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LanguageContext from '../../../context/LanguageContext';
import UserContext from '../../../context/UserContext';
import isPermitted from '../../../utils/is-permitted';

/**
 * Render workgroup select input and create new button
 */
const WorkgroupSelect = ({
    value, workgroups, isCreator, isOwner, onChange, onClickNew,
}) => {
    const { language } = useContext(LanguageContext);
    const { user } = useContext(UserContext);

    return (
        <div className="flex">
            <Autocomplete
                id="workgroupId"
                fullWidth
                value={value && workgroups
                    ? workgroups.find((element) => element.id === value) : null}
                onChange={(e, val) => onChange({ target: { name: 'workgroupId', value: val ? val.id : '' } })}
                options={workgroups || []}
                getOptionLabel={(option) => {
                    if (option) return option.name;
                    return '';
                }}
                noOptionsText={language.dictionary.noAlternatives}
                renderInput={(params) => <TextField {...params} label={language.dictionary.labelWorkgroup} variant="outlined" />}
                disabled={!isOwner && !isPermitted(user, ['SHARE_KEY'])}
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

export default WorkgroupSelect;
