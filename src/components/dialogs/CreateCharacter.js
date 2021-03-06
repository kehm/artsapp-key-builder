import React, {
    useContext, useEffect, useState, useRef,
} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LanguageContext from '../../context/LanguageContext';
import { createCharacter } from '../../utils/api/create';
import { updateCharacter, updateStatePremises } from '../../utils/api/update';
import CloseButton from '../components/buttons/CloseButton';
import ConfirmDelete from './ConfirmDelete';
import SetMediaInfo from './SetMediaInfo';
import UnsavedChanges from './UnsavedChanges';
import { convertEditorToHtml, getCategoricalCharacterInfoValues, getNumericalCharacterInfoValues } from '../../utils/form-values';
import getInputChange from '../../utils/input-change';
import { handleUpdateRevisionMedia } from '../../utils/media';
import ProgressIndicator from '../components/ProgressIndicator';
import CreateState from './CreateState';
import { isValid } from '../../utils/character';
import InfoInputs from '../components/inputs/InfoInputs';
import LanguageBar from '../components/LanguageBar';
import DialogButtons from '../components/buttons/DialogButtons';

/**
 * Render create character dialog
 */
const CreateCharacter = ({
    openDialog, revision, id, languages, onClose, onCreated, onRemove,
}) => {
    const { language } = useContext(LanguageContext);
    const [defaultFormValues, setDefaultFormValues] = useState({
        titleNo: '',
        titleEn: '',
        descriptionNo: '',
        descriptionEn: '',
        type: '',
        alternatives: [],
        min: '',
        max: '',
        stepSize: 1,
        unitNo: '',
        unitEn: '',
        keyId: revision && revision.keyId,
        revisionId: revision && revision.id,
        files: [],
        existingFiles: [],
        characterMedia: undefined,
        stateFiles: [],
    });
    const [formValues, setFormValues] = useState(defaultFormValues);
    const [openMediaDialog, setOpenMediaDialog] = useState({ index: undefined, existing: false });
    const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
    const [showProgress, setShowProgress] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState({ open: undefined });
    const [error, setError] = useState(undefined);
    const [tab, setTab] = useState(0);
    const [step, setStep] = useState(0);
    const editorRef = useRef();
    const [existingStates, setExistingStates] = useState(undefined);

    /**
     * Set default values if edit
     */
    useEffect(() => {
        if (id && revision && revision.content && revision.content.characters) {
            const character = revision.content.characters.find((element) => element.id === id);
            if (character) {
                if (Array.isArray(character.states)) {
                    setExistingStates(character.states.map((element) => element.id));
                    getCategoricalCharacterInfoValues(
                        character,
                        formValues,
                        revision.media,
                    ).then((values) => {
                        setDefaultFormValues(JSON.parse(JSON.stringify(values)));
                        setFormValues(values);
                    }).catch(() => setError(language.dictionary.internalAPIError));
                } else {
                    getNumericalCharacterInfoValues(
                        character,
                        formValues,
                        revision.media,
                    ).then((values) => {
                        setDefaultFormValues(JSON.parse(JSON.stringify(values)));
                        setFormValues(values);
                    }).catch(() => setError(language.dictionary.internalAPIError));
                }
            }
        }
    }, [id, revision, language]);

    /**
     * Extend file array on new alternative
     */
    useEffect(() => {
        if (formValues.stateFiles.length < formValues.alternatives.length) {
            const arr = [...formValues.stateFiles];
            arr.push({ files: [] });
            setFormValues({ ...formValues, stateFiles: arr });
        }
    }, [formValues]);

    /**
     * Update logical premises affected by the changed alternatives
     *
     * @param {Array} activeStates State IDs currently active
     */
    const updateCategoricalPremises = async (activeStates) => {
        try {
            const states = [];
            existingStates.forEach((element) => {
                if (!activeStates.includes(element)) states.push(element);
            });
            await updateStatePremises(revision, states);
        } catch (err) { }
    };

    /**
     * Check if any alternatives have been removed
     *
     * @param {Array} alternatives States IDs array
     */
    const checkAlternatives = async (alternatives) => {
        const arr = [];
        alternatives.forEach((element) => {
            if (existingStates.includes(element)) arr.push(element);
        });
        if (arr.length !== existingStates.length) await updateCategoricalPremises(arr);
    };

    /**
     * Validate submission data and show progress indicator if successful
     */
    const handleSubmit = async () => {
        try {
            if (JSON.stringify(formValues) !== JSON.stringify(defaultFormValues)) {
                if (isValid(formValues, languages)) {
                    setShowProgress(true);
                } else {
                    setShowProgress(false);
                    setError(language.dictionary.missingRequired);
                }
            } else {
                setShowProgress(false);
                setError(undefined);
                onClose();
            }
        } catch (err) {
            setShowProgress(false);
            setError(language.dictionary.internalAPIError);
        }
    };

    /**
     * Submit to API
     */
    const submit = async () => {
        try {
            const promises = [];
            let values = { ...formValues };
            values = convertEditorToHtml(values);
            delete values.files;
            let revisionId;
            let characterId = id;
            if (id) {
                revisionId = await updateCharacter(id, values);
                if (values.type !== 'NUMERICAL') {
                    await checkAlternatives(values.alternatives.map((element) => element.id));
                }
            } else {
                const created = await createCharacter(values);
                characterId = created.characterId;
                revisionId = created.revisionId;
            }
            await handleUpdateRevisionMedia(
                formValues.keyId,
                revisionId,
                characterId,
                'character',
                formValues.files,
                formValues.characterMedia,
                formValues.existingFiles,
            );
            formValues.stateFiles.forEach((stateFile) => {
                promises.push(new Promise((resolve, reject) => {
                    handleUpdateRevisionMedia(
                        formValues.keyId,
                        revisionId,
                        characterId,
                        'state',
                        stateFile.files,
                        stateFile.stateMedia,
                        stateFile.existingFiles,
                        stateFile.stateId,
                    ).then(() => {
                        resolve();
                    }).catch((err) => reject(err));
                }));
            });
            Promise.all(promises).then(() => {
                onCreated(revisionId);
                setError(undefined);
                setShowProgress(false);
                onClose();
            }).catch(() => {
                setShowProgress(false);
                setError(language.dictionary.internalAPIError);
            });
        } catch (err) {
            setShowProgress(false);
            setError(language.dictionary.internalAPIError);
        }
    };

    /**
     * Submit to API on progress
     */
    useEffect(() => {
        if (showProgress) submit();
    }, [showProgress]);

    /**
     * Check if required fields are present
     */
    const handleNext = () => {
        if (languages.langEn && formValues.titleEn === '') {
            setError(language.dictionary.missingRequired);
        } else if (languages.langNo && formValues.titleNo === '') {
            setError(language.dictionary.missingRequired);
        } else {
            setError(undefined);
            setStep(1);
        }
    };

    /**
      * Delete character
      *
      * @param {boolean} confirm True if confirmation is required
      */
    const handleDelete = async (confirm) => {
        if (confirm) {
            setConfirmDelete({ open: 'CHARACTER' });
        } else onRemove(id, defaultFormValues.titleEn !== '' ? defaultFormValues.titleEn : defaultFormValues.titleNo);
    };

    /**
     * Remove state from state list
     *
     * @param {Object} state State
     * @param {boolean} confirm True if confirmation is required
     */
    const handleDeleteState = (state, confirm) => {
        if (confirm) {
            setConfirmDelete({ open: state });
        } else {
            const arr = [...formValues.alternatives];
            const index = arr.indexOf(state);
            if (index > -1) {
                arr.splice(index, 1);
                setFormValues({
                    ...formValues,
                    alternatives: arr,
                });
            }
        }
    };

    /**
     * Render inputs for character info
     *
     * @returns JSX
     */
    const renderCharacterInputs = () => (
        <form autoComplete="off" hidden={step === 1}>
            <p>{`${language.dictionary.sectionNewCharacter} ${language.dictionary.activeLanguages}:`}</p>
            <ul className="font-semibold">
                {languages.langNo && <li>{language.dictionary.norwegian}</li>}
                {languages.langEn && <li>{language.dictionary.english}</li>}
            </ul>
            <p className="mb-8">{language.dictionary.changeLanguages}</p>
            <LanguageBar
                tab={tab}
                showNo
                showEn
                requireNo={languages.langNo}
                requireEn={languages.langEn}
                onChangeTab={(val) => setTab(val)}
            />
            <InfoInputs
                names={['titleNo', 'titleEn']}
                formValues={formValues}
                tab={tab}
                languages={languages}
                editorRef={editorRef}
                onChange={(val) => setFormValues(val)}
                onOpenFileDrop={(index, existing) => setOpenMediaDialog({
                    index,
                    existing,
                })}
            />
            {error && <p className="text-red-600 mb-4">{error}</p>}
            <DialogButtons
                exists={id}
                showNext
                onNext={() => handleNext()}
                onDelete={() => handleDelete(true)}
            />
        </form>
    );

    /**
     * Render inputs for state info
     *
     * @returns JSX
     */
    const renderStateInputs = () => (
        <CreateState
            hidden={step === 0}
            id={id}
            languages={languages}
            formValues={formValues}
            onInputChange={(e) => setFormValues(getInputChange(e, formValues))}
            onStateChange={(alternatives) => setFormValues({
                ...formValues,
                alternatives,
            })}
            onUpdateFiles={(stateFiles) => setFormValues({ ...formValues, stateFiles })}
            onDeleteCharacter={() => handleDelete(true)}
            onSubmit={() => handleSubmit()}
            onSuccess={() => setShowProgress(false)}
            onConfirmDelete={(state) => setConfirmDelete({ open: state })}
            onPrev={() => setStep(0)}
            error={error}
        />
    );

    /**
     * Render dialogs
     *
     * @returns JSX
     */
    const renderDialogs = () => (
        <>
            {openMediaDialog.index !== undefined && (
                <SetMediaInfo
                    size="small"
                    openDialog={openMediaDialog.index !== undefined}
                    index={openMediaDialog.index}
                    fileName={openMediaDialog.existing
                        ? formValues.existingFiles[openMediaDialog.index].name
                        : formValues.files[openMediaDialog.index].name}
                    fileInfo={openMediaDialog.existing
                        ? formValues.existingFiles[openMediaDialog.index].fileInfo
                        : formValues.files[openMediaDialog.index].fileInfo}
                    onClose={(unsaved) => {
                        if (unsaved) {
                            setShowUnsavedDialog(true);
                        } else setOpenMediaDialog({ index: undefined, existing: false });
                    }}
                    onUpdate={(index, values) => {
                        if (openMediaDialog.existing) {
                            const arr = [...formValues.existingFiles];
                            arr[index].fileInfo = values;
                            setFormValues({ ...formValues, existingFiles: arr });
                        } else {
                            const arr = [...formValues.files];
                            arr[index].fileInfo = values;
                            setFormValues({ ...formValues, files: arr });
                        }
                    }}
                />
            )}
            <ConfirmDelete
                openDialog={confirmDelete.open !== undefined}
                onClose={() => setConfirmDelete({ open: undefined })}
                onConfirm={() => {
                    if (confirmDelete.open === 'CHARACTER') {
                        handleDelete();
                    } else handleDeleteState(confirmDelete.open);
                }}
            />
            <UnsavedChanges
                openDialog={showUnsavedDialog}
                onClose={() => setShowUnsavedDialog(false)}
                onConfirm={() => setOpenMediaDialog({ index: undefined, existing: false })}
            />
        </>
    );

    return (
        <Dialog
            fullWidth
            scroll="paper"
            open={openDialog}
            onClose={() => onClose(
                JSON.stringify(formValues) !== JSON.stringify(defaultFormValues),
            )}
        >
            <div className="p-2">
                <DialogTitle>
                    {id ? language.dictionary.editCharacter : language.dictionary.newCharacter}
                    <span className="font-light">
                        {` (${language.dictionary.labelStep} ${step + 1}/2)`}
                    </span>
                </DialogTitle>
                <DialogContent>
                    <CloseButton
                        onClick={() => onClose(
                            JSON.stringify(formValues) !== JSON.stringify(defaultFormValues),
                        )}
                    />
                    {renderCharacterInputs()}
                    {renderStateInputs()}
                </DialogContent>
            </div>
            {renderDialogs()}
            <ProgressIndicator open={showProgress} />
        </Dialog>
    );
};

export default CreateCharacter;
