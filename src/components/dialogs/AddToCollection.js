import React, { useContext, useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import PostAdd from '@material-ui/icons/PostAdd';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import LanguageContext from '../../context/LanguageContext';
import CloseButton from '../components/buttons/CloseButton';
import { getKeys, getKeysByCollection } from '../../utils/api/get';
import KeyTitleList from '../components/lists/KeyTitleList';
import UserContext from '../../context/UserContext';
import ConfirmDelete from './ConfirmDelete';
import getInputChange from '../../utils/input-change';
import { removeKeyFromCollection } from '../../utils/api/delete';
import { addKeyToCollection } from '../../utils/api/create';
import isPermitted from '../../utils/is-permitted';

/**
 * Render add key to collection dialog
 */
const AddToCollection = ({
    openDialog, collection, isEditor, onClose,
}) => {
    const { language } = useContext(LanguageContext);
    const { user } = useContext(UserContext);
    const defaultFormValues = {
        keyId: '',
    };
    const [formValues, setFormValues] = useState(defaultFormValues);
    const [error, setError] = useState(undefined);
    const [tab, setTab] = useState(0);
    const [keys, setKeys] = useState(undefined);
    const [collectionKeys, setCollectionKeys] = useState(undefined);
    const [confirmDelete, setConfirmDelete] = useState(undefined);

    /**
     * Get list of keys
     */
    useEffect(() => {
        if (!collectionKeys) {
            getKeysByCollection(collection.id, language.language.split('_')[0]).then((collections) => {
                getKeys(language.language.split('_')[0]).then((response) => {
                    const arr = [];
                    response.forEach((element) => {
                        const found = collections.find((key) => key.artsapp_key.id === element.id);
                        if (!found) arr.push(element);
                    });
                    setCollectionKeys(collections);
                    setKeys(arr);
                }).catch(() => setError(language.dictionary.internalAPIError));
            }).catch(() => setError(language.dictionary.internalAPIError));
        }
    }, [collectionKeys]);

    /**
     * Add key to collection
     *
     * @param {Object} e Event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addKeyToCollection({
                collectionId: collection.id,
                keyId: formValues.keyId,
            });
            setCollectionKeys(undefined);
            setTab(0);
            setError(undefined);
            setFormValues({ ...formValues, keyId: '' });
        } catch (err) {
            setError(language.dictionary.internalAPIError);
        }
    };

    /**
     * Remove key from collection
     *
     * @param {int} collectionsId Collections ID
     * @param {boolean} confirm True if confirmation is required
     */
    const handleDelete = async (collectionsId, confirm) => {
        if (confirm) {
            setConfirmDelete(collectionsId);
        } else {
            try {
                await removeKeyFromCollection(collectionsId);
                setCollectionKeys(undefined);
                setError(undefined);
            } catch (err) {
                setError(language.dictionary.internalAPIError);
            }
        }
    };

    /**
     * Render dialog content
     *
     * @returns JSX
     */
    const renderContent = () => {
        if (tab === 1) {
            return (
                <FormControl variant="outlined" fullWidth>
                    <InputLabel id="keyId-label" required>
                        {language.dictionary.key}
                    </InputLabel>
                    <Select
                        className="mb-8"
                        labelId="keyId-label"
                        id="keyId"
                        name="keyId"
                        value={formValues.keyId}
                        variant="outlined"
                        required
                        label={language.dictionary.key}
                        fullWidth
                        onChange={(e) => setFormValues(getInputChange(e, formValues))}
                    >
                        {keys && keys.map((element) => (
                            <MenuItem key={element.id} value={element.id}>
                                {element.key_info ? element.key_info.title : ''}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            );
        }
        return (
            <KeyTitleList
                keys={collectionKeys}
                showActions={isPermitted(user, ['EDIT_COLLECTION'])}
                onRemove={(collectionsId) => handleDelete(collectionsId, true)}
            />
        );
    };

    return (
        <Dialog open={openDialog} onClose={() => onClose()}>
            <form className="p-2" autoComplete="off" onSubmit={handleSubmit}>
                <DialogTitle>
                    {collection ? collection.name : ''}
                </DialogTitle>
                <DialogContent>
                    <CloseButton onClick={() => onClose()} />
                    <p>{language.dictionary.sectionKeyCollectionList}</p>
                    <AppBar position="relative" className="my-6" color="default">
                        <Tabs value={tab} onChange={(e, val) => setTab(val)} aria-label="language tabs">
                            <Tab label={language.dictionary.labelOverview} />
                            {(isEditor && user.workgroups.includes(collection.workgroup_id))
                                && <Tab label={language.dictionary.btnAdd} />}
                        </Tabs>
                    </AppBar>
                    {renderContent()}
                    {collectionKeys && collectionKeys.length === 0 && <p className="mb-4">{language.dictionary.noKeysInCollection}</p>}
                    {error && <p className="text-red-600 mb-4">{error}</p>}
                </DialogContent>
                {tab === 1 && (
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
            </form>
            <ConfirmDelete
                openDialog={confirmDelete !== undefined}
                onClose={() => setConfirmDelete(undefined)}
                onConfirm={() => handleDelete(confirmDelete)}
            />
        </Dialog>
    );
};

export default AddToCollection;
