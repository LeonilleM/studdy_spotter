import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import { Star } from 'lucide-react';
import { createReview } from '../../../../services/Reviews/Reviews'
import { loadingComponent } from '../../../../components/Loading'

const StarRating = ({ rating, setRating, starSize = 24, color = "secondary" }) => {
    const [hover, setHover] = useState(null);

    const renderInteractiveStars = () => {
        const stars = [];
        const totalStars = 5;

        for (let i = 1; i <= totalStars; i++) {

            const isFilled = i <= Math.floor(hover || rating);
            const isHalfFilled = !isFilled && i - 0.5 <= (hover || rating);

            stars.push(
                <label key={i} className="relative cursor-pointer">
                    <input
                        type="radio"
                        name="rating"
                        value={i - 0.5}
                        className="hidden"
                        onClick={() => setRating(i - 0.5)}
                    />
                    <input
                        type="radio"
                        name="rating"
                        value={i}
                        className="hidden"
                        onClick={() => setRating(i)}
                    />

                    {isFilled ? (
                        <Star
                            size={starSize}
                            className="fill-yellow-400 text-yellow-400"
                            onMouseEnter={() => setHover(i)}
                            onMouseLeave={() => setHover(null)}
                        />
                    ) : isHalfFilled ? (
                        <div className="relative">
                            <Star
                                size={starSize}
                                className="text-gray-300"
                                onMouseEnter={() => setHover(i - 0.5)}
                                onMouseLeave={() => setHover(null)}
                            />
                            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                                <Star
                                    size={starSize}
                                    className="fill-yellow-400 text-yellow-400"
                                    onMouseEnter={() => setHover(i - 0.5)}
                                    onMouseLeave={() => setHover(null)}
                                />
                            </div>
                        </div>
                    ) : (
                        <Star
                            size={starSize}
                            className="text-gray-300"
                            onMouseEnter={() => setHover(i)}
                            onMouseLeave={() => setHover(null)}
                        />
                    )}
                </label>
            );
        }

        return <div className="flex gap-1">{stars}</div>;
    };

    return (
        <div className="flex items-center">
            {renderInteractiveStars()}
            <span className={`text-xs text-${color} ml-2`}>
                ({(hover || rating).toFixed(1)})
            </span>
        </div>
    );
};



const ReviewModal = ({ locationId, userID, locationName, show, handleClose, handleSave }) => {
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSaveReview = async () => {
        setLoading(true);
        setError(null);
        try {
            await createReview(locationId, userID, rating, review);
            setSuccess(true);
            handleSave({ locationId, userID, rating, review });
            setTimeout(() => {
                setSuccess(false);
                handleClose();
            }, 2000); // Close modal after 2 seconds
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


    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4 sm:px-52 font-semibold">
            <div className="fixed inset-0 bg-gray-500 opacity-75" onClick={handleClose}></div>
            <div className="bg-primary rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-3/4 w-full py-6 px-12">
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
                                className="w-full h-52 border-2 border-secondary rounded-lg sm:p-10 p-4 pt-12 mt-2 relative"
                                value={review}
                                onChange={e => setReview(e.target.value)}
                                placeholder="Write your review here..."
                            />
                        </div>
                        {error && <div className="text-red-500 mt-2">{error}</div>}
                        {success && <div className="text-green-500 mt-2">Review submitted successfully!</div>}
                        <button
                            onClick={handleSaveReview}
                            disabled={loading}
                            className={`mt-4 py-2 px-4 rounded-lg text-white ${loading ? 'bg-gray-400' : 'bg-action hover:scale-'} transition duration-200`}
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
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleSave: PropTypes.func.isRequired,
};

export default ReviewModal;