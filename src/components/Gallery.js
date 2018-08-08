import React, { Component }from 'react';
import PropTypes from 'prop-types';
import GridGallery from 'react-grid-gallery';

export class Gallery extends Component {
    static propType = {
        images: PropTypes.arrayOf(
            PropTypes.shape({
                user: PropTypes.string.isRequired,
                src: PropTypes.string.isRequired,
                thumbnail: PropTypes.string.isRequired,
                caption: PropTypes.string,
                thumbnailWidth: PropTypes.number.isRequired,
                thumbnailHeight: PropTypes.number.isRequired
            })
        )
    }

    render () {
        const images = this.props.images.map((image)=>{
            return {
                ...image,
                customOverlay: (
                    <div style={captionStyle}>
                        <div>{`${image.user}: ${image.caption}`}</div>
                    </div>
                )
            }
        })
        return (<GridGallery
            images={images}
            enableImageSelection={false}
            backdropClosesModal
        />)
    }
}

const captionStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    maxHeight: "240px",
    overflow: "hidden",
    position: "absolute",
    bottom: "0",
    width: "100%",
    color: "white",
    padding: "2px",
    fontSize: "90%"
};
