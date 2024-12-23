import { useContext } from 'react';
import { AuthContext } from '../../services/Auth/AuthContext.jsx';
import { FaUser, FaSignOutAlt, FaStar, FaUserShield, FaMapMarkerAlt } from 'react-icons/fa';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import ReviewTab from './accountTabs/reviewTab.jsx';
import CollectionTab from './accountTabs/collectionTab.jsx';
import { FaEdit } from 'react-icons/fa';

const renderTabContents = (selectedOption, userId) => {
    switch (selectedOption) {
        case 'reviews':
            return <ReviewTab userId={userId} />;
        case 'locations':
            return <CollectionTab userId={userId} />;
        default:
            return null;
    }
}

function Account() {
    const { user, isAuthenticated } = useContext(AuthContext);
    const { logout } = useContext(AuthContext);
    const [selectedOption, setSelectedOption] = useState('reviews');


    const handleOptionChange = (option) => {
        setSelectedOption(option);
    }


    const handleSignOut = () => {
        logout();
    }



    return (
        <div className="2xl:h-screen bg-background pt-20 text-darkBlue">
            {isAuthenticated ? (
                <div className="flex lg:flex-row flex-col  container mx-auto py-24 2xl:px-40 px-4 gap-24">
                    <div className="flex flex-col lg:w-1/3 w-full">
                        <div className="flex flex-col items-center bg-white text-black rounded-t-lg pb-16 shadow-lg font-lato border-[1px] border-borderColor">
                            <div className="self-end flex items-center  mt-3 mr-3 mb-6">
                                <NavLink to="/setting" className="flex items-center bg-action rounded-lg py-2 px-5">
                                    <FaEdit className="w-4 h-4 text-white mr-2" />
                                    <span className="text-xs font-lato text-white">Edit Profile</span>
                                </NavLink>
                            </div>
                            {user.image_url ? (
                                <img src={user.image_url} alt="user avatar" className="w-20 h-20 bg-fill rounded-full shadow-md" />
                            ) : (
                                <FaUser className="w-20 h-20 bg-gray-300 text-white rounded-full shadow-md border-2" />
                            )}
                            <span className="mt-4 font-bold text-lg">{user.first_name} {user.last_name}</span>
                            <span className="text-sm">{user.University?.name || "No University Affiliation"}</span>
                            {user.role.name === 'Admin' && <span className="text-sm">Admin</span>}
                        </div>
                        <div className="flex flex-col border-r-[1px] border-b-[1px] border-l-[1px] rounded-b-lg  border-borderColor pt-2  pb-8 shadow-lg font-lato bg-white">
                            <button
                                onClick={() => handleOptionChange('reviews')}
                                className="flex items-center gap-2 py-4 px-6 hover:bg-lightBlue hover:text-blueAlt transition duration-300 ">
                                <FaStar />
                                <span>View Reviews</span>
                            </button>
                            <button
                                onClick={() => handleOptionChange('locations')}
                                className="flex items-center gap-2 py-4 px-6 hover:bg-lightBlue hover:text-blueAlt transition duration-300 ">
                                <FaMapMarkerAlt />
                                <span>View Collections</span>
                            </button>
                            {user.role.name === 'Admin' && (
                                <NavLink
                                    to="/admin-dashboard"
                                    onClick={() => handleOptionChange('studyRequests')}
                                    className="flex items-center gap-2 py-2 px-6 hover:bg-lightBlue hover:text-blueAlt transition duration-300">
                                    <FaUserShield />
                                    <span>Admin Dashboard</span>
                                </NavLink>
                            )}
                            <button
                                onClick={handleSignOut}
                                className="mx-6 inline-flex items-center py-2 justify-center overflow-hidden rounded-lg bg-error text-white hover:scale-105 transition duration-300 mt-6"
                                aria-label="Sign out"
                            >
                                <FaSignOutAlt className="text-white mr-2" />
                                Sign Out
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col lg:w-2/3 w-full">
                        <span className="font-bold text-4xl font-poppins pb-4">
                            {selectedOption === 'reviews' ? 'Reviews' : 'Collections'}
                        </span>
                        {renderTabContents(selectedOption, user.id)}
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