import React, { useContext, useState } from 'react';
import SaveOutlined from '@material-ui/icons/SaveOutlined';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import LanguageContext from '../../context/LanguageContext';
import CloseButton from '../components/CloseButton';
import CreatorSelect from '../components/inputs/CreatorSelect';
import AddCreator from './AddCreator';
import TextInput from '../components/inputs/TextInput';
import getInputChange from '../../utils/input-change';

/**
 * Render set media info dialog
 */
const SetMediaInfo = ({
    openDialog, index, size, fileName, fileInfo, onClose, onUpdate,
}) => {
    const { language } = useContext(LanguageContext);
    const defaultFormValues = {
        titleNo: fileInfo && fileInfo.titleNo ? fileInfo.titleNo : '',
        titleEn: fileInfo && fileInfo.titleEn ? fileInfo.titleEn : '',
        creators: fileInfo && fileInfo.creators ? fileInfo.creators : [],
        licenseUrl: fileInfo ? (fileInfo.licenseurl ? fileInfo.licenseurl : (fileInfo.licenseUrl ? fileInfo.licenseUrl : '')) : '',
    };
    const [formValues, setFormValues] = useState(defaultFormValues);
    const [tab, setTab] = useState(0);
    const [openCreatorDialog, setOpenCreatorDialog] = useState(false);

    /**
     * Handle save new status
     *
     * @param {Object} e Event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const values = {
            titleNo: formValues.titleNo !== '' ? formValues.titleNo : undefined,
            titleEn: formValues.titleEn !== '' ? formValues.titleEn : undefined,
            creators: formValues.creators,
            licenseUrl: formValues.licenseUrl !== '' ? formValues.licenseUrl : undefined,
            fileName,
        };
        onUpdate(index, values);
        onClose();
    };

    /**
     * Render input fields for each language
     *
     * @returns JSX
     */
    const renderInputs = () => (
        <>
            <TextInput
                name="titleNo"
                label={`${language.dictionary.labelTitle} (${language.dictionary.norwegianShort})`}
                value={formValues.titleNo}
                autoFocus
                hidden={tab === 1}
                maxLength={255}
                onChange={(e) => setFormValues(getInputChange(e, formValues))}
            />
            <TextInput
                name="titleEn"
                label={`${language.dictionary.labelTitle} (${language.dictionary.englishShort})`}
                value={formValues.titleEn}
                autoFocus
                hidden={tab === 0}
                maxLength={255}
                onChange={(e) => setFormValues(getInputChange(e, formValues))}
            />
            <hr className="mb-10" />
            <CreatorSelect
                creators={formValues.creators}
                onChange={(e) => setFormValues(getInputChange(e, formValues))}
                onClickNew={() => setOpenCreatorDialog(true)}
            />
            <TextField
                id="licenseUrl"
                name="licenseUrl"
                type="url"
                label={language.dictionary.labelLicenseUrl}
                variant="outlined"
                fullWidth
                value={formValues.licenseUrl}
                onChange={(e) => setFormValues(getInputChange(e, formValues))}
            />
        </>
    );

    return (
        <Dialog
            className={`${size === 'small' ? 'm-10' : ''}`}
            onClose={() => onClose(
                JSON.stringify(formValues) !== JSON.stringify(defaultFormValues),
            )}
            open={openDialog}
        >
            <form className="p-2" autoComplete="off" onSubmit={handleSubmit}>
                <DialogTitle>{language.dictionary.headerImageInfo}</DialogTitle>
                <DialogContent>
                    <CloseButton
                        onClick={() => onClose(
                            JSON.stringify(formValues) !== JSON.stringify(defaultFormValues),
                        )}
                    />
                    <p className="mb-8">{language.dictionary.sectionMediaCredits}</p>
                    <AppBar position="relative" className="my-6" color="default">
                        <Tabs value={tab} onChange={(e, val) => setTab(val)} aria-label="language tabs">
                            <Tab label={`${language.dictionary.norwegian} (${language.dictionary.norwegianShort})`} />
                            <Tab label={`${language.dictionary.english} (${language.dictionary.englishShort})`} />
                        </Tabs>
                    </AppBar>
                    {renderInputs()}
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
            {openCreatorDialog && (
                <AddCreator
                    openDialog={openCreatorDialog}
                    onClose={() => setOpenCreatorDialog(false)}
                    onUpdate={(name) => {
                        const arr = [...formValues.creators];
                        arr.push(name);
                        setFormValues({ ...formValues, creators: arr });
                        setOpenCreatorDialog(false);
                    }}
                    disableText
                />
            )}
        </Dialog>
    );
};

export default SetMediaInfo;
