import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types'

function ErrorPage({ errorMessage, customMessage, link, linkText }) {
    return (
        <div>
            <div className="pt-20 overflow-x-hidden text-center h-[82vh] space-y-4 sm:px-0 px-4 flex flex-col items-center justify-center bg-background text-secondary">
                <h1 className="text-3xl font-semibold font-poppins lg:w-1/2">{errorMessage}</h1>
                <p className="text-xl font-lato">{customMessage}</p>
                <NavLink to={link} className="mt-4 inline-block bg-action text-white py-2 px-4 rounded-lg hover:scale-110 transition duration-300">
                    {linkText}
                </NavLink>
            </div>
        </div>
    )
}

ErrorPage.propTypes = {
    errorMessage: PropTypes.string.isRequired,
    customMessage: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    linkText: PropTypes.string.isRequired
}

export default ErrorPage