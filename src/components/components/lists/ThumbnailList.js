import React from 'react';
import List from '@material-ui/core/List';

/**
 * Render thumbnail list
 */
const ThumbnailList = ({ media }) => (
    <List className="flex">
        {media && media.map(
            (element) => <img key={element.mediaid} className="h-24 mt-6 mr-4 rounded" alt="Thumbnail" src={`${process.env.REACT_APP_BUILDER_API_URL}/media/thumbnails/${element.mediaid}`} />,
        )}
    </List>
);

export default ThumbnailList;
