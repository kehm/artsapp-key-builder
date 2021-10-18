/**
 * Find taxon from taxa
 *
 * @param {Array} arr Taxa array
 * @param {int} id Taxon ID
 * @returns {Object} Taxon
 */
export const findTaxon = (arr, id) => {
    let taxon;
    arr.forEach((element) => {
        if (element.id === id) {
            taxon = element;
        } else if (element.children) {
            const tmp = findTaxon(element.children, id);
            if (tmp) taxon = tmp;
        }
    });
    return taxon;
};

/**
 * Find all taxa
 *
 * @param {Array} taxa Taxa array
 * @returns {Array} Taxa objects
 */
export const findTaxa = (taxa) => {
    const getTaxa = (taxaList, arr) => {
        taxaList.forEach((taxon) => {
            arr.push(taxon);
            if (taxon.children) getTaxa(taxon.children, arr);
        });
    };
    const arr = [];
    if (taxa) getTaxa(taxa, arr);
    return arr;
};

/**
  * Find list of all higher taxa for the taxon
  *
  * @param {Array} taxa Taxa array
  * @param {int} taxonId Taxon ID
  * @returns {Array} Parent taxa
  */
export const findParentTaxa = (taxa, taxonId) => {
    const find = (arr, subset, id, parent) => {
        for (let i = 0; i < subset.length; i += 1) {
            if (subset[i].id === id) {
                if (parent) {
                    arr.push(parent);
                    find(arr, taxa, parent.id);
                } else break;
            }
            if (subset[i].children) {
                find(arr, subset[i].children, id, subset[i]);
            }
        }
    };
    const arr = [];
    find(arr, taxa, taxonId);
    return arr;
};

/**
 * Find all subtaxa for taxon
 *
 * @param {Object} taxon Taxon object
 * @returns {Array} Subtaxa
 */
export const findSubTaxa = (taxon) => {
    const getSubTaxa = (taxa, arr) => {
        taxa.forEach((element) => {
            arr.push(element);
            if (element.children) getSubTaxa(element.children, arr);
        });
    };
    const arr = [];
    if (taxon.children) getSubTaxa(taxon.children, arr);
    return arr;
};
