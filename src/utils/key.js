import { convertToRaw } from 'draft-js';
import { stateFromHTML } from 'draft-js-import-html';
import { getOrganizations, getRevisions } from './api/get';
import { getFileArray } from './media';

/**
 * Get values from key info
 *
 * @param {Object} key Key object
 * @param {boolean} organizations Organizations list
 * @param {Object} exValues Existing form values
 * @returns {Object} Form values
 */
export const getKeyInfoValues = (key, organizations, exValues) => {
    const publishers = key.publishers && key.publishers.map(
        (publisher) => organizations.find((org) => org.id === publisher),
    );
    const infoNo = key.key_info && key.key_info.find((element) => element.languageCode === 'no');
    const infoEn = key.key_info && key.key_info.find((element) => element.languageCode === 'en');
    return {
        ...exValues,
        status: key.status || '',
        version: key.version || '',
        titleNo: infoNo && infoNo.title ? infoNo.title : '',
        titleEn: infoEn && infoEn.title ? infoEn.title : '',
        descriptionNo: infoNo && infoNo.description
            ? JSON.stringify(convertToRaw(stateFromHTML(infoNo.description))) : '',
        descriptionEn: infoEn && infoEn.description
            ? JSON.stringify(convertToRaw(stateFromHTML(infoEn.description))) : '',
        revisionId: key.revisionId || '',
        collections: key.collections || [],
        creators: key.creators || [],
        contributors: key.contributors || [],
        publishers: publishers || [],
        groupId: key.keyGroupId || '',
        workgroupId: key.workgroupId || '',
        licenseUrl: key.licenseUrl || '',
        existingFiles: getFileArray(key.media),
    };
};

/**
 * Get active languages for key
 *
 * @param {Array} languages Languages
 * @returns {Object} Object with true/false values for languages
 */
export const getKeyLanguages = (languages) => {
    const keyLanguages = {
        no: languages.includes('no'),
        en: languages.includes('en'),
    };
    return keyLanguages;
};

/**
 * Get revisions, collections, groups and organizations for a key
 *
 * @param {string} keyId Key ID
 * @returns {Object} Object with revisions and organizations
 */
export const getKeyMetadata = async (keyId, language) => {
    const promises = [];
    promises.push(getRevisions(keyId));
    promises.push(getOrganizations(language));
    const responses = await Promise.all(promises);
    return {
        revisions: responses[0].filter((element) => element.status === 'ACCEPTED'),
        organizations: responses[1],
    };
};
