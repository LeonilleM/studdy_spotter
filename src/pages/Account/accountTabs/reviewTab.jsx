import { useState, useEffect } from 'react';
import ReviewModal from '../../Reviews/helper/reviewModal'; // Adjust the import path as needed
import ReviewSetting from '../../Reviews/helper/reviewSettings'; // Adjust the import path as needed
import { fetchUserReviews } from '../../../services/Reviews/Reviews';
import { formatDistanceToNow, format } from 'date-fns';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import StarRating from '../../../components/StarRating'; // Adjust the import path as needed
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import ImageUpload from '../../Reviews/helper/ImageUpload';

function ReviewTab({ userId }) {
    const [reviews, setReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showFullText, setShowFullText] = useState({});
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSettingMenu, setShowSettingMenu] = useState(false);
    const [showUploadImageModal, setUploadImageModal] = useState(false)
    const [reviewToEdit, setReviewToEdit] = useState(null);
    const [selectedReview, setSelectedReview] = useState(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const reviewsPerPage = 5;
    const MAX_LENGTH = 200;

    const openLightbox = (review, index) => {
        setSelectedReview(review);
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };
    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const showNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex + 1) % selectedReview.post_images.length
        );
    };

    const showPrevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex - 1 + selectedReview.post_images.length) % selectedReview.post_images.length
        );
    };


    const toggleShowFullText = (reviewId) => {
        setShowFullText((prevState) => ({
            ...prevState,
            [reviewId]: !prevState[reviewId],
        }));
    };

    const renderText = (text, reviewId) => {
        if (showFullText[reviewId] || text.length <= MAX_LENGTH) {
            return text;
        }
        return `${text.substring(0, MAX_LENGTH)}...`;
    };

    const handleUploadImage = (review) => {
        setReviewToEdit(review);
        setUploadImageModal(true);
    };

    const handleEditReview = (review) => {
        setReviewToEdit(review);
        setShowSettingMenu(true);
    };

    const handleUpdateReview = (updatedReview) => {
        setReviews((prevReviews) =>
            prevReviews.map((review) =>
                review.id === updatedReview.id ? updatedReview : review
            )
        );
        setShowEditModal(false);
    };

    const handleDeleteReview = (deletedReviewId) => {
        setReviews((prevReviews) =>
            prevReviews.filter((review) => review.id !== deletedReviewId)
        );
        setShowEditModal(false);
    };

    const openReviewModal = () => {
        setShowEditModal(true);
    };

    useEffect(() => {
        const fetchReviews = async () => {
            try {

                const reviewsData = await fetchUserReviews(userId);
                const sortedData = reviewsData.sort((a, b) =>
                    new Date(b.created_at) - new Date(a.created_at)
                );

                setReviews(sortedData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchReviews();
    }, [userId]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);
    console.log(currentReviews)

    return (
        <div>
            {currentReviews.length > 0 ? (
                currentReviews.map((review) => {
                    const UniPage = `/university/${review.StudyLocation.University.name} ${review.StudyLocation.University.city}`;
                    const studyPage = `${UniPage}/${review.StudyLocation.name}`;
                    return (
                        <div key={review.id} className="flex flex-col my-4 text-black pb-8">
                            <div className="flex flex-row flex-wrap items-center gap-4 font-lato">
                                <NavLink to={studyPage}>
                                    <img src={review.StudyLocation.image_url} alt="location" className="sm:w-28 sm:h-28  rounded-md" />
                                </NavLink>
                                <div className="flex flex-col gap-4 sm:ml-2 space-y-1 xl:w-[80%]">
                                    <div className="flex flex-row justify-between items-center">
                                        <div className="flex flex-col">
                                            <NavLink
                                                to={studyPage}
                                                className="font-bold text-lg font-poppins hover:underline">
                                                {review.StudyLocation.name}
                                            </NavLink>
                                            <NavLink
                                                to={UniPage}
                                                className="text-sm hover:underline">{review.StudyLocation.University.name}, {review.StudyLocation.University.city}</NavLink>
                                        </div>
                                        <div
                                            onClick={() => handleEditReview(review)}
                                            className="text-secondary h-5 w-5 hover:cursor-pointer hover:text-black"
                                        >
                                            <BsThreeDots />
                                        </div>
                                    </div>

                                    <div className="flex flex-row flex-wrap gap-1 pt-2 text-white">
                                        <span className="text-xs font-bold bg-white text-black py-1 px-3 align-center">{review.StudyLocation.category}</span>
                                        {review.StudyLocation.LocationTagList.map((tag, index) => {
                                            const tagName = tag.TagTypes?.name || 'no-name';
                                            return (
                                                <span key={`tag-${index}-${tagName}`} className="text-xs bg-white text-black font-bold py-1 px-3 align-center">
                                                    {tagName}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 pt-5 font-lato">
                                <StarRating rating={review.rating} />
                                <span className="text-sm font-poppins sm:ml-2">
                                    Posted On {format(new Date(review.created_at), 'MMMM dd, yyyy')}
                                </span>
                            </div>
                            <p className="mt-4 whitespace-pre-wrap font-lato">
                                {renderText(review.description, review.id)}
                                {review.description.length > MAX_LENGTH && (
                                    <span
                                        onClick={() => toggleShowFullText(review.id)}
                                        className="text-action hover:underline cursor-pointer flex"
                                    >
                                        {showFullText[review.id] ? 'Show Less' : 'Read More'}
                                    </span>
                                )}
                            </p>
                            {review.post_images && review.post_images.length > 0 &&
                                <div className="flex gap-4 mt-4 overflow-x-scroll">
                                    {review.post_images.map((image, index) => (
                                        <img
                                            onClick={() => openLightbox(review, index)}
                                            key={index}
                                            src={image.image_url}
                                            alt={image.description || `Review Image ${index + 1}`}
                                            className="w-52 object-cover rounded-lg"
                                        />
                                    ))}
                                </div>
                            }
                            {review.updated_at && (
                                <p className="text-xs text-gray-500 mt-4 font-lato">
                                    Updated {formatDistanceToNow(new Date(review.updated_at))} ago
                                </p>
                            )}
                            <hr className="border-[1px] border-black mt-14" />
                        </div >
                    );
                })
            ) : (
                <p>No reviews written</p>
            )}
            <div className="flex justify-center mt-4 space-x-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`text-darkBlue`}
                >
                    <FaChevronLeft />
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`mx-1 px-3 py-1 rounded-lg ${currentPage === index + 1 ? 'bg-accent text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`text-darkBlue`}
                >
                    <FaChevronRight />
                </button>
            </div>
            {lightboxOpen && selectedReview && (
                <div className="fixed inset-0 -top-2 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="relative container mx-auto p-36 flex items-center justify-center">
                        <div className="relative p-10">
                            <button
                                onClick={closeLightbox}
                                className="absolute top-0 left-4 text-white text-3xl"
                            >
                                &times;
                            </button>
                            <img
                                src={selectedReview.post_images[currentImageIndex].image_url}
                                alt={selectedReview.post_images[currentImageIndex].description || 'Review Image'}
                                className="w-full h-full object-contain"
                            />
                            <p className="text-white text-center mt-4">
                                {selectedReview.post_images[currentImageIndex].description}
                            </p>
                        </div>
                        {selectedReview.post_images.length > 1 && (
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
            {showSettingMenu && (
                <ReviewSetting
                    show={showSettingMenu}
                    handleClose={() => setShowSettingMenu(false)}
                    review={reviewToEdit}
                    handleUpdateReview={handleUpdateReview}
                    handleDeleteReview={handleDeleteReview}
                    userID={userId}
                    studyLocationID={reviewToEdit.StudyLocation?.id}
                    updateModal={openReviewModal}
                    uploadImageModal={() => handleUploadImage(reviewToEdit)}
                />
            )}
            {showEditModal && (
                <ReviewModal
                    show={showEditModal}
                    handleClose={() => setShowEditModal(false)}
                    userID={userId}
                    locationId={reviewToEdit.StudyLocation?.id}
                    locationName={reviewToEdit.StudyLocation?.name}
                    review={reviewToEdit}
                />
            )}
            {showUploadImageModal && (
                <ImageUpload
                    show={showUploadImageModal}
                    reviewData={
                        reviewToEdit
                            ? {
                                review_id: reviewToEdit.id,
                                user_id: userId,
                                study_location_id: reviewToEdit.StudyLocation?.id || null,
                            }
                            : null
                    }
                    handleClose={() => setUploadImageModal(false)}
                />
            )}

        </div >
    );
}

ReviewTab.propTypes = {
    userId: PropTypes.string.isRequired,
};

export default ReviewTab;