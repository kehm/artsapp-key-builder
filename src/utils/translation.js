/**
 * Find variable name in selected language
 *
 * @param {Object} object Name object
 * @param {string} selectedLanguage Selected language code
 * @returns {string} Variable name
 */
export const findName = (object, selectedLanguage) => {
    let name;
    if (object) {
        if (object[selectedLanguage]) {
            name = object[selectedLanguage];
        } else if (object.en) {
            name = object.en;
        } else if (object.no) {
            name = object.no;
        }
    }
    return name;
};

/**
 * Find revision status name in selected language
 *
 * @param {string} status Status value
 * @param {Object} language Language context
 * @returns {string} Status name
 */
export const findRevisionStatusName = (status, language) => {
    let name;
    if (status === 'DRAFT') {
        name = language.dictionary.statusDraft;
    } else if (status === 'REVIEW') {
        name = language.dictionary.statusReview;
    } else if (status === 'ACCEPTED') {
        name = language.dictionary.statusAccepted;
    }
    return name;
};
