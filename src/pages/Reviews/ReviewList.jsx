import ReviewListItems from './helper/reviewListItems';
import PropTypes from 'prop-types';
import ReviewFilter from './helper/reviewFilter';

function ReviewList({ reviews, handleEditReview, onFilterChange }) {
    if (!reviews) {
        return (
            <p className="text-center text-secondary font-bold">No reviews currently</p>
        );
    }

    return (
        <>
            {reviews.userReview.length > 0 && (
                <div key="user-reviews" className="pb-20">
                    <h1 className="font-bold text-3xl font-poppins text-heading">Your Review</h1>
                    {reviews.userReview.map((review, index) => (
                        <ReviewListItems
                            key={review.id || `user-review-${index}`}
                            review={review}
                            isUserReview
                            onEditReview={handleEditReview}
                        />
                    ))}
                </div>
            )}
            <h1 className="font-bold text-3xl font-poppins text-heading ">Reviews</h1>
            <ReviewFilter
                onFilterChange={onFilterChange}
            />
            {reviews.otherReviews.map((review, index) => (
                <ReviewListItems
                    key={review.id || `review-${index}`}
                    review={review}
                />
            ))}
        </>
    );
}

ReviewList.propTypes = {
    reviews: PropTypes.object.isRequired,
    handleEditReview: PropTypes.func.isRequired,
    onFilterChange: PropTypes.func.isRequired
};


export default ReviewList;