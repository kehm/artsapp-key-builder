import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import SaveOutlined from '@material-ui/icons/SaveOutlined';
import DeleteOutlined from '@material-ui/icons/DeleteOutlined';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import LanguageContext from '../../context/LanguageContext';
import { hideKey, updateKey } from '../../utils/api/update';
import {
    getCollections, getKey, getKeyGroups, getWorkgroups,
} from '../../utils/api/get';
import LanguageSwitches from '../components/inputs/LanguageSwitches';
import UnsavedChanges from '../dialogs/UnsavedChanges';
import CollectionSelect from '../components/inputs/CollectionSelect';
import KeyGroupSelect from '../components/inputs/KeyGroupSelect';
import BackButton from '../components/BackButton';
import ConfirmDelete from '../dialogs/ConfirmDelete';
import ConfirmPublish from '../dialogs/ConfirmPublish';
import ProgressIndicator from '../components/ProgressIndicator';
import AddContributor from '../dialogs/AddContributor';
import AddCreator from '../dialogs/AddCreator';
import CreateCollection from '../dialogs/CreateCollection';
import CreateKeyGroup from '../dialogs/CreateKeyGroup';
import SetMediaInfo from '../dialogs/SetMediaInfo';
import { handleUpdateEntityMedia } from '../../utils/media';
import { getKeyInfoValues, getKeyLanguages, getKeyMetadata } from '../../utils/key';
import getInputChange from '../../utils/input-change';
import { convertEditorToHtml } from '../../utils/form-values';
import UserContext from '../../context/UserContext';
import CreateWorkgroup from '../dialogs/CreateWorkgroup';
import VersionControlForm from '../components/forms/VersionControlForm';
import OwnershipForm from '../components/forms/OwnershipForm';
import KeyInfoForm from '../components/forms/KeyInfoForm';
import isPermitted from '../../utils/is-permitted';

/**
 * Render key edit info page
 */
const EditKeyInfo = () => {
    const [defaultFormValues, setDefaultFormValues] = useState({
        status: '',
        version: '',
        titleNo: '',
        titleEn: '',
        descriptionNo: '',
        descriptionEn: '',
        revisionId: '',
        groupId: '',
        collections: [],
        creators: [],
        contributors: [],
        publishers: [],
        workgroupId: '',
        files: [],
        existingFiles: [],
    });
    const defaultLanguages = { no: false, en: false };
    const { language } = useContext(LanguageContext);
    const { user } = useContext(UserContext);
    const [formValues, setFormValues] = useState(defaultFormValues);
    const [languages, setLanguages] = useState(defaultLanguages);
    const { keyId } = useParams();
    const history = useHistory();
    const [key, setKey] = useState(undefined);
    const [revisions, setRevisions] = useState(undefined);
    const [collections, setCollections] = useState(undefined);
    const [groups, setGroups] = useState(undefined);
    const [organizations, setOrganizations] = useState(undefined);
    const [workgroups, setWorkgroups] = useState(undefined);
    const [error, setError] = useState(undefined);
    const [tab, setTab] = useState(0);
    const [selectedLanguage, setSelectedLanguage] = useState(undefined);
    const [openDialog, setOpenDialog] = useState(undefined);
    const [openMediaDialog, setOpenMediaDialog] = useState({ index: undefined, existing: false });
    const [openUnsavedDialog, setOpenUnsavedDialog] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [showProgress, setShowProgress] = useState(true);

    /**
     * Get objects from API
     */
    useEffect(() => {
        if (!key && !revisions && !collections && !groups) {
            getKey(keyId).then((element) => {
                getKeyMetadata(element.id, language.language.split('_')[0]).then((metadata) => {
                    setRevisions(metadata.revisions);
                    setOrganizations(metadata.organizations);
                    setKey(element);
                    setLanguages(getKeyLanguages(element.languages));
                    const values = getKeyInfoValues(element, metadata.organizations, formValues);
                    setDefaultFormValues(JSON.parse(JSON.stringify(values)));
                    setFormValues(values);
                    setShowProgress(false);
                }).catch(() => {
                    setError(language.dictionary.internalAPIError);
                    setShowProgress(false);
                });
            }).catch(() => {
                setError(language.dictionary.internalAPIError);
                setShowProgress(false);
            });
        }
        if (!groups) {
            getKeyGroups().then((response) => {
                setGroups(response);
            }).catch(() => setError(language.dictionary.internalAPIError));
        }
        if (!collections) {
            getCollections().then((response) => {
                setCollections(response);
            }).catch(() => setError(language.dictionary.internalAPIError));
        }
        if (!workgroups) {
            getWorkgroups().then((response) => {
                setWorkgroups(response);
            }).catch(() => setError(language.dictionary.internalAPIError));
        }
    }, [keyId, key, revisions, collections, groups, languages, formValues, language]);

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
     * Submit changes to API
     *
     * @param {Object} e Submission event
     * @param {boolean} confirmed True if skip confirm dialog
     */
    const handleSubmit = async (e, confirmed) => {
        if (e) e.preventDefault();
        if (tab === 0 && languages.en && formValues.titleEn === '') {
            setError(language.dictionary.errorTextEn);
        } else if (tab === 1 && languages.no && formValues.titleNo === '') {
            setError(language.dictionary.errorTextNo);
        } else if (!confirmed && formValues.status !== 'PRIVATE') {
            setOpenDialog('CONFIRM');
        } else {
            setOpenDialog(undefined);
            try {
                let values = { ...formValues };
                values = convertEditorToHtml(values);
                values.publishers = formValues.publishers.map((publisher) => publisher.id);
                values.languages = [];
                if (languages.no) values.languages.push('no');
                if (languages.en) values.languages.push('en');
                if (values.groupId === '') delete values.groupId;
                if (values.workgroupId === '') delete values.workgroupId;
                await updateKey(keyId, values);
                await handleUpdateEntityMedia(keyId, 'key', formValues.files, key.media, formValues.existingFiles);
                setError(undefined);
                history.replace(`/keys/${key.id}`);
                history.goBack();
            } catch (err) {
                setError(language.dictionary.internalAPIError);
            }
        }
    };

    /**
      * Delete key (set status HIDDEN)
      *
      * @param {boolean} confirm True if confirmation is required
      */
    const handleDelete = async (confirm) => {
        if (confirm) {
            setConfirmDelete(true);
        } else {
            try {
                await hideKey(keyId);
                setError(undefined);
                history.replace('/');
                history.goBack();
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
            setOpenUnsavedDialog(true);
        } else if (openMediaDialog.index !== undefined) {
            setOpenMediaDialog({ index: undefined, existing: false });
        } else if (openDialog === 'GROUP' || openDialog === 'COLLECTION' || openDialog === 'WORKGROUP'
            || openDialog === 'CREATOR' || openDialog === 'CONTRIBUTOR' || openDialog === 'PUBLISHER') {
            setOpenDialog(undefined);
        } else history.goBack();
    };

    /**
     * Render dialogs
     *
     * @returns JSX
     */
    const renderCreateDialogs = () => {
        switch (openDialog) {
            case 'GROUP':
                return (
                    <CreateKeyGroup
                        openDialog={openDialog === 'GROUP'}
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
            case 'COLLECTION':
                return (
                    <CreateCollection
                        openDialog={openDialog === 'COLLECTION'}
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
            case 'WORKGROUP':
                return (
                    <CreateWorkgroup
                        openDialog={openDialog === 'WORKGROUP'}
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
            case 'CREATOR':
                return (
                    <AddCreator
                        openDialog={openDialog === 'CREATOR'}
                        onClose={(unsaved) => handleCloseDialog(unsaved)}
                        onUpdate={(name) => {
                            const arr = [...formValues.creators];
                            arr.push(name);
                            setFormValues({ ...formValues, creators: arr });
                            handleCloseDialog();
                        }}
                    />
                );
            case 'CONTRIBUTOR':
                return (
                    <AddContributor
                        openDialog={openDialog === 'CONTRIBUTOR'}
                        onClose={(unsaved) => handleCloseDialog(unsaved)}
                        onUpdate={(name) => {
                            const arr = [...formValues.contributors];
                            arr.push(name);
                            setFormValues({ ...formValues, contributors: arr });
                            handleCloseDialog();
                        }}
                    />
                );
            case 'CONFIRM':
                return (
                    <ConfirmPublish
                        openDialog={openDialog === 'CONFIRM'}
                        onClose={() => setOpenDialog(undefined)}
                        onConfirm={() => handleSubmit(undefined, true)}
                    />
                );
            default:
                return null;
        }
    };

    /**
     * Render info dialogs
     *
     * @returns JSX
     */
    const renderInfoDialogs = () => (
        <>
            {openMediaDialog.index !== undefined && (
                <SetMediaInfo
                    openDialog={openMediaDialog.index !== undefined}
                    index={openMediaDialog.index}
                    fileName={openMediaDialog.existing
                        ? formValues.existingFiles[openMediaDialog.index].name
                        : formValues.files[openMediaDialog.index].name}
                    fileInfo={openMediaDialog.existing
                        ? formValues.existingFiles[openMediaDialog.index].fileInfo
                        : formValues.files[openMediaDialog.index].fileInfo}
                    onClose={(unsaved) => handleCloseDialog(unsaved)}
                    onUpdate={(index, values) => {
                        if (openMediaDialog.existing) {
                            const arr = [...formValues.existingFiles];
                            arr[index].fileInfo = values;
                            setFormValues({ ...formValues, existingFiles: arr });
                        } else {
                            const arr = [...formValues.files];
                            arr[index].fileInfo = values;
                            setFormValues({ ...formValues, files: arr });
                        }
                    }}
                />
            )}
            <UnsavedChanges
                openDialog={openUnsavedDialog}
                onClose={() => setOpenUnsavedDialog(false)}
                onConfirm={() => handleCloseDialog()}
            />
            <ConfirmDelete
                openDialog={confirmDelete}
                customText={language.dictionary.confirmDeleteKey}
                onClose={() => setConfirmDelete(false)}
                onConfirm={() => handleDelete()}
            />
        </>
    );

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

    /**
     * Render inputs
     *
     * @returns JSX
     */
    const renderInputs = () => (
        <>
            <KeyInfoForm
                formValues={formValues}
                languages={languages}
                selectedLanguage={selectedLanguage}
                onChange={(e) => setFormValues(getInputChange(e, formValues))}
                onUpdate={(data, field) => setFormValues({ ...formValues, [field]: data })}
                onOpenMediaDialog={(index, existing) => setOpenMediaDialog({ index, existing })}
            />
            <hr className="mb-6" />
            <h2 className="mb-4">{language.dictionary.headerOrganize}</h2>
            <KeyGroupSelect
                value={formValues.groupId}
                groups={groups}
                isCreator={isPermitted(user, ['CREATE_GROUP'])}
                onChange={(e) => setFormValues(getInputChange(e, formValues))}
                onClickNew={() => setOpenDialog('GROUP')}
            />
            <CollectionSelect
                value={formValues.collections}
                collections={collections}
                isCreator={isPermitted(user, ['CREATE_COLLECTION'])}
                onChange={(e) => setFormValues(getInputChange(e, formValues))}
                onClickNew={() => setOpenDialog('COLLECTION')}
            />
            <hr className="mb-6" />
            <OwnershipForm
                formValues={formValues}
                organizations={organizations}
                workgroups={workgroups}
                onOpenDialog={(val) => setOpenDialog(val)}
                onChange={(e) => setFormValues(getInputChange(e, formValues))}
                onChangePublishers={(val) => setFormValues({ ...formValues, publishers: val })}
            />
            <hr className="mb-6" />
            <VersionControlForm
                formValues={formValues}
                revisions={revisions}
                onChange={(e) => setFormValues(getInputChange(e, formValues))}
            />
        </>
    );

    const renderActions = () => (
        <>
            <Button
                variant="contained"
                color="secondary"
                size="small"
                type="submit"
                endIcon={<SaveOutlined />}
                disabled={!languages.no && !languages.en}
            >
                {language.dictionary.btnSaveChanges}
            </Button>
            <span className="absolute right-0">
                <Button
                    variant="text"
                    color="inherit"
                    size="medium"
                    type="button"
                    endIcon={<DeleteOutlined />}
                    onClick={() => handleDelete(true)}
                >
                    {language.dictionary.btnDelete}
                </Button>
            </span>
        </>
    );

    return (
        <div className="py-14 px-4 md:w-10/12 m-auto">
            <BackButton
                onClick={() => handleCloseDialog(
                    JSON.stringify(formValues) !== JSON.stringify(defaultFormValues),
                )}
            />
            <form className="relative mt-10 max-w-2xl" autoComplete="off" onSubmit={handleSubmit}>
                <h1>{language.dictionary.keyInfo}</h1>
                <p className="mt-4 mb-6">{language.dictionary.sectionEditKey}</p>
                <LanguageSwitches
                    switches={languages}
                    onSwitchUpdate={(switches) => setTab(0, setLanguages(switches))}
                />
                {renderLangBar()}
                {selectedLanguage && renderInputs()}
                {error && <p className="text-red-600 mb-4">{error}</p>}
                {renderActions()}
            </form>
            {renderCreateDialogs()}
            {renderInfoDialogs()}
            <ProgressIndicator open={showProgress} />
        </div>
    );
};

export default EditKeyInfo;
