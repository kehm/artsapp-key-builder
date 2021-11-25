import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import OpenInNewOutlined from '@material-ui/icons/OpenInNewOutlined';
import EditOutlined from '@material-ui/icons/EditOutlined';
import GroupAddOutlined from '@material-ui/icons/GroupAddOutlined';
import LanguageContext from '../../context/LanguageContext';
import { getKey, getRevisions, getWorkgroups } from '../../utils/api/get';
import ShareKey from '../dialogs/ShareKey';
import SelectRevision from '../dialogs/SelectRevision';
import BackButton from '../components/buttons/BackButton';
import ThumbnailList from '../components/lists/ThumbnailList';
import UserContext from '../../context/UserContext';
import MissingPermission from '../components/MissingPermission';
import isPermitted from '../../utils/is-permitted';
import TestKey from '../dialogs/TestKey';
import ActionButton from '../components/buttons/ActionButton';
import KeyInfoList from '../components/lists/KeyInfoList';
import LanguageBar from '../components/LanguageBar';

/**
 * Render key info page
 */
const Key = ({ onSetTitle }) => {
    const { language } = useContext(LanguageContext);
    const { user } = useContext(UserContext);
    const { keyId } = useParams();
    const history = useHistory();
    const [key, setKey] = useState(undefined);
    const [revisions, setRevisions] = useState(undefined);
    const [workgroups, setWorkgroups] = useState(undefined);
    const [error, setError] = useState(undefined);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(undefined);
    const [openShareDialog, setOpenShareDialog] = useState(false);
    const [openTestDialog, setOpenTestDialog] = useState(false);
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
     * Go to edit page
     */
    const handleBuildKey = async (revision) => {
        if (revision) {
            history.push(`/build/${revision.id}`);
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
        onSetTitle(info && info.title ? info.title : language.dictionary.keys);
        return (
            <div className="mt-6">
                <LanguageBar
                    tab={tab}
                    showNo={languages.langNo}
                    showEn={languages.langEn}
                    selectable
                    maxWidth
                    onChangeTab={(val) => setTab(val)}
                    onSelectLanguage={(val) => setSelectedLanguage(val)}
                />
                <ThumbnailList media={key && key.media} />
                <div className="max-w-2xl mt-6" dangerouslySetInnerHTML={{ __html: info && info.description }} />
                <KeyInfoList keyInfo={key} />
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
                <div className="flex relative mt-6">
                    <ActionButton
                        label={language.dictionary.btnEditKey}
                        icon={<EditOutlined />}
                        onClick={() => setOpenEditDialog(true)}
                        disabled={key && !key.createdBy && !key.isEditor && !isPermitted(user, ['EDIT_KEY'], key.workgroupId || true)}
                    />
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
                    <span className="ml-4">
                        <Button
                            variant="contained"
                            color="primary"
                            size="medium"
                            endIcon={<GroupAddOutlined />}
                            onClick={() => setOpenShareDialog(true)}
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
                            onClick={() => setOpenTestDialog(true)}
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

    /**
     * Render select revision dialog
     *
     * @returns JSX
     */
    const renderRevisionDialog = () => (
        <Dialog
            className="text-center"
            onClose={() => setOpenEditDialog(false)}
            open={openEditDialog}
        >
            <SelectRevision
                revisions={revisions}
                onSelect={(revision) => handleBuildKey(revision)}
                onClose={() => setOpenEditDialog(false)}
            />
        </Dialog>
    );

    return (
        <div className="py-14 px-4 lg:w-10/12 m-auto pb-28">
            <BackButton onClick={() => history.goBack()} />
            {key && renderActionBar()}
            {error && <p className="text-red-600 mt-4">{error}</p>}
            {key && renderKeyDetails()}
            {renderRevisionDialog()}
            {openShareDialog && (
                <ShareKey
                    openDialog={openShareDialog}
                    keyId={keyId}
                    workgroup={key ? key.workgroup : undefined}
                    onClose={() => setOpenShareDialog(false)}
                />
            )}
            {openTestDialog && (
                <TestKey
                    openDialog={openTestDialog}
                    revisions={revisions}
                    onSelect={(revisionId) => {
                        window.open(`${process.env.REACT_APP_PLAYER_URL}/preview/${revisionId}`, '_blank');
                        setOpenTestDialog(false);
                    }}
                    onClose={() => setOpenTestDialog(false)}
                />
            )}
        </div>
    );
};

export default Key;
