import axios from 'axios';

/**
 * Update key info
 *
 * @param {string} keyId Key ID
 * @param {Object} data Key object
 * @returns {Object} Response data
 */
export const updateKey = async (keyId, data) => {
    const response = await axios.put(
        `${process.env.REACT_APP_BUILDER_API_URL}/keys/${keyId}`,
        data,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Set key status to HIDDEN
 *
 * @param {string} keyId Key ID
 * @returns {Object} Response data
 */
export const hideKey = async (keyId) => {
    const response = await axios.put(
        `${process.env.REACT_APP_BUILDER_API_URL}/keys/hide/${keyId}`,
        {},
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Update revision status
 *
 * @param {string} revisionId Revision ID
 * @param {Object} data Object with status string and key ID
 * @returns {Object} Response data
 */
export const updateRevisionStatus = async (revisionId, data) => {
    const response = await axios.put(
        `${process.env.REACT_APP_BUILDER_API_URL}/revisions/${revisionId}`,
        data,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Update collection info
 *
 * @param {int} collectionId Collection ID
 * @param {Object} data Collection object
 * @returns {Object} Response data
 */
export const updateCollection = async (collectionId, data) => {
    const response = await axios.put(
        `${process.env.REACT_APP_BUILDER_API_URL}/collections/${collectionId}`,
        data,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Update key group info
 *
 * @param {int} groupId Group ID
 * @param {Object} data Group object
 * @returns {Object} Response data
 */
export const updateKeyGroup = async (groupId, data) => {
    const response = await axios.put(
        `${process.env.REACT_APP_BUILDER_API_URL}/groups/${groupId}`,
        data,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Update workgroup
 *
 * @param {int} workgroupId Workgroup ID
 * @param {Object} data Workgroup object
 * @returns {Object} Response data
 */
export const updateWorkgroup = async (workgroupId, data) => {
    const response = await axios.put(
        `${process.env.REACT_APP_BUILDER_API_URL}/workgroups/${workgroupId}`,
        data,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Update taxon
 *
 * @param {int} taxonId Taxon ID
 * @param {Object} data Taxon object
 * @returns {Object} Response data
 */
export const updateTaxon = async (taxonId, data) => {
    const response = await axios.put(
        `${process.env.REACT_APP_BUILDER_API_URL}/taxa/${taxonId}`,
        data,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Update character
 *
 * @param {int} characterId Character ID
 * @param {Object} data Character object
 * @returns {Object} Response data
 */
export const updateCharacter = async (characterId, data) => {
    const response = await axios.put(
        `${process.env.REACT_APP_BUILDER_API_URL}/characters/${characterId}`,
        data,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Update character premise
 *
 * @param {Object} data Object with keyId, revisionId, characterId and premise
 * @returns {Object} Response data
 */
export const updateCharacterPremise = async (data) => {
    const response = await axios.put(
        `${process.env.REACT_APP_BUILDER_API_URL}/characters/premise/${data.characterId}`,
        data,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Update premises including the supplied list of removed state IDs
 *
 * @param {Object} revision Revision object
 * @param {Array} states Array of removed state IDs
 */
export const updateStatePremises = async (revision, states) => {
    await axios.put(
        `${process.env.REACT_APP_BUILDER_API_URL}/characters/states/revision/${revision.id}`,
        {
            keyId: revision.keyId,
            states,
        },
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
};

/**
 * Update media info
 *
 * @param {int} mediaId Media ID
 * @param {Object} media Updated media object
 */
export const updateMedia = async (mediaId, media) => {
    await axios.put(
        `${process.env.REACT_APP_BUILDER_API_URL}/media/${mediaId}`,
        {
            titleNo: media.fileInfo.titleNo || '',
            titleEn: media.fileInfo.titleEn || '',
            creators: media.fileInfo.creators || [],
            licenseUrl: media.fileInfo.licenseUrl,
        },
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
};

/**
 * Update media info in revision media elements
 *
 * @param {string} revisionId Revision ID
 * @param {int} mediaId Media ID
 * @param {Object} media Updated media object
 */
export const updateRevisionMedia = async (revisionId, mediaId, media) => {
    await axios.put(
        `${process.env.REACT_APP_BUILDER_API_URL}/media/revision/${revisionId}`,
        {
            mediaId,
            titleNo: media.fileInfo.titleNo || '',
            titleEn: media.fileInfo.titleEn || '',
            creators: media.fileInfo.creators || [],
            licenseUrl: media.fileInfo.licenseUrl,
        },
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
};
