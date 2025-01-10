import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

const BackButton = ({ location, color = 'black' }) => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        if (location) {
            navigate(location)
        } else {
            window.history.back();
        }
    };

    return (
        <div className="relative">
            <button
                onClick={handleBackClick}
                className={`text-${color} font-lato font-bold py-2   rounded-lg flex items-center transition duration-300 transform hover:-translate-x-2`}
            >
                <FaArrowLeft className="mr-2" />
                Back
            </button>
        </div>
    )
};

BackButton.propTypes = {
    location: PropTypes.string,
    color: PropTypes.string
}

export default BackButton