import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';

/**
 * Render list avatar
 */
const ListAvatar = ({ media, alt, rightAlign }) => {
    if (media && media.length > 0) {
        return (
            <Avatar
                className={rightAlign ? 'ml-4' : 'mr-4'}
                alt={alt}
                src={`${process.env.REACT_APP_BUILDER_API_URL}/media/thumbnails/${media[0].mediaid || media[0]}`}
            />
        );
    }

    return (
        <Avatar className={rightAlign ? 'ml-4' : 'mr-4'}>
            <ImageIcon />
        </Avatar>
    );
};

export default ListAvatar;
