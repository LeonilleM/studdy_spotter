import { FaUser } from 'react-icons/fa';
import StarRating from '../../../components/StarRating';
import { formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types';
import { BsThreeDots } from 'react-icons/bs';

function reviewListItems({ review, isUserReview, onEditReview }) {

    return (
        <div className="flex flex-col space-y-2 pb-24 ">
            {isUserReview && <h1 className="font-bold text-3xl font-poppins">Your Review</h1>}
            <div className="flex flex-col font-lato w-full py-4 px-2">
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
                <p className="mt-4">{review.description}</p>
                {review.updated_at && (
                    <p className="text-xs text-gray-500 mt-4">
                        Updated {formatDistanceToNow(new Date(review.updated_at))} ago
                    </p>
                )}
            </div>
            <hr className="w-full border-secondary" />
        </div>
    );
}

reviewListItems.propTypes = {
    review: PropTypes.object.isRequired,
    isUserReview: PropTypes.bool,
    onEditReview: PropTypes.func
}

export default reviewListItems