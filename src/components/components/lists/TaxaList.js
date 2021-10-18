import React, { useContext, useEffect, useState } from 'react';
import TreeView from '@material-ui/lab/TreeView';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import SubdirectoryArrowRight from '@material-ui/icons/SubdirectoryArrowRight';
import Stop from '@material-ui/icons/Stop';
import CompareArrows from '@material-ui/icons/CompareArrows';
import TreeItem from '@material-ui/lab/TreeItem';
import EditOutlined from '@material-ui/icons/EditOutlined';
import IconButton from '@material-ui/core/IconButton';
import LanguageContext from '../../../context/LanguageContext';
import { findTaxa } from '../../../utils/taxon';
import getInputChange from '../../../utils/input-change';
import TextInput from '../inputs/TextInput';
import ListAvatar from '../ListAvatar';
import AddButton from '../buttons/AddButton';

/**
 * Render taxa list
 */
const TaxaList = ({
    taxa, selectedTaxon, onSelectTaxon, onEditTaxon, onClickAdd, onChangeSort,
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
        <div className={type === 'list' ? 'p-2 h-16 flex' : 'p-4 flex'}>
            <span className="hidden lg:inline">
                <ListAvatar
                    media={taxon.media}
                    alt="Taxon"
                />
            </span>
            <ul>
                <li className="overflow-hidden overflow-ellipsis whitespace-nowrap w-40 xl:w-60">
                    {taxon.scientificName}
                </li>
                <li className="text-gray-500 text-sm ml-1 overflow-hidden overflow-ellipsis whitespace-nowrap w-40 xl:w-60">
                    {taxon.vernacularName && taxon.vernacularName[language.language.split('_')[0]]
                        ? taxon.vernacularName[language.language.split('_')[0]]
                        : language.dictionary.unknown}
                </li>
            </ul>
            <span className="absolute right-4 top-3">
                <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => onEditTaxon(taxon.id)}
                >
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
            className={selectedTaxon && selectedTaxon.id === taxon.id
                ? 'bg-blue-200 rounded mt-4 cursor-pointer' : 'rounded mt-4 cursor-pointer'}
            onClick={() => onSelectTaxon(taxon)}
        >
            {renderLabel('list', taxon)}
        </ListItem>
    );

    return (
        <div className="mr-4 border-r border-solid rounded h-full overflow-hidden pb-36">
            <div className="pl-2">
                <div className="flex mr-2">
                    <AddButton
                        label={language.dictionary.labelTaxa}
                        onClick={() => onClickAdd()}
                    />
                    <span className="ml-3">
                        <IconButton
                            edge="start"
                            aria-label="add"
                            color="primary"
                            title={language.dictionary.btnSwitchLists}
                            onClick={() => onChangeSort()}
                        >
                            <CompareArrows />
                        </IconButton>
                    </span>
                </div>
                <div className="w-80">
                    <TextInput
                        name="filter"
                        label={language.dictionary.labelSearch}
                        value={formValues.filter}
                        maxLength={280}
                        standard
                        onChange={(e) => setFormValues(getInputChange(e, formValues))}
                    />
                </div>
            </div>
            <hr />
            <div className="overflow-y-auto h-full mt-1">
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
        </div>
    );
};

export default TaxaList;
