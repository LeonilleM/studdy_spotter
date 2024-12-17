import { NavLink, useLocation } from 'react-router-dom';
import Logo from '../../assets/studdyspotter.png';
import { useContext, useState } from 'react';
import { AuthContext } from '../../services/Auth/AuthContext.jsx';
import { loadingComponent } from '../../components/Loading.jsx'
import { FaUser } from 'react-icons/fa';
import AuthDropDown from './AuthDropDown.jsx'

function Navbar() {
    const location = useLocation();
    const { user, isAuthenticated, isLoading } = useContext(AuthContext);
    const [showDropDown, setShowDropDown] = useState(false);

    const handleDropDown = () => {
        setShowDropDown(!showDropDown);
    }

    const closeDropDown = () => {
        setShowDropDown(false);
    }

    if (isLoading) {
        return loadingComponent()
    }

    return (
        <>
            {location.pathname === '/signin' || location.pathname === '/signup' ? null : (
                <nav className="absolute top z-10 w-full">
                    <div className="flex justify-between items-center font-poppins py-4 bg-[#3C3C3C]  sm:px-12 px-4 rounded-full mt-4 sm:mx-12 mx-4">
                        <NavLink to="/">
                            <img src={Logo} alt="logo" className="h-14" />
                        </NavLink>
                        <div className="space-x-4">
                            {isAuthenticated ? (
                                <div className="relative">
                                    <button
                                        onClick={handleDropDown}
                                        className="flex items-center justify-center text-center gap-4 font-lato">
                                        {user.image_url ? (
                                            <img src={user.image_url} alt="avatar" className="rounded-full w-10 h-10" />
                                        ) : (
                                            <FaUser className="w-10 h-10 text-white bg-gray-200 rounded-full" />
                                        )}
                                        <span className="text-white font-bold">
                                            {user.first_name ? user.first_name : 'No Name User'} {user.last_name ? user.last_name : ''}
                                        </span>
                                    </button>

                                    {showDropDown && <AuthDropDown closeDropDown={closeDropDown} />}
                                </div>
                            ) : (
                                location.pathname !== '/signin' && location.pathname !== '/signup' && !user && (
                                    <div className="flex flex-row gap-2">
                                        <NavLink to="/signin">
                                            <button className="px-4 py-2 rounded-full text-white font-lato font-bold hover:before:bg-redborder-red-500 relative overflow-hidden border border-red-white shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-white before:transition-all before:duration-500 hover:text-black hover:shadow-primary hover:before:left-0 hover:before:w-full">
                                                <span className="relative z-10">Log In</span>
                                            </button>
                                        </NavLink>
                                        <NavLink to="/signup">
                                            <button className="px-4 py-2 rounded-full text-black font-lato font-bold relative overflow-hidden border border-red-white shadow-2xl transition-all before:absolute before:bottom-0 before:right-0 before:top-0 before:z-0 before:h-full before:w-full before:transition-all before:bg-white before:duration-500 hover:text-white hover:shadow-primary hover:before:w-0 hover:before:right-0">
                                                <span className="relative z-10">Register</span>
                                            </button>
                                        </NavLink>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </nav>
            )
            }
        </>

    );
}

export default Navbar;