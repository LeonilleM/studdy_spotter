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
                <navbar className="absolute top z-10 w-full px-12 py-5">
                    <nav className="flex justify-between items-center font-poppins py-2  bg-[#3C3C3C] rounded-full px-12">

                        <NavLink to="/">
                            <img src={Logo} alt="logo" className="h-16" />
                        </NavLink>
                        <div className="space-x-4">
                            {isAuthenticated ? (
                                <div className="relative inline-block">
                                    <button
                                        onClick={handleDropDown}
                                        className="flex items-center space-x-4 font-lato">
                                        {user.image_url ? (
                                            <img src={user.image_url} alt="avatar" className="w-12 h-12 rounded-full" />
                                        ) : (
                                            <FaUser className="w-12 h-12 text-white bg-gray-200 rounded-full" />
                                        )}
                                        <span className="text-white font-bold">
                                            {user.first_name ? user.first_name : 'No Name User'} {user.last_name ? user.last_name : ''}
                                        </span>
                                    </button>

                                    {showDropDown && <AuthDropDown closeDropDown={closeDropDown} />}
                                </div>
                            ) : (
                                location.pathname !== '/signin' && location.pathname !== '/signup' && !user && (
                                    <>
                                        <NavLink to="/signin">
                                            <button className="  px-8 py-2 rounded-full text-white font-lato font-bold hover:before:bg-redborder-red-500 relative overflow-hidden border border-red-white shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-white before:transition-all before:duration-500 hover:text-black hover:shadow-primary hover:before:left-0 hover:before:w-full">
                                                <span className="relative z-10">Sign in</span>
                                            </button>
                                        </NavLink>
                                        <NavLink to="/signup">
                                            <button className="px-8 py-2 rounded-full text-black font-lato font-bold relative overflow-hidden border border-red-white shadow-2xl transition-all before:absolute before:bottom-0 before:right-0 before:top-0 before:z-0 before:h-full before:w-full before:transition-all before:bg-white before:duration-500 hover:text-white hover:shadow-primary hover:before:w-0 hover:before:right-0">
                                                <span className="relative z-10">Sign up</span>
                                            </button>
                                        </NavLink>
                                    </>
                                )
                            )}
                        </div>
                    </nav>
                </navbar>
            )
            }
        </>

    );
}

export default Navbar;