import React, { useContext, useEffect, useState } from 'react';
import SaveOutlined from '@material-ui/icons/SaveOutlined';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import Close from '@material-ui/icons/Close';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LanguageContext from '../../context/LanguageContext';
import CloseButton from '../components/buttons/CloseButton';
import { updateRevisionStatus } from '../../utils/api/update';
import getInputChange from '../../utils/input-change';
import UserContext from '../../context/UserContext';
import isPermitted from '../../utils/is-permitted';

/**
 * Render set revision status dialog
 */
const SetRevisionStatus = ({
    openDialog, currentStatus, revision, onClose, onUpdated,
}) => {
    const { language } = useContext(LanguageContext);
    const { user } = useContext(UserContext);
    const defaultFormValues = {
        status: '',
    };
    const [formValues, setFormValues] = useState(defaultFormValues);
    const [error, setError] = useState(undefined);
    const status = [
        { value: 'DRAFT', label: language.dictionary.statusDraft },
        { value: 'REVIEW', label: language.dictionary.statusReview },
        { value: 'ACCEPTED', label: language.dictionary.statusAccepted },
    ];

    /**
     * Set current status
     */
    useEffect(() => {
        if (currentStatus) setFormValues({ status: currentStatus });
    }, [currentStatus]);

    /**
     * Handle save new status
     *
     * @param {Object} e Event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formValues.status !== currentStatus) {
            try {
                await updateRevisionStatus(revision.id, {
                    keyId: revision.keyId,
                    status: formValues.status,
                });
                onUpdated(formValues.status !== 'DRAFT');
                onClose();
            } catch (err) {
                if (err && err.response && err.response.status === 409) {
                    setError(language.dictionary.errorStatusConflict);
                } else setError(language.dictionary.internalAPIError);
            }
        } else onClose();
    };

    return (
        <Dialog onClose={() => onClose()} open={openDialog}>
            <form className="p-2" autoComplete="off" onSubmit={handleSubmit}>
                <DialogTitle>{language.dictionary.headerChangeStatus}</DialogTitle>
                <DialogContent>
                    <CloseButton onClick={() => onClose()} />
                    <p className="mb-8">{language.dictionary.sectionChangeStatus}</p>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel id="status-label" required>
                            {language.dictionary.labelStatus}
                        </InputLabel>
                        <Select
                            className="mb-8"
                            labelId="status-label"
                            id="status"
                            name="status"
                            value={formValues.status}
                            variant="outlined"
                            required
                            label={language.dictionary.labelStatus}
                            fullWidth
                            onChange={(e) => setFormValues(getInputChange(e, formValues))}
                        >
                            {status.map((element) => (
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
                    {formValues.status !== 'DRAFT' && formValues.status !== currentStatus
                        && <p className="mb-8">{language.dictionary.returnAfterStatus}</p>}
                    {error && <p className="text-red-600 mb-4">{error}</p>}
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        endIcon={formValues.status === currentStatus ? <Close /> : <SaveOutlined />}
                        type="submit"
                    >
                        {formValues.status === currentStatus
                            ? language.dictionary.close
                            : language.dictionary.btnSaveChanges}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default SetRevisionStatus;
