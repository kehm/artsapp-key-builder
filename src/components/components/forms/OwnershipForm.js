import React, { useContext } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import LanguageContext from '../../../context/LanguageContext';
import UserContext from '../../../context/UserContext';
import CreatorSelect from '../inputs/CreatorSelect';
import ContributorSelect from '../inputs/ContributorSelect';
import WorkgroupSelect from '../inputs/WorkgroupSelect';
import isPermitted from '../../../utils/is-permitted';

/**
 * Render version control input section
 */
const OwnershipForm = ({
    formValues, organizations, workgroups, onOpenDialog, onChange, onChangePublishers,
}) => {
    const { language } = useContext(LanguageContext);
    const { user } = useContext(UserContext);

    return (
        <>
            <h2 className="mb-4">{language.dictionary.labelOwner}</h2>
            <CreatorSelect
                creators={formValues.creators}
                onChange={onChange}
                onClickNew={() => onOpenDialog('CREATOR')}
            />
            <ContributorSelect
                contributors={formValues.contributors}
                onChange={onChange}
                onClickNew={() => onOpenDialog('CONTRIBUTOR')}
            />
            <Autocomplete
                multiple
                disableClearable
                id="publishers"
                fullWidth
                value={formValues.publishers || null}
                onChange={(e, val) => onChangePublishers(val)}
                options={organizations || []}
                getOptionLabel={(option) => {
                    if (option && option.full_name) return option.full_name;
                    return '';
                }}
                noOptionsText={language.dictionary.noAlternatives}
                renderTags={(value, getTagProps) => value.map((option, index) => (
                    <Chip variant="outlined" label={option ? option.full_name : ''} {...getTagProps({ index })} />
                ))}
                renderInput={(params) => <TextField {...params} label={language.dictionary.labelPublishers} variant="outlined" />}
            />
            <WorkgroupSelect
                value={formValues.workgroupId}
                workgroups={workgroups}
                isCreator={isPermitted(user, ['CREATE_WORKGROUP'])}
                onChange={onChange}
                onClickNew={() => onOpenDialog('WORKGROUP')}
            />
        </>
    );
};

export default OwnershipForm;
