import { NavLink, useLocation } from 'react-router-dom';
import { FaChevronRight, FaEnvelope } from 'react-icons/fa';
import Logo from '../../assets/studdyspotter.png'; // Adjust the path to your logo

function Footer() {
    const location = useLocation();
    return (
        <footer className="w-full">
            {location.pathname !== '/' && location.pathname !== '/signup' && location.pathname !== '/signin' && (
                <div className="bg-secondary h-[18vh] py-4 text-white">
                    <div className="container mx-auto justify-between flex flex-col h-full">
                        <div className="justify-between  flex flex-row items-center sm:px-0 px-4">
                            <img src={Logo} alt="logo" className="w-32 hidden md:block" draggable='false' />
                            <div className="flex flex-row lg:gap-32 items-center justify-center font-lato">
                                <NavLink to="/about" className="text-white flex items-center ">
                                    <FaChevronRight className="ml-1" />About
                                </NavLink>
                                <NavLink to="/allschools" className="text-white flex items-center">
                                    <FaChevronRight className="ml-1" /> All Schools
                                </NavLink>
                                {/* <NavLink to="/" className="text-white">Privacy Policy</NavLink> */}
                            </div>
                            <div className="flex flex-col">
                                <h1 className="font-poppins font-lg">Contact</h1>
                                <h1 className="font-lato flex items-center">
                                    <FaEnvelope className="mr-1" /> Mail
                                </h1>
                            </div>
                        </div>
                        <div className="font-lato space-y-2 ">
                            <hr />
                            <h1 className="sm:px-0 px-2">© 2024 Study Spotter</h1>
                        </div>
                    </div>
                </div>
            )}
        </footer>
    );
}

export default Footer;