import axios from 'axios';

/**
 * Get key
 *
 * @param {string} id Key id
 * @param {string} language Language code
 */
export const getKey = async (id, language) => {
    const response = await axios.get(
        `${process.env.REACT_APP_BUILDER_API_URL}/keys/${id}${language ? `?language=${language}` : ''}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get all keys from Keys API
 *
 * @param {string} language Language code
 */
export const getKeys = async (language) => {
    const response = await axios.get(
        `${process.env.REACT_APP_BUILDER_API_URL}/keys${language ? `?language=${language}` : ''}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get keys for user
 *
 * @param {string} language Language code
 */
export const getUserKeys = async (language) => {
    const response = await axios.get(
        `${process.env.REACT_APP_BUILDER_API_URL}/keys/user/session${language ? `?language=${language}` : ''}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get keys by key group ID
 *
 * @param {int} id Key group ID
 * @param {string} language Language code
 * @returns {Array} Keys
 */
export const getKeysByGroup = async (id, language) => {
    const response = await axios.get(
        `${process.env.REACT_APP_BUILDER_API_URL}/keys/group/${id}${language ? `?language=${language}` : ''}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get keys by collection ID
 *
 * @param {int} id Collection ID
 * @param {string} language Language code
 * @returns {Array} Keys
 */
export const getKeysByCollection = async (id, language) => {
    const response = await axios.get(
        `${process.env.REACT_APP_BUILDER_API_URL}/keys/collection/${id}${language ? `?language=${language}` : ''}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get key revision
 *
 * @param {string} id Revision ID
 */
export const getRevision = async (id) => {
    const response = await axios.get(
        `${process.env.REACT_APP_BUILDER_API_URL}/revisions/${id}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get revisions for key
 *
 * @param {string} keyId Key ID
 * @returns {Object} Response data
 */
export const getRevisions = async (keyId) => {
    const response = await axios.get(
        `${process.env.REACT_APP_BUILDER_API_URL}/revisions/key/${keyId}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get collection
 *
 * @param {int} id Collection ID
 * @returns {Object} Response data
 */
export const getCollection = async (id) => {
    const response = await axios.get(
        `${process.env.REACT_APP_BUILDER_API_URL}/collections/${id}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get available collections for key
 *
 * @param {string} language Language code
 * @returns {Object} Response data
 */
export const getCollections = async (language) => {
    const response = await axios.get(
        `${process.env.REACT_APP_BUILDER_API_URL}/collections${language ? `?language=${language}` : ''}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get key group
 *
 * @param {int} id Group ID
 * @returns {Object} Response data
 */
export const getKeyGroup = async (id) => {
    const response = await axios.get(
        `${process.env.REACT_APP_BUILDER_API_URL}/groups/${id}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get key groups
 *
 * @param {string} language Language code
 * @returns {Object} Response data
 */
export const getKeyGroups = async (language) => {
    const response = await axios.get(
        `${process.env.REACT_APP_BUILDER_API_URL}/groups${language ? `?language=${language}` : ''}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get workgroups for the user's organization
 * @returns {Object} Response data
 */
export const getWorkgroups = async () => {
    const response = await axios.get(
        `${process.env.REACT_APP_BUILDER_API_URL}/workgroups`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get workgroups for the user in session
 *
 * @param {string} language Language code
 * @returns {Object} Response data
 */
export const getUserWorkgroups = async (language) => {
    const response = await axios.get(
        `${process.env.REACT_APP_BUILDER_API_URL}/workgroups/user/session${language ? `?language=${language}` : ''}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get workgroup users
 *
 * @param {int} id Workgroup ID
 * @returns {Object} Response data
 */
export const getWorkgroupUsers = async (id) => {
    const response = await axios.get(
        `${process.env.REACT_APP_BUILDER_API_URL}/workgroups/users/${id}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get key editors
 *
 * @param {int} id Key ID
 * @returns {Object} Response data
 */
export const getKeyEditors = async (id) => {
    const response = await axios.get(
        `${process.env.REACT_APP_BUILDER_API_URL}/editors/key/${id}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get role by ID
 *
 * @param {int} id Role ID
 * @param {string} language Language code
 * @returns {Object} Response data
 */
export const getRole = async (id, language) => {
    const response = await axios.get(
        `${process.env.REACT_APP_BUILDER_API_URL}/organizations/roles/${id}${language ? `?language=${language}` : ''}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get organizations
 *
 * @param {string} language Language code
 * @returns {Object} Response data
 */
export const getOrganizations = async (language) => {
    const response = await axios.get(
        `${process.env.REACT_APP_BUILDER_API_URL}/organizations${language ? `?language=${language}` : ''}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get organization by ID
 *
 * @param {int} id Organization ID
 * @param {string} language Language code
 * @returns {Object} Response data
 */
export const getOrganization = async (id, language) => {
    const response = await axios.get(
        `${process.env.REACT_APP_BUILDER_API_URL}/organizations/${id}${language ? `?language=${language}` : ''}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get suggestions for scientific names
 *
 * @param {string} name Scientific name
 * @returns {Object} Response data
 */
export const getTaxonSuggestions = async (name) => {
    const response = await axios.get(
        `${process.env.REACT_APP_BUILDER_API_URL}/taxa/scientificname/suggest?scientificname=${name}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get vernacular name for taxon
 *
 * @param {string} name Scientific name
 * @returns {Object} Response data
 */
export const getVernacularName = async (name) => {
    const response = await axios.get(
        `${process.env.REACT_APP_BUILDER_API_URL}/taxa/scientificname/vernacularname?scientificname=${name}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get list of media
 *
 * @param {Array} data Media IDs
 * @returns {Object} Response data
 */
export const getMediaList = async (data) => {
    const response = await axios.get(
        `${process.env.REACT_APP_BUILDER_API_URL}/media/info/list?ids=${JSON.stringify(data)}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};
