import { NavLink } from 'react-router-dom'
import Logo from '../assets/studdyspotter.png'
import { useLocation } from 'react-router-dom'


function Navbar() {
    const location = useLocation()

    return (
        < div className=" bg-secondary absolute top z-10 w-full " >
            <nav className="container mx-auto flex justify-between items-center font-poppins py-2">
                <NavLink to="/">
                    <img src={Logo} alt="logo" className="h-16 " />
                </NavLink>
                <div className="space-x-4">
                    {location.pathname !== '/signin' && location.pathname !== '/signup' && (
                        <>
                            <NavLink to="/signin">
                                <button className="px-8 py-1 rounded-md text-white font-lato font-bold hover:before:bg-redborder-red-500 relative  overflow-hidden border border-red-white   shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-white before:transition-all before:duration-500 hover:text-black hover:shadow-primary hover:before:left-0 hover:before:w-full">
                                    <span className="relative z-10">Sign in</span></button>
                            </NavLink>
                            <NavLink to="/signup">
                                <button className="px-8 py-1 rounded-md  text-black font-lato font-bold relative overflow-hidden border border-red-white shadow-2xl transition-all before:absolute before:bottom-0 before:right-0 before:top-0 before:z-0 before:h-full before:w-full  before:transition-all before:bg-white before:duration-500 hover:text-white hover:shadow-primary hover:before:w-0 hover:before:right-0">
                                    <span className="relative z-10">Sign up</span>
                                </button>
                            </NavLink>
                        </>
                    )}

                </div>
            </nav>
        </div >
    )
}

export default Navbar