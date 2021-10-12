import React, { useContext, useState } from 'react';
import SaveOutlined from '@material-ui/icons/SaveOutlined';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LanguageContext from '../../context/LanguageContext';
import CloseButton from '../components/buttons/CloseButton';
import { updateRevisionMode } from '../../utils/api/update';

/**
 * Render set revision status dialog
 */
const SetRevisionMode = ({
    openDialog, currentMode, revision, onClose, onChanged,
}) => {
    const { language } = useContext(LanguageContext);
    const [mode, setMode] = useState(currentMode);
    const [error, setError] = useState(undefined);
    const status = [
        { value: 1, label: language.dictionary.labelMode1 },
        { value: 2, label: language.dictionary.labelMode2 },
    ];

    /**
     * Handle change mode
     *
     * @param {Object} e Event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (mode !== currentMode) {
            try {
                await updateRevisionMode(revision.id, {
                    keyId: revision.keyId,
                    mode,
                });
                onChanged();
                onClose();
            } catch (err) {
                setError(language.dictionary.internalAPIError);
            }
        } else onClose();
    };

    return (
        <Dialog onClose={() => onClose()} open={openDialog}>
            <form className="p-2" autoComplete="off" onSubmit={handleSubmit}>
                <DialogTitle>{language.dictionary.headerChangeMode}</DialogTitle>
                <DialogContent>
                    <CloseButton onClick={() => onClose()} />
                    <p className="mb-8">{language.dictionary.sectionChangeMode}</p>
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
                            onChange={(e) => setMode(e.target.value)}
                        >
                            {status.map((element) => (
                                <MenuItem
                                    key={element.value}
                                    value={element.value}
                                >
                                    {element.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <p className="mb-8">{language.dictionary.modeChangeEffect}</p>
                    {error && <p className="text-red-600 mb-4">{error}</p>}
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        endIcon={<SaveOutlined />}
                        type="submit"
                    >
                        {language.dictionary.btnSave}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default SetRevisionMode;
