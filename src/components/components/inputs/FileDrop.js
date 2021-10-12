import React, { useContext, useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import LibraryBooksOutlined from '@material-ui/icons/LibraryBooksOutlined';
import HighlightOffOutlined from '@material-ui/icons/HighlightOffOutlined';
import IconButton from '@material-ui/core/IconButton';
import LanguageContext from '../../../context/LanguageContext';

/**
 * Render file dropzone
 */
const FileDrop = ({
    maxFiles, existingFiles, size, onUpdate, onUpdateExisting, onClickOpen,
}) => {
    const { language } = useContext(LanguageContext);
    const [files, setFiles] = useState([]);

    /**
     * Revoke data URIs to avoid memory leaks
     */
    useEffect(() => () => {
        files.forEach((file) => URL.revokeObjectURL(file.preview));
    }, [files]);

    /**
     * Add new dropped files to file array and assign URI for image preview
     *
     * @param {Array} dropped New dropped files
     */
    const handleDropFiles = (dropped) => {
        let arr = [...files];
        const existingLength = existingFiles ? existingFiles.length : 0;
        if (existingLength + arr.length + dropped.length <= maxFiles) {
            arr = arr.concat(
                dropped.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) })),
            );
            setFiles(arr);
            onUpdate(arr);
        }
    };

    /**
     * Remove file from array
     *
     * @param {Object} e Event
     * @param {int} index File index
     * @param {Object} media Existing media object (if exists)
     */
    const handleRemoveFile = (e, index, media) => {
        e.stopPropagation();
        if (media) {
            const arr = [...existingFiles];
            arr.splice(index, 1);
            onUpdateExisting(arr);
        } else {
            const arr = [...files];
            arr.splice(index, 1);
            setFiles(arr);
            onUpdate(arr);
        }
    };

    /**
     * Open image information dialog
     *
     * @param {Object} e Event
     * @param {int} index File index
     * @param {boolean} existing True if media already exists on server
     */
    const handleOpenDialog = (e, index, existing) => {
        e.stopPropagation();
        onClickOpen(index, existing);
    };

    /**
     * Render file item
     *
     * @param {Object} file File
     * @param {int} index File index
     * @param {boolean} existing True if file already exists on server
     * @returns JSX
     */
    const renderFileItem = (file, index, existing) => (
        <li key={index}>
            <div className="flex items-center">
                <p className={`${size === 'small' ? 'w-28' : 'w-72'} overflow-hidden overflow-ellipsis whitespace-nowrap`}>{file.name}</p>
                <p className="ml-4 w-28">{`${existing ? '' : ` - ${file.size} ${language.dictionary.bytes}`}`}</p>
                <div className="align-bottom ml-10">
                    <IconButton
                        edge="end"
                        aria-label="add-credits"
                        onClick={(e) => handleOpenDialog(e, index, existing)}
                    >
                        <LibraryBooksOutlined />
                    </IconButton>
                    <span className="ml-4">
                        <IconButton
                            edge="end"
                            aria-label="remove"
                            onClick={(e) => handleRemoveFile(e, index, existing)}
                        >
                            <HighlightOffOutlined />
                        </IconButton>
                    </span>
                </div>
            </div>
            <img
                className="h-24 my-2"
                src={existing ? `${process.env.REACT_APP_BUILDER_API_URL}/media/thumbnails/${file.id}` : file.preview}
                alt="File upload preview"
            />
        </li>
    );

    return (
        <FormControl variant="filled" fullWidth>
            <InputLabel id="file-drop-label">
                {`${language.dictionary.labelImages} (${language.dictionary.max} ${maxFiles} ${language.dictionary.files}, ${language.dictionary.maxSize})`}
            </InputLabel>
            <Dropzone
                onDrop={(dropped) => handleDropFiles(dropped)}
                accept="image/jpeg, image/png"
                maxFiles={maxFiles}
                maxSize={parseInt(process.env.REACT_APP_MAX_FILE_SIZE, 10)}
            >
                {({ getRootProps, getInputProps }) => (
                    <section>
                        <div
                            className="p-10 mb-6 border-solid border-2 rounded cursor-pointer text-gray-700"
                            {...getRootProps()}
                        >
                            <input {...getInputProps()} />
                            <div className="text-center mb-4">
                                <p className="mt-8">{language.dictionary.dragAndDrop}</p>
                                <p className="font-light text-sm mb-4">{`(${language.dictionary.acceptedFileTypes})`}</p>
                                <hr />
                            </div>
                            <div hidden={files.length === 0}>
                                <h3 className={`font-semibold mb-2 ${size === 'small' && '-ml-6'}`}>
                                    {language.dictionary.selectedFiles}
                                    :
                                </h3>
                                <ul className={`list-disc ${size !== 'small' && 'ml-10'}`}>
                                    {files.map((file, index) => renderFileItem(file, index, false))}
                                </ul>
                            </div>
                            <div className="mt-10" hidden={!existingFiles || existingFiles.length === 0}>
                                <h3 className={`font-semibold mb-2 ${size === 'small' && '-ml-6'}`}>
                                    {language.dictionary.existingFiles}
                                    :
                                </h3>
                                <ul className={`list-disc ${size !== 'small' && 'ml-10'}`}>
                                    {existingFiles && existingFiles.map(
                                        (file, index) => renderFileItem(file, index, true),
                                    )}
                                </ul>
                            </div>
                        </div>
                    </section>
                )}
            </Dropzone>
        </FormControl>
    );
};

export default FileDrop;
