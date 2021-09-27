import React, { useContext, useEffect, useState } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import CloseButton from '../components/buttons/CloseButton';
import LanguageContext from '../../context/LanguageContext';

/**
 * Render help dialog
 */
const Help = ({ openDialog, onClose }) => {
    const { language } = useContext(LanguageContext);
    const [content, setContent] = useState(undefined);

    /**
     * Set help dialog content based on window path
     */
    useEffect(() => {
        const path = window.location.pathname.split('/');
        if (path.length > 1) {
            switch (path[2]) {
                case 'groups':
                    setContent(language.dictionary.sectionCollections);
                    break;
                case 'workgroups':
                    setContent(language.dictionary.sectionWorkgroups);
                    break;
                case 'create':
                    setContent(language.dictionary.sectionNewKey);
                    break;
                case 'keys':
                    setContent(language.dictionary.sectionKeyInfo);
                    break;
                case 'edit':
                    setContent(language.dictionary.sectionNewKey);
                    break;
                case 'build':
                    setContent(language.dictionary.sectionBuildKey);
                    break;
                default:
                    setContent(language.dictionary.sectionMyKeys);
                    break;
            }
        } else setContent(language.dictionary.sectionMyKeys);
    }, [openDialog]);

    return (
        <Dialog onClose={() => onClose()} open={openDialog}>
            <div className="p-2">
                <DialogTitle>{language.dictionary.help}</DialogTitle>
                <DialogContent>
                    <CloseButton onClick={() => onClose()} />
                    <div className="mb-8" dangerouslySetInnerHTML={{ __html: content }} />
                </DialogContent>
            </div>
        </Dialog>
    );
};

export default Help;
