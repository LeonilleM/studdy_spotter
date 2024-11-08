import { NavLink } from 'react-router-dom'
import Logo from '../../assets/studdyspotter.png'
import { useLocation } from 'react-router-dom'

function Footer() {
    const location = useLocation()
    return (
        <footer>
            {location.pathname !== '/' && location.pathname !== '/signup' && location.pathname != '/signin' && (

                <div className="bg-secondary h-[18vh] py-4">
                    <div className="container mx-auto justify-between flex flex-col h-full ">
                        <div className="justify-between flex flex-row items-center">
                            <img src={Logo} alt="logo" className="w-32" />
                            <div className="flex flex-row lg:gap-32 items-center justify-center">
                                <NavLink to="/" className="text-white">About</NavLink>
                                <NavLink to="/" className="text-white">All Schools</NavLink>
                                <NavLink to="/" className="text-white">Privacy Policy</NavLink>
                            </div>
                            <div>
                                <h1>Contact</h1>
                                <h1>
                                    Mail
                                </h1>
                            </div>
                        </div>
                        <div className="text-white font-lato space-y-2">
                            <hr></hr>
                            <h1>© 2021 Studdy Spotter</h1>
                        </div>

                    </div>

                </div>
            )}
        </footer>



    )
}

export default Footer