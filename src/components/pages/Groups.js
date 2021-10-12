import React, { useContext, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Add from '@material-ui/icons/Add';
import LanguageContext from '../../context/LanguageContext';
import { getCollections, getKeyGroups } from '../../utils/api/get';
import CollectionList from '../components/lists/CollectionList';
import KeyGroupList from '../components/lists/KeyGroupList';
import CreateKeyGroup from '../dialogs/CreateKeyGroup';
import CreateCollection from '../dialogs/CreateCollection';
import UnsavedChanges from '../dialogs/UnsavedChanges';
import UserContext from '../../context/UserContext';
import MissingPermission from '../components/MissingPermission';
import GroupKeys from '../dialogs/GroupKeys';
import AddToCollection from '../dialogs/AddToCollection';
import isPermitted from '../../utils/is-permitted';
import ActionButton from '../components/buttons/ActionButton';

/**
 * Render key groups/collections page
 */
const Groups = ({ onSetTitle }) => {
    const { language } = useContext(LanguageContext);
    const { user } = useContext(UserContext);
    const [groups, setGroups] = useState(undefined);
    const [collections, setCollections] = useState(undefined);
    const [error, setError] = useState(undefined);
    const [tab, setTab] = useState(0);
    const [openCreateDialog, setOpenCreateDialog] = useState(undefined);
    const [openKeyList, setOpenKeyList] = useState(undefined);
    const [openUnsavedDialog, setOpenUnsavedDialog] = useState(false);

    /**
     * Get key groups from API
     */
    useEffect(() => {
        if (!groups) {
            onSetTitle(language.dictionary.groupsAndCollections);
            getKeyGroups(language.language.split('_')[0]).then((keyGroups) => {
                setGroups(keyGroups);
            }).catch(() => setError(language.dictionary.internalAPIError));
        }
    }, [groups]);

    /**
     * Get collections from API
     */
    useEffect(() => {
        if (!collections) {
            getCollections(language.language.split('_')[0]).then((keyCollections) => {
                setCollections(keyCollections);
            }).catch(() => setError(language.dictionary.internalAPIError));
        }
    }, [collections]);

    /**
     * Show confirm dialog before closing the dialog if form has unsaved changes
     *
     * @param {boolean} unsaved True if unsaved changes
     */
    const handleCloseDialog = (unsaved) => {
        if (unsaved) {
            setOpenUnsavedDialog(true);
        } else setOpenCreateDialog(undefined);
    };

    /**
     * Render tab contents
     *
     * @returns JSX
     */
    const renderTabs = () => {
        if (tab === 0 && isPermitted(user, ['BROWSE_GROUPS'])) {
            return (
                <KeyGroupList
                    groups={groups}
                    isEditor={isPermitted(user, ['EDIT_GROUP'])}
                    onOpenList={(object) => setOpenKeyList({ dialog: 'GROUP', object })}
                    onEdit={(id) => setOpenCreateDialog({ dialog: 'GROUP', id })}
                />
            );
        }
        if (tab === 1 && isPermitted(user, ['BROWSE_COLLECTIONS'])) {
            return (
                <CollectionList
                    collections={collections}
                    isEditor={isPermitted(user, ['EDIT_COLLECTION'])}
                    onOpenList={(object) => setOpenKeyList({ dialog: 'COLLECTION', object })}
                    onEdit={(id) => setOpenCreateDialog({ dialog: 'COLLECTION', id })}
                />
            );
        }
        return null;
    };

    /**
     * Render tab bar
     *
     * @returns JSX
     */
    const renderBar = () => (
        <AppBar position="relative" className="my-6" color="default">
            <Tabs
                value={tab}
                onChange={(e, val) => setTab(val)}
                aria-label="group and collection tabs"
            >
                <Tab
                    label={language.dictionary.labelKeyGroups}
                    disabled={!isPermitted(user, ['BROWSE_GROUPS'])}
                />
                <Tab
                    label={language.dictionary.labelCollections}
                    disabled={!isPermitted(user, ['BROWSE_COLLECTIONS'])}
                />
            </Tabs>
        </AppBar>
    );

    /**
     * Render dialogs
     *
     * @returns JSX
     */
    const renderDialogs = () => (
        <>
            {openCreateDialog && openCreateDialog.dialog === 'GROUP' && (
                <CreateKeyGroup
                    openDialog={openCreateDialog && openCreateDialog.dialog === 'GROUP'}
                    groups={groups}
                    id={openCreateDialog && openCreateDialog.id}
                    onClose={(unsaved) => handleCloseDialog(unsaved)}
                    onCreated={() => setGroups(undefined)}
                />
            )}
            {openCreateDialog && openCreateDialog.dialog === 'COLLECTION' && (
                <CreateCollection
                    openDialog={openCreateDialog && openCreateDialog.dialog === 'COLLECTION'}
                    collections={collections}
                    id={openCreateDialog && openCreateDialog.id}
                    onClose={(unsaved) => handleCloseDialog(unsaved)}
                    onCreated={() => setCollections(undefined)}
                />
            )}
            {openKeyList && openKeyList.dialog === 'GROUP' && (
                <GroupKeys
                    openDialog={openKeyList.dialog === 'GROUP'}
                    group={openKeyList.object}
                    onClose={() => setOpenKeyList(undefined)}
                />
            )}
            {openKeyList && openKeyList.dialog === 'COLLECTION' && (
                <AddToCollection
                    openDialog={openKeyList.dialog === 'COLLECTION'}
                    collection={openKeyList.object}
                    isEditor={isPermitted(user, ['EDIT_COLLECTION'])}
                    onClose={() => setOpenKeyList(undefined)}
                />
            )}
            <UnsavedChanges
                openDialog={openUnsavedDialog}
                onClose={() => setOpenUnsavedDialog(false)}
                onConfirm={() => setOpenCreateDialog(undefined)}
            />
        </>
    );

    const renderCreateButton = () => {
        let label;
        if (tab === 0) {
            if (!isPermitted(user, ['CREATE_GROUP']) && !isPermitted(user, ['EDIT_GROUP'])) {
                label = language.dictionary.notChangeGroup;
            } else if (!isPermitted(user, ['CREATE_GROUP'])) {
                label = language.dictionary.notCreateGroup;
            } else if (!isPermitted(user, ['EDIT_GROUP'])) {
                label = language.dictionary.notEditGroup;
            }
        } else if (tab === 1) {
            if (!isPermitted(user, ['CREATE_COLLECTION']) && !isPermitted(user, ['EDIT_COLLECTION'])) {
                label = language.dictionary.notChangeCollection;
            } else if (!isPermitted(user, ['CREATE_COLLECTION'])) {
                label = language.dictionary.notCreateCollection;
            } else if (!isPermitted(user, ['EDIT_COLLECTION'])) {
                label = language.dictionary.notEditCollection;
            }
        }
        return (
            <>
                <ActionButton
                    label={tab === 0
                        ? language.dictionary.newKeyGroup : language.dictionary.newCollection}
                    icon={<Add />}
                    onClick={() => setOpenCreateDialog({ dialog: tab === 0 ? 'GROUP' : 'COLLECTION' })}
                    disabled={(tab === 0 && !isPermitted(user, ['CREATE_GROUP']))
                        || (tab === 1 && !isPermitted(user, ['CREATE_COLLECTION']))}
                />
                <MissingPermission
                    show={label}
                    label={label}
                />
            </>
        );
    };

    return (
        <div className="py-14 md:w-10/12 m-auto pb-28">
            <p className="px-2 mt-20 lg:mt-6">{language.dictionary.sectionGroupsCollections}</p>
            {renderBar()}
            {renderCreateButton()}
            {renderTabs()}
            {error && <p className="text-red-600 mt-4">{error}</p>}
            {renderDialogs()}
        </div>
    );
};

export default Groups;
