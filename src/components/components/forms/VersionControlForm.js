import React, { useContext } from 'react';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import MissingPermission from '../MissingPermission';
import TextInput from '../inputs/TextInput';
import formatDate from '../../../utils/format-date';
import LanguageContext from '../../../context/LanguageContext';
import UserContext from '../../../context/UserContext';
import isPermitted from '../../../utils/is-permitted';

/**
 * Render version control form
 */
const VersionControlForm = ({ formValues, revisions, onChange }) => {
    const { language } = useContext(LanguageContext);
    const { user } = useContext(UserContext);
    const status = [
        { value: 'PRIVATE', label: language.dictionary.statusPrivate },
        { value: 'BETA', label: language.dictionary.statusBeta },
        { value: 'PUBLISHED', label: language.dictionary.statusPublished },
    ];

    return (
        <>
            <h2 className="">{language.dictionary.headerVersionControl}</h2>
            <div className="mb-4">
                <MissingPermission
                    show={!isPermitted(user, ['PUBLISH_KEY'])}
                    label={language.dictionary.notPublishKey}
                />
            </div>
            <TextInput
                name="version"
                label={language.dictionary.version}
                value={formValues.version}
                maxLength={30}
                onChange={onChange}
                disabled={!isPermitted(user, ['PUBLISH_KEY'])}
            />
            <FormControl variant="outlined" fullWidth>
                <InputLabel id="status-label" required>
                    {language.dictionary.labelStatus}
                </InputLabel>
                <Select
                    className="mb-8"
                    labelId="status-label"
                    id="status"
                    name="status"
                    value={formValues.status}
                    variant="outlined"
                    required
                    label={language.dictionary.labelStatus}
                    fullWidth
                    onChange={onChange}
                    disabled={!isPermitted(user, ['PUBLISH_KEY'])}
                >
                    {status.map((stat) => (
                        <MenuItem key={stat.value} value={stat.value}>{stat.label}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl variant="outlined" fullWidth>
                <InputLabel id="revision-label" required>
                    {language.dictionary.labelRevision}
                </InputLabel>
                <Select
                    className="mb-8"
                    labelId="revision-label"
                    id="revisionId"
                    name="revisionId"
                    value={formValues.revisionId}
                    variant="outlined"
                    required
                    label={language.dictionary.labelRevision}
                    fullWidth
                    onChange={onChange}
                    disabled={!isPermitted(user, ['PUBLISH_KEY'])}
                >
                    {revisions && revisions.map((revision) => (
                        <MenuItem key={revision.id} value={revision.id}>
                            {revision.note
                                ? `${revision.note} (${formatDate(revision.created_at)})`
                                : formatDate(revision.created_at)}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    );
};

export default VersionControlForm;
