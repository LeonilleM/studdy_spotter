import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { format } from 'date-fns';
import { fetchStudyLocationLogHistory } from '../../../../services/Admin/Admin';

function EditLocationModal({ adminId, isOpen, onClose, location }) {
    const [logHistory, setLogHistory] = useState([]);

    useEffect(() => {
        const batchFetch = async () => {
            const universitiesData = await fetchStudyLocationLogHistory(location.id)
            setLogHistory(universitiesData);
        };
        batchFetch();
    }, [location.id]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    console.log(location)
    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-8  max-w-7xl rounded-xl overflow-y-auto  h-[85vh]">
                <button
                    onClick={onClose}
                    className="relative -top-4 -left-4 text-xl text-darkBlue hover:text-red-500 transition-colors duration-300">
                    <FaTimes />
                </button>
                <h1 className="text-darkBlue font-poppins font-bold text-3xl mb-6">Edit Campus</h1>
                <section className="flex flex-col sm:flex-row gap-8">
                    <form
                        className="flex flex-row flex-wrap gap-4 w-full sm:w-2/5">
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium">Location Name</label>
                            <input
                                type="text"
                                value={location.name}
                                className="border border-gray-300 p-2 rounded-lg placeholder:italic"
                                disabled />
                        </div>
                        <div className="flex flex-col ">
                            <label className="text-gray-700 font-medium">City</label>
                            <input
                                type="text"
                                value={location.city}
                                className="border border-gray-300 p-2 rounded-lg placeholder:italic"
                                disabled />
                        </div>
                        <div className="flex flex-col w-[88%] ">
                            <label className="text-gray-700 font-medium">Address</label>
                            <input
                                type="text"
                                value={location.address}
                                className="border border-gray-300 p-2 rounded-lg placeholder:italic"
                                disabled />
                        </div>
                        <div className="flex flex-col w-[15%]">
                            <label className="text-gray-700 font-medium">State</label>
                            <input
                                type="text"
                                value={location.States.abr}
                                className="border border-gray-300 p-2 rounded-lg placeholder:italic"
                                disabled />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium">Zipcode</label>
                            <input
                                type="text"
                                value={location.zipcode ?? "N/A"}
                                className="border border-gray-300 p-2 rounded-lg placeholder:italic"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium">Category</label>
                            <input
                                type="text"
                                value={location.category}
                                className="border border-gray-300 p-2 rounded-lg placeholder:italic"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium">University</label>
                            <input
                                type="text"
                                value={location.University?.name ?? "N/A"}
                                className="border border-gray-300 p-2 rounded-lg placeholder:italic"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium">Longitude</label>
                            <input
                                type="text"
                                value={location.longitude ? location.longitude.toFixed(3) : "N/A"}
                                placeholder="Ex. 123.456"
                                className="border border-gray-300 p-2 rounded-lg placeholder:italic"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium">Latitude</label>
                            <input
                                type="text"
                                value={location.latitude ? location.latitude.toFixed(3) : "N/A"}
                                placeholder="Ex. 123.456"
                                className="border border-gray-300 p-2 rounded-lg placeholder:italic"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium">Status</label>
                            <select
                                value={status}

                                className="border border-gray-300 p-2 rounded-lg"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Denied">Denied</option>
                            </select>
                        </div>
                        <div className="flex flex-col w-full">
                            <label className="text-gray-700 font-medium">Update Reason</label>
                            <textarea
                                className="border border-gray-300 p-2 rounded-lg placeholder:italic"
                                placeholder="Enter your reason..."
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-action text-white rounded-lg p-2 hover:scale-105 transform transition-transform duration-300 disabled:opacity-50"
                        >
                            Submit
                        </button>

                    </form>
                    <section className="w-3/5">
                        <h2 className="text-darkBlue font-poppins font-bold text-xl mb-1">Update Logs</h2>
                        <div className="overflow-y-auto max-h-[55vh] space-y-4 border border-black border-opacity-10 rounded-lg">
                            {logHistory.length > 0 ? (
                                logHistory.map((log, index) => (
                                    <div
                                        key={index}
                                        className={`p-4 space-y-1 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
                                    >
                                        <p className="font-medium">{log.Users.first_name} {log.Users.last_name} - Updated on {format(new Date(log.edit_time), 'MM-dd-yyyy HH:mm:ss')}</p>
                                        <p className="text-gray-600">
                                            <span className="font-semibold">Update Notes:</span> {log.message || 'None'}
                                        </p>
                                        <ul className="space-y-1">
                                            {Object.keys(log.action).map((key, i) => (
                                                <li key={i}>
                                                    <span className="font-semibold text-darkBlue">{key.toUpperCase()}:</span>{' '}
                                                    <span className="text-red-500">Old: {log.action[key].old}</span> |{' '}
                                                    <span className="text-green-500">New: {log.action[key].new}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-600">No edit history available.</p>
                            )}
                        </div>
                    </section>
                </section>
            </div>
        </div>
    )

}


EditLocationModal.propTypes = {
    adminId: PropTypes.string,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    location: PropTypes.object,
};

export default EditLocationModal;