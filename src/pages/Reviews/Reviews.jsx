import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { fetchStudyLocationData, } from '../../services/StudyLocation/Study';
import { fetchAllReviews } from '../../services/Reviews/Reviews';
import { loadingComponent } from '../../components/Loading';
import ReviewModal from './helper/reviewModal';
import { AuthContext } from '../../services/Auth/AuthContext';
import FavoriteButton from './helper/favoriteButton'
import EditReview from './helper/reviewSettings';
import LocationDetails from './LocationDetails';
import ReviewList from './ReviewList';
import ErrorPage from '../../components/shared/ErrorPage';
import PopUpModal from '../../components/shared/popupModal';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown } from "react-icons/fa";
import { HiPencilSquare } from "react-icons/hi2";
import Icon from '../../components/shared/IconMapping';
import { extractHours } from '../../components/shared/TimeUtility';

const sortOptions = {
    Oldest: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    Newest: (a, b) => new Date(b.created_at) - new Date(a.created_at),
    Highest: (a, b) => b.rating - a.rating,
    Lowest: (a, b) => a.rating - b.rating,
};

function Reviews() {
    const { uniName, studyLocation, } = useParams();
    const [locationDetails, setLocationDetails] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showMoreHours, setShowMoreHours] = useState(false);
    const [popUp, setShowPopUp] = useState(null);
    const [address, setAddress] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { today, sortedHours, nextOpen } = extractHours(locationDetails?.study_location_hours);

    useEffect(() => {
        if (sessionStorage.getItem('showModalReview') === 'true') {
            setShowModal(true);
        }
        const fetchData = async () => {
            try {
                setLoading(true);
                const uniNameCity = decodeURIComponent(uniName);
                const parts = uniNameCity.split(" ");
                // Assuming Cities are always the last part of the name
                let uniCity = parts.slice(-1).join(' ');
                let universityName = parts.slice(0, -1).join(' ');
                const locationData = await fetchStudyLocationData(studyLocation, universityName, uniCity);
                setAddress(locationData.address + " " + locationData.city + " " + locationData.State.abr + " " + locationData.zipcode + " " + locationData.name);
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

    const handleSuggestions = (location) => {
        navigate(`/suggestion?location=${location}`, { state: { locationDetails } });
    }

    const handleEditReview = () => {
        setShowEditModal(true);
    };

    const handleUpdateReviewModal = () => {
        setShowEditModal(false);
        handleOpenModal();
    }

    const handleOpenModal = () => {
        if (user) {
            setShowModal(true);
            sessionStorage.setItem('showModalReview', 'true');
        } else {
            setShowPopUp({
                type: 'noAuth',
                message: 'Please log in to write a review',
                onClick: () => setShowPopUp(null),
                timeout: 5000
            })
        }
    };

    const handleFavoriteButton = () => {
        if (!user) {
            setShowPopUp({
                type: 'noAuth',
                message: 'Please log in to save this location',
                onClick: () => setShowPopUp(null),
                timeout: 5000
            })
        }
    };

    const handleDeleteReview = () => {
        setReviews(prevReviews => ({
            ...prevReviews,
            userReview: []
        }));
    };

    const handleViewMore = () => {
        setShowMoreHours(!showMoreHours);
    }

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

    const handleUpdateReview = (updatedReview) => {
        setReviews(prevReviews => {
            const updatedUserReview = prevReviews.userReview.map(review =>
                review.id === updatedReview.id ? { ...review, ...updatedReview } : review
            );
            return {
                ...prevReviews,
                userReview: updatedUserReview
            };
        });
    };

    const handleFilterChange = (filter) => {
        setReviews(prevReviews => ({
            ...prevReviews,
            otherReviews: [...prevReviews.otherReviews].sort(sortOptions[filter])
        }));
    };

    const totalReviews = (reviews.userReview?.length || 0) + (reviews.otherReviews?.length || 0);

    if (loading) {
        return loadingComponent("Loading Reviews...");
    }

    if (error) {
        return (
            <ErrorPage
                errorMessage={error}
                customMessage="If you think this location should be added, send a location application below"
                link="/university/request-location"
                linkText="Send Application"
            />
        );
    }
    return (
        <div className="bg-background ">
            {locationDetails && (
                <LocationDetails locationDetails={locationDetails} totalReviews={totalReviews} />
            )}
            {popUp && <PopUpModal
                type={popUp.type}
                message={popUp.message}
                onClick={popUp.onClick}
                timeout={popUp.timeout}
            />
            }
            <div className="container mx-auto flex flex-col lg:flex-row lg:justify-between lg:pt-24 sm:px-0 px-6 pb-32 ">
                <div className="lg:w-2/5 text-secondary lg:order-1 order-2 relative">
                    {reviews.userReview.length > 0 || reviews.otherReviews.length > 0 ? (
                        <ReviewList
                            reviews={reviews}
                            handleEditReview={handleEditReview}
                            onFilterChange={handleFilterChange}
                        />
                    ) : (
                        <p className="text-center text-secondary font-bold">No reviews currently</p>
                    )}
                </div>
                <div className="2xl:w-[27%] xl:w-1/3 sticky lg:top-10 lg:h-[calc(100vh)]  lg:py-0 py-12 lg:order-2 order-1 mb-24">
                    <div className="bg-white p-4 rounded-xl border-2 text-darkBlue font-lato">
                        <iframe
                            className="w-full h-48 border-1 rounded-lg shadow-lg"
                            src={`https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s${encodeURIComponent(address)}!6i13`
                            }
                        >
                        </iframe>
                        <h2 className="text-xl font-bold font-poppins mt-4">Address</h2>
                        <a
                            className="text-black italic hover:underline hover:text-blue-500 transition duration-300 ease-in-out"
                            target="_blank"
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                        >{address}
                        </a>
                        <div className="flex flex-row justify-between items-center">
                            <h1 className="text-xl font-bold font-poppins pt-4">Hours</h1>
                            <button
                                onClick={() => handleSuggestions(locationDetails.id)}
                                className="font-bold font-poppins pt-4 text-sm flex items-center gap-0.5 hover:underline">
                                <HiPencilSquare /> Suggest an Edit
                            </button>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            {today && today.length > 0 && (
                                <div className="flex flex-col gap-2">
                                    {today.map((data, index) => (
                                        <div key={`today-${index}`} className="flex flex-row  items-center gap-2">
                                            {data.isClosed ? (
                                                <span className="text-red-700 font-bold">Closed</span>
                                            ) : (
                                                <>
                                                    <span className="text-green-700 font-bold">Open</span>
                                                    <span className="text-secondary font-lato">{data.open} - {data.close}</span>
                                                </>

                                            )}

                                        </div>
                                    ))}
                                </div>
                            )}
                            {nextOpen && (
                                <span className="text-secondary font-lato text-sm">Open {nextOpen.day} {nextOpen.open}</span>
                            )}
                            <button
                                onClick={handleViewMore}
                                className="text-secondary transition-transform duration-500"
                            >
                                <span className={`flex transition-transform duration-500`}>
                                    <FaChevronDown />
                                </span>
                            </button>
                        </div>
                        <div
                            className={`transition-all duration-500 ease-in-out`}
                        >
                            {showMoreHours && sortedHours.length > 0 && (
                                <div className="flex flex-col gap-2">
                                    <table>
                                        <tbody>
                                            {sortedHours.map((data, index) => (
                                                <tr key={`row-${index}`}>
                                                    <td className="py-1 pr-3">{data.abbreviation}</td>
                                                    <td className="pr-2">{data.open} - {data.close}</td>

                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                    </div>
                    <div className="mt-4 flex flex-row gap-4 font-bold">
                        <button onClick={handleOpenModal}
                            className={`bg-accent text-white py-3 px-4 rounded-lg w-full ${reviews.userReview.length > 0 ? 'bg-red-700 hover:bg-red-600 transition duration-300 ease-in-out' : 'bg-accent'}`}>
                            {reviews.userReview.length > 0 ? 'Edit Review' : 'Write Review'}
                        </button>
                        <FavoriteButton
                            onClick={handleFavoriteButton}
                            studyLocationID={locationDetails.id}
                            userID={user ? user.id : null} />
                    </div>
                    <div className="bg-white  w-full lg:mt-14 mt-10 rounded-xl border-2 border-b-gray-300 p-8 font-lato ">
                        <h1 className="text-darkBlue font-poppins font-bold text-xl mb-6">Amenities</h1>
                        <div className="grid grid-cols-2 pb-2 gap-y-2 text-lato font-normal sm:text-base text-xs">
                            <span className=" text-black  py-2 font-poppins border-b flex items-center gap-2">
                                <Icon iconName={locationDetails.category} size={20} />{locationDetails.category}
                            </span>
                            {locationDetails.LocationTagList.map((Amenities, index) => {
                                const tagName = Amenities.TagTypes?.name || 'no-name';
                                const isLastItem = index === locationDetails.LocationTagList.length;
                                return (
                                    <span key={`tag-${index}-${tagName}`} className={`text-secondary py-2 font-poppins flex items-center gap-2 ${!isLastItem ? 'border-b' : ''}`}>
                                        <Icon iconName={tagName} size={20} />{tagName}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div >
            <ReviewModal
                show={showModal}
                locationId={locationDetails.id}
                userID={user ? user.id : null}
                locationName={locationDetails.name}
                handleClose={() => {
                    sessionStorage.setItem('showModalReview', 'false');
                    setShowModal(false)
                }}
                handleNewReview={handleNewReview}
                handleUpdateReview={handleUpdateReview}
                review={reviews.userReview[0]}

            />
            <EditReview
                show={showEditModal}
                handleClose={() => { setShowEditModal(false) }}
                userID={user ? user.id : null}
                studyLocationID={locationDetails.id}
                handleDeleteReview={handleDeleteReview}
                updateModal={handleUpdateReviewModal}
            />
        </div >
    );
}

export default Reviews;