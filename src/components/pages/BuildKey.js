import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
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
import BackButton from '../components/buttons/BackButton';
import { findParentTaxa, findTaxa, findTaxon } from '../../utils/taxon';
import SetRevisionStatus from '../dialogs/SetRevisionStatus';
import ProgressIndicator from '../components/ProgressIndicator';
import { removeCharacterPremises } from '../../utils/character';
import SetRevisionMode from '../dialogs/SetRevisionMode';
import AddButton from '../components/buttons/AddButton';
import CharacterFilter from '../components/inputs/CharacterFilter';
import BuildKeyActionBar from '../components/buttons/BuildKeyActionBar';

/**
 * Render build key page
 */
const BuildKey = ({ onSetTitle }) => {
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
     * Get key revision from API
     */
    const getKeyRevision = async () => {
        try {
            onSetTitle(language.dictionary.buildKey);
            const rev = await getRevision(revisionId);
            const key = await getKey(rev.keyId);
            setRevision(rev);
            setLanguages({
                langNo: key.languages.includes('no'),
                langEn: key.languages.includes('en'),
            });
            if (rev.content) {
                if (rev.content.taxa && rev.content.taxa.length > 0) {
                    const switches = {};
                    rev.content.taxa.forEach((taxon) => { switches[taxon.id] = -1; });
                    setTaxa(rev.content.taxa);
                    if (!selectedTaxon) setSelectedTaxon(rev.content.taxa[0]);
                }
                if (rev.content.characters && rev.content.characters.length > 0) {
                    const switches = {};
                    rev.content.characters.forEach((character) => { switches[character.id] = -1; });
                    setCharacters(rev.content.characters);
                    if (!selectedCharacter) setSelectedCharacter(rev.content.characters[0]);
                }
                if (changesSaved && rev.content.statements) {
                    setStatements(rev.content.statements);
                } else setStatements(statements);
            }
        } catch (err) {
            setError(language.dictionary.internalAPIError);
        } finally {
            setShowProgress(false);
        }
    };

    /**
     * Get revision from API
     */
    useEffect(() => {
        if (!revision) getKeyRevision();
    }, [revisionId, revision]);

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
                    mode: revision.mode,
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
                mode: revision.mode,
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
     * Render taxa/character lists
     *
     * @returns JSX
     */
    const renderLists = () => (
        <div className="grid grid-cols-2 h-full pb-16 lg:pb-2">
            {sortByCharacters ? (
                <>
                    <CharacterList
                        characters={characters}
                        selectedCharacter={selectedCharacter}
                        onSelectCharacter={(character) => setSelectedCharacter(character)}
                        onEditCharacter={(id) => setOpenModal({ open: 'CHARACTERS', id })}
                        onMoveCharacter={(id, direction) => moveCharacter(id, direction)}
                        onClickAdd={() => setOpenModal({ open: 'CHARACTERS', id: undefined })}
                        onChangeSort={() => setSortByCharacters(!sortByCharacters)}
                    />
                    {taxa && selectedCharacter ? (
                        <div className="h-full overflow-hidden pb-36">
                            <div className="pb-20">
                                <AddButton
                                    label={language.dictionary.labelTaxa}
                                    onClick={() => setOpenModal({ open: 'TAXA', id: undefined })}
                                />
                            </div>
                            <hr />
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
                        onClickAdd={() => setOpenModal({ open: 'TAXA', id: undefined })}
                        onChangeSort={() => setSortByCharacters(!sortByCharacters)}
                    />
                    {characters && selectedTaxon ? (
                        <div className="h-full overflow-hidden pb-36">
                            <AddButton
                                label={language.dictionary.labelCharacters}
                                onClick={() => setOpenModal({ open: 'CHARACTERS', id: undefined })}
                            />
                            <CharacterFilter
                                filter={filterTaxonCharacters}
                                onChange={(e) => setFilterTaxonCharacters(e.target.value)}
                            />
                            <hr />
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
            {openModal.open === 'MODE' && (
                <SetRevisionMode
                    currentMode={revision && revision.mode}
                    revision={revision}
                    openDialog={openModal.open === 'MODE'}
                    onClose={() => setOpenModal({ open: undefined, id: undefined })}
                    onCreated={(id) => handleCreated(id)}
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
        <div className="relative py-14 pl-2 m-auto h-screen overflow-hidden xl:ml-8">
            <BackButton onClick={() => handleCloseDialog(!changesSaved)} />
            {error && <p className="text-red-600 mt-4">{error}</p>}
            <BuildKeyActionBar
                revision={revision}
                changesSaved={changesSaved}
                onOpenModal={(open) => setOpenModal({ open, id: undefined })}
                onChangeSort={() => setSortByCharacters(!sortByCharacters)}
            />
            {renderLists()}
            {renderDialogs()}
            <ProgressIndicator open={showProgress} />
        </div>
    );
};

export default BuildKey;
