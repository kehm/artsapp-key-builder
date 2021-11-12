import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LanguageContext from '../../../context/LanguageContext';
import getInputChange from '../../../utils/input-change';
import FileDrop from './FileDrop';
import RichEditor from './RichEditor';
import TextInput from './TextInput';

// Set editor height
const useStyles = makeStyles(() => ({
    editor: {
        height: '8.9rem',
    },
}));

/**
 * Render inputs for no/en title, description and file
 */
const InfoInputs = ({
    names, title, formValues, tab, languages, editorRef, onChange, onOpenFileDrop,
}) => {
    const { language } = useContext(LanguageContext);
    const classes = useStyles();

    return (
        <>
            <TextInput
                name={names[0]}
                label={`${title || language.dictionary.labelTitle} (${language.dictionary.norwegianShort})`}
                value={formValues[names[0]]}
                required={tab === 0 && languages.langNo}
                autoFocus
                hidden={tab === 1}
                maxLength={120}
                onChange={(e) => onChange(getInputChange(e, formValues))}
            />
            <TextInput
                name={names[1]}
                label={`${title || language.dictionary.labelTitle} (${language.dictionary.englishShort})`}
                value={formValues[names[1]]}
                required={tab === 1 && languages.langEn}
                autoFocus
                hidden={tab === 0}
                maxLength={120}
                onChange={(e) => onChange(getInputChange(e, formValues))}
            />
            <RichEditor
                id="descriptionNo"
                ref={editorRef}
                hidden={tab === 1}
                size="small"
                defaultValue={formValues.descriptionNo}
                label={`${language.dictionary.labelDescription} (${language.dictionary.norwegianShort})...`}
                labelMaxLength={language.dictionary.maxLengthEditor}
                onSave={(data) => onChange({ ...formValues, descriptionNo: data })}
                editorClass={classes.editor}
            />
            <RichEditor
                id="descriptionEn"
                ref={editorRef}
                hidden={tab === 0}
                size="small"
                defaultValue={formValues.descriptionEn}
                label={`${language.dictionary.labelDescription} (${language.dictionary.englishShort})...`}
                labelMaxLength={language.dictionary.maxLengthEditor}
                onSave={(data) => onChange({ ...formValues, descriptionEn: data })}
                editorClass={classes.editor}
            />
            <hr className="mb-6" />
            <FileDrop
                maxFiles={6}
                size="small"
                existingFiles={formValues.existingFiles}
                onUpdate={(files) => onChange({ ...formValues, files })}
                onUpdateExisting={(files) => onChange({
                    ...formValues,
                    existingFiles: files,
                })}
                onClickOpen={(index, existing) => onOpenFileDrop(index, existing)}
            />
        </>
    );
};

export default InfoInputs;
