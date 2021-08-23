import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import Flip from '@material-ui/icons/Flip';
import Button from '@material-ui/core/Button';
import Add from '@material-ui/icons/Add';
import FlagOutlined from '@material-ui/icons/FlagOutlined';
import SaveOutlined from '@material-ui/icons/SaveOutlined';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import LanguageContext from '../../context/LanguageContext';
import { createRevision } from '../../utils/api/create';
import { getKey, getRevision } from '../../utils/api/get';
import CreateCharacter from '../dialogs/CreateCharacter';
import CreateTaxon from '../dialogs/CreateTaxon';
import CharacterCards from '../components/cards/CharacterCards';
import TaxaCards from '../components/cards/TaxaCards';
import TaxaList from '../components/lists/TaxaList';
import CharacterList from '../components/lists/CharacterList';
import UnsavedChanges from '../dialogs/UnsavedChanges';
import CreateRevisionNote from '../dialogs/CreateRevisionNote';
import BackButton from '../components/BackButton';
import { findParentTaxa, findTaxa, findTaxon } from '../../utils/taxon';
import SetRevisionStatus from '../dialogs/SetRevisionStatus';
import { findRevisionStatusName } from '../../utils/translation';
import ProgressIndicator from '../components/ProgressIndicator';
import { removeCharacterPremises } from '../../utils/character';

/**
 * Render build key page
 */
const BuildKey = () => {
    const { language } = useContext(LanguageContext);
    const { revisionId } = useParams();
    const history = useHistory();
    const [revision, setRevision] = useState(undefined);
    const [error, setError] = useState(undefined);
    const [openModal, setOpenModal] = useState({ open: undefined, id: undefined });
    const [sortByCharacters, setSortByCharacters] = useState(false);
    const [taxa, setTaxa] = useState([]);
    const [characters, setCharacters] = useState([]);
    const [selectedTaxon, setSelectedTaxon] = useState(undefined);
    const [selectedCharacter, setSelectedCharacter] = useState(undefined);
    const [characterSwitches, setCharacterSwitches] = useState({});
    const [taxaSwitches, setTaxaSwitches] = useState({});
    const [statements, setStatements] = useState([]);
    const [filterTaxonCharacters, setFilterTaxonCharacters] = useState('ALL');
    const [changesSaved, setChangesSaved] = useState(true);
    const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
    const [showProgress, setShowProgress] = useState(true);
    const [languages, setLanguages] = useState({
        langNo: false,
        langEn: false,
    });

    /**
     * Get revision from API
     */
    useEffect(() => {
        if (!revision) {
            getRevision(revisionId).then((rev) => {
                getKey(rev.keyId).then((key) => {
                    setLanguages({
                        langNo: key.languages.includes('no'),
                        langEn: key.languages.includes('en'),
                    });
                    setShowProgress(false);
                }).catch(() => setError(language.dictionary.internalAPIError));
                setRevision(rev);
                if (rev.content) {
                    if (rev.content.taxa && rev.content.taxa.length > 0) {
                        const switches = {};
                        rev.content.taxa.forEach((taxon) => {
                            switches[taxon.id] = -1;
                        });
                        setTaxa(rev.content.taxa);
                        if (!selectedTaxon) setSelectedTaxon(rev.content.taxa[0]);
                    }
                    if (rev.content.characters && rev.content.characters.length > 0) {
                        const switches = {};
                        rev.content.characters.forEach((character) => {
                            switches[character.id] = -1;
                        });
                        setCharacters(rev.content.characters);
                        if (!selectedCharacter) {
                            setSelectedCharacter(rev.content.characters[0]);
                        }
                    }
                    if (changesSaved && rev.content.statements) {
                        setStatements(rev.content.statements);
                    } else setStatements(statements);
                }
            }).catch(() => {
                setError(language.dictionary.internalAPIError);
                setShowProgress(false);
            });
        }
    }, [revisionId, revision, language]);

    /**
     * Set correct switches and checkboxes on selecting a new taxon
     */
    useEffect(() => {
        if (selectedTaxon && characters) {
            const arr = statements.filter((element) => element.taxonId === selectedTaxon.id);
            const switches = { ...characterSwitches };
            characters.forEach((character) => {
                if (arr.find((element) => element.characterId === character.id)) {
                    switches[character.id] = 0;
                } else switches[character.id] = -1;
            });
            setCharacterSwitches(switches);
        }
    }, [selectedTaxon, characters, statements, revisionId]);

    /**
     * Set correct switches and checkboxes on selecting a new character
     */
    useEffect(() => {
        if (selectedCharacter && taxa) {
            const arr = statements.filter(
                (element) => element.characterId === selectedCharacter.id,
            );
            const switches = { ...taxaSwitches };
            taxa.forEach((taxon) => { switches[taxon.id] = -1; });
            arr.forEach((element) => { switches[element.taxonId] = element.value || 0; });
            setTaxaSwitches(switches);
        }
    }, [selectedCharacter, taxa, statements, revisionId]);

    /**
     * Load new revision
     *
     * @param {string} id Revision ID
     */
    const handleCreated = (id) => {
        history.replace(`/build/${id}`);
        setRevision(undefined);
        setTaxa(undefined);
        setCharacters(undefined);
    };

    /**
     * Handle setting new revision
     *
     * @param {string} id Revision ID
     */
    const handleNewRevision = (id) => {
        handleCreated(id);
        setSelectedTaxon(undefined);
        setSelectedCharacter(undefined);
        setError(undefined);
        setOpenModal({ open: undefined, id: undefined });
    };

    /**
     * Create and load new revision
     *
     * @param {string} note Optional revision note
     * @param {string} status Optional revision status (defaults to DRAFT)
     */
    const saveChanges = async (note, status) => {
        try {
            let statementError = false;
            for (let i = 0; i < statements.length; i += 1) {
                if (!statements[i].value) {
                    statementError = true;
                    break;
                }
            }
            if (!statementError) {
                const content = { taxa, characters, statements };
                const revId = await createRevision({
                    keyId: revision.keyId,
                    content: JSON.stringify(content),
                    media: JSON.stringify(revision.media),
                    note,
                    status,
                });
                setChangesSaved(true);
                handleNewRevision(revId);
            } else setError(language.dictionary.stateError);
        } catch (err) {
            setError(language.dictionary.internalAPIError);
        }
    };

    /**
     * Show confirm dialog before closing the dialog if form has unsaved changes
     *
     * @param {boolean} unsaved True if unsaved changes
     */
    const handleCloseDialog = (unsaved) => {
        if (unsaved) {
            setShowUnsavedDialog(true);
        } else if (openModal.open) {
            setOpenModal({ open: undefined, id: undefined });
        } else history.goBack();
    };

    /**
     * Remove taxon/character and create new revision
     *
     * @param {string} field Field name
     * @param {int} id Object ID
     * @param {string} name Object name
     */
    const handleRemove = async (field, id, name) => {
        let valid = true;
        let note;
        let taxaArr = [...taxa];
        let charactersArr = [...characters];
        let statementsArr = [...statements];
        if (field === 'TAXA') {
            const taxon = findTaxon(taxa, id);
            if (taxon) {
                if (taxon.children && taxon.children.length > 0) {
                    valid = false;
                    setError(language.dictionary.errorRemoveTaxon);
                } else {
                    const parentTaxa = findParentTaxa(taxaArr, taxon.id);
                    if (parentTaxa.length > 0) taxaArr = parentTaxa[0].children;
                    if (taxaArr) {
                        taxaArr = taxaArr.filter((element) => element.id !== taxon.id);
                        statementsArr = statementsArr.filter((element) => element.taxonId !== id);
                        note = `Removed taxon ${name}`;
                    } else valid = false;
                }
            }
        } else if (field === 'CHARACTERS') {
            charactersArr = charactersArr.filter((element) => element.id !== id);
            charactersArr = removeCharacterPremises(id, charactersArr);
            statementsArr = statementsArr.filter((element) => element.characterId !== id);
            note = `Removed character ${name}`;
        }
        if (valid) {
            const content = {
                taxa: taxaArr,
                characters: charactersArr,
                statements: statementsArr,
            };
            const revId = await createRevision({
                keyId: revision.keyId,
                content: JSON.stringify(content),
                media: JSON.stringify(revision.media),
                note,
            });
            handleNewRevision(revId);
        } else window.scrollTo(0, 0);
        handleCloseDialog();
    };

    /**
     * Move character up or down in array
     *
     * @param {int} id Character ID
     * @param {string} direction Direction
     */
    const moveCharacter = (id, direction) => {
        if (revision) {
            const arr = [...characters];
            const from = arr && arr.findIndex((character) => character.id === id);
            if (from !== undefined && from > -1) {
                let to;
                if (direction === 'UP' && from > 0) {
                    to = from - 1;
                } else if (direction === 'DOWN' && from < arr.length) {
                    to = from + 1;
                }
                const character = arr.splice(from, 1)[0];
                arr.splice(to, 0, character);
                setCharacters(arr);
                setChangesSaved(false);
            }
        }
    };

    /**
      * Render taxon character filter
      *
      * @returns JSX
      */
    const renderTaxonCharacterFilter = () => (
        <RadioGroup
            aria-label="character type"
            name="characterType"
            value={filterTaxonCharacters}
            onChange={(e) => setFilterTaxonCharacters(e.target.value)}
        >
            <div className="xl:flex my-6">
                <span className="mt-2 mr-6 font-semibold">
                    {language.dictionary.show}
                </span>
                <FormControlLabel value="ALL" control={<Radio />} label={language.dictionary.all} />
                <FormControlLabel value="CATEGORICAL" control={<Radio />} label={language.dictionary.categorical} />
                <FormControlLabel value="NUMERICAL" control={<Radio />} label={language.dictionary.numerical} />
            </div>
        </RadioGroup>
    );

    /**
     * Render taxa/character lists
     *
     * @returns JSX
     */
    const renderLists = () => (
        <div className="grid grid-cols-2">
            {sortByCharacters ? (
                <>
                    <CharacterList
                        characters={characters}
                        selectedCharacter={selectedCharacter}
                        onSelectCharacter={(character) => setSelectedCharacter(character)}
                        onEditCharacter={(id) => setOpenModal({ open: 'CHARACTERS', id })}
                        onMoveCharacter={(id, direction) => moveCharacter(id, direction)}
                    />
                    {taxa && selectedCharacter ? (
                        <div className="overflow-auto">
                            <h2 className="mb-24">{language.dictionary.labelTaxa}</h2>
                            <TaxaCards
                                taxa={findTaxa(taxa)}
                                character={selectedCharacter}
                                statements={statements}
                                taxaSwitches={taxaSwitches}
                                onStateChange={(arr) => {
                                    setStatements(arr);
                                    setChangesSaved(false);
                                }}
                                onEditTaxon={(id) => setOpenModal({ open: 'TAXA', id })}
                            />
                        </div>
                    ) : <p className="mt-24">{language.dictionary.selectCharacter}</p>}
                </>
            ) : (
                <>
                    <TaxaList
                        taxa={taxa}
                        selectedTaxon={selectedTaxon}
                        onSelectTaxon={(taxon) => setSelectedTaxon(taxon)}
                        onEditTaxon={(id) => setOpenModal({ open: 'TAXA', id })}
                    />
                    {characters && selectedTaxon ? (
                        <div className="overflow-auto">
                            <h2>{language.dictionary.labelCharacters}</h2>
                            {renderTaxonCharacterFilter()}
                            <CharacterCards
                                characters={characters}
                                taxa={taxa}
                                statements={statements}
                                taxon={selectedTaxon}
                                characterSwitches={characterSwitches}
                                filter={filterTaxonCharacters}
                                revision={revision}
                                onStateChange={(arr) => {
                                    setStatements(arr);
                                    setChangesSaved(false);
                                }}
                                onEditCharacter={(id) => setOpenModal({ open: 'CHARACTERS', id })}
                                onCreatedPremise={(id) => handleCreated(id)}
                            />
                        </div>
                    ) : <p className="mt-24">{language.dictionary.selectTaxon}</p>}
                </>
            )}
        </div>
    );

    /**
     * Render action bar buttons
     *
     * @returns JSX
     */
    const renderActionBar = () => (
        <div className="md:flex relative mt-10">
            <Button
                variant="contained"
                color="secondary"
                size="medium"
                endIcon={<SaveOutlined />}
                onClick={() => setOpenModal({ open: 'SAVE', id: undefined })}
                disabled={changesSaved}
            >
                <span className="xl:hidden">{language.dictionary.btnSave}</span>
                <span className="hidden xl:inline">{language.dictionary.btnSaveChanges}</span>
            </Button>
            <span className="ml-4">
                <Button
                    variant="contained"
                    color="secondary"
                    size="medium"
                    endIcon={<Add />}
                    onClick={() => setOpenModal({ open: 'TAXA', id: undefined })}
                >
                    {language.dictionary.newTaxon}
                </Button>
            </span>
            <span className="ml-4">
                <Button
                    variant="contained"
                    color="secondary"
                    size="medium"
                    endIcon={<Add />}
                    onClick={() => setOpenModal({ open: 'CHARACTERS', id: undefined })}
                >
                    {language.dictionary.newCharacter}
                </Button>
            </span>
            <span className="ml-4">
                <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    endIcon={<Flip />}
                    type="button"
                    onClick={() => setSortByCharacters(!sortByCharacters)}
                >
                    {sortByCharacters
                        ? language.dictionary.btnSortTaxa
                        : language.dictionary.btnSortCharacters}
                </Button>
            </span>
            <span className="xl:absolute right-0 ml-4">
                <Button
                    variant="contained"
                    color="secondary"
                    size="medium"
                    endIcon={<FlagOutlined />}
                    onClick={() => setOpenModal({ open: 'STATUS', id: undefined })}
                    disabled={!changesSaved}
                >
                    <span className="xl:hidden">{language.dictionary.headerChangeStatus}</span>
                    <span className="hidden xl:inline">{`${language.dictionary.headerChangeStatus} ${revision ? `(${findRevisionStatusName(revision.status, language)})` : ''}`}</span>
                </Button>
            </span>
        </div>
    );

    /**
     * Render dialogs
     *
     * @returns JSX
     */
    const renderDialogs = () => (
        <>
            {openModal.open === 'TAXA' && (
                <CreateTaxon
                    openDialog={openModal.open === 'TAXA'}
                    revision={revision}
                    id={openModal.id}
                    languages={languages}
                    onClose={(unsaved) => handleCloseDialog(unsaved)}
                    onCreated={(id) => handleCreated(id)}
                    onRemove={(id, name) => handleRemove('TAXA', id, name)}
                />
            )}
            {openModal.open === 'CHARACTERS' && (
                <CreateCharacter
                    openDialog={openModal.open === 'CHARACTERS'}
                    revision={revision}
                    id={openModal.id}
                    languages={languages}
                    onClose={(unsaved) => handleCloseDialog(unsaved)}
                    onCreated={(id) => handleCreated(id)}
                    onRemove={(id, name) => handleRemove('CHARACTERS', id, name)}
                />
            )}
            {openModal.open === 'SAVE' && (
                <CreateRevisionNote
                    openDialog={openModal.open === 'SAVE'}
                    onClose={() => setOpenModal({ open: undefined, id: undefined })}
                    onCreate={(note) => saveChanges(note)}
                />
            )}
            {openModal.open === 'STATUS' && (
                <SetRevisionStatus
                    currentStatus={revision && revision.status}
                    revision={revision}
                    openDialog={openModal.open === 'STATUS'}
                    onClose={() => setOpenModal({ open: undefined, id: undefined })}
                    onUpdated={(close) => {
                        if (close) {
                            history.goBack();
                        } else setRevision(undefined);
                    }}
                />
            )}
            <UnsavedChanges
                openDialog={showUnsavedDialog}
                onClose={() => setShowUnsavedDialog(false)}
                onConfirm={() => handleCloseDialog()}
            />
        </>
    );

    return (
        <div className="relative py-14 px-4 lg:w-11/12 m-auto">
            <BackButton onClick={() => handleCloseDialog(!changesSaved)} />
            <div className="max-w-6xl mt-4">
                <h1>{language.dictionary.buildKey}</h1>
                <p className="my-4">{language.dictionary.rememberSave}</p>
            </div>
            {renderActionBar()}
            <hr className="mt-10 mb-6" />
            {error && <p className="text-red-600 mt-4">{error}</p>}
            {renderLists()}
            {renderDialogs()}
            <ProgressIndicator open={showProgress} />
        </div>
    );
};

export default BuildKey;
