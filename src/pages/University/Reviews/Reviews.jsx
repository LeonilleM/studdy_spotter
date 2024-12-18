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
import BackButton from '../../../components/BackButton';
import { FaUser } from 'react-icons/fa';


function Reviews() {
    const { uniName, studyLocation, } = useParams(); // Get the study location from the URL
    const [locationDetails, setLocationDetails] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { user } = useContext(AuthContext);

    // Open the review modal
    const handleOpenModal = () => {
        if (user) {
            setShowModal(true);
        } else {
            alert('Please log in to write a review');
        }
    };

    const handleFavoriteButton = () => {
        if (user) {
            console.log('Favorite button clicked');
        }
        alert('Please log in to add to favorites');
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
                    setReviews(sortedReviews);
                }
            } catch (err) {
                setError(err.message || 'Location you\'ve selected is not available or not associated with the specified university');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [studyLocation, uniName]);

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
        <div className="bg-primary pt-20 ">
            {locationDetails && (
                <div style={{ backgroundImage: `url(${locationDetails.image_url})`, backgroundPosition: 'center', height: '45vh' }}>
                    <div className="lg:w-1/3 w-3/5 bg-[#32006e]/75 h-full font-lato flex flex-col py-8 lg:px-14 px-4 gap-4 text-white justify-between">
                        <section className="flex flex-col gap-2">
                            <BackButton />
                            <h1 className="lg:text-4xl text-2xl  font-poppins font-bold">{locationDetails.name}</h1>
                            <div className="flex flex-row gap-4 items-center">
                                <StarRating rating={locationDetails.rating} starSize={14} color="primary" />
                                <p className="text-xs">({reviews.length} reviews)</p>
                            </div>
                        </section>
                        <div className="flex flex-row flex-wrap gap-2 ">
                            {locationDetails.LocationTagList.map((tag, index) => {
                                const tagName = tag.TagTypes?.name || 'no-name';
                                return (
                                    <span key={`tag-${index}-${tagName}`} className="bg-gray-200 text-secondary font-bold md:text-sm text-xs px-3 py-1.5 rounded-full font-poppins">
                                        {tagName}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
            <div className="container mx-auto flex flex-col lg:flex-row lg:justify-between lg:pt-24 sm:px-0 px-6 ">
                <div className="lg:w-2/5 text-secondary lg:order-1 order-2">
                    <h1 className="pb-12 font-poppins text-4xl font-bold">Reviews</h1>
                    {reviews.length > 0 ? (
                        reviews.map((review, index) => (
                            <div key={review.id || `review-${index}`} className="flex flex-row pb-24">
                                <div className="flex flex-col font-lato">
                                    <div className="flex flex-row gap-2">
                                        {review.Users.image_url ? (
                                            <img src={user.image_url} alt="avatar" className="w-14 h-14 rounded-full" />
                                        ) : (
                                            <FaUser className="w-14 h-14 text-white bg-gray-300 rounded-full" />
                                        )}
                                        <div className="flex flex-col justify-center">
                                            <p className="font-bold">{review.Users.first_name} {review.Users.last_name}</p>
                                            <p className="text-sm text-gray-500"> {review.Users.University ? review.Users.University.name : 'No School Affilation'}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-4 items-center font-poppins text-sm text-light mt-2">
                                        <StarRating rating={review.rating} />
                                        <p>Posted {formatDistanceToNow(new Date(review.created_at))} ago</p>
                                    </div>
                                    <p className="mt-2">{review.description}</p>
                                    <hr className="bg-slate-500 h-1 rounded w-full mt-12" />
                                </div>
                            </div>
                        ))
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
                        <p className="italic text-red-500">CLOSED</p>
                    </div>

                    <div className="mt-4 flex flex-row gap-4 font-bold">
                        <button onClick={handleOpenModal} className="bg-action text-white py-3 px-4 rounded-lg w-full ">Write Review</button>
                        <FavoriteButton onClick={handleFavoriteButton} studyLocationID={locationDetails.id} userID={user ? user.id : null} />
                        <ReviewModal show={showModal} locationId={locationDetails.id} userID={user ? user.id : null} locationName={locationDetails.name} handleClose={() => setShowModal(false)} handleSave={(review) => console.log(review)} />
                    </div>
                    <hr className="h-1 w-full bg-secondary mt-12 rounded block sm:hidden" />
                </div>
            </div>

        </div>
    );
}

export default Reviews;