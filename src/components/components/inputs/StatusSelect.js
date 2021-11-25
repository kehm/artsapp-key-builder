import React, { useContext } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import LanguageContext from '../../../context/LanguageContext';
import UserContext from '../../../context/UserContext';
import isPermitted from '../../../utils/is-permitted';

/**
 * Render revision status select input
 */
const StatusSelect = ({ status, currentStatus, onChange }) => {
    const { language } = useContext(LanguageContext);
    const { user } = useContext(UserContext);
    const statusNames = [
        { value: 'DRAFT', label: language.dictionary.statusDraft },
        { value: 'REVIEW', label: language.dictionary.statusReview },
        { value: 'ACCEPTED', label: language.dictionary.statusAccepted },
    ];

    return (
        <FormControl variant="outlined" fullWidth>
            <InputLabel id="status-label" required>
                {language.dictionary.labelStatus}
            </InputLabel>
            <Select
                className="mb-8"
                labelId="status-label"
                id="status"
                name="status"
                value={status}
                variant="outlined"
                required
                label={language.dictionary.labelStatus}
                fullWidth
                onChange={onChange}
            >
                {statusNames.map((element) => (
                    <MenuItem
                        key={element.value}
                        value={element.value}
                        disabled={!isPermitted(user, ['PUBLISH_KEY'])
                            && (element.value === 'ACCEPTED' || currentStatus === 'ACCEPTED')}
                    >
                        {element.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default StatusSelect;
