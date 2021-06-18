import React from 'react';
import TextField from '@material-ui/core/TextField';

/**
 * Render text input
 */
const TextInput = ({
    name, label, value, required, autoFocus, hidden,
    multitline, maxLength, disabled, standard, onChange,
}) => (
    <span className={hidden ? 'hidden' : ''}>
        <TextField
            autoFocus={autoFocus}
            required={required}
            id={name}
            name={name}
            type="text"
            disabled={disabled}
            multiline={multitline}
            rows={multitline ? 6 : 1}
            inputProps={{ maxLength }}
            label={label}
            variant={standard ? 'standard' : 'outlined'}
            fullWidth
            value={value}
            onChange={onChange}
        />
    </span>
);

export default TextInput;
