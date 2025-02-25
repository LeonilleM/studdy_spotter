import { NavLink, useLocation } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import Logo from '../../assets/studdyspotter.png';

function Footer() {
    const location = useLocation();
    return (
        <footer className="w-full">
            {location.pathname !== '/signup' && location.pathname !== '/signin' && (
                <div className="bg-secondary pt-8 pb-12 text-white ">
                    <div className="container mx-auto justify-between flex flex-col h-full">
                        <NavLink to='/'><img src={Logo} alt="logo" className="w-32 pb-12" /></NavLink>
                        <div className="font-lato">
                            <hr />
                            <div className="flex flex-wrap justify-between items-center gap-4 sm:px-0 px-4 pt-8">
                                <h1 className="sm:w-fit w-full">© 2024 Study Spotter</h1>
                                <div className="flex flex-row flex-wrap sm:gap-8 gap-4">

                                    <NavLink to="/about" className="text-white flex items-center gap-1">
                                        About
                                    </NavLink>
                                    <NavLink to="/allschools" className="text-white flex items-center gap-1">
                                        All Schools
                                    </NavLink>
                                    <NavLink to="/privacy-policy" className="text-white flex items-center gap-1">
                                        Privacy Policy
                                    </NavLink>
                                </div>
                                <h1 className="font-lato flex items-center">
                                    <a href="mailto:support_studdyspotter@gmail.com"><FaEnvelope></FaEnvelope></a>
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