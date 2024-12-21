import PropTypes from 'prop-types'
import { FaTrash, FaUpload } from 'react-icons/fa'
import { useState } from 'react'


function EditImage({ onClose, user, profileUpdate }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file.size > 5024 * 1024) {
            setError("File is too large. Max size is 5MB");
            return;
        }
        // Only accept jpg
        setSelectedFile(file);
        await handleUpload(file);
    }

    const handleUpload = async (file) => {
        if (!file) return;
        setIsUploading(true);
        setError(null);
        try {
            await profileUpdate({ userId: user.id, image: file }, false);
            onClose();
        } catch (error) {
            console.error(error);
            setError("Failed to upload image");
        }
        setIsUploading(false);
    };

    const handleDelete = async () => {
        try {
            await profileUpdate({ userId: user.id }, true);
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="fixed z-10 inset-0">
            <div className="flex items-center justify-center min-h-screen bg-black/30">
                <div className="bg-white pt-12 rounded-lg shadow-lg text-center flex flex-col w-[50vh]">
                    {error && <div className="text-red-500">{error}</div>}
                    <h2 className="text-xl font-semibold mb-4 text-secondary">Change Profile Image</h2>
                    <div className="px-24 border-t py-3.5 hover:bg-slate-300">
                        <div className="w-full text-center ">
                            <input
                                onChange={handleImageUpload}
                                id="file-upload"
                                type="file"
                                accept="image/jpeg, image/jpg"
                                className="hidden"
                                disabled={isUploading}
                            />
                            <label
                                htmlFor="file-upload"
                                className={` cursor-pointer text-action flex items-center justify-center  rounded-md ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isUploading}
                            >
                                <FaUpload className="mr-2" />
                                {selectedFile ? `Change Image ${selectedFile.name}` : "Upload Image"}
                                {isUploading && <span className="font-bold" >uploading...</span>}
                            </label>
                        </div>
                    </div>
                    {user.image_url && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className=" text-red-500 border-t py-3.5 hover:bg-slate-300 flex items-center justify-center"
                        >
                            <FaTrash className="mr-2" />
                            Remove Image
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-secondary border-t px-4 py-2 rounded hover:bg-slate-300 "
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    )
}

EditImage.propTypes = {
    onClose: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    profileUpdate: PropTypes.func.isRequired
}

export default EditImage