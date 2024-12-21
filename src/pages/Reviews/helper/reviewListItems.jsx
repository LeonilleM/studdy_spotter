import { FaUser } from 'react-icons/fa';
import StarRating from '../../../components/StarRating';
import { formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types';
import { BsThreeDots } from 'react-icons/bs';
import { useState } from 'react';

function ReviewListItems({ review, isUserReview, onEditReview }) {
    const [showFullText, setShowFullText] = useState(false);
    const MAX_LENGTH = 200; // Character count

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
        <div className="flex flex-col space-y-2 pb-24 ">
            {isUserReview && <h1 className="font-bold text-3xl font-poppins">Your Review</h1>}
            <div className="flex flex-col font-lato w-full py-4">
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row gap-4">
                        {review.Users.image_url ? (
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
                                {review.Users.first_name} {review.Users.last_name}
                            </p>
                            <p className="text-sm text-gray-500">
                                {review.Users.University?.name || 'No School Affiliation'}
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
                <p className="mt-4 whitespace-pre-wrap">
                    {renderText(review.description)}
                    {review.description.length > MAX_LENGTH && (
                        <span
                            onClick={toggleShowFullText}
                            className="text-action hover:underline cursor-pointer flex"
                        >
                            {showFullText ? ' Show Less' : ' Read More'}
                        </span>
                    )}
                </p>
                {review.updated_at && (
                    <p className="text-xs text-gray-500 mt-4">
                        Updated {formatDistanceToNow(new Date(review.updated_at))} ago
                    </p>
                )}
            </div>
            {!isUserReview && (<hr className="w-full border-secondary" />)}
        </div>
    );
}

ReviewListItems.propTypes = {
    review: PropTypes.object.isRequired,
    isUserReview: PropTypes.bool,
    onEditReview: PropTypes.func
}

export default ReviewListItems