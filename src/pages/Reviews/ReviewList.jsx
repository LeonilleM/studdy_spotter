import { useState } from 'react';
import ReviewListItems from './helper/reviewListItems';
import ReviewFilter from './helper/reviewFilter';
import PropTypes from 'prop-types'
function ReviewList({ reviews, handleEditReview, onFilterChange }) {
    const [visibleReviews, setVisibleReviews] = useState(10); // Number of reviews to show initially

    const loadMoreReviews = () => {
        setVisibleReviews((prev) => prev + 8); // Load 10 more reviews
    };

    return (
        <>
            {reviews.userReview.length > 0 && (
                <div key="user-reviews" className="mb-10">
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
            <div className="sticky top-0 bg-background  pb-4 mb-4 border-b border-gray-300  z-10">
                <h1 className="font-bold text-3xl font-poppins text-heading">Reviews</h1>
                <ReviewFilter onFilterChange={onFilterChange} />
            </div>

            {reviews.otherReviews.slice(0, visibleReviews).map((review, index) => (
                <ReviewListItems
                    key={review.id || `review-${index}`}
                    review={review}
                />
            ))}

            {visibleReviews < reviews.otherReviews.length && (
                <button
                    onClick={loadMoreReviews}
                    className="mt-6 mx-auto block bg-accent text-white py-2 px-4 rounded-lg  transition duration-300"
                >
                    Load More
                </button>
            )}
        </>
    );
}

ReviewList.propTypes = {
    reviews: PropTypes.object.isRequired,
    handleEditReview: PropTypes.func.isRequired,
    onFilterChange: PropTypes.func.isRequired
};


export default ReviewList;