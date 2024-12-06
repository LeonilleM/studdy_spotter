
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import { deleteReview, updateReview } from '../../../../services/Reviews/Reviews';
import StarRating from './starRating';

function EditReview({ show, handleClose, userID, studyLocationID, review }) {
    const [rating, setRating] = useState(review?.rating || 0);
    const [description, setDescription] = useState(review?.description || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (review) {
            setRating(review.rating);
            setDescription(review.description);
        }
    }, [review]);

    if (!show) {
        return null;
    }

    const handleUpdate = async () => {
        setLoading(true);
        setError(null);
        try {
            await updateReview(userID, studyLocationID, rating, description);
            setSuccess(true);
            console.log('Review Updated');
            setTimeout(() => {
                setSuccess(false);
                handleClose();
            }, 1000); // Close modal after 1 second
        } catch (error) {
            setError(error.message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    const handleIsUpdating = () => {
        setIsUpdating(true);
    };

    const handleDelete = async () => {
        try {
            await deleteReview(userID, studyLocationID);
            handleClose();
            console.log('Review Deleted');
        } catch (error) {
            console.error(error);
        }
    };

    const handleInput = (e) => {
        const text = e.target.value;
        const wordCount = wordCounter(text);

        if (wordCount <= 500) {
            setDescription(text);
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
            <div className="bg-background rounded-lg overflow-hidden shadow-xl transform transition-all py-6 sm:px-12">
                <button onClick={handleClose} className="text-secondary">
                    <FaTimes className="w-4 h-4 hover:text-red-700 transition duration-500 ease-in-out" />
                </button>
                <div className="flex flex-col p-6">
                    <div className="flex flex-row justify-between items-center">
                        <h1 className="font-poppins text-2xl text-secondary">Edit Review</h1>

                    </div>
                    <div className="w-full flex-col font-lato text-secondary pt-6 space-y-2">
                        <button
                            onClick={handleIsUpdating}
                            className="text-action font-bold hover:text-action-dark flex flex-row items-center gap-2"
                        >
                            Update?
                        </button>
                        {isUpdating && (
                            <div className="flex flex-col">
                                <div className="relative">
                                    <StarRating rating={rating} setRating={setRating} />
                                    <textarea
                                        className="w-full h-52 border-2 border-secondary rounded-md sm:py-10 px-4 p-4 pt-12 mt-2 relative"
                                        value={description}
                                        onChange={handleInput}
                                        placeholder="Edit your review here..."
                                    />
                                    <span className={`text-sm ${error ? 'text-red-500' : 'text-gray-500'}`}>{wordCounter(description)} / 500 words</span>
                                </div>
                                <button
                                    onClick={handleUpdate}
                                    disabled={loading}
                                    className={`mt-4 py-2 px-4 rounded-lg text-white ${loading ? 'bg-gray-400' : 'bg-action'} transition duration-200`}
                                >
                                    {loading ? 'Updating...' : 'Update Review'}
                                </button>
                            </div>

                        )}
                        <button
                            onClick={handleDelete}
                            className="text-red-500 font-bold hover:text-red-700 flex flex-row items-center gap-2 mt-4"
                        >
                            <FaTrash />
                            Delete Review
                        </button>
                    </div>
                </div>
                {error && <div className="text-red-500 mt-2">{error}</div>}
                {success && <div className="text-green-500 mt-2">Review updated successfully!</div>}
            </div>
        </div>
    );
}

EditReview.propTypes = {
    show: PropTypes.bool,
    handleClose: PropTypes.func,
    userID: PropTypes.string,
    studyLocationID: PropTypes.string,
    review: PropTypes.object,
};




export default EditReview;