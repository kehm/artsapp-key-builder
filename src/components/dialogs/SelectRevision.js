import React, { useContext, useState } from 'react';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import LanguageContext from '../../context/LanguageContext';
import RevisionList from '../components/lists/RevisionList';
import CloseButton from '../components/buttons/CloseButton';

/**
 * Render select revision dialog
 */
const SelectRevision = ({ revisions, onSelect, onClose }) => {
    const { language } = useContext(LanguageContext);
    const [showAll, setShowAll] = useState(false);

    /**
     * Render action buttons
     *
     * @returns JSX
     */
    const renderActions = () => (
        <div className="flex m-auto py-6 es:ml-12">
            <span className="mr-4">
                <Button
                    variant="contained"
                    color="secondary"
                    size="medium"
                    type="button"
                    onClick={() => onSelect()}
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
                    onClick={() => setShowAll(true)}
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
    );

    if (!showAll) {
        return (
            <DialogContent>
                <p className="px-4 pt-2">{language.dictionary.selectLatestRevision}</p>
                {renderActions()}
            </DialogContent>
        );
    }
    return (
        <DialogContent>
            <CloseButton onClick={() => onClose()} />
            <p className="px-4 pt-2">{language.dictionary.selectRevisionInfo}</p>
            <RevisionList
                revisions={revisions}
                onClickListItem={(revision) => onSelect(revision)}
            />
        </DialogContent>
    );
};

export default SelectRevision;
