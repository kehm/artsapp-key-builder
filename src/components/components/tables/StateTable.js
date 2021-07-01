import React, { useContext, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Add from '@material-ui/icons/Add';
import DeleteOutlined from '@material-ui/icons/DeleteOutlined';
import LanguageContext from '../../../context/LanguageContext';
import FileDrop from '../inputs/FileDrop';
import SetMediaInfo from '../../dialogs/SetMediaInfo';
import UnsavedChanges from '../../dialogs/UnsavedChanges';
import TextInput from '../inputs/TextInput';

/**
 * Render state table
 */
const StateTable = ({
    tab, formValues, states, languages, onChangeState, onDeleteItem, onUpdateFiles,
}) => {
    const { language } = useContext(LanguageContext);
    const [openMediaDialog, setOpenMediaDialog] = useState({
        stateId: undefined,
        fileIndex: undefined,
        existing: false,
    });
    const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

    /**
     * Render text inputs for different languages
     *
     * @param {Object} state State
     * @param {int} index Index
     * @returns JSX
     */
    const renderTextInputs = (state, index) => {
        let title = '';
        let description = '';
        if (state.title) {
            if (tab === 0 && state.title.no) {
                title = state.title.no;
            } else if (tab === 1 && state.title.en) {
                title = state.title.en;
            }
        }
        if (state.description) {
            if (tab === 0 && state.description.no) {
                description = state.description.no;
            } else if (tab === 1 && state.description.en) {
                description = state.description.en;
            }
        }
        return (
            <>
                <TextInput
                    name={`stateTitleNo${index}`}
                    label={`${language.dictionary.labelAlternative} ${index + 1} (${language.dictionary.norwegianShort})`}
                    value={title || ''}
                    required={languages.langNo}
                    autoFocus
                    hidden={tab === 1}
                    maxLength={120}
                    onChange={(e) => onChangeState(index, 'title', e.target.value)}
                />
                <TextInput
                    name={`stateTitleEn${index}`}
                    label={`${language.dictionary.labelAlternative} ${index + 1} (${language.dictionary.englishShort})`}
                    value={title || ''}
                    required={languages.langEn}
                    hidden={tab === 0}
                    maxLength={120}
                    onChange={(e) => onChangeState(index, 'title', e.target.value)}
                />
                <TextInput
                    name={`stateDescriptionNo${index}`}
                    label={`${language.dictionary.labelDescription} (${language.dictionary.norwegianShort})`}
                    value={description}
                    hidden={tab === 1}
                    multitline
                    maxLength={280}
                    onChange={(e) => onChangeState(index, 'description', e.target.value)}
                />
                <TextInput
                    name={`stateDescriptionEn${index}`}
                    label={`${language.dictionary.labelDescription} (${language.dictionary.englishShort})`}
                    value={description}
                    hidden={tab === 0}
                    multitline
                    maxLength={280}
                    onChange={(e) => onChangeState(index, 'description', e.target.value)}
                />
            </>
        );
    };

    /**
     * Update files array
     *
     * @param {Array} files Files array
     * @param {Object} state State object
     * @param {boolean} existing True if updating an existing file
     */
    const updateFiles = (files, state, existing) => {
        const formFiles = [...formValues.stateFiles];
        const fileState = formFiles.find((element) => element.stateId === state.id);
        if (!fileState) {
            formFiles.push({ stateId: state.id, files });
        } else {
            if (existing) fileState.existingFiles = files;
            fileState.files = files;
        }
        onUpdateFiles(formFiles);
    };

    /**
     * Render file drop
     *
     * @param {Object} state State object
     * @returns JSX
     */
    const renderFileDrop = (state) => {
        const stateFile = formValues.stateFiles.find((element) => element.stateId === state.id);
        let existingFiles = [];
        if (stateFile && stateFile.existingFiles) {
            existingFiles = stateFile.existingFiles;
        }
        return (
            <FileDrop
                maxFiles={6}
                size="small"
                existingFiles={existingFiles}
                onUpdate={(files) => updateFiles(files, state)}
                onUpdateExisting={(files) => updateFiles(files, state, true)}
                onClickOpen={(fileIndex, existing) => setOpenMediaDialog({
                    stateId: state.id,
                    fileIndex,
                    existing,
                })}
            />
        );
    };

    /**
     * Render set media dialog
     *
     * @returns JSX
     */
    const renderSetMedia = () => {
        const stateFile = formValues.stateFiles.find(
            (element) => element.stateId === openMediaDialog.stateId,
        );
        let fileName = '';
        let fileInfo = '';
        if (openMediaDialog.existing) {
            fileName = stateFile.existingFiles[openMediaDialog.fileIndex].name;
            fileInfo = stateFile.existingFiles[openMediaDialog.fileIndex].fileInfo;
        } else {
            fileName = stateFile.files[openMediaDialog.fileIndex].name;
            fileInfo = stateFile.files[openMediaDialog.fileIndex].fileInfo;
        }
        return (
            <SetMediaInfo
                openDialog={openMediaDialog.stateId !== undefined}
                index={openMediaDialog.fileIndex}
                size="small"
                fileName={fileName}
                fileInfo={fileInfo}
                onClose={(unsaved) => {
                    if (unsaved) {
                        setShowUnsavedDialog(true);
                    } else {
                        setOpenMediaDialog({
                            stateId: undefined,
                            fileIndex: undefined,
                            existing: false,
                        });
                    }
                }}
                onUpdate={(index, values) => {
                    const arr = [...formValues.stateFiles];
                    const file = arr.find(
                        (element) => element.stateId === openMediaDialog.stateId,
                    );
                    if (openMediaDialog.existing) {
                        file.existingFiles[index].fileInfo = values;
                    } else file.files[index].fileInfo = values;
                    onUpdateFiles(arr);
                }}
            />
        );
    };

    return (
        <>
            <p>{language.dictionary.sectionTypeExlusiveMulti}</p>
            <TableContainer className="my-4">
                <Table aria-label="state table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <h2 className="font-light">
                                    {language.dictionary.headerStates}
                                </h2>
                            </TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {states && states.map((state, index) => (
                            <TableRow key={index}>
                                <TableCell component="th" scope="row">
                                    <span className="absolute right-10">
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() => onDeleteItem(state)}
                                        >
                                            <DeleteOutlined />
                                        </IconButton>
                                    </span>
                                    {renderTextInputs(state, index)}
                                    {renderFileDrop(state)}
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell component="th" scope="row">
                                {states && states.length === 0
                                    && language.dictionary.noAlternatives}
                                <IconButton
                                    color="primary"
                                    edge="end"
                                    aria-label="add"
                                    onClick={() => onChangeState()}
                                >
                                    <Add />
                                </IconButton>
                            </TableCell>
                            <TableCell align="right" />
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            {openMediaDialog.stateId !== undefined && renderSetMedia()}
            <UnsavedChanges
                openDialog={showUnsavedDialog}
                onClose={() => setShowUnsavedDialog(false)}
                onConfirm={() => setOpenMediaDialog({
                    stateId: undefined,
                    fileIndex: undefined,
                    existing: false,
                })}
            />
        </>
    );
};

export default StateTable;
