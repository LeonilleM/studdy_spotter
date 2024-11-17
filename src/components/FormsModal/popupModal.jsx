
import PropTypes from 'prop-types';
import { IoIosClose } from "react-icons/io";

const Modal = ({ type, message, buttonText, onClick }) => {
    let title;
    let buttonStyle;

    switch (type) {
        case 'success':
            title = message || 'Operation Successful';
            buttonStyle = 'bg-action';
            break;
        case 'failed':
            title = message || 'Operation Failed';
            buttonStyle = 'bg-red-500';
            break;
        case 'notAuthenticated':
            title = message || 'Authentication Required';
            buttonStyle = 'bg-action';
            break;
        default:
            title = message;
            buttonStyle = 'bg-primary';
    }

    return (
        <div
            onClick={onClick}
            className=" absolute inset-0  z-50  bg-black/75 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center  bg-white rounded-md shadow p-2 top-24 left-24">
                <IoIosClose className="relative text-2xl cursor-pointer self-end mb-4 h-8 w-8" onClick={onClick} />
                <h1 className="text-2xl font-bold text-center font-poppins text-secondary px-4">{title}</h1>
                <button
                    className={`${buttonStyle} text-white px-4 py-2 my-8 rounded-md w-1/2 `}
                    onClick={onClick}
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

Modal.propTypes = {
    type: PropTypes.oneOf(['success', 'failed', 'notAuthenticated']).isRequired,
    message: PropTypes.string.isRequired,
    buttonText: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default Modal;