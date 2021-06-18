import React, {
    useContext, useEffect, useRef, useState,
} from 'react';
import { useHistory } from 'react-router';
import Button from '@material-ui/core/Button';
import PostAdd from '@material-ui/icons/PostAdd';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import LanguageContext from '../../context/LanguageContext';
import { createKey, createRevision } from '../../utils/api/create';
import { getCollections, getKeyGroups, getUserWorkgroups } from '../../utils/api/get';
import LanguageSwitches from '../components/inputs/LanguageSwitches';
import UnsavedChanges from '../dialogs/UnsavedChanges';
import CreateKeyGroup from '../dialogs/CreateKeyGroup';
import CreateCollection from '../dialogs/CreateCollection';
import CollectionSelect from '../components/inputs/CollectionSelect';
import KeyGroupSelect from '../components/inputs/KeyGroupSelect';
import BackButton from '../components/BackButton';
import RichEditor from '../components/inputs/RichEditor';
import FileDrop from '../components/inputs/FileDrop';
import SetMediaInfo from '../dialogs/SetMediaInfo';
import getInputChange from '../../utils/input-change';
import TextInput from '../components/inputs/TextInput';
import { handleUpdateEntityMedia } from '../../utils/media';
import { convertEditorToHtml } from '../../utils/form-values';
import UserContext from '../../context/UserContext';
import WorkgroupSelect from '../components/inputs/WorkgroupSelect';
import CreateWorkgroup from '../dialogs/CreateWorkgroup';
import isPermitted from '../../utils/is-permitted';

/**
 * Render page to create new key
 */
const CreateKey = () => {
    const defaultFormValues = {
        titleNo: '',
        titleEn: '',
        descriptionNo: '',
        descriptionEn: '',
        groupId: '',
        collections: [],
        workgroupId: '',
        files: [],
        fileInfo: [],
    };
    const defaultLanguages = { no: true, en: false };
    const { language } = useContext(LanguageContext);
    const { user } = useContext(UserContext);
    const [formValues, setFormValues] = useState(defaultFormValues);
    const [languages, setLanguages] = useState(defaultLanguages);
    const [workgroups, setWorkgroups] = useState(undefined);
    const [collections, setCollections] = useState(undefined);
    const [groups, setGroups] = useState(undefined);
    const [error, setError] = useState(undefined);
    const history = useHistory();
    const [tab, setTab] = useState(0);
    const [selectedLanguage, setSelectedLanguage] = useState(undefined);
    const [openCreateDialog, setOpenCreateDialog] = useState(undefined);
    const [openMediaDialog, setOpenMediaDialog] = useState(undefined);
    const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
    const editorRef = useRef();

    /**
     * Get collections and key groups from API
     */
    useEffect(() => {
        if (!groups) {
            getKeyGroups().then((keyGroups) => {
                setGroups(keyGroups);
            }).catch(() => setError(language.dictionary.internalAPIError));
        }
        if (!collections) {
            getCollections().then((keyCollections) => {
                setCollections(keyCollections);
            }).catch(() => setError(language.dictionary.internalAPIError));
        }
        if (!workgroups) {
            getUserWorkgroups().then((response) => {
                setWorkgroups(response);
            }).catch(() => setError(language.dictionary.internalAPIError));
        }
    }, [workgroups, collections, groups, formValues, language]);

    /**
     * Set default selected tab based on language switches
     */
    useEffect(() => {
        if (languages.no) {
            setSelectedLanguage('no');
        } else if (languages.en) {
            setSelectedLanguage('en');
        } else setSelectedLanguage(undefined);
    }, [languages]);

    /**
     * Submit form values to API and create key, revision and media elements
     *
     * @param {Object} e Event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (tab === 0 && languages.en && formValues.titleEn === '') {
            setError(language.dictionary.errorTextEn);
        } else if (tab === 1 && languages.no && formValues.titleNo === '') {
            setError(language.dictionary.errorTextNo);
        } else {
            try {
                let values = { ...formValues };
                values = convertEditorToHtml(values);
                const keyId = await createKey({
                    titleNo: values.titleNo,
                    titleEn: values.titleEn,
                    descriptionNo: values.descriptionNo,
                    descriptionEn: values.descriptionEn,
                    groupId: values.groupId !== '' ? values.groupId : undefined,
                    collections: values.collections,
                    workgroupId: values.workgroupId !== '' ? values.workgroupId : undefined,
                    languages: Object.keys(languages).filter((key) => languages[key]),
                });
                await createRevision({ keyId, note: 'Initial revision' });
                await handleUpdateEntityMedia(keyId, 'key', values.files);
                setError(undefined);
                history.replace(`/keys/${keyId}`);
            } catch (err) {
                setError(language.dictionary.internalAPIError);
            }
        }
    };

    /**
     * Show confirm dialog before closing the dialog if form has unsaved changes
     *
     * @param {boolean} unsaved True if unsaved changes
     */
    const handleCloseDialog = (unsaved) => {
        if (unsaved) {
            setShowUnsavedDialog(true);
        } else if (openCreateDialog || openMediaDialog !== undefined) {
            setOpenCreateDialog(undefined);
            setOpenMediaDialog(undefined);
        } else history.goBack();
    };

    /**
     * Render text inputs for different languages
     *
     * @returns JSX
     */
    const renderTextInputs = () => (
        <>
            <TextInput
                name="titleNo"
                label={`${language.dictionary.labelKeyName} (${language.dictionary.norwegianShort})`}
                value={formValues.titleNo}
                required={selectedLanguage === 'no' && languages.no}
                autoFocus
                hidden={selectedLanguage !== 'no'}
                maxLength={60}
                onChange={(e) => setFormValues(getInputChange(e, formValues))}
            />
            <TextInput
                name="titleEn"
                label={`${language.dictionary.labelKeyName} (${language.dictionary.englishShort})`}
                value={formValues.titleEn}
                required={selectedLanguage === 'en' && languages.en}
                autoFocus
                hidden={selectedLanguage !== 'en'}
                maxLength={60}
                onChange={(e) => setFormValues(getInputChange(e, formValues))}
            />
            <RichEditor
                id="descriptionNo"
                ref={editorRef}
                hidden={selectedLanguage !== 'no'}
                defaultValue={formValues.descriptionNo}
                label={`${language.dictionary.labelDescription} (${language.dictionary.norwegianShort})...`}
                labelMaxLength={language.dictionary.maxLengthEditor}
                onSave={(data) => setFormValues({ ...formValues, descriptionNo: data })}
            />
            <RichEditor
                id="descriptionEn"
                ref={editorRef}
                hidden={selectedLanguage !== 'en'}
                defaultValue={formValues.descriptionEn}
                label={`${language.dictionary.labelDescription} (${language.dictionary.englishShort})...`}
                labelMaxLength={language.dictionary.maxLengthEditor}
                onSave={(data) => setFormValues({ ...formValues, descriptionEn: data })}
            />
        </>
    );

    /**
     * Render key group and collection selects
     *
     * @returns JSX
     */
    const renderSelects = () => (
        <>
            <KeyGroupSelect
                value={formValues.groupId}
                groups={groups}
                isCreator={isPermitted(user, ['CREATE_GROUP'])}
                onChange={(e) => setFormValues(getInputChange(e, formValues))}
                onClickNew={() => setOpenCreateDialog('GROUP')}
            />
            <CollectionSelect
                value={formValues.collections}
                collections={collections}
                isCreator={isPermitted(user, ['CREATE_COLLECTION'])}
                onChange={(e) => setFormValues(getInputChange(e, formValues))}
                onClickNew={() => setOpenCreateDialog('COLLECTION')}
            />
            <WorkgroupSelect
                value={formValues.workgroupId}
                workgroups={workgroups}
                isCreator={isPermitted(user, ['CREATE_WORKGROUP'])}
                isOwner
                onChange={(e) => setFormValues(getInputChange(e, formValues))}
                onClickNew={() => setOpenCreateDialog('WORKGROUP')}
            />
        </>
    );

    /**
     * Render dialogs
     *
     * @returns JSX
     */
    const renderDialogs = () => {
        if (openCreateDialog === 'GROUP') {
            return (
                <CreateKeyGroup
                    openDialog={openCreateDialog === 'GROUP'}
                    groups={groups}
                    onClose={(unsaved) => handleCloseDialog(unsaved)}
                    onCreated={(id) => {
                        setGroups(undefined);
                        setFormValues({
                            ...formValues,
                            groupId: id,
                        });
                    }}
                />
            );
        }
        if (openCreateDialog === 'COLLECTION') {
            return (
                <CreateCollection
                    openDialog={openCreateDialog === 'COLLECTION'}
                    collections={collections}
                    onClose={(unsaved) => handleCloseDialog(unsaved)}
                    onCreated={(id) => {
                        setCollections(undefined);
                        const tmp = [...formValues.collections];
                        tmp.push(id);
                        setFormValues({
                            ...formValues,
                            collections: tmp,
                        });
                    }}
                />
            );
        }
        if (openCreateDialog === 'WORKGROUP') {
            return (
                <CreateWorkgroup
                    openDialog={openCreateDialog === 'WORKGROUP'}
                    onClose={(unsaved) => handleCloseDialog(unsaved)}
                    onCreated={(id) => {
                        setWorkgroups(undefined);
                        setFormValues({
                            ...formValues,
                            workgroupId: id,
                        });
                    }}
                />
            );
        }
        return null;
    };

    /**
     * Render languages bar
     *
     * @returns JSX
     */
    const renderLangBar = () => (
        <AppBar position="relative" className="my-6" color="default">
            <Tabs value={tab} onChange={(e, val) => setTab(val)} aria-label="language tabs">
                {languages.no && (
                    <Tab
                        label={`${language.dictionary.norwegian} (${language.dictionary.norwegianShort})${languages.no ? ' *' : ''}`}
                        onClick={() => setSelectedLanguage('no')}
                    />
                )}
                {languages.en && (
                    <Tab
                        label={`${language.dictionary.english} (${language.dictionary.englishShort})${languages.en ? ' *' : ''}`}
                        onClick={() => setSelectedLanguage('en')}
                    />
                )}
            </Tabs>
        </AppBar>
    );

    return (
        <div className="py-14 px-4 md:w-10/12 m-auto">
            <BackButton
                onClick={() => handleCloseDialog(
                    JSON.stringify(formValues) !== JSON.stringify(defaultFormValues),
                )}
            />
            <form className="mt-10 max-w-2xl" autoComplete="off" onSubmit={handleSubmit}>
                <h1>{language.dictionary.createKey}</h1>
                <p className="mt-4 mb-6">{language.dictionary.sectionCreateKey}</p>
                <LanguageSwitches
                    switches={languages}
                    onSwitchUpdate={(switches) => setTab(0, setLanguages(switches))}
                />
                {renderLangBar()}
                {selectedLanguage && (
                    <>
                        {renderTextInputs()}
                        <FileDrop
                            maxFiles={6}
                            onUpdate={(files) => setFormValues({ ...formValues, files })}
                            onClickOpen={(index) => setOpenMediaDialog(index)}
                        />
                        {renderSelects()}
                    </>
                )}
                {error && <p className="text-red-600 mb-4">{error}</p>}
                <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    endIcon={<PostAdd />}
                    type="submit"
                    disabled={!languages.no && !languages.en}
                >
                    {language.dictionary.btnCreate}
                </Button>
            </form>
            {renderDialogs()}
            {openMediaDialog !== undefined && (
                <SetMediaInfo
                    openDialog={openMediaDialog !== undefined}
                    index={openMediaDialog}
                    fileName={formValues.files[openMediaDialog].name}
                    fileInfo={formValues.files[openMediaDialog].fileInfo}
                    onClose={(unsaved) => handleCloseDialog(unsaved)}
                    onUpdate={(index, values) => {
                        const arr = [...formValues.files];
                        arr[index].fileInfo = values;
                        setFormValues({ ...formValues, files: arr });
                    }}
                />
            )}
            <UnsavedChanges
                openDialog={showUnsavedDialog}
                onClose={() => setShowUnsavedDialog(false)}
                onConfirm={() => handleCloseDialog()}
            />
        </div>
    );
};

export default CreateKey;
