import PropTypes from 'prop-types';
import { insertUploadedImages } from '../../../services/Reviews/Reviews';
import useImageUpload from './useImageUploads'; // Ensure the correct path
import { useState } from 'react'


const ImageUpload = ({ reviewData }) => {
    const {
        images,
        currentIndex,
        dragging,
        handleDrop,
        handleDragOver,
        handleDragLeave,
        handleFileChange,
        handleNextImage,
        handlePrevImage,
    } = useImageUpload();

    const [captions, setCaptions] = useState([]);
    const [uploadStatus, setUploadStatus] = useState(null);

    const handleCaptionChange = (event, index) => {
        const newCaptions = [...captions];
        newCaptions[index] = event.target.value;
        setCaptions(newCaptions);
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
            console.log('All images uploaded successfully');
        } catch (error) {
            console.error('Image upload failed:', error);
            setUploadStatus('Upload failed.');
        }
    };

    return (
        <div>
            <div
                className={`relative bg-gray-100 border border-dashed border-gray-300 rounded-lg h-60 flex items-center justify-center hover:border-secondary hover:scale-105 duration-500 transition ease-in-out focus-within:border-primary focus-within:scale-105 ${dragging ? 'bg-gray-200' : ''
                    }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                {images.length > 0 ? (
                    <div className="relative w-full h-full">
                        <img
                            src={images[currentIndex].preview}
                            alt={`Uploaded ${currentIndex + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                        />
                        {images.length > 1 && (
                            <div className="absolute inset-0 flex justify-between items-center px-4">
                                <button
                                    type="button"
                                    onClick={handlePrevImage}
                                    className="text-white bg-gray-800 bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition"
                                >
                                    &#10094;
                                </button>
                                <button
                                    type="button"
                                    onClick={handleNextImage}
                                    className="text-white bg-gray-800 bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition"
                                >
                                    &#10095;
                                </button>
                            </div>
                        )}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {images.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-primary' : 'bg-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center cursor-pointer"
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
                        />
                    </label>
                )}
            </div>
            {images.map((image, index) => (
                <div key={index} className="mt-4">
                    <input
                        type="text"
                        placeholder="Enter caption"
                        value={captions[index] || ''}
                        onChange={(event) => handleCaptionChange(event, index)}
                        className="border p-2 rounded w-full"
                    />
                </div>
            ))}
            <button
                onClick={handleUpload}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
                Upload
            </button>
            {uploadStatus && <p>{uploadStatus}</p>}
        </div>
    );
};

ImageUpload.propTypes = {
    reviewData: PropTypes.shape({
        review_id: PropTypes.number.isRequired,
        user_id: PropTypes.string.isRequired,
        study_location_id: PropTypes.string.isRequired,
    }),
};

export default ImageUpload;