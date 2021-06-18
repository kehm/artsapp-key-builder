import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import Button from '@material-ui/core/Button';
import Add from '@material-ui/icons/Add';
import LanguageContext from '../../context/LanguageContext';
import { getKeys, getUserKeys } from '../../utils/api/get';
import KeyList from '../components/lists/KeyList';
import KeyFilter from '../components/inputs/KeyFilter';
import UserContext from '../../context/UserContext';
import MissingPermission from '../components/MissingPermission';
import isPermitted from '../../utils/is-permitted';

/**
 * Render keys page
 */
const Keys = () => {
    const { language } = useContext(LanguageContext);
    const { user } = useContext(UserContext);
    const history = useHistory();
    const [keys, setKeys] = useState(undefined);
    const [filterKeys, setFilterKeys] = useState({ keys: 'ALLKEYS', language: language.language.split('_')[0] });
    const [error, setError] = useState(undefined);

    /**
     * Respond to filter changes
     */
    useEffect(() => {
        if (!keys) {
            getKeys(filterKeys.language !== 'all' ? filterKeys.language : undefined).then((keyList) => {
                setKeys(keyList);
                setError(undefined);
            }).catch(() => setError(language.dictionary.internalAPIError));
        } else if (filterKeys.keys === 'ALLKEYS') {
            getKeys(filterKeys.language !== 'all' ? filterKeys.language : undefined).then((keyList) => {
                setKeys(keyList);
                setError(undefined);
            }).catch(() => setError(language.dictionary.internalAPIError));
        } else {
            getUserKeys(filterKeys.language !== 'all' ? filterKeys.language : undefined).then((userKeys) => {
                setKeys(userKeys);
                setError(undefined);
            }).catch(() => setError(language.dictionary.internalAPIError));
        }
    }, [filterKeys, language]);

    return (
        <div className="py-14 px-4 md:w-10/12 m-auto">
            <h1>{language.dictionary.keys}</h1>
            <p className="my-4">{language.dictionary.sectionKeys}</p>
            <Button
                variant="contained"
                color="secondary"
                size="medium"
                endIcon={<Add />}
                onClick={() => history.push('/create')}
                disabled={!isPermitted(user, ['CREATE_KEY'])}
            >
                {language.dictionary.btnNewKey}
            </Button>
            <MissingPermission
                show={!isPermitted(user, ['CREATE_KEY'])}
                label={language.dictionary.notCreateKey}
            />
            <KeyFilter
                filter={filterKeys}
                onChangeFilter={(val) => setFilterKeys(val)}
            />
            {error && <p className="text-red-600 mt-4">{error}</p>}
            {keys && keys.length > 0
                && (
                    <KeyList
                        keys={keys}
                        onClickListItem={(key) => history.push(`keys/${key.id}`)}
                    />
                )}
        </div>
    );
};

export default Keys;
