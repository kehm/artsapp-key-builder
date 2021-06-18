import axios from 'axios';

/**
 * Delete collection
 *
 * @param {int} id Collection ID
 */
export const deleteCollection = async (id) => {
    await axios.delete(
        `${process.env.REACT_APP_BUILDER_API_URL}/collections/${id}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
};

/**
 * Delete key group
 *
 * @param {int} id Group ID
 */
export const deleteKeyGroup = async (id) => {
    await axios.delete(
        `${process.env.REACT_APP_BUILDER_API_URL}/groups/${id}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
};

/**
 * Delete workgroup
 *
 * @param {int} id Workgroup ID
 */
export const deleteWorkgroup = async (id) => {
    await axios.delete(
        `${process.env.REACT_APP_BUILDER_API_URL}/workgroups/${id}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
};

/**
 * Remove user in session from the workgroup
 *
 * @param {int} id Workgroups ID
 */
export const deleteUserWorkgroup = async (id) => {
    await axios.delete(
        `${process.env.REACT_APP_BUILDER_API_URL}/workgroups/user/session/${id}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
};

/**
 * Remove user workgroup association
 *
 * @param {int} id Workgroups ID
 */
export const deleteWorkgroupUser = async (id) => {
    await axios.delete(
        `${process.env.REACT_APP_BUILDER_API_URL}/workgroups/users/${id}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
};

/**
 * Remove key editor
 *
 * @param {int} id Key ID and editors ID
 */
export const deleteKeyEditor = async (id) => {
    await axios.delete(
        `${process.env.REACT_APP_BUILDER_API_URL}/editors/${id}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
};

/**
 * Remove key from collection
 *
 * @param {int} id Collections ID
 */
export const removeKeyFromCollection = async (id) => {
    await axios.delete(
        `${process.env.REACT_APP_BUILDER_API_URL}/collections/key/${id}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
};

/**
 * Remove media from entity and delete file
 *
 * @param {string} entityId Entity ID
 * @param {string} entity Entity name (key, taxon, character, state, group or collection)
 * @param {Array} media List of media IDs and file names
 */
export const removeMediaFromEntity = async (entityId, entity, media) => {
    await axios.delete(
        `${process.env.REACT_APP_BUILDER_API_URL}/media/${entity}/${entityId}`,
        { data: { media } },
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
};

/**
 * Remove media files
 *
 * @param {string} revisionId Revision ID
 * @param {string} entityId Entity ID
 * @param {string} entity Entity name
 * @param {Array} media List of media IDs and file names
 * @param {string} stateId State ID
 */
export const removeMediaFromRevision = async (revisionId, entityId, entity, media, stateId) => {
    await axios.delete(
        `${process.env.REACT_APP_BUILDER_API_URL}/media/${entity}`,
        {
            data: {
                media, entityId, revisionId, stateId,
            },
        },
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
};
