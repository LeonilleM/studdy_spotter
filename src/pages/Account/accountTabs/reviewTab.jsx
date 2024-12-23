
import { NavLink } from 'react-router-dom';
import StarRating from '../../../components/StarRating';
import { useEffect, useState } from 'react';
import { fetchUserReviews } from '../../../services/Reviews/Reviews';
import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';


function ReviewTab({ userId }) {
    const [reviews, setReviews] = useState([]);
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

    return reviews.length > 0 ? (
        reviews.map((review) => {
            const studyPage = `/university/${review.StudyLocation.University.name}/${review.StudyLocation.name}`;
            const UniPage = `/university/${review.StudyLocation.University.name}`;
            return (
                <div key={review.id} className="flex flex-col my-4 text-black pb-8">
                    <div className="flex">
                        <NavLink to={studyPage}>
                            <img src={review.StudyLocation.image_url} alt="location" className="w-24 h-24 sm:w-50 sm:h-50 min-w-24 min-h-24 rounded-md" />
                        </NavLink>
                        <div className="flex flex-col ml-4 font-lato">
                            <NavLink
                                to={studyPage}
                                className="font-bold text-lg font-poppins hover:underline">
                                {review.StudyLocation.name}
                            </NavLink>
                            <NavLink
                                to={UniPage}
                                className="text-sm hover:underline">{review.StudyLocation.University.name}</NavLink>
                            <div className="flex flex-row flex-wrap gap-1 pt-2 text-white">
                                <span className="text-xs font-bold bg-darkBlue py-1 px-3 align-center">{review.StudyLocation.category}</span>
                                {review.StudyLocation.LocationTagList.map((tag, index) => {
                                    const tagName = tag.TagTypes?.name || 'no-name';
                                    return (
                                        <span key={`tag-${index}-${tagName}`} className="text-xs bg-darkBlue font-bold py-1 px-3 align-center">
                                            {tagName}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                        <StarRating rating={review.rating} />
                        <span className="text-sm">
                            {new Date(review.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: '2-digit'
                            })}
                        </span>
                    </div>
                    <div className="mt-4">
                        <p>{review.description}</p>
                    </div>
                    {review.updated_at && (
                        <p className="text-xs text-gray-500 mt-4">
                            Updated {formatDistanceToNow(new Date(review.updated_at))} ago
                        </p>
                    )}
                    <hr className="border-[1px] border-black mt-14" />
                </div>
            );
        })
    ) : (
        <p>No reviews written</p>
    );
}

ReviewTab.propTypes = {
    userId: PropTypes.string
};



export default ReviewTab

