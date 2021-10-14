import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import ViewStreamOutlined from '@material-ui/icons/ViewStreamOutlined';
import FlagOutlined from '@material-ui/icons/FlagOutlined';
import SaveOutlined from '@material-ui/icons/SaveOutlined';
import LanguageContext from '../../../context/LanguageContext';
import ActionButton from './ActionButton';
import { findRevisionStatusName } from '../../../utils/translation';

/**
 * Render buttons for taxa/character lists
 */
const BuildKeyActionBar = ({ revision, changesSaved, onOpenModal }) => {
    const { language } = useContext(LanguageContext);

    return (
        <div className="mt-4">
            {revision && (
                <span className="ml-1 mt-1">
                    <Button
                        variant="text"
                        color="primary"
                        size="medium"
                        startIcon={<ViewStreamOutlined />}
                        onClick={() => onOpenModal('MODE')}
                        disabled={!changesSaved}
                    >
                        {revision.mode === 2
                            ? language.dictionary.mode2 : language.dictionary.mode1}
                    </Button>
                </span>
            )}
            <span className="absolute right-2">
                <Button
                    variant="text"
                    color="primary"
                    size="medium"
                    endIcon={<FlagOutlined />}
                    onClick={() => onOpenModal('STATUS')}
                    disabled={!changesSaved}
                >
                    {revision && findRevisionStatusName(revision.status, language)}
                </Button>
            </span>
            <div className="md:flex relative">
                <ActionButton
                    label={language.dictionary.btnSaveChanges}
                    icon={<SaveOutlined />}
                    onClick={() => onOpenModal('SAVE')}
                    disabled={changesSaved}
                />
            </div>
            <hr />
        </div>
    );
};

export default BuildKeyActionBar;
