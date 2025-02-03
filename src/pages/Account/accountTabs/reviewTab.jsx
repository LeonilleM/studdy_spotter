import { useState, useEffect } from 'react';
import ReviewModal from '../../Reviews/helper/reviewModal'; // Adjust the import path as needed
import ReviewSetting from '../../Reviews/helper/reviewSettings'; // Adjust the import path as needed
import { fetchUserReviews } from '../../../services/Reviews/Reviews';
import { formatDistanceToNow } from 'date-fns';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import StarRating from '../../../components/StarRating'; // Adjust the import path as needed
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';

function ReviewTab({ userId }) {
    const [reviews, setReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showFullText, setShowFullText] = useState({});
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSettingMenu, setShowSettingMenu] = useState(false);
    const [reviewToEdit, setReviewToEdit] = useState(null);
    const reviewsPerPage = 3;
    const MAX_LENGTH = 200;

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

    const handleEditReview = (review) => {
        console.log("Review", review);
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
                setReviews(reviewsData);
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

    return (
        <div>
            {currentReviews.length > 0 ? (
                currentReviews.map((review) => {
                    const studyPage = `/university/${review.StudyLocation.University.name}/${review.StudyLocation.name}`;
                    const UniPage = `/university/${review.StudyLocation.University.name} ${review.StudyLocation.University.city}`;
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
                                    Posted On {new Date(review.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: '2-digit'
                                    })}
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
                            {
                                review.updated_at && (
                                    <p className="text-xs text-gray-500 mt-4 font-lato">
                                        Updated {formatDistanceToNow(new Date(review.updated_at))} ago
                                    </p>
                                )
                            }
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
                        className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-darkBlue text-white' : 'bg-gray-200 text-black'}`}
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
        </div >
    );
}

ReviewTab.propTypes = {
    userId: PropTypes.string.isRequired,
};

export default ReviewTab;