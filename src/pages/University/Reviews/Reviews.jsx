import { useEffect, useState, useContext } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { fetchStudyLocationData, } from '../../../services/StudyLocation/Study';
import { fetchAllReviews } from '../../../services/Reviews/Reviews';
import { formatDistanceToNow } from 'date-fns';
import StarRating from '../../../components/StarRating';
import { loadingComponent } from '../../../components/Loading';
import ReviewModal from './helper/reviewModal';
import { AuthContext } from '../../../services/Auth/AuthContext';
import FavoriteButton from './helper/favoriteButton'
import BackButton from '../../../components/shared/BackButton';
import { FaUser } from 'react-icons/fa';
import { BsThreeDots } from "react-icons/bs";
import EditReview from './helper/editReview';



function Reviews() {
    const { uniName, studyLocation, } = useParams(); // Get the study location from the URL
    const [locationDetails, setLocationDetails] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const { user } = useContext(AuthContext);

    const handleEditReview = () => {
        setShowEditModal(true);
    };

    const handleOpenModal = () => {
        if (user) {
            setShowModal(true);
        } else {
            alert('Please log in to write a review');
            setShowModal(false);
        }
    };

    const handleFavoriteButton = () => {
        if (!user) {
            alert('Please log in to add to favorites');
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const locationData = await fetchStudyLocationData(studyLocation, uniName);
                setLocationDetails(locationData);

                if (locationData) {
                    const reviewsData = await fetchAllReviews(locationData.id);
                    // Sort reviews by date
                    const sortedReviews = reviewsData.sort((a, b) =>
                        new Date(b.created_at) - new Date(a.created_at)
                    );

                    const userReview = sortedReviews.filter(review => review.Users.id === user?.id);
                    const otherReviews = sortedReviews.filter(review => review.Users.id !== user?.id);
                    setReviews({ userReview, otherReviews });

                }
            } catch (err) {
                setError(err.message || 'Location you\'ve selected is not available or not associated with the specified university');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [studyLocation, uniName, user?.id]);
    const totalReviews = (reviews.userReview?.length || 0) + (reviews.otherReviews?.length || 0);


    const handleNewReview = async (newReview) => {
        if (newReview) {

            const newReviews = await fetchAllReviews(locationDetails.id);
            const sortedReviews = newReviews.sort((a, b) =>
                new Date(b.created_at) - new Date(a.created_at)
            );
            const userReview = sortedReviews.filter(review => review.Users.id === user?.id);
            const otherReviews = sortedReviews.filter(review => review.Users.id !== user?.id);
            setReviews({ userReview, otherReviews });
        }
    };

    if (loading) {
        return loadingComponent();
    }

    if (error) {
        return (
            <div className="pt-20 overflow-x-hidden text-center h-[82vh] space-y-4  sm:px-0 px-4 flex flex-col items-center justify-center bg-primary text-secondary">
                <h1 className="text-3xl font-semibold font-poppins lg:w-1/2">{error}</h1>
                <p className="text-xl font-lato">If you think this location should be added, send a location application below</p>
                <NavLink
                    to={`/university/request-location`}
                    className="mt-4 inline-block bg-action text-white py-2 px-4 rounded-lg hover:scale-110 transition duration-300">
                    Send Application
                </NavLink>
            </div>
        );
    }

    return (
        <div className="bg-background pt-32 ">

            {locationDetails && (
                <div
                    style={{ backgroundImage: `url(${locationDetails.image_url})`, backgroundPosition: 'center', height: '45vh', }}>
                    <div className="flex container mx-auto h-full">
                        <div className="lg:w-1/3  font-lato flex flex-col py-8 text-white justify-between rounded-l-md">
                            <section className="flex flex-col gap-2">
                                <BackButton color="white" />
                                <h1 className="lg:text-4xl text-2xl  font-poppins font-bold">{locationDetails.name}</h1>
                                <div className="flex flex-row gap-4 items-center">
                                    <StarRating rating={locationDetails.rating} starSize={14} color="primary" />
                                    <p className="text-xs">({totalReviews} reviews)</p>
                                </div>
                            </section>
                            <div className="flex flex-row flex-wrap gap-2 ">
                                {locationDetails.LocationTagList.map((tag, index) => {
                                    const tagName = tag.TagTypes?.name || 'no-name';
                                    return (
                                        <span key={`tag-${index}-${tagName}`} className="bg-gray-200 text-secondary font-bold md:text-sm text-xs px-3 py-1.5 rounded-xl font-poppins">
                                            {tagName}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto flex flex-col lg:flex-row lg:justify-between lg:pt-24 sm:px-0 px-6 ">
                <div className="lg:w-2/5 text-secondary lg:order-1 order-2 relative">
                    <h1 className="pb-12 font-poppins text-4xl font-bold">Reviews</h1>
                    {reviews.userReview.length > 0 || reviews.otherReviews.length > 0 ? (
                        <>
                            {reviews.userReview.map((review, index) => (
                                <div key={review.id || `user-review-${index}`} className="flex flex-col space-y-2 pb-24">
                                    <h1 className="font-bold">Your Review</h1>
                                    <div className="flex flex-col font-lato w-full">
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
                                                    console.log('edit review')
                                                    handleEditReview(review);
                                                }
                                                }
                                                className="text-secondary h-5 w-5 hover:cursor-pointer hover:text-black" />

                                        </div>
                                        <div className="flex flex-row gap-4 items-center font-poppins text-sm text-light mt-2 ">
                                            <StarRating rating={review.rating} />
                                            <p>Posted {formatDistanceToNow(new Date(review.created_at))} ago</p>
                                        </div>
                                        <p className="mt-2">{review.description}</p>
                                        {review.updated_at && ( // Show updated date if review has been updated
                                            <p className="text-xs text-gray-500 mt-4">Updated {formatDistanceToNow(new Date(review.updated_at))} ago</p>
                                        )}
                                        <hr className="bg-slate-500 h-1 rounded w-full mt-4" />
                                    </div>
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
                                        {review.updated_at && ( // Show updated date if review has been updated
                                            <p className="text-xs text-gray-500 mt-4 italic">Updated {formatDistanceToNow(new Date(review.updated_at))} ago</p>
                                        )}
                                        <hr className="bg-slate-500 h-1 rounded w-full mt-4" />
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <>
                            <p className="text-center text-secondary font-bold">No reviews currently</p>
                            <hr className="bg-secondary h-1 rounded" />
                        </>
                    )}
                </div>
                <div className="2xl:w-1/4 xl:w-1/3 sticky lg:top-20  lg:h-[calc(100vh-20rem)] overflow-y-auto lg:py-0 py-12 lg:order-2 order-1">
                    <div className="bg-white p-4 rounded-xl  border-2 text-secondary font-lato">
                        <h2 className="text-xl font-bold font-poppins">Address</h2>
                        <a
                            className="italic hover:underline hover:text-blue-500 transition duration-300 ease-in-out"
                            target="_blank"
                            href={`https://www.google.com/maps/search/?api=1&query=${locationDetails.address}`}
                        >{locationDetails.address}
                        </a>
                        <h2 className="text-xl font-bold font-poppins pt-4">Hours</h2>
                        <p className="italic text-red-500">Not Available</p>
                    </div>

                    <div className="mt-4 flex flex-row gap-4 font-bold">
                        <button onClick={handleOpenModal} className="bg-action text-white py-3 px-4 rounded-lg w-full ">Write Review</button>
                        <FavoriteButton onClick={handleFavoriteButton} studyLocationID={locationDetails.id} userID={user ? user.id : null} />

                    </div>
                    <hr className="h-1 w-full bg-secondary mt-12 rounded block sm:hidden" />

                </div>
            </div>
            <ReviewModal
                show={showModal}
                locationId={locationDetails.id}
                userID={user ? user.id : null}
                locationName={locationDetails.name}
                handleClose={() => setShowModal(false)}
                handleNewReview={handleNewReview}
            />
            <EditReview
                show={showEditModal}
                handleClose={() => setShowEditModal(false)}
                userID={user ? user.id : null}
                studyLocationID={locationDetails.id}
                review={reviews.userReview?.[0]}
            />
        </div >
    );
}

export default Reviews;