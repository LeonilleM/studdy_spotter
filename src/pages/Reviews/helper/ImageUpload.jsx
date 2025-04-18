import PropTypes from 'prop-types';
import { insertUploadedImages } from '../../../services/Reviews/Reviews';
import useImageUpload from './useImageUploads';
import { useState } from 'react';

const ImageUpload = ({ show, reviewData, handleClose }) => {
    const {
        images,
        setImages,
    } = useImageUpload();

    const [captions, setCaptions] = useState([]);
    const [uploadStatus, setUploadStatus] = useState(null);

    const handleCaptionChange = (event, index) => {
        const newCaptions = [...captions];
        newCaptions[index] = event.target.value;
        setCaptions(newCaptions);
    };

    const handleDeleteImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setCaptions((prevCaptions) => prevCaptions.filter((_, i) => i !== index));
        setImages(updatedImages);
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const newImages = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        const updatedImages = [...images, ...newImages].slice(0, 4);
        setImages(updatedImages);
        setCaptions((prevCaptions) => [...prevCaptions, ...new Array(newImages.length).fill('')]);
    };

    const handleUpload = async () => {
        try {
            setUploadStatus('Uploading...');
            for (let i = 0; i < images.length; i++) {
                const { file } = images[i];
                const caption = captions[i] || '';
                await insertUploadedImages(file, reviewData, caption);
            }
            setUploadStatus('Upload successful!');
            handleClose();
        } catch (error) {
            console.error('Image upload failed:', error);
            setUploadStatus('Upload failed.');
        }
    };

    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4 font-semibold">
            <div className="fixed inset-0 bg-black opacity-75" onClick={handleClose}></div>
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-2/3 w-full py-6 sm:px-12">
                <div
                    className={`relative bg-gray-100 border border-dashed border-gray-300 rounded-lg h-60 flex items-center justify-center hover:border-secondary hover:scale-105 duration-500 transition ease-in-out`}
                >
                    <label
                        htmlFor="image-upload"
                        className={`flex flex-col items-center cursor-pointer ${images.length >= 4 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                        <span className="text-gray-600">Upload Images (1-4)</span>
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            multiple
                            onChange={handleFileChange}
                            disabled={images.length >= 4}
                        />
                    </label>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    {images.map((image, index) => (
                        <div key={index} className="relative">
                            <img
                                src={image.preview}
                                alt={`Uploaded ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                            />
                            <input
                                type="text"
                                placeholder="Enter caption"
                                value={captions[index] || ''}
                                onChange={(event) => handleCaptionChange(event, index)}
                                className="border p-2 rounded w-full mt-2"
                            />
                            <button
                                onClick={() => handleDeleteImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
                <p className="text-gray-500 mt-2">
                    {4 - images.length} slots remaining
                </p>
                <button
                    onClick={handleUpload}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                >
                    Upload
                </button>
                {uploadStatus && <p>{uploadStatus}</p>}
            </div>
        </div>
    );
};

ImageUpload.propTypes = {
    show: PropTypes.bool,
    reviewData: PropTypes.shape({
        review_id: PropTypes.number.isRequired,
        user_id: PropTypes.string.isRequired,
        study_location_id: PropTypes.string.isRequired,
    }),
    handleClose: PropTypes.func,
};

export default ImageUpload;