
import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaTrash } from 'react-icons/fa';
import { deleteReview } from '../../../services/Reviews/Reviews';


function EditReview({ show, handleClose, userID, reviewID, handleDeleteReview, updateModal, uploadImageModal }) {
    const [error, setError] = useState(null);
    if (!show) {
        return null;
    }

    const handleDelete = async () => {
        try {
            await deleteReview(userID, reviewID);
            handleClose();
            handleDeleteReview();
        } catch (error) {
            setError(error.message);
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            <div className="fixed inset-0 bg-black/50" onClick={handleClose}></div>
            <div className="bg-white transform transition-all pt-12 rounded-lg shadow-lg  font-lato w-[50vh] flex flex-col justify-center  text-center ">
                <h1 className="text-xl text-secondary font-semibold">Edit Review</h1>
                <div className="w-full flex-col font-lato text-secondary pt-6 ">
                    <button
                        type="button"
                        onClick={updateModal}
                        className="text-action border-t px-4 py-3 rounded hover:bg-slate-300 w-full "
                    >
                        Update
                    </button>
                    <button
                        onClick={uploadImageModal}
                        className="text-action border-t px-4 py-3 rounded hover:bg-slate-300 w-full "
                    >
                        Upload Images
                    </button>
                    <button
                        onClick={handleDelete}
                        className="text-red-500 border-t py-3 px-4  hover:bg-slate-300 w-full"
                    >
                        <FaTrash className="inline-block mr-2" />
                        Delete Review
                    </button>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="text-red-500 border-t px-4 py-3 rounded hover:bg-slate-300 w-full "
                    >
                        Close
                    </button>

                </div>
                {error && <div className="text-red-500 mt-2">{error}</div>}
            </div>
        </div>
    );
}

EditReview.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    userID: PropTypes.string,
    reviewID: PropTypes.number,
    handleDeleteReview: PropTypes.func.isRequired,
    updateModal: PropTypes.func.isRequired,
    uploadImageModal: PropTypes.func
};




export default EditReview;