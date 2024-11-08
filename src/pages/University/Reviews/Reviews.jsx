import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { fetchStudyLocationData, } from '../../../services/StudyLocation/Study';
import { fetchAllReviews } from '../../../services/Reviews/Reviews';
import { FaArrowLeft } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import StarRating from '../../../components/StarRating';
import { loadingComponent } from '../../../components/Loading';
import ReviewModal from './reviewModal';
import { AuthContext } from '../../../services/Auth/AuthContext';
import FavoriteButton from './favoriteButton'

function Reviews() {
    const { studyLocation } = useParams(); // Get the study location from the URL
    const [locationDetails, setLocationDetails] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { user } = useContext(AuthContext);

    // Open the review modal
    const handleOpenModal = () => {
        setShowModal(true);
    };



    useEffect(() => {
        // Fetch detailed information for the selected study location
        fetchStudyLocationData(studyLocation).then((data) => {
            if (Array.isArray(data) && data.length > 0) {
                setLocationDetails(data[0]);
            } else {
                console.error('Invalid data format or empty data');
            }
        }).catch(error => {
            console.error(error);
            setError(error);
        });
    }, [studyLocation]);

    useEffect(() => {
        // Fetch all reviews for the selected study location
        if (locationDetails) {
            fetchAllReviews(locationDetails.id).then((data) => {
                // Sort reviews by date
                data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setReviews(data);
                setLoading(false);
            }).catch(error => {
                console.error(error);
                setError(error);
                setLoading(false);
            });
        }
    }, [locationDetails]);

    const backButton = () => {
        return (
            <button
                onClick={() => window.history.back()}
                className="text-primary font-poppins font-bold py-2  rounded-lg flex items-center self-start hover:text-gray-500 transition duration-300 transform hover:-translate-x-2"
            >
                <FaArrowLeft className="mr-2" />
                Back
            </button>
        );
    };

    if (loading) {
        return loadingComponent();
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="bg-primary pt-20 ">
            {locationDetails && (
                <div style={{ backgroundImage: `url(${locationDetails.image_url})`, backgroundPosition: 'center', height: '45vh' }}>
                    <div className="lg:w-1/3 w-3/5 bg-[#32006e]/75 h-full font-lato flex flex-col py-8 lg:px-14 px-4 gap-4 text-white justify-between">
                        <section className="flex flex-col gap-2">
                            {backButton()}
                            <h1 className="lg:text-4xl text-2xl  font-poppins font-bold">{locationDetails.name}</h1>
                            <div className="flex flex-row gap-4 items-center">
                                <StarRating rating={locationDetails.rating} starSize={14} color="primary" />
                                <p className="text-xs">({reviews.length} reviews)</p>
                            </div>
                        </section>
                        <div className="flex flex-row flex-wrap gap-2 ">
                            {locationDetails.LocationTagList.map(tag => (
                                <span key={tag.tag_id} className="bg-gray-200 text-secondary font-bold md:text-sm text-xs px-3 py-1.5 rounded-full font-poppins">
                                    {tag.TagTypes.name}
                                </span>
                            ))}
                        </div>
                    </div>

                </div>
            )}
            <div className="container mx-auto flex flex-col lg:flex-row lg:justify-between lg:pt-24 sm:px-0 px-6 ">
                <div className="lg:w-2/5 text-secondary lg:order-1 order-2">
                    <h1 className="pb-12 font-poppins text-4xl font-bold">Reviews</h1>
                    {reviews.length > 0 ? (
                        reviews.map(review => (
                            <div key={review.id} className="flex flex-row pb-24">
                                <h1>{review.id}</h1>
                                <div className="flex flex-col font-lato">
                                    <div className="flex flex-row gap-2">
                                        <img src={review.Users.image_url} alt="user" className="w-14 h-14 rounded-full bg-slate-500 object-cover" />
                                        <div className="flex flex-col justify-center">
                                            <p className="font-bold">{review.Users.first_name} {review.Users.last_name}</p>
                                            <p className="text-sm text-gray-500">{review.Users.University.name}</p>
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
                <div className="lg:w-1/4 sticky lg:top-20  lg:h-[calc(100vh-20rem)] overflow-y-auto lg:py-0 py-12 lg:order-2 order-1">
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
                    <div className="mt-4 flex flex-row gap-4 font-poppins font-bold">
                        <button onClick={handleOpenModal} className="bg-action text-white py-3 px-4 rounded-lg w-full ">Write Review</button>
                        <FavoriteButton studyLocationID={locationDetails.id} userID={user.id} />
                        <ReviewModal show={showModal} handleClose={() => setShowModal(false)} handleSave={(review) => console.log(review)} />
                    </div>
                    <hr className="h-1 w-full bg-secondary mt-12 rounded block sm:hidden" />
                </div>
            </div>

        </div>
    );
}

export default Reviews;