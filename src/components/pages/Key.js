import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import OpenInNewOutlined from '@material-ui/icons/OpenInNewOutlined';
import EditOutlined from '@material-ui/icons/EditOutlined';
import GroupAddOutlined from '@material-ui/icons/GroupAddOutlined';
import LanguageContext from '../../context/LanguageContext';
import { getKey, getRevisions, getWorkgroups } from '../../utils/api/get';
import formatDate from '../../utils/format-date';
import ShareKey from '../dialogs/ShareKey';
import SelectRevision from '../dialogs/SelectRevision';
import BackButton from '../components/BackButton';
import ThumbnailList from '../components/lists/ThumbnailList';
import UserContext from '../../context/UserContext';
import MissingPermission from '../components/MissingPermission';
import isPermitted from '../../utils/is-permitted';

/**
 * Render key info page
 */
const Key = () => {
    const { language } = useContext(LanguageContext);
    const { user } = useContext(UserContext);
    const { keyId } = useParams();
    const history = useHistory();
    const [key, setKey] = useState(undefined);
    const [revisions, setRevisions] = useState(undefined);
    const [workgroups, setWorkgroups] = useState(undefined);
    const [error, setError] = useState(undefined);
    const [errorDialog, setErrorDialog] = useState(undefined);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(undefined);
    const [latestRevision, setLatestRevision] = useState(true);
    const [selectedRevision, setSelectedRevision] = useState(undefined);
    const [openShareModal, setOpenShareModal] = useState(false);
    const [tab, setTab] = useState(0);
    const [languages, setLanguages] = useState({
        langNo: false,
        langEn: false,
    });

    /**
     * Get key from API
     */
    useEffect(() => {
        if (!key) {
            getKey(keyId).then((element) => {
                const langs = {
                    langNo: element.languages.includes('no'),
                    langEn: element.languages.includes('en'),
                };
                setLanguages(langs);
                if (langs.langNo) {
                    setSelectedLanguage('no');
                } else if (langs.langEn) {
                    setSelectedLanguage('en');
                } else setSelectedLanguage(undefined);
                setKey(element);
            }).catch(() => history.replace('/'));
        }
    }, [keyId, key]);

    /**
     * Get revisions from API
     */
    useEffect(() => {
        if (!revisions) {
            getRevisions(keyId).then((revs) => {
                setRevisions(revs);
            }).catch(() => { });
        }
    }, [keyId, revisions, key]);

    /**
     * Get workgroups from API
     */
    useEffect(() => {
        if (!workgroups) {
            getWorkgroups().then((groups) => {
                setWorkgroups(groups);
            }).catch(() => setError(language.dictionary.internalAPIError));
        }
    }, [workgroups]);

    /**
     * Reset error message and latest flag on dialog exit
     */
    useEffect(() => {
        if (!openDialog) {
            setLatestRevision(true);
            setErrorDialog(false);
        }
    }, [openDialog]);

    /**
     * Go to edit page
     */
    const handleBuildKey = async () => {
        if (selectedRevision) {
            history.push(`/build/${selectedRevision.id}`);
        } else history.push(`/build/${revisions[0].id}`);
    };

    /**
     * Render key details
     *
     * @returns JSX
     */
    const renderKeyDetails = () => {
        const info = key.key_info && key.key_info.find(
            (element) => element.languageCode === selectedLanguage,
        );
        const createdAt = key.created_at ? formatDate(key.created_at, true) : undefined;
        const modified = key.updated_at ? formatDate(key.updated_at) : undefined;
        return (
            <div className="mt-6">
                <AppBar position="relative" className="mb-6 mt-10 max-w-2xl" color="default">
                    <Tabs value={tab} onChange={(e, val) => setTab(val)} aria-label="language tabs">
                        {languages.langNo && (
                            <Tab
                                label={`${language.dictionary.norwegian} (${language.dictionary.norwegianShort})`}
                                onClick={() => setSelectedLanguage('no')}
                            />
                        )}
                        {languages.langEn && (
                            <Tab
                                label={`${language.dictionary.english} (${language.dictionary.englishShort})`}
                                onClick={() => setSelectedLanguage('en')}
                            />
                        )}
                    </Tabs>
                </AppBar>
                <h1 className="font-light">{info && info.title}</h1>
                <ThumbnailList media={key && key.media} />
                <div className="max-w-2xl mt-6" dangerouslySetInnerHTML={{ __html: info && info.description }} />
                <h2 className="mb-4 mt-8">{language.dictionary.keyInfo}</h2>
                <dl className="mb-8">
                    {modified && modified !== createdAt && (
                        <>
                            <dt className="float-left w-32 font-bold text-right mr-6 tracking-wide">
                                {language.dictionary.labelModified}
                            </dt>
                            <dd>{modified}</dd>
                        </>
                    )}
                    {createdAt && (
                        <>
                            <dt className="float-left w-32 font-bold text-right mr-6 tracking-wide">
                                {language.dictionary.created}
                            </dt>
                            <dd>{createdAt}</dd>
                        </>
                    )}
                    {key.status && (
                        <>
                            <dt className="float-left w-32 font-bold text-right mr-6 tracking-wide">
                                {language.dictionary.labelStatus}
                                :
                            </dt>
                            <dd>
                                {key.status.charAt(0).toUpperCase()
                                    + key.status.slice(1).toLowerCase()}
                            </dd>
                        </>
                    )}
                    {key.version && (
                        <>
                            <dt className="float-left w-32 font-bold text-right mr-6 tracking-wide">
                                {language.dictionary.labelVersion}
                            </dt>
                            <dd>{key.version}</dd>
                        </>
                    )}
                </dl>
                <h2 className="my-4">{language.dictionary.labelOwner}</h2>
                <dl>
                    {key.artsapp_user && (
                        <>
                            <dt className="float-left w-32 font-bold text-right mr-6 tracking-wide">
                                {language.dictionary.labelCreatedBy}
                            </dt>
                            <dd>{key.artsapp_user.name}</dd>
                        </>
                    )}
                    {key.workgroup && key.workgroup.name && (
                        <>
                            <dt className="float-left w-32 font-bold text-right mr-6 tracking-wide">
                                {language.dictionary.labelWorkgroup}
                                :
                            </dt>
                            <dd>{key.workgroup.name}</dd>
                        </>
                    )}
                    {key.workgroup && key.workgroup.organization
                        && key.workgroup.organization.organization_info && (
                            <>
                                <dt className="float-left w-32 font-bold text-right mr-6 tracking-wide">
                                    {language.dictionary.labelOrganization}
                                </dt>
                                <dd>{key.workgroup.organization.organization_info.fullName}</dd>
                            </>
                        )}
                </dl>
            </div>
        );
    };

    /**
     * Render action bar buttons
     *
     * @returns JSX
     */
    const renderActionBar = () => {
        let label = language.dictionary.notEditKeyInfo;
        if (!isPermitted(user, ['EDIT_KEY_INFO'], key.workgroupId || true) && !isPermitted(user, ['EDIT_KEY'], key.workgroupId || true)) {
            label = language.dictionary.notChangeKey;
        } else if (!isPermitted(user, ['EDIT_KEY'], key.workgroupId || true)) {
            label = language.dictionary.notEditKey;
        }
        return (
            <>
                <div className="flex relative mb-8 mt-4">
                    <Button
                        variant="contained"
                        color="secondary"
                        size="medium"
                        endIcon={<EditOutlined />}
                        onClick={() => setOpenDialog(true)}
                        disabled={key && !key.createdBy && !key.isEditor && !isPermitted(user, ['EDIT_KEY'], key.workgroupId || true)}
                    >
                        {language.dictionary.btnEditKey}
                    </Button>
                    <span className="ml-4">
                        <Button
                            variant="contained"
                            color="primary"
                            size="medium"
                            endIcon={<EditOutlined />}
                            onClick={() => history.push(`/edit/${keyId}`)}
                            disabled={key && !key.createdBy && !isPermitted(user, ['EDIT_KEY_INFO'], key.workgroupId || true)}
                        >
                            {language.dictionary.btnEditInfo}
                        </Button>
                    </span>
                    <span className="ml-4">
                        <Button
                            variant="contained"
                            color="primary"
                            size="medium"
                            endIcon={<GroupAddOutlined />}
                            onClick={() => setOpenShareModal(true)}
                            disabled={key && !key.createdBy && !isPermitted(user, ['SHARE_KEY'], key.workgroupId || true)}
                        >
                            {language.dictionary.btnShare}
                        </Button>
                    </span>
                    <span className="ml-4">
                        <Button
                            variant="contained"
                            color="primary"
                            size="medium"
                            endIcon={<OpenInNewOutlined />}
                            disabled
                        >
                            {language.dictionary.btnTestKey}
                        </Button>
                    </span>
                </div>
                <MissingPermission
                    show={key && !key.createdBy && !isPermitted(user, ['EDIT_KEY_INFO', 'EDIT_KEY'], key.workgroupId || true)}
                    label={label}
                />
            </>
        );
    };

    return (
        <div className="py-14 px-4 lg:w-10/12 m-auto">
            <BackButton onClick={() => history.goBack()} />
            {key && renderActionBar()}
            {error && <p className="text-red-600 mt-4">{error}</p>}
            {key && renderKeyDetails()}
            <Dialog className="text-center" onClose={() => setOpenDialog(false)} open={openDialog}>
                <SelectRevision
                    revisions={revisions}
                    selected={selectedRevision}
                    selectLatest={latestRevision}
                    onBuildKey={() => handleBuildKey()}
                    onShowPrevious={() => setLatestRevision(false)}
                    onSelect={(revision) => setSelectedRevision(revision)}
                    onClose={() => setOpenDialog(false)}
                    error={errorDialog}
                />
            </Dialog>
            {openShareModal && (
                <ShareKey
                    openDialog={openShareModal}
                    keyId={keyId}
                    workgroup={key ? key.workgroup : undefined}
                    onClose={() => setOpenShareModal(false)}
                />
            )}
        </div>
    );
};

export default Key;
