import { NavLink, useLocation } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import Logo from '../../assets/studdyspotter.png';

function Footer() {
    const location = useLocation();
    return (
        <footer className="w-full">
            {location.pathname !== '/signup' && location.pathname !== '/signin' && (
                <div className="bg-secondary sm:h-[20vh] h-full py-6 text-white ">
                    <div className="container mx-auto justify-between flex flex-col h-full">
                        <NavLink to="/">
                            <img src={Logo} alt="logo" className="w-32 sm:px-0 mx-4 my-4" />
                        </NavLink>
                        <div className="font-lato space-y-2 ">
                            <hr />
                            <div className="flex flex-wrap justify-between items-center gap-4 sm:px-0 px-4">
                                <div className="flex flex-row flex-wrap sm:gap-8 gap-4">
                                    <h1 className="sm:w-fit w-full">© 2024 Study Spotter</h1>
                                    <NavLink to="/about" className="text-white flex items-center gap-1">
                                        About
                                    </NavLink>
                                    <NavLink to="/allschools" className="text-white flex items-center gap-1">
                                        All Schools
                                    </NavLink>
                                    <NavLink to="/" className="text-white flex items-center gap-1">
                                        Privacy Policy
                                    </NavLink>
                                </div>
                                <h1 className="font-lato flex items-center">
                                    <FaEnvelope className="mr-1" /> support_studdyspotter@gmail.com
                                </h1>
                            </div>

                        </div>
                    </div>
                </div>
            )
            }
        </footer >
    );
}

export default Footer;