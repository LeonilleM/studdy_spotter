import { FaUser } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import StarRating from '../../components/StarRating';
import { formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types';

function ReviewList({ reviews, handleEditReview }) {
    if (!reviews) {
        return (
            <p className="text-center text-secondary font-bold">No reviews currently</p>
        );
    }

    return (
        <>
            {reviews.userReview.map((review, index) => (
                <div key={review.id || `user-review-${index}`} className="flex flex-col space-y-2 pb-24">
                    <h1 className="font-bold">Your Review</h1>
                    <div className="flex flex-col font-lato w-full py-4 px-2">
                        <div className="flex flex-row justify-between items-center">
                            <div className="flex flex-row gap-4">
                                {review.Users.image_url ? (
                                    <img src={review.Users.image_url} alt="avatar" className="w-14 h-14 rounded-full" />
                                ) : (
                                    <FaUser className="w-14 h-14 text-white bg-gray-300 rounded-full" />
                                )}
                                <div className="flex flex-col justify-center">
                                    <p className="font-bold">{review.Users.first_name} {review.Users.last_name}</p>
                                    <p className="text-sm text-gray-500">{review.Users.University ? review.Users.University.name : 'No School Affiliation'}</p>
                                </div>
                            </div>
                            <BsThreeDots
                                onClick={() => {
                                    console.log('edit review');
                                    handleEditReview(review);
                                }}
                                className="text-secondary h-5 w-5 hover:cursor-pointer hover:text-black"
                            />
                        </div>
                        <div className="flex flex-row gap-4 items-center font-poppins text-sm text-light mt-2">
                            <StarRating rating={review.rating} />
                            <p>Posted {formatDistanceToNow(new Date(review.created_at))} ago</p>
                        </div>
                        <p className="mt-4">{review.description}</p>
                        {review.updated_at && (
                            <p className="text-xs text-gray-500 mt-4">Updated {formatDistanceToNow(new Date(review.updated_at))} ago</p>
                        )}
                    </div>
                    <hr className="bg-slate-500 h-1 rounded w-full mt-6" />
                </div>
            ))}
            {reviews.otherReviews.map((review, index) => (
                <div key={review.id || `review-${index}`} className="flex flex-row pb-24">
                    <div className="flex flex-col font-lato w-full">
                        <div className="flex flex-row gap-2">
                            {review.Users.image_url ? (
                                <img src={review.Users.image_url} alt="avatar" className="w-14 h-14 rounded-full" />
                            ) : (
                                <FaUser className="w-14 h-14 text-white bg-gray-300 rounded-full" />
                            )}
                            <div className="flex flex-col justify-center">
                                <p className="font-bold">{review.Users.first_name} {review.Users.last_name}</p>
                                <p className="text-sm text-gray-500">{review.Users.University ? review.Users.University.name : 'No School Affiliation'}</p>
                            </div>
                        </div>
                        <div className="flex flex-row gap-4 items-center font-poppins text-sm text-light mt-2">
                            <StarRating rating={review.rating} />
                            <p>Posted {formatDistanceToNow(new Date(review.created_at))} ago</p>
                        </div>
                        <p className="mt-2">{review.description}</p>
                        {review.updated_at && (
                            <p className="text-xs text-gray-500 mt-4 italic">Updated {formatDistanceToNow(new Date(review.updated_at))} ago</p>
                        )}
                        <hr className="bg-slate-500 h-1 rounded w-full mt-4" />
                    </div>
                </div>
            ))}
        </>
    );
}

ReviewList.propTypes = {
    reviews: PropTypes.object.isRequired,
    handleEditReview: PropTypes.func.isRequired
};


export default ReviewList;