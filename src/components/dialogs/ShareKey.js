import React, { useContext, useEffect, useState } from 'react';
import PostAdd from '@material-ui/icons/PostAdd';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LanguageContext from '../../context/LanguageContext';
import CloseButton from '../components/buttons/CloseButton';
import getInputChange from '../../utils/input-change';
import { addKeyEditor } from '../../utils/api/create';
import { getKeyEditors } from '../../utils/api/get';
import EditorList from '../components/lists/EditorList';
import { deleteKeyEditor } from '../../utils/api/delete';

/**
 * Render share key modal
 */
const ShareKey = ({
    openDialog, keyId, workgroup, onClose,
}) => {
    const { language } = useContext(LanguageContext);
    const defaultFormValues = {
        email: '',
        workgroupId: '',
    };
    const [formValues, setFormValues] = useState(defaultFormValues);
    const [error, setError] = useState(undefined);
    const [tab, setTab] = useState(0);
    const [editors, setEditors] = useState(undefined);

    /**
     * Remove error on change tab
     */
    useEffect(() => {
        if (error) setError(undefined);
    }, [tab]);

    /**
     * Get existing key editors
     */
    useEffect(() => {
        if (!editors) {
            getKeyEditors(keyId).then((response) => {
                setEditors(response);
            }).catch(() => setError(language.dictionary.internalAPIError));
        }
    }, [editors]);

    /**
     * Add key editor
     *
     * @param {Object} e Event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addKeyEditor({
                keyId,
                email: formValues.email,
            });
            setEditors(undefined);
            setTab(0);
        } catch (err) {
            setError(language.dictionary.errorAddUser);
        }
    };

    /**
     * Remove key editor
     *
     * @param {int} editorsId Editors ID
     */
    const handleRemoveEditor = async (editorsId) => {
        try {
            await deleteKeyEditor({ keyId, editorsId });
            setEditors(undefined);
            setError(0);
        } catch (err) {
            setError(language.dictionary.internalAPIError);
        }
    };

    /**
     * Render tabs
     *
     * @returns JSX
     */
    const renderInputs = () => {
        if (tab === 0) {
            return (
                <EditorList
                    editors={editors}
                    workgroup={workgroup}
                    onRemove={(id) => handleRemoveEditor(id)}
                />
            );
        }
        if (tab === 1) {
            return (
                <>
                    <p className="my-4">{language.dictionary.sectionShareIndividual}</p>
                    <TextField
                        autoFocus
                        required
                        id="email"
                        name="email"
                        type="email"
                        inputProps={{ maxLength: 255 }}
                        label={language.dictionary.labelEmail}
                        variant="outlined"
                        fullWidth
                        value={formValues.email}
                        onChange={(e) => setFormValues(getInputChange(e, formValues))}
                    />
                </>
            );
        }
        return null;
    };

    return (
        <Dialog
            fullWidth
            scroll="paper"
            open={openDialog}
            onClose={() => onClose()}
        >
            <form className="p-2" autoComplete="off" onSubmit={handleSubmit}>
                <DialogTitle>{language.dictionary.shareKey}</DialogTitle>
                <DialogContent>
                    <CloseButton onClick={() => onClose()} />
                    <p className="mb-4">{language.dictionary.sectionShareKey}</p>
                    <AppBar position="relative" className="my-6" color="default">
                        <Tabs value={tab} onChange={(e, val) => setTab(val)} aria-label="language tabs">
                            <Tab label={language.dictionary.labelOverview} />
                            <Tab label={language.dictionary.btnAdd} />
                        </Tabs>
                    </AppBar>
                    {renderInputs()}
                    {error && <p className="text-red-600 mb-4">{error}</p>}
                    {tab > 0 && (
                        <DialogActions>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                endIcon={<PostAdd />}
                                type="submit"
                            >
                                {language.dictionary.btnAdd}
                            </Button>
                        </DialogActions>
                    )}
                </DialogContent>
            </form>
        </Dialog>
    );
};

export default ShareKey;
