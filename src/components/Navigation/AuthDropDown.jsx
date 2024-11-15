import React, { useState, useContext } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../../services/Auth/AuthContext.jsx';
import { NavLink } from 'react-router-dom';

function AuthDropDown({ closeDropDown }) {
    const { logout, user } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);

    const handleLogOut = () => {
        setShowModal(true);
    };

    const confirmLogOut = async () => {
        await logout();
        setShowModal(false);
        closeDropDown();
    };

    return (
        <>
            <div className="absolute top-20 right-0 z-50 md:w-[15rem] w-[13rem] px-2 bg-white rounded-md shadow-lg md:mx-10">
                <div className="absolute top-[-10px] left-6 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white"></div>
                <div className="flex flex-col gap-4 py-4">
                    <NavLink
                        onClick={closeDropDown}
                        to={`account/${(user.first_name ? user.first_name.toLowerCase() : 'No Name') + (user.last_name ? user.last_name.toLowerCase() : '')}`}
                        className="text-left font-poppins text-secondary font-bold hover:bg-secondary hover:text-white transition duration-300 ease-in-out py-2 rounded px-2">

                        Profile
                    </NavLink>
                    <NavLink
                        onClick={closeDropDown}
                        to="/setting"
                        className="text-left font-poppins text-secondary font-bold hover:bg-secondary hover:text-white transition duration-300 ease-in-out py-2 rounded px-2">
                        Settings
                    </NavLink>
                    <hr />
                    <button onClick={handleLogOut} className="text-left font-poppins text-secondary font-bold hover:bg-secondary hover:text-white transition duration-300 ease-in-out py-2 rounded px-2">
                        <FaSignOutAlt className="w-5 h-5 inline-block mr-2" />
                        Sign out
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                    <div className="bg-white p-4 rounded-md">
                        <p className="text-center">Are you sure you want to log out?</p>
                        <div className="flex justify-center gap-4 mt-4">
                            <button className="bg-secondary text-white px-4 py-1 rounded-md" onClick={confirmLogOut}>Yes</button>
                            <button className="bg-red-500 text-white px-4 py-1 rounded-md" onClick={() => setShowModal(false)}>No</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AuthDropDown;