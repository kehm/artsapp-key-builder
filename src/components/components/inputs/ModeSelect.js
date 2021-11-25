import React, { useContext } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import LanguageContext from '../../../context/LanguageContext';

/**
 * Render revision mode select input
 */
const ModeSelect = ({ mode, onChange }) => {
    const { language } = useContext(LanguageContext);
    const statusNames = [
        { value: 1, label: language.dictionary.labelMode1 },
        { value: 2, label: language.dictionary.labelMode2 },
    ];

    return (
        <FormControl variant="outlined" fullWidth>
            <InputLabel id="status-label" required>
                {language.dictionary.labelMode}
            </InputLabel>
            <Select
                className="mb-8"
                labelId="status-label"
                id="status"
                name="status"
                value={mode}
                variant="outlined"
                required
                label={language.dictionary.labelMode}
                fullWidth
                onChange={(e) => onChange(e.target.value)}
            >
                {statusNames.map((element) => (
                    <MenuItem
                        key={element.value}
                        value={element.value}
                    >
                        {element.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default ModeSelect;
