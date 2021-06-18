import { convertFromRaw, convertToRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import { getMediaList } from './api/get';
import { getFileArray, getRevisionFileArray } from './media';

/**
 * Convert HTML to editor state
 *
 * @param {string} value HTML
 * @returns {string} Stringified raw editor content
 */
const convertFromHtml = (value) => {
    if (!value) return '';
    const raw = convertToRaw(stateFromHTML(value));
    return JSON.stringify(raw);
};

/**
 * Get values from group info
 *
 * @param {Array} group Array of group info in multiple languages
 * @param {Object} exValues Existing form values
 * @returns {Object} Form values
 */
export const getGroupInfoValues = (group, exValues) => {
    const infoNo = group.find((element) => element.language_code === 'no');
    const infoEn = group.find((element) => element.language_code === 'en');
    return {
        ...exValues,
        nameNo: infoNo && infoNo.name ? infoNo.name : '',
        nameEn: infoEn && infoEn.name ? infoEn.name : '',
        descriptionNo: infoNo ? convertFromHtml(infoNo.description) : '',
        descriptionEn: infoEn ? convertFromHtml(infoEn.description) : '',
        parentId: group[0].parent_id || '',
        existingFiles: getFileArray(group[0].media),
    };
};

/**
 * Get values from collection info
 *
 * @param {Array} collection Array of collection info in multiple languages
 * @param {Object} exValues Existing form values
 * @returns {Object} Form values
 */
export const getCollectionInfoValues = (collection, exValues) => {
    const infoNo = collection.find((element) => element.language_code === 'no');
    const infoEn = collection.find((element) => element.language_code === 'en');
    return {
        ...exValues,
        nameNo: infoNo && infoNo.name ? infoNo.name : '',
        nameEn: infoEn && infoEn.name ? infoEn.name : '',
        descriptionNo: infoNo ? convertFromHtml(infoNo.description) : '',
        descriptionEn: infoEn ? convertFromHtml(infoEn.description) : '',
        workgroupId: collection[0].workgroupId,
        existingFiles: getFileArray(collection[0].media),
    };
};

/**
 * Get values from taxon info
 *
 * @param {Object} taxon Taxon object
 * @param {Object} exValues Existing form values
 * @param {Object} revisionMedia Media element from revision media elements array
 * @returns {Object} Form values
 */
export const getTaxonInfoValues = async (taxon, exValues, revisionMedia) => {
    const values = {
        ...exValues,
        parentId: taxon.parentId ? taxon.parentId : '',
        scientificName: taxon.scientificName ? taxon.scientificName : '',
        vernacularNameNo: taxon.vernacularName && taxon.vernacularName.no ? taxon.vernacularName.no : '',
        vernacularNameEn: taxon.vernacularName && taxon.vernacularName.en ? taxon.vernacularName.en : '',
        descriptionNo: taxon.description ? convertFromHtml(taxon.description.no) : '',
        descriptionEn: taxon.description ? convertFromHtml(taxon.description.en) : '',
    };
    if (taxon.media && taxon.media.length > 0) {
        const media = await getMediaList(taxon.media);
        values.existingFiles = getRevisionFileArray(media, revisionMedia);
        values.taxonMedia = media;
    }
    return values;
};

/**
 * Get values from state info
 *
 * @param {Array} states State objects
 * @param {Object} revisionMedia Revision media elements
 * @returns {Array} Array of states with file info
 */
export const getStateFiles = (states, revisionMedia) => new Promise((resolve, reject) => {
    const promises = [];
    const stateFiles = [];
    states.forEach((state) => {
        if (state.media && state.media.length > 0) {
            promises.push(new Promise((resolve, reject) => {
                getMediaList(state.media).then((media) => {
                    stateFiles.push({
                        stateId: state.id,
                        stateMedia: media,
                        files: [],
                        existingFiles: getRevisionFileArray(media, revisionMedia),
                    });
                    resolve();
                }).catch((err) => reject(err));
            }));
        } else stateFiles.push({ stateId: state.id, files: [], existingFiles: [] });
    });
    Promise.all(promises).then(() => {
        resolve(stateFiles);
    }).catch((err) => reject(err));
});

/**
 * Get values from categorical character info
 *
 * @param {Object} character Character object
 * @param {Object} exValues Existing form values
 * @param {Object} revisionMedia Media element from revision media elements array
 * @returns {Object} Form values
 */
export const getCategoricalCharacterInfoValues = (
    character, exValues, revisionMedia,
) => new Promise((resolve, reject) => {
    const values = {
        ...exValues,
        type: character.type ? character.type.toUpperCase() : '',
        titleNo: character.title && character.title.no ? character.title.no : '',
        titleEn: character.title && character.title.en ? character.title.en : '',
        descriptionNo: character.description ? convertFromHtml(character.description.no) : '',
        descriptionEn: character.description ? convertFromHtml(character.description.en) : '',
        alternatives: character.states ? JSON.parse(JSON.stringify(character.states)) : [],
    };
    const promises = [];
    promises.push(new Promise((resolve, reject) => {
        if (character.media && character.media.length > 0) {
            getMediaList(character.media).then((media) => {
                values.existingFiles = getRevisionFileArray(media, revisionMedia);
                resolve(media);
            }).catch((err) => reject(err));
        } else resolve();
    }));
    promises.push(new Promise((resolve, reject) => {
        getStateFiles(character.states, revisionMedia).then((stateFiles) => {
            resolve(stateFiles);
        }).catch((err) => reject(err));
    }));
    Promise.all(promises).then((responses) => {
        const characterMedia = responses[0];
        const stateFiles = responses[1];
        if (characterMedia) {
            values.existingFiles = getRevisionFileArray(characterMedia, revisionMedia);
            values.characterMedia = characterMedia;
        }
        if (stateFiles) values.stateFiles = stateFiles;
        resolve(values);
    }).catch((err) => reject(err));
});

/**
 * Get values from numerical character info
 *
 * @param {Object} character Character object
 * @param {Object} exValues Existing form values
 * @param {Object} revisionMedia Media element from revision media elements array
 * @returns {Object} Form values
 */
export const getNumericalCharacterInfoValues = async (character, exValues, revisionMedia) => {
    const state = character.states;
    const values = {
        ...exValues,
        type: character.type ? character.type.toUpperCase() : '',
        titleNo: character.title && character.title.no ? character.title.no : '',
        titleEn: character.title && character.title.en ? character.title.en : '',
        descriptionNo: character.description ? convertFromHtml(character.description.no) : '',
        descriptionEn: character.description ? convertFromHtml(character.description.en) : '',
        min: state.min ? state.min : '',
        max: state.max ? state.max : '',
        stepSize: state.stepSize ? state.stepSize : 1,
        unitNo: state.unit && state.unit.no ? state.unit.no : '',
        unitEn: state.unit && state.unit.en ? state.unit.en : '',
    };
    if (character.media && character.media.length > 0) {
        const media = await getMediaList(character.media);
        values.existingFiles = getRevisionFileArray(media, revisionMedia);
        values.characterMedia = media;
    }
    return values;
};

/**
 * Convert editor state to HTML
 *
 * @param {Object} editorValues Editor values
 * @returns {Object} Converted values
 */
export const convertEditorToHtml = (editorValues) => {
    const values = { ...editorValues };
    if (values.descriptionNo !== '') {
        values.descriptionNo = stateToHTML(convertFromRaw(JSON.parse(values.descriptionNo)));
    }
    if (values.descriptionEn !== '') {
        values.descriptionEn = stateToHTML(convertFromRaw(JSON.parse(values.descriptionEn)));
    }
    return values;
};
