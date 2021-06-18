import axios from 'axios';

/**
 * Create new key
 *
 * @param {Object} data Object with workgroupId
 * @returns {Object} Response data
 */
export const createKey = async (data) => {
    const response = await axios.post(
        `${process.env.REACT_APP_BUILDER_API_URL}/keys`,
        data,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Create new revision
 *
 * @param {Object} data Object with keyId and content (optional)
 * @returns {Object} Response data
 */
export const createRevision = async (data) => {
    const response = await axios.post(
        `${process.env.REACT_APP_BUILDER_API_URL}/revisions`,
        data,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Create new taxon for key
 *
 * @param {Object} data keyId, revisionId, scientificName, vernacularName (opt), description (opt)
 * @returns {Object} Response data
 */
export const createTaxon = async (data) => {
    const response = await axios.post(
        `${process.env.REACT_APP_BUILDER_API_URL}/taxa`,
        data,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Create new character for key
 *
 * @param {Object} data keyId, revisionId, title, type and alternatives (EXCLUSIVE and MULTISTATE)
 * @returns {Object} Response data
 */
export const createCharacter = async (data) => {
    const response = await axios.post(
        `${process.env.REACT_APP_BUILDER_API_URL}/characters`,
        data,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Create new character state
 *
 * @param {Object} data Key ID and character ID
 * @returns {Object} Response data
 */
export const createCharacterState = async (data) => {
    const response = await axios.post(
        `${process.env.REACT_APP_BUILDER_API_URL}/characters/state`,
        data,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Create new key collection
 *
 * @param {Object} data Title and description
 * @returns {Object} Response data
 */
export const createCollection = async (data) => {
    const response = await axios.post(
        `${process.env.REACT_APP_BUILDER_API_URL}/collections`,
        data,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Create new key group
 *
 * @param {Object} data Title and description
 * @returns {Object} Response data
 */
export const createKeyGroup = async (data) => {
    const response = await axios.post(
        `${process.env.REACT_APP_BUILDER_API_URL}/groups`,
        data,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Create new workgroup
 *
 * @param {Object} data Object with name
 * @returns {Object} Response data
 */
export const createWorkgroup = async (data) => {
    const response = await axios.post(
        `${process.env.REACT_APP_BUILDER_API_URL}/workgroups`,
        data,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Add user to workgroup
 *
 * @param {Object} data Object with email and workgroup ID
 * @returns {Object} Response data
 */
export const addUserToWorkgroup = async (data) => {
    const response = await axios.post(
        `${process.env.REACT_APP_BUILDER_API_URL}/workgroups/users`,
        data,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Add new key editor
 *
 * @param {Object} data Object with email and key ID
 * @returns {Object} Response data
 */
export const addKeyEditor = async (data) => {
    const response = await axios.post(
        `${process.env.REACT_APP_BUILDER_API_URL}/editors`,
        data,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Add key to collection
 *
 * @param {Object} data Object with key ID and collection ID
 * @returns {Object} Response data
 */
export const addKeyToCollection = async (data) => {
    const response = await axios.post(
        `${process.env.REACT_APP_BUILDER_API_URL}/collections/key`,
        data,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Add media to entity
 *
 * @param {Object} data Multipart/form-data with files, file info and key ID
 * @param {string} entity Entity name (key, taxon, character, state, group or collection)
 * @returns {Object} Response data
 */
export const addMediaToEntity = async (data, entity) => {
    const response = await axios.post(
        `${process.env.REACT_APP_BUILDER_API_URL}/media/${entity}`,
        data,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};
