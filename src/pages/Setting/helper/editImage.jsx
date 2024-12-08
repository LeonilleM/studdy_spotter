import PropTypes from 'prop-types'
import { FaTrash } from 'react-icons/fa'

function editImage({ onClose, user }) {
    return (
        <div className="fixed z-10 inset-0">
            <div className="flex items-center justify-center min-h-screen bg-black/30">
                <div className="bg-white pt-12 rounded-lg shadow-lg text-center flex flex-col w-[50vh]">
                    <h2 className="text-xl font-semibold mb-4">Change Profile Image</h2>
                    <div className="px-24 border-t py-2 hover:bg-slate-300">
                        <div className="w-full text-center">
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                className="hidden"
                            />
                            <label
                                htmlFor="file-upload"
                                className="inline-block cursor-pointer  text-action py-2 px-4 rounded-md "
                            >
                                Choose Image
                            </label>
                        </div>
                    </div>
                    {user.image_url && (
                        <button
                            type="button"
                            className=" text-red-500 border-t py-2 hover:bg-slate-300"
                        >
                            <FaTrash className="inline-block" />
                            Remove Image
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-red-500 border-t px-4 py-2 rounded hover:bg-slate-300 "
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

editImage.propTypes = {
    onClose: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
}

export default editImage