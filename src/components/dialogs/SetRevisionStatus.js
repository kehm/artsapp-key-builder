import React, { useContext, useEffect, useState } from 'react';
import SaveOutlined from '@material-ui/icons/SaveOutlined';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Close from '@material-ui/icons/Close';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LanguageContext from '../../context/LanguageContext';
import CloseButton from '../components/buttons/CloseButton';
import { updateRevisionStatus } from '../../utils/api/update';
import getInputChange from '../../utils/input-change';
import StatusSelect from '../components/inputs/StatusSelect';

/**
 * Render set revision status dialog
 */
const SetRevisionStatus = ({
    openDialog, currentStatus, revision, onClose, onUpdated,
}) => {
    const { language } = useContext(LanguageContext);
    const defaultFormValues = {
        status: '',
    };
    const [formValues, setFormValues] = useState(defaultFormValues);
    const [error, setError] = useState(undefined);

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
            <form
                className="p-2"
                autoComplete="off"
                onSubmit={handleSubmit}
            >
                <DialogTitle>{language.dictionary.headerChangeStatus}</DialogTitle>
                <DialogContent>
                    <CloseButton onClick={() => onClose()} />
                    <p className="mb-8">{language.dictionary.sectionChangeStatus}</p>
                    <StatusSelect
                        status={formValues.status}
                        currentStatus={currentStatus}
                        onChange={(e) => setFormValues(getInputChange(e, formValues))}
                    />
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
