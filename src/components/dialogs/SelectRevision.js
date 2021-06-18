import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import LanguageContext from '../../context/LanguageContext';
import RevisionList from '../components/lists/RevisionList';

/**
 * Render select revision dialog
 */
const SelectRevision = ({
    revisions, selected, selectLatest, onBuildKey, onShowPrevious, onSelect, onClose, error,
}) => {
    const { language } = useContext(LanguageContext);

    if (selectLatest) {
        return (
            <>
                <p className="px-4 pt-6">{language.dictionary.selectLatestRevision}</p>
                <div className="flex m-auto py-6">
                    <span className="mr-4">
                        <Button
                            variant="contained"
                            color="secondary"
                            size="medium"
                            type="button"
                            onClick={() => onBuildKey()}
                        >
                            {language.dictionary.btnSelectLatest}
                        </Button>
                    </span>
                    <span className="mr-4">
                        <Button
                            variant="contained"
                            color="default"
                            size="medium"
                            type="button"
                            onClick={() => onShowPrevious()}
                        >
                            {language.dictionary.btnShowAll}
                        </Button>
                    </span>
                    <Button
                        variant="contained"
                        color="default"
                        size="medium"
                        type="button"
                        onClick={() => onClose()}
                    >
                        {language.dictionary.btnCancel}
                    </Button>
                </div>
                {error && <p className="text-red-600 mb-4">{error}</p>}
            </>
        );
    }
    return (
        <>
            <p className="px-4 pt-6">{language.dictionary.selectRevisionInfo}</p>
            <RevisionList
                revisions={revisions}
                selectable
                onClickListItem={(revision) => onSelect(revision)}
            />
            <div className="flex m-auto pb-6">
                <span className="mr-4">
                    <Button
                        variant="contained"
                        color="secondary"
                        size="medium"
                        type="button"
                        onClick={() => onBuildKey()}
                        disabled={!selected}
                    >
                        {language.dictionary.btnSelectRevision}
                    </Button>
                </span>
                <Button
                    variant="contained"
                    color="default"
                    size="medium"
                    type="button"
                    onClick={() => onClose()}
                >
                    {language.dictionary.btnCancel}
                </Button>
            </div>
            {error && <p className="text-red-600 mb-4">{error}</p>}
        </>
    );
};

export default SelectRevision;
