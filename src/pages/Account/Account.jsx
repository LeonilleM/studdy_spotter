import { useContext, useEffect } from 'react';
import { AuthContext } from '../../services/Auth/AuthContext.jsx';
import { FaUser, FaSignOutAlt, FaStar, FaMapMarkerAlt, FaUserShield } from 'react-icons/fa';
import { fetchUserReviews } from '../../services/Reviews/Reviews.js';
import { fetchUserFavorites } from '../../services/StudyLocation/Study.js';
import { useState } from 'react';
import StarRating from '../../components/StarRating.jsx';
import { NavLink } from 'react-router-dom';

const renderTabContents = (selectedOption, reviews, favorites) => {
    switch (selectedOption) {
        case 'reviews':
            return reviews.length > 0 ? (
                reviews.map((review) => {
                    const studyPage = `/university/${review.StudyLocation.University.name}/${review.StudyLocation.name}`;
                    const UniPage = `/university/${review.StudyLocation.University.name}`;
                    return (
                        <div key={review.id} className="flex flex-col my-4 text-secondary pb-8">
                            <div className="flex items-center">
                                <NavLink to={studyPage}>
                                    <img src={review.StudyLocation.image_url} alt="location" className="w-24 h-24 rounded-md" />
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
                                    <div className="flex flex-row gap-1">
                                        <span className="text-xs">{review.StudyLocation.category}</span>
                                        {review.StudyLocation.LocationTagList.map((tag, index) => {
                                            const tagName = tag.TagTypes?.name || 'no-name';
                                            return (
                                                <span key={`tag-${index}-${tagName}`} className="text-xs">
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
                            <div className="pt-2">
                                <p>{review.description}</p>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p>No reviews written</p>
            );
        case 'locations':
            return favorites.length > 0 ? (
                favorites.map((favorite) => {
                    const studyPage = `/university/${favorite.StudyLocation.University.name}/${favorite.StudyLocation.name}`;
                    return (
                        <NavLink
                            to={studyPage}
                            key={favorite.id} className="flex flex-row gap-2 rounded-md items-center font-lato hover:underline pt-2">
                            <span className="font-semibold">{favorite.StudyLocation.name}</span>
                            <span className="font-sm italic">- {favorite.StudyLocation.University.name}</span>

                        </NavLink>
                    );
                })
            ) : (
                <p>No saved locations</p>
            );
        default:
            return null;
    }
}


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
            } catch (error) {
                console.error(error);
            }
        };
        fetchUserData();
    }, [user]);


    const handleOptionChange = (option) => {
        setSelectedOption(option);
    }


    const handleSignOut = () => {
        console.log('Sign out');
        logout();
    }



    return (
        <div className="2xl:h-screen bg-primary pt-20 text-secondary">
            {isAuthenticated ? (
                <div className="flex md:flex-row flex-col  container mx-auto py-24 2xl:px-32 px-4 gap-12">
                    <div className="flex flex-col lg:w-1/3 w-full">
                        <div className="flex flex-col items-center bg-secondary text-white  rounded-t-md p-8 shadow-lg font-lato">
                            {user.image_url ? (
                                <img src={user.image_url} alt="user avatar" className="w-20 h-20 rounded-full shadow-md" />
                            ) : (
                                <FaUser className="w-20 h-20 bg-gray-300 text-white rounded-full shadow-md border-2" />
                            )}
                            <span className="mt-4 font-bold text-lg">{user.first_name} {user.last_name}</span>
                            <span className="text-sm">{user.University?.name || "No University Affiliation"}</span>
                            {user.role.name === 'Admin' && <span className="text-sm">Admin</span>}
                        </div>
                        <div className="flex flex-col border-2 rounded-b-md  border-secondary py-8 shadow-lg font-lato">
                            <button
                                onClick={() => handleOptionChange('reviews')}
                                className="flex items-center gap-2 py-2 px-4 hover:bg-action hover:text-white transition duration-300 ">
                                <FaStar />
                                <span>View Reviews</span>
                            </button>
                            <button
                                onClick={() => handleOptionChange('locations')}
                                className="flex items-center gap-2 py-2 px-4 hover:bg-action hover:text-white transition duration-300 ">
                                <FaMapMarkerAlt />
                                <span>View Saved Locations</span>
                            </button>
                            {user.role.name === 'Admin' && (
                                <NavLink
                                    to="/admin-dashboard"
                                    onClick={() => handleOptionChange('studyRequests')}
                                    className="flex items-center gap-2 py-2 px-4 hover:bg-action hover:text-white transition duration-300 ">
                                    <FaUserShield />
                                    <span>Admin Dashboard</span>
                                </NavLink>
                            )}
                            <button
                                onClick={handleSignOut}
                                className="mt-4 mx-4 group relative inline-flex py-3 h-12 items-center justify-center overflow-hidden rounded-lg border-2  bg-blue-600 px-6 font-medium text-white transition-all duration-300 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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
                        <div className="flex flex-col text-secondary">
                            <span className="font-bold text-4xl font-poppins">
                                {selectedOption === 'reviews' ? 'Reviews' : 'Saved Locations'}
                            </span>
                        </div>
                        <div>
                            {renderTabContents(selectedOption, reviews, favorites)}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-screen">
                    <p>Please sign in to view your account</p>
                </div>
            )}
        </div >
    );
}

export default Account