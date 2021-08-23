import React, { useContext } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LanguageContext from '../../context/LanguageContext';
import RevisionList from '../components/lists/RevisionList';

/**
 * Render test key dialog
 */
const TestKey = ({
    openDialog, revisions, onSelect, onClose,
}) => {
    const { language } = useContext(LanguageContext);

    return (
        <Dialog
            fullWidth
            scroll="paper"
            open={openDialog}
            onClose={() => onClose()}
        >
            <div className="p-2">
                <DialogTitle>{language.dictionary.headerTestKey}</DialogTitle>
                <DialogContent>
                    <p className="mb-4">{language.dictionary.selectTestRevision}</p>
                    <RevisionList
                        revisions={revisions}
                        onClickListItem={(revision) => onSelect(revision.id)}
                    />
                </DialogContent>
            </div>
        </Dialog>
    );
};

export default TestKey;
