/**
 * Handle alternative checkbox click
 *
 * @param {Array} statements Statements array
 * @param {Object} character Character object
 * @param {string} stateId State ID
 * @param {string} taxonId Taxon ID
 * @param {boolean} uncheck True if uncheck
 * @returns {Array} Updated statements array
 */
export const handleAlternativeCheck = (statements, character, stateId, taxonId, uncheck) => {
    let arr = [...statements];
    if (uncheck) {
        if (arr.filter(
            (element) => element.taxonId === taxonId
                && element.characterId === character.id,
        ).length > 1) {
            arr = arr.filter(
                (element) => !(element.taxonId === taxonId
                    && element.characterId === character.id
                    && element.value === stateId),
            );
        }
    } else if (character.states.length > arr.filter(
        (element) => element.taxonId === taxonId && element.characterId === character.id,
    ).length) {
        arr.push({ taxonId, characterId: character.id, value: stateId });
    }
    return arr;
};

/**
 * Handle numerical character slider change
 *
 * @param {Array} statements Statements array
 * @param {Array} val Value
 * @param {string} objectId Taxon or Character ID
 * @param {string} taxonId Taxon ID
 * @param {string} characterId Character ID
 * @returns {Array} Updated statements
 */
export const handleSliderChange = (statements, val, objectId, taxonId, characterId) => {
    const arr = [...statements];
    let statement;
    if (taxonId) {
        statement = arr.find(
            (element) => element.characterId === objectId && element.taxonId === taxonId,
        );
    } else if (characterId) {
        statement = arr.find(
            (element) => element.taxonId === objectId && element.characterId === characterId,
        );
    }
    if (statement) statement.value = val;
    return arr;
};

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
