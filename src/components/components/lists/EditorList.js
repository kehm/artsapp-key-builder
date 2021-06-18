import React, { useContext } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CancelOutlined from '@material-ui/icons/CancelOutlined';
import IconButton from '@material-ui/core/IconButton';
import LanguageContext from '../../../context/LanguageContext';

/**
 * Render editor list
 */
const EditorList = ({ editors, workgroup, onRemove }) => {
    const { language } = useContext(LanguageContext);

    return (
        <>
            {workgroup && (
                <p className="mb-4">
                    {language.dictionary.workgroupAccess}
                    <span className="font-bold">{workgroup.name}</span>
                    {language.dictionary.workgroupHasAccess}
                </p>
            )}
            {editors && editors.length > 0 ? (
                <>
                    <p className="my-4">{language.dictionary.sectionShareOverview}</p>
                    <List className="w-96">
                        {editors.map((editor) => (
                            <ListItem key={editor.id}>
                                <ListItemText primary={editor.artsapp_user ? editor.artsapp_user.name : ''} />
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge="end"
                                        aria-label="remove"
                                        onClick={() => onRemove(editor.id)}
                                    >
                                        <CancelOutlined />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </>
            ) : (
                <p className="mb-8">{workgroup ? language.dictionary.noKeyEditors : language.dictionary.notShared}</p>
            )}
        </>
    );
};

export default EditorList;
