import { FaUser } from 'react-icons/fa';
import StarRating from '../../../components/StarRating';
import { formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types';
import { BsThreeDots } from 'react-icons/bs';
import { useState } from 'react';

function ReviewListItems({ review, isUserReview, onEditReview }) {
    const [showFullText, setShowFullText] = useState(false);
    const MAX_LENGTH = 200;
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const openLightbox = (index) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const showNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % review.post_images.length);
    };

    const showPrevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex - 1 + review.post_images.length) % review.post_images.length
        );
    };

    const toggleShowFullText = () => {
        setShowFullText(!showFullText);
    };

    const renderText = (text) => {
        if (showFullText || text.length <= MAX_LENGTH) {
            return text;
        }
        return `${text.substring(0, MAX_LENGTH)}...`;
    };

    return (
        <div className="flex flex-col space-y-2 ">
            <div className="flex flex-col font-lato w-full">
                <div className="flex flex-row justify-between items-center mt-6">
                    <div className="flex flex-row gap-4">
                        {review.Users?.image_url ? (
                            <img
                                src={review.Users.image_url}
                                alt="avatar"
                                className="w-14 h-14 rounded-full"
                            />
                        ) : (
                            <FaUser className="w-14 h-14 text-white bg-gray-300 rounded-full" />
                        )}
                        <div className="flex flex-col justify-center">
                            <p className="font-bold">
                                {review.Users
                                    ? `${review.Users.first_name} ${review.Users.last_name}`
                                    : "Anonymous"}
                            </p>
                            <p className="text-sm text-gray-500">
                                {review.Users?.University?.name || "No School Affiliation"}
                            </p>
                        </div>
                    </div>
                    {isUserReview && (
                        <BsThreeDots
                            onClick={() => {
                                onEditReview(review);
                            }}
                            className="text-secondary h-5 w-5 hover:cursor-pointer hover:text-black"
                        />
                    )}
                </div>
                <div className="flex flex-row gap-4 items-center font-poppins text-sm text-light mt-4 md:justify-normal justify-between">
                    <StarRating rating={review.rating} starSize={20} />
                    <p className="font-lato text-sm">Posted {formatDistanceToNow(new Date(review.created_at))} ago</p>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-lg">
                    {renderText(review.description)}
                    {review.description.length > MAX_LENGTH && (
                        <span
                            onClick={toggleShowFullText}
                            className="text-action hover:underline cursor-pointer flex"
                        >
                            {showFullText ? "Show Less" : "Read More"}
                        </span>
                    )}
                </p>
                {review.post_images && review.post_images.length > 0 &&
                    <div className="flex gap-4 mt-10 overflow-x-scroll">
                        {review.post_images.map((image, index) => (
                            <div
                                className="flex flex-col space-y-2"
                                key={index}>
                                <img
                                    onClick={() => openLightbox(index)}
                                    src={image.image_url}
                                    alt={image.description || `Review Image ${index + 1}`}
                                    className="w-52 object-cover rounded-lg"
                                />
                                <h1 className="w-full">{image.description}</h1>
                            </div>
                        ))}
                    </div>
                }
                {review.updated_at && (
                    <p className="text-xs text-gray-500 mt-10 ">
                        Updated {formatDistanceToNow(new Date(review.updated_at))} ago
                    </p>
                )}
                {!isUserReview && <hr className="w-full  border-gray-300 mt-5 mb-12" />}
            </div>
            {/* Lightbox */}
            {lightboxOpen && (
                <div className="fixed inset-0 -top-2 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="relative container mx-auto px-4 flex items-center justify-center">
                        <div className="relative p-10">
                            <button
                                onClick={closeLightbox}
                                className="absolute top-0 left-4 text-white text-3xl"
                            >
                                &times;
                            </button>
                            <img
                                src={review.post_images[currentImageIndex].image_url}
                                alt={review.post_images[currentImageIndex].description || 'Review Image'}
                                className="w-full h-full object-contain"

                            />

                            <p className="text-white text-center mt-4">
                                {review.post_images[currentImageIndex].description}
                            </p>
                        </div>
                        {review.post_images.length > 1 && (
                            <>
                                <button
                                    onClick={showPrevImage}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl"
                                >
                                    &#10094;
                                </button>
                                <button
                                    onClick={showNextImage}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl"
                                >
                                    &#10095;
                                </button>
                            </>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
}

ReviewListItems.propTypes = {
    review: PropTypes.object.isRequired,
    isUserReview: PropTypes.bool,
    onEditReview: PropTypes.func
}

export default ReviewListItems