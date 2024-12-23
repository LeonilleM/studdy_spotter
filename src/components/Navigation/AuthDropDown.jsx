import { useState, useContext } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { IoMdPerson } from "react-icons/io";
import { IoIosSettings } from "react-icons/io";
import { AuthContext } from '../../services/Auth/AuthContext.jsx';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';


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
            <div className="fixed inset-0  z-40" onClick={closeDropDown}>
            </div>
            <div className="absolute top-[55px]  z-50 w-[11rem]  bg-white rounded-md shadow-lg overflow-x-hidden border-[1px] border-borderColor ">
                <div className="flex flex-col pt-2 pb-4">
                    <NavLink
                        onClick={closeDropDown}
                        to={`account/${(user.first_name ? user.first_name.toLowerCase() : 'No Name') + (user.last_name ? user.last_name.toLowerCase() : '')}`}
                        className="text-left font-poppins hover:bg-lightBlue hover:text-blueAlt transition duration-300 ease-in-out py-4 px-4  flex items-center">
                        <IoMdPerson className="w-6 h-6 mr-2" />
                        Profile
                    </NavLink>
                    <NavLink
                        onClick={closeDropDown}
                        to="/setting"
                        className="text-left font-poppins hover:bg-lightBlue hover:text-blueAlt transition duration-300 ease-in-out py-4 px-4 flex items-center">
                        <IoIosSettings className="w-6 h-6 mr-2" />
                        Settings
                    </NavLink>
                    <button onClick={handleLogOut} className="mt-4 mx-4 text-left font-poppins text-white  bg-error hover:text-white transition duration-300 ease-in-out p-2 rounded-lg flex items-center justify-center">
                        <FaSignOutAlt className="w-4 h-4 mr-2" />
                        Sign out
                    </button>
                </div>
            </div >
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                    <div className="bg-white p-12 rounded-md">
                        <p className="text-center">Are you sure you want to log out?</p>
                        <div className="flex justify-center gap-4 mt-8">
                            <button className="bg-action text-white px-8 py-2 rounded-md hover:scale-105 transition duration-300 ease-in-out" onClick={confirmLogOut}>Yes</button>
                            <button className="bg-error text-white px-8 py-2 rounded-md hover:scale-105 transition duration-300 ease-in-out" onClick={() => setShowModal(false)}>No</button>
                        </div>
                    </div>
                </div>
            )
            }
        </>
    );
}

AuthDropDown.propTypes = {
    closeDropDown: PropTypes.func.isRequired
};


export default AuthDropDown;