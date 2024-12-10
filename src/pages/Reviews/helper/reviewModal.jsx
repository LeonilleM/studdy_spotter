import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import { createReview, updateReview } from '../../../services/Reviews/Reviews'
import StarRating from './starRating';


const ReviewModal = ({ locationId, userID, locationName, show, handleClose, handleNewReview, handleUpdateReview, review }) => {
    const [reviewText, setReviewText] = useState(review?.description || '');
    const [rating, setRating] = useState(review?.rating || 0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const isEditMode = !!review;

    useEffect(() => {
        if (review) {
            setReviewText(review.description);
            setRating(review.rating);
        }
    }, [review])

    const handleSaveReview = async () => {
        setLoading(true);
        setError(null);
        try {
            if (reviewText === '' || rating === 0) {
                setError('Please provide a rating and review before submitting');
                setLoading(false);
                return;
            }

            if (isEditMode) {
                const updatedReview = await updateReview(userID, locationId, rating, reviewText);
                handleUpdateReview(updatedReview);
            } else {
                const userReview = await createReview(locationId, userID, rating, reviewText);
                handleNewReview(userReview);
            }
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                handleClose();
            }, 2000);
        } catch (error) {
            if (error.message.includes('duplicate key value violates unique constraint')) {
                setError('You have already written a review for this location. Update your existing review instead.');
            } else {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    if (!show) {
        return null;
    }

    const handleInput = (e) => {
        const text = e.target.value;
        const wordCount = wordCounter(text);
        if (wordCount <= 500) {
            setReviewText(text);
            setError(null);
            return;
        } else {
            setError("Word limit exceeded");
        }
    };

    const wordCounter = (text) => {
        return text.trim().split(/\s+/).filter(word => word !== '').length;
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4 font-semibold">
            <div className="fixed inset-0 bg-black opacity-75" onClick={handleClose}></div>
            <div className="bg-background rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-2/3 w-full py-6 sm:px-12">
                <div className="flex flex-col p-6">
                    <div className="flex flex-row justify-between items-center">
                        <h1 className="font-poppins text-2xl text-secondary">{locationName}</h1>
                        <button onClick={handleClose} className="text-secondary">
                            <FaTimes className="w-6 h-6 hover:text-red-700 transition duration-500 ease-in-out" />
                        </button>
                    </div>
                    <div className="w-full flex-col font-lato text-secondary pt-6 space-y-2">
                        <h1 className="text-xl font-bold">{isEditMode ? 'Edit Review' : 'Write Review'}</h1>
                        <div className="relative">
                            <StarRating rating={rating} setRating={setRating} />
                            <textarea
                                className="w-full h-52 border-2 border-secondary rounded-md sm:py-10 px-4 p-4 pt-12 mt-2 relative"
                                value={reviewText}
                                onChange={handleInput}
                                placeholder="Write your review here..."
                            />
                            <span className={`text-sm ${error ? 'text-red-500' : 'text-gray-500'}`}>{wordCounter(reviewText)} / 500 words</span>
                        </div>
                        {error && <div className="text-red-500 mt-2">{error}</div>}
                        {success && <div className="text-green-500 mt-2">Review submitted successfully!</div>}
                        <button
                            onClick={handleSaveReview}
                            disabled={loading || success}
                            className={`mt-4 py-2 px-4 rounded-lg text-white ${success ? 'bg-gray-400 cursor-not-allowed' : 'bg-action'} transition duration-200`}
                        >
                            {loading ? 'Submitting...' : isEditMode ? 'Update Review' : 'Submit Review'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

ReviewModal.propTypes = {
    locationId: PropTypes.string.isRequired,
    userID: PropTypes.string.isRequired,
    locationName: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleNewReview: PropTypes.func,
    handleUpdateReview: PropTypes.func,
    review: PropTypes.object,
};

export default ReviewModal;