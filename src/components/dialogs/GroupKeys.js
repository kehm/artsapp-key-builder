import React, { useContext, useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LanguageContext from '../../context/LanguageContext';
import CloseButton from '../components/CloseButton';
import { getKeysByGroup } from '../../utils/api/get';
import KeyTitleList from '../components/lists/KeyTitleList';

/**
 * Render group keys dialog
 */
const GroupKeys = ({
    openDialog, group, onClose,
}) => {
    const { language } = useContext(LanguageContext);
    const [error, setError] = useState(undefined);
    const [keys, setKeys] = useState(undefined);

    /**
     * Get key list
     */
    useEffect(() => {
        if (!keys) {
            getKeysByGroup(group.id, language.language.split('_')[0]).then((response) => {
                setKeys(response);
            }).catch(() => setError(language.dictionary.internalAPIError));
        }
    }, [keys]);

    return (
        <Dialog open={openDialog} onClose={() => onClose()}>
            <div className="p-2">
                <DialogTitle>
                    {group ? group.name : ''}
                </DialogTitle>
                <DialogContent>
                    <CloseButton onClick={() => onClose()} />
                    <p>{language.dictionary.sectionKeyGroupList}</p>
                    <KeyTitleList keys={keys} />
                    {keys && keys.length === 0 && <p className="mb-4">{language.dictionary.noKeysInGroup}</p>}
                    {error && <p className="text-red-600 mb-4">{error}</p>}
                </DialogContent>
            </div>
        </Dialog>
    );
};

export default GroupKeys;
