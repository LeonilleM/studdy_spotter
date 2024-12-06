import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import { createReview } from '../../../../services/Reviews/Reviews'
import StarRating from './starRating';


const ReviewModal = ({ locationId, userID, locationName, show, handleClose, handleNewReview }) => {
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSaveReview = async () => {
        setLoading(true);
        setError(null);
        try {
            const userReview = await createReview(locationId, userID, rating, review);
            setSuccess(true);
            console.log(userReview);
            handleNewReview(userReview);
            setTimeout(() => {
                setSuccess(false);
                handleClose();
            }, 1000); // Close modal after 2 seconds
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
            setReview(text);
            setError(null);
            return;
        } else {
            setError("Word limit exceeded");
        }
    };

    const wordCounter = (text) => {
        return text.trim().split(/\s+/).filter(word => word !== '').length;
    }



    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4 font-semibold">
            <div className="fixed inset-0 bg-black opacity-75" onClick={handleClose}></div>
            <div className="bg-background rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-2/3 w-full   py-6 sm:px-12">
                <div className="flex flex-col p-6">
                    <div className="flex flex-row justify-between items-center">
                        <h1 className="font-poppins text-2xl text-secondary">{locationName}</h1>
                        <button onClick={handleClose} className="text-secondary">
                            <FaTimes className="w-6 h-6 hover:text-red-700 transition duration-500 ease-in-out" />
                        </button>
                    </div>
                    <div className="w-full flex-col font-lato text-secondary pt-6 space-y-2">
                        <h1 className="text-xl font-bold">Write Review</h1>
                        <div className="relative">
                            <StarRating rating={rating} setRating={setRating} />
                            <textarea
                                className="w-full h-52  border-2 border-secondary rounded-md sm:py-10 px-4 p-4 pt-12 mt-2 relative"
                                value={review}
                                onChange={handleInput}
                                placeholder="Write your review here..."
                            />
                            <span className={`text-sm ${error ? 'text-red-500' : 'text-gray-500'}`}>{wordCounter(review)} / 500 words</span>
                        </div>
                        {error && <div className="text-red-500 mt-2">{error}</div>}
                        {success && <div className="text-green-500 mt-2">Review submitted successfully!</div>}
                        <button
                            onClick={handleSaveReview}
                            disabled={loading}
                            className={`mt-4 py-2 px-4 rounded-lg text-white ${loading ? 'bg-gray-400' : 'bg-action'} transition duration-200`}
                        >
                            {loading ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

ReviewModal.propTypes = {
    locationId: PropTypes.string,
    userID: PropTypes.string,
    locationName: PropTypes.string,
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleNewReview: PropTypes.func.isRequired,
};




export default ReviewModal;