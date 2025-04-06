import React from 'react';
import PropTypes from 'prop-types';

class ImageUpload extends React.Component {
    state = {
        files: [],
        captions: []
    };

    fileSelectHandler = (event, index) => {
        const file = event.target.files[0];
        if (file) {
            const newFiles = [...this.state.files];
            newFiles[index] = URL.createObjectURL(file);
            this.setState({ files: newFiles });
            this.props.onImageChange(newFiles, this.state.captions);
        }
    };

    handleCaptionChange = (event, index) => {
        const newCaptions = [...this.state.captions];
        newCaptions[index] = event.target.value;
        this.setState({ captions: newCaptions });
        this.props.onImageChange(this.state.files, newCaptions);
    };


}

ImageUpload.propTypes = {
    onImageChange: PropTypes.func.isRequired,
};

export default ImageUpload;