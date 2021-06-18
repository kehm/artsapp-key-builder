import { addMediaToEntity } from './api/create';
import { removeMediaFromEntity, removeMediaFromRevision } from './api/delete';
import { updateMedia, updateRevisionMedia } from './api/update';

/**
 * Convert media array to file array
 *
 * @param {Array} media Media array
 * @returns {Array} Array with file names and file info
 */
export const getFileArray = (media) => {
    const mediaIds = new Set(media && media.map((element) => element.mediaid));
    const arr = [];
    mediaIds.forEach((mediaId) => {
        const info = media.filter((element) => element.mediaid === mediaId);
        const infoObj = {
            creators: info[0].creators,
            licenseUrl: info[0].licenseurl,
            fileName: info[0].filename,
        };
        info.forEach((element) => {
            if (element.languagecode === 'no') {
                infoObj.titleNo = element.title;
            } else if (element.languagecode === 'en') {
                infoObj.titleEn = element.title;
            }
        });
        arr.push({ id: info[0].mediaid, name: info[0].filename, fileInfo: infoObj });
    });
    return arr;
};

/**
 * Convert media array to file array with info from revision media elements
 *
 * @param {Array} media Media array
 * @param {Object} revisionMedia Revision media
 * @returns {Array} Array with file names and file info
 */
export const getRevisionFileArray = (media, revisionMedia) => {
    const mediaIds = new Set(media && media.map((element) => element.mediaid));
    const arr = [];
    mediaIds.forEach((mediaId) => {
        const mediaInfo = media.find((element) => element.mediaid === mediaId);
        const mediaElement = revisionMedia.mediaElements.find((element) => `${element.id}` === `${mediaId}`);
        const creatorNames = [];
        if (mediaElement.creators && revisionMedia.persons) {
            mediaElement.creators.forEach((creator) => {
                const person = revisionMedia.persons.find((element) => element.id === creator);
                if (person) creatorNames.push(person.name);
            });
        }
        const infoObj = {
            creators: creatorNames,
            licenseUrl: mediaInfo.licenseurl,
            fileName: mediaInfo.filename,
            titleNo: mediaElement && mediaElement.title && mediaElement.title.no ? mediaElement.title.no : '',
            titleEn: mediaElement && mediaElement.title && mediaElement.title.en ? mediaElement.title.en : '',
        };
        arr.push({ id: mediaInfo.mediaid, name: mediaInfo.filename, fileInfo: infoObj });
    });
    return arr;
};

/**
 * Create FormData object
 *
 * @param {Object} form Key-value pairs
 * @param {Array} files File array
 * @returns {Object} FormData object
 */
const createFormData = (form, files) => {
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    files.forEach((file) => formData.append('files', file));
    return formData;
};

/**
 * Add new media to entity and update existing
 *
 * @param {string} entityId Entity ID
 * @param {string} entity Entity name (key, taxon, character, state, group or collection)
 * @param {Array} files New media
 * @param {Array} media Existing entity media
 * @param {Array} modFiles Modified existing entity media
 */
export const handleUpdateEntityMedia = async (
    entityId, entity, files, media, modFiles,
) => {
    const removed = [];
    if (media && modFiles) {
        await Promise.all(media.map(async (element) => {
            const file = modFiles.find((modFile) => modFile.name === element.filename);
            if (file) {
                await updateMedia(element.mediaid, file);
            } else removed.push(element);
        }));
        if (removed.length > 0) {
            await removeMediaFromEntity(
                entityId,
                entity,
                removed.map((element) => ({ id: element.mediaid, filename: element.filename })),
            );
        }
    }
    if (files.length > 0) {
        await addMediaToEntity(createFormData({
            entityId,
            fileInfo: JSON.stringify(files.map((file) => file.fileInfo)),
        }, files), entity);
    }
};

/**
 * Add new media to entity in revision and update existing
 *
 * @param {string} keyId Key ID
 * @param {string} entityId Entity ID
 * @param {string} entity Entity name (key, taxon, character, state, group or collection)
 * @param {string} revisionId Revision ID
 * @param {Array} files New media
 * @param {Array} media Existing entity media
 * @param {Array} modFiles Modified existing entity media
 * @param {string} stateId State ID (required if updating state)
 */
export const handleUpdateRevisionMedia = async (
    keyId, revisionId, entityId, entity, files, media, modFiles, stateId,
) => {
    const removed = [];
    if (media && modFiles) {
        await Promise.all(media.map(async (element) => {
            const file = modFiles.find((modFile) => modFile.name === element.filename);
            if (file) {
                await updateRevisionMedia(revisionId, element.mediaid, file);
            } else removed.push(element);
        }));
        if (removed.length > 0) {
            await removeMediaFromRevision(
                revisionId,
                entityId,
                entity,
                removed.map((element) => `${element.mediaid}`),
                stateId,
            );
        }
    }
    if (files.length > 0) {
        await addMediaToEntity(createFormData({
            keyId,
            entityId,
            revisionId,
            stateId,
            fileInfo: JSON.stringify(files.map((file) => file.fileInfo)),
        }, files), entity);
    }
};
