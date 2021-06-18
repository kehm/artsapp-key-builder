/**
 * Remove premises that includes the selected character
 *
 * @param {int} id Character ID
 * @param {Array} arr Characters array
 * @returns {Array} Updated characters array
 */
export const removeCharacterPremises = (id, chars) => {
    const arr = [...chars];
    arr.forEach((element) => {
        if (element.logicalPremise && Array.isArray(element.logicalPremise)) {
            element.logicalPremise = element.logicalPremise.map((subElement) => {
                if (Array.isArray(subElement)) {
                    return subElement.filter((el) => el.characterId !== id);
                }
                return subElement;
            });
            element.logicalPremise = element.logicalPremise.filter(
                (subElement) => subElement.length > 1,
            );
        }
    });
    return arr;
};

/**
 * Check if necessary form values have been added
 *
 * @param {Object} values Form values
 * @param {Object} languages Active languages
 * @returns {boolean} True if form is valid
 */
export const isValid = (values, languages) => {
    let valid = true;
    if (values.type === 'NUMERICAL') {
        if (languages.langNo && values.unitNo === '') valid = false;
        if (languages.langEn && values.unitEn === '') valid = false;
        if (values.stepSize === '' || values.min === '' || values.max === '') valid = false;
    } else if (values.alternatives.length > 1) {
        values.alternatives.forEach((alternative) => {
            if (languages.langNo && (!alternative.title.no || alternative.title.no === '')) valid = false;
            if (languages.langEn && (!alternative.title.en || alternative.title.en === '')) valid = false;
        });
    } else valid = false;
    return valid;
};
