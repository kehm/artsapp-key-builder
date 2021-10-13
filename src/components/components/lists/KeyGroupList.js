import React, { useEffect, useState } from 'react';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import EditOutlined from '@material-ui/icons/EditOutlined';
import ListOutlined from '@material-ui/icons/ListOutlined';
import IconButton from '@material-ui/core/IconButton';
import ListAvatar from '../ListAvatar';

/**
 * Render key group list
 */
const KeyGroupList = ({
    groups, isEditor, onOpenList, onEdit,
}) => {
    const [mainGroups, setMainGroups] = useState(undefined);

    /**
     * Find main groups
     */
    useEffect(() => {
        if (groups) {
            const main = groups.filter((element) => !element.parent_id);
            if (JSON.stringify(main) !== JSON.stringify(mainGroups)) setMainGroups(main);
        }
    }, [groups, mainGroups]);

    /**
     * Render key group label
     *
     * @param {Object} group Key group object
     * @returns JSX
     */
    const renderLabel = (group) => (
        <div className="p-4 w-96 flex items-center">
            <ListAvatar
                media={group.media}
                alt="Group"
            />
            <span className="overflow-hidden overflow-ellipsis whitespace-nowrap w-44">{group.name}</span>
            <span className="absolute right-16 top-3">
                <IconButton
                    edge="end"
                    aria-label="list"
                    onClick={() => onOpenList(group)}
                >
                    <ListOutlined />
                </IconButton>
            </span>
            <span className="absolute right-4 top-3">
                <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => onEdit(group.id)}
                    disabled={!isEditor}
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
    const renderItem = (group) => {
        const subGroups = groups.filter((element) => element.parent_id === group.id);
        return (
            <TreeItem key={group.id} nodeId={`${group.id}`} label={renderLabel(group)}>
                {subGroups.map((subGroup) => renderItem(subGroup))}
            </TreeItem>
        );
    };

    return (
        <TreeView
            className="w-96"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
        >
            {groups && mainGroups && mainGroups.map((group) => renderItem(group))}
        </TreeView>
    );
};

export default KeyGroupList;
