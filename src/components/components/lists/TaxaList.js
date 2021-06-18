import React, { useContext, useEffect, useState } from 'react';
import TreeView from '@material-ui/lab/TreeView';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import SubdirectoryArrowRight from '@material-ui/icons/SubdirectoryArrowRight';
import Stop from '@material-ui/icons/Stop';
import TreeItem from '@material-ui/lab/TreeItem';
import EditOutlined from '@material-ui/icons/EditOutlined';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import LanguageContext from '../../../context/LanguageContext';
import { findTaxa } from '../../../utils/taxon';
import getInputChange from '../../../utils/input-change';
import TextInput from '../inputs/TextInput';

/**
 * Render taxa list
 */
const TaxaList = ({
    taxa, selectedTaxon, onSelectTaxon, onEditTaxon,
}) => {
    const { language } = useContext(LanguageContext);
    const defaultFormValues = {
        filter: '',
    };
    const [formValues, setFormValues] = useState(defaultFormValues);
    const [filter, setFilter] = useState(undefined);

    /**
     * Filter taxa list
     */
    useEffect(() => {
        if (taxa) {
            if (formValues.filter) {
                const arr = findTaxa(taxa).filter((taxon) => (taxon.scientificName !== undefined
                    && taxon.scientificName.toUpperCase().includes(formValues.filter.toUpperCase()))
                    || (taxon.vernacularName && taxon.vernacularName[language.language.split('_')[0]] && taxon.vernacularName[language.language.split('_')[0]].toUpperCase().includes(formValues.filter.toUpperCase())));
                setFilter(arr);
            } else setFilter(undefined);
        }
    }, [taxa, formValues, language]);

    /**
     * Render label
     *
     * @param {string} type List type
     * @param {Object} taxon Taxon object
     * @returns JSX
     */
    const renderLabel = (type, taxon) => (
        <div className={type === 'list' ? 'p-2 w-96 h-16 flex' : 'p-4 w-96 flex'}>
            <span className="hidden lg:inline">
                {taxon.media && taxon.media.length > 0
                    ? <Avatar className="mr-4" alt="Taxon" src={`${process.env.REACT_APP_BUILDER_API_URL}/media/thumbnails/${taxon.media[0]}`} />
                    : (
                        <Avatar className="mr-4">
                            <ImageIcon />
                        </Avatar>
                    )}
            </span>
            <ul>
                <li className="overflow-hidden overflow-ellipsis whitespace-nowrap w-40 xl:w-60">{taxon.scientificName}</li>
                <li className="text-gray-500 text-sm ml-1 overflow-hidden overflow-ellipsis whitespace-nowrap w-40 xl:w-60">
                    {taxon.vernacularName && taxon.vernacularName[language.language.split('_')[0]]
                        ? taxon.vernacularName[language.language.split('_')[0]]
                        : language.dictionary.unknown}
                </li>
            </ul>
            <span className="absolute right-4 top-3">
                <IconButton edge="end" aria-label="edit" onClick={() => onEditTaxon(taxon.id)}>
                    <EditOutlined />
                </IconButton>
            </span>
        </div>
    );

    /**
     * Render group item
     *
     * @param {Object} group Group object
     * @returns JSX
     */
    const renderTreeItem = (taxon) => (
        <TreeItem
            key={taxon.id}
            nodeId={`${taxon.id}`}
            onClick={() => onSelectTaxon(taxon)}
            label={renderLabel('tree', taxon)}
        >
            {taxon.children && taxon.children.map((subTaxon) => renderTreeItem(subTaxon))}
        </TreeItem>
    );

    /**
     * Render list item
     *
     * @param {Object} taxon Taxon object
     * @returns JSX
     */
    const renderListItem = (taxon) => (
        <ListItem
            key={taxon.id}
            className={selectedTaxon && selectedTaxon.id === taxon.id ? 'bg-blue-200 rounded mt-4 cursor-pointer' : 'rounded mt-4 cursor-pointer'}
            onClick={() => onSelectTaxon(taxon)}
        >
            {renderLabel('list', taxon)}
        </ListItem>
    );

    return (
        <div className="mr-4 xl:mr-16 p-2 border-r border-solid rounded">
            <h2 className="mb-4">{language.dictionary.labelTaxa}</h2>
            <TextInput
                name="filter"
                label={language.dictionary.labelSearch}
                value={formValues.filter}
                maxLength={280}
                standard
                onChange={(e) => setFormValues(getInputChange(e, formValues))}
            />
            {filter ? (
                <List>
                    {filter.map((taxon, index) => renderListItem(taxon, index))}
                </List>
            )
                : (
                    <TreeView
                        defaultEndIcon={<Stop />}
                        defaultParentIcon={<SubdirectoryArrowRight />}
                        selected={`${selectedTaxon && selectedTaxon.id}`}
                        expanded={findTaxa(taxa).map((taxon) => `${taxon.id}`)}
                    >
                        {taxa && taxa.map((taxon) => renderTreeItem(taxon))}
                    </TreeView>
                )}
        </div>
    );
};

export default TaxaList;
