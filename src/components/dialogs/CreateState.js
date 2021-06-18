import React, { useContext, useState } from 'react';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import PostAdd from '@material-ui/icons/PostAdd';
import SaveOutlined from '@material-ui/icons/SaveOutlined';
import DeleteOutlined from '@material-ui/icons/DeleteOutlined';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import DialogActions from '@material-ui/core/DialogActions';
import LanguageContext from '../../context/LanguageContext';
import TextInput from '../components/inputs/TextInput';
import LanguageBar from '../components/LanguageBar';
import { createCharacterState } from '../../utils/api/create';
import StateTable from '../components/tables/StateTable';

/**
 * Render create character state dialog
 */
const CreateState = ({
    id, languages, formValues, onStateChange, onInputChange, hidden,
    onUpdateFiles, onDeleteCharacter, onSubmit, onConfirmDelete, onPrev, error,
}) => {
    const { language } = useContext(LanguageContext);
    const [tab, setTab] = useState(0);
    const [stateError, setStateError] = useState(false);
    const types = [
        { value: 'EXCLUSIVE', label: language.dictionary.exclusive },
        { value: 'MULTISTATE', label: language.dictionary.multistate },
        { value: 'NUMERICAL', label: language.dictionary.numerical },
    ];

    /**
     * Add/change state in state list
     *
     * @param {int} index State index
     * @param {string} field Field name
     * @param {string} val New value
     */
    const handleStateChange = async (index, field, val) => {
        const arr = [...formValues.alternatives];
        if (index !== undefined && arr.length > index) {
            if (field === 'description') {
                if (arr[index].description === undefined) arr[index].description = {};
                if (tab === 0) {
                    arr[index].description.no = val.descriptionNo;
                } else arr[index].description.en = val.descriptionEn;
            } else if (field === 'title') {
                arr[index].title[tab === 0 ? 'no' : 'en'] = val;
            }
        } else {
            try {
                const stateId = await createCharacterState({
                    keyId: formValues.keyId,
                    characterId: id,
                });
                arr.push({ id: stateId, title: { [tab === 0 ? 'no' : 'en']: val }, description: {} });
                setStateError(false);
            } catch (err) {
                setStateError(true);
            }
        }
        onStateChange(arr);
    };

    /**
     * Remove state from state list
     *
     * @param {*} state State
     * @param {boolean} confirm True if confirmation is required
     */
    const handleDeleteState = (state, confirm) => {
        if (confirm) {
            onConfirmDelete(state);
        } else {
            const arr = [...formValues.alternatives];
            const index = arr.indexOf(state);
            if (index > -1) {
                arr.splice(index, 1);
                onStateChange(arr);
            }
        }
    };

    /**
     * Render inputs for numerical character
     *
     * @returns JSX
     */
    const renderNumericalInputs = () => (
        <>
            <p className="mb-6">{language.dictionary.sectionTypeNumerical}</p>
            {id && <p className="mb-8">{language.dictionary.sectionChangeNumerical}</p>}
            <div className="flex mb-10">
                <div className="w-60">
                    <TextInput
                        name="unitNo"
                        label={`${language.dictionary.labelUnit} (${language.dictionary.norwegianShort})`}
                        value={formValues.unitNo}
                        required={languages.langNo}
                        autoFocus
                        hidden={tab === 1}
                        maxLength={60}
                        onChange={(e) => onInputChange(e)}
                    />
                    <TextInput
                        name="unitEn"
                        label={`${language.dictionary.labelUnit} (${language.dictionary.englishShort})`}
                        value={formValues.unitEn}
                        required={languages.langEn}
                        autoFocus
                        hidden={tab === 0}
                        maxLength={60}
                        onChange={(e) => onInputChange(e)}
                    />
                    <TextField
                        required
                        id="min"
                        name="min"
                        type="number"
                        label={language.dictionary.labelMin}
                        variant="outlined"
                        fullWidth
                        value={formValues.min}
                        onChange={(e) => onInputChange(e)}
                        inputProps={{
                            min: -999999,
                            max: formValues.max,
                            step: formValues.stepSize,
                        }}
                    />
                </div>
                <div className="w-60">
                    <TextField
                        required
                        id="stepSize"
                        name="stepSize"
                        type="number"
                        fullWidth
                        label={language.dictionary.labelStepSize}
                        variant="outlined"
                        value={formValues.stepSize}
                        onChange={(e) => onInputChange(e)}
                        inputProps={{
                            min: 0,
                            max: formValues.max - formValues.min,
                            step: 0.000001,
                        }}
                    />
                    <TextField
                        required
                        id="max"
                        name="max"
                        type="number"
                        label={language.dictionary.labelMax}
                        variant="outlined"
                        fullWidth
                        value={formValues.max}
                        onChange={(e) => onInputChange(e)}
                        inputProps={{ min: formValues.min, max: 999999, step: formValues.stepSize }}
                    />
                </div>
            </div>
        </>
    );

    /**
     * Render type select
     *
     * @returns JSX
     */
    const renderTypeSelect = () => (
        <div className="mb-4">
            <FormControl variant="outlined" fullWidth>
                <InputLabel id="type-label" required>
                    {language.dictionary.labelType}
                </InputLabel>
                <Select
                    className="mb-6"
                    labelId="type-label"
                    id="type"
                    name="type"
                    value={formValues.type}
                    variant="outlined"
                    required
                    disabled={id !== undefined || formValues.alternatives.length > 0}
                    label={language.dictionary.labelType}
                    fullWidth
                    onChange={(e) => onInputChange(e)}
                >
                    {types.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                            {type.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );

    /**
     * Render dialog action buttons
     *
     * @returns JSX
     */
    const renderActions = () => (
        <DialogActions>
            <span className="absolute left-8">
                <Button
                    variant="contained"
                    color="default"
                    size="large"
                    startIcon={<NavigateBefore />}
                    onClick={() => onPrev()}
                >
                    {language.dictionary.btnPrev}
                </Button>
            </span>
            {id && (
                <IconButton edge="start" aria-label="delete" onClick={() => onDeleteCharacter()}>
                    <DeleteOutlined />
                </IconButton>
            )}
            <Button
                variant="contained"
                color="secondary"
                size="large"
                endIcon={id ? <SaveOutlined /> : <PostAdd />}
                type="button"
                onClick={() => onSubmit()}
                disabled={formValues.type === ''
                    || ((formValues.type === 'EXCLUSIVE'
                        || formValues.type === 'MULTISTATE')
                        && formValues.alternatives.length < 2)}
            >
                {id ? language.dictionary.btnSaveChanges : language.dictionary.btnAdd}
            </Button>
        </DialogActions>
    );

    return (
        <div hidden={hidden}>
            <p className="mb-8">{language.dictionary.sectionCharacterType}</p>
            {renderTypeSelect()}
            {formValues.type && (
                <LanguageBar
                    tab={tab}
                    requireNo={languages.langNo}
                    requireEn={languages.langEn}
                    onTabChange={(val) => setTab(val)}
                />
            )}
            {(formValues.type === 'EXCLUSIVE' || formValues.type === 'MULTISTATE') && (
                <StateTable
                    formValues={formValues}
                    tab={tab}
                    states={formValues.alternatives}
                    languages={languages}
                    onChangeState={(index, field, val) => handleStateChange(index, field, val)}
                    onDeleteItem={(state) => handleDeleteState(state, true)}
                    onUpdateFiles={(stateFiles) => onUpdateFiles(stateFiles)}
                />
            )}
            {formValues.type === 'NUMERICAL' && renderNumericalInputs()}
            {error && <p className="text-red-600 mb-4">{error}</p>}
            {stateError && <p className="text-red-600 mb-4">{language.dictionary.internalAPIError}</p>}
            {renderActions()}
        </div>
    );
};

export default CreateState;
