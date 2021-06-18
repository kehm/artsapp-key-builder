/**
 * Get new form values
 *
 * @param {Object} e Event
 * @param {Object} exitingValues Existing form values
 * @returns {Object} Updated form values object
 */
const getInputChange = (e, exitingValues) => {
    const { name, value } = e.target;
    return ({
        ...exitingValues,
        [name]: value,
    });
};

export default getInputChange;
