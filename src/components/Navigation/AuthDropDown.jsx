import { useState, useContext } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { ImProfile } from 'react-icons/im';
import { VscSettings } from 'react-icons/vsc';
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
            <div className="absolute top-[70px]  z-50  w-[11rem] px-4 bg-white rounded-md shadow-lg overflow-x-hidden ">
                <div className="flex flex-col gap-2 py-4">
                    <NavLink
                        onClick={closeDropDown}
                        to={`account/${(user.first_name ? user.first_name.toLowerCase() : 'No Name') + (user.last_name ? user.last_name.toLowerCase() : '')}`}
                        className="text-left font-poppins  font-bold hover:bg-primary hover:text-white transition duration-300 ease-in-out p-2 rounded">
                        <ImProfile className="w-5 h-5 inline-block mr-2" />
                        Profile
                    </NavLink>
                    <hr />
                    <NavLink
                        onClick={closeDropDown}
                        to="/setting"
                        className="text-left font-poppins  font-bold hover:bg-primary hover:text-white transition duration-300 ease-in-out p-2 rounded">
                        <VscSettings className="w-5 h-5 inline-block mr-2" />
                        Settings
                    </NavLink>

                    <hr />
                    <button onClick={handleLogOut} className="mt-4 text-left font-poppins text-white font-bold bg-red-700 hover:text-white transition duration-300 ease-in-out p-2 rounded-lg flex items-center justify-center">
                        <FaSignOutAlt className="w-5 h-5 inline-block mr-2" />
                        Sign out
                    </button>
                </div>
            </div >
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                    <div className="bg-white p-4 rounded-md">
                        <p className="text-center">Are you sure you want to log out?</p>
                        <div className="flex justify-center gap-4 mt-4">
                            <button className="bg-action text-white px-4 py-1 rounded-md hover:scale-105 transition duration-300 ease-in-out" onClick={confirmLogOut}>Yes</button>
                            <button className="bg-red-500 text-white px-4 py-1 rounded-md hover:scale-105 transition duration-300 ease-in-out" onClick={() => setShowModal(false)}>No</button>
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