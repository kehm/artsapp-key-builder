import React, { useContext, useRef } from 'react';
import TextInput from '../inputs/TextInput';
import LanguageContext from '../../../context/LanguageContext';
import RichEditor from '../inputs/RichEditor';
import FileDrop from '../inputs/FileDrop';

/**
 * Render key info form
 */
const KeyInfoForm = ({
    formValues, languages, selectedLanguage, onChange,
    onUpdate, onOpenMediaDialog,
}) => {
    const { language } = useContext(LanguageContext);
    const editorRef = useRef();

    return (
        <>
            <TextInput
                name="titleNo"
                label={`${language.dictionary.labelKeyName} (${language.dictionary.norwegianShort})`}
                value={formValues.titleNo}
                required={selectedLanguage === 'no' && languages.no}
                autoFocus
                hidden={selectedLanguage !== 'no'}
                maxLength={60}
                onChange={onChange}
            />
            <TextInput
                name="titleEn"
                label={`${language.dictionary.labelKeyName} (${language.dictionary.englishShort})`}
                value={formValues.titleEn}
                required={selectedLanguage === 'en' && languages.en}
                autoFocus
                hidden={selectedLanguage !== 'en'}
                maxLength={60}
                onChange={onChange}
            />
            <RichEditor
                id="descriptionNo"
                ref={editorRef}
                hidden={selectedLanguage !== 'no'}
                defaultValue={formValues.descriptionNo}
                label={`${language.dictionary.labelDescription} (${language.dictionary.norwegianShort})...`}
                labelMaxLength={language.dictionary.maxLengthEditor}
                onSave={(data) => onUpdate(data, 'descriptionNo')}
            />
            <RichEditor
                id="descriptionEn"
                ref={editorRef}
                hidden={selectedLanguage !== 'en'}
                defaultValue={formValues.descriptionEn}
                label={`${language.dictionary.labelDescription} (${language.dictionary.englishShort})...`}
                labelMaxLength={language.dictionary.maxLengthEditor}
                onSave={(data) => onUpdate(data, 'descriptionEn')}
            />
            <hr className="mb-6" />
            <FileDrop
                maxFiles={6}
                existingFiles={formValues.existingFiles}
                onUpdate={(files) => onUpdate(files, 'files')}
                onUpdateExisting={(files) => onUpdate(files, 'existingFiles')}
                onClickOpen={(index, existing) => onOpenMediaDialog(index, existing)}
            />
        </>
    );
};

export default KeyInfoForm;
