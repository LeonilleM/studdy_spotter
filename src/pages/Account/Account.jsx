import { useContext, useEffect } from 'react';
import { AuthContext } from '../../services/Auth/AuthContext.jsx';
import { FaUser, FaSignOutAlt, FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import { fetchUserReviews } from '../../services/Reviews/Reviews.js';
import { fetchUserFavorites } from '../../services/StudyLocation/Study.js';
import { useState } from 'react';
import StarRating from '../../components/StarRating.jsx';


function Account() {
    const { user, isAuthenticated } = useContext(AuthContext);
    const { logout } = useContext(AuthContext);
    const [selectedOption, setSelectedOption] = useState('reviews');
    const [reviews, setReviews] = useState([]);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const [reviewsData, favoritesData] = await Promise.all([
                    fetchUserReviews(user.id),
                    fetchUserFavorites(user.id)
                ]);
                setReviews(reviewsData);
                setFavorites(favoritesData);
                console.log(reviewsData, favoritesData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUserData();
    }, [user.id]);


    const handleOptionChange = (option) => {
        setSelectedOption(option);
    }



    const handleSignOut = () => {
        console.log('Sign out');
        logout();
    }
    return (
        <div className="h-screen bg-primary pt-20 text-secondary">
            {isAuthenticated ? (
                <div className="flex md:flex-row flex-col  container mx-auto py-24 2xl:px-32 px-4 gap-12">
                    <div className="flex flex-col lg:w-1/3 w-full">
                        <div className="flex flex-col items-center bg-secondary text-white  rounded-t-md p-8 shadow-lg">
                            {user.image_url ? (
                                <img src={user.image_url} alt="user avatar" className="w-20 h-20 rounded-full shadow-md" />
                            ) : (
                                <FaUser className="w-20 h-20 bg-gray-300 text-white rounded-full shadow-md border-2" />
                            )}
                            <span className="mt-4 font-bold text-lg">{user.first_name} {user.last_name}</span>
                        </div>
                        <div className="flex flex-col border-4 rounded-b-md px-4 border-secondary  h-[20vh] py-4  shadow-lg">
                            <button
                                onClick={() => handleOptionChange('reviews')}
                                className="flex items-center gap-2 py-2 px-4 hover:bg-action hover:text-white transition duration-300 rounded-md">
                                <FaStar />
                                <span>View Reviews</span>
                            </button>
                            <button
                                onClick={() => handleOptionChange('locations')}
                                className="flex items-center gap-2 py-2 px-4 hover:bg-action hover:text-white transition duration-300 rounded-md">
                                <FaMapMarkerAlt />
                                <span>View Saved Locations</span>
                            </button>
                            <button
                                onClick={handleSignOut}
                                className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-lg border-2  bg-blue-600 px-6 font-medium text-white transition-all duration-300 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label="Sign out"
                            >

                                <span className="absolute inset-0 flex translate-y-full items-center justify-center bg-action transition-transform duration-300 ease-out group-hover:translate-y-0">
                                    <FaSignOutAlt className="h-5 w-5" />
                                </span>
                                <span className="flex items-center gap-2 transition-transform duration-300 group-hover:-translate-y-full">
                                    Sign Out
                                </span>
                                <span className="invisible absolute">Sign Out</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col lg:w-2/3 w-full">
                        <div className="flex flex-col items-center bg-secondary text-white rounded-t-md p-8 shadow-lg">
                            <span className="font-bold text-xl font-poppins">
                                {selectedOption === 'reviews' ? 'Your Reviews' : 'Your Saved Locations'}
                            </span>
                        </div>
                        <div className="flex flex-col border-4 rounded-b-md px-4 border-secondary py-4 shadow-lg">
                            {selectedOption === 'reviews' ? (
                                reviews.length > 0 ? (
                                    reviews.map((review) => (
                                        <div key={review.id} className="flex flex-col  rounded-md p-4 my-4 text-secondary">
                                            <div className="flex items-center ">
                                                <img src={review.StudyLocation.image_url} alt="location" className="w-20 h-20 rounded-md" />
                                                <div className="flex flex-col ml-4 font-lato">
                                                    <span className="font-bold text-lg">{review.StudyLocation.name}</span>
                                                    <span className="text-sm font-semibold">{review.StudyLocation.category}</span>
                                                    <span className="text-sm italic">{review.StudyLocation.University.name}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <StarRating rating={review.rating} />
                                                <span className="text-sm">
                                                    {new Date(review.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No reviews Written</p>
                                )
                            ) : (
                                favorites.length > 0 ? (
                                    favorites.map((favorite) => (
                                        <div key={favorite.id} className="flex flex-col border-2 rounded-md p-4 my-4">
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-lg">{favorite.StudyLocation.name}</span>

                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No saved locations</p>
                                )
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <h1 className="text-3xl font-bold">Not authenticated</h1>
                </div>
            )}
        </div>
    );
}

export default Account