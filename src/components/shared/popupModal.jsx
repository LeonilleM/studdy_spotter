
import PropTypes from 'prop-types';
import { IoCloseCircle } from 'react-icons/io5';
import { FaCircleCheck } from 'react-icons/fa6'
import { FaUser } from 'react-icons/fa';


const Modal = ({ type, message, onClick }) => {
    let title;
    let buttonStyle;
    let icon;

    switch (type) {
        case 'success':
            icon = <FaCircleCheck className="text-green-700 w-20 h-20" />;
            title = 'Success';
            message = message || 'Operation Successful';
            break;
        case 'failed':
            icon = <IoCloseCircle className="text-red-700 w-24 h-24" />;
            title = 'Failed'
            message = message || 'Operation Failed';
            break;
        case 'notAuthenticated':
            icon = <FaUser className="text-action w-20 h-20" />;
            title = 'Log In!'
            message = message || 'You need to be logged in to perform this operation';
            buttonStyle = 'text-red-700';
            break;
        default:
            title = message;
    }

    return (
        <div
            onClick={onClick}
            className=" absolute inset-0  z-30  bg-black/30 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow px-8 py-10 gap-3 font-lato  z-50">
                {icon}
                <h1 className="text-2xl text-center font-poppins text-secondary px-4">{title}</h1>
                <h1 className="text-center font-poppins text-secondary px-4 w-2/3">{message}</h1>
                <button
                    className={`text-white py-4 px-10 rounded-lg bg-red-700 font-bold text-lg mt-2 ${buttonStyle ? 'block' : 'hidden'} `}
                    onClick={onClick}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

Modal.propTypes = {
    type: PropTypes.oneOf(['success', 'failed', 'notAuthenticated']).isRequired,
    message: PropTypes.string.isRequired,
    onClick: PropTypes.func,
};

export default Modal;