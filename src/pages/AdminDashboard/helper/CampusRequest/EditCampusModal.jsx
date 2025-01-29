import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { uniRequestCommand, fetchCampusLogHistory } from '../../../../services/Admin/Admin';
import { fetchStates } from '../../../../services/helper/helper';
import { FaTimes } from 'react-icons/fa';
import { format } from 'date-fns';

function EditCampusModal({ adminId, isOpen, onClose, campus }) {
    const [status, setStatus] = useState(campus.status);
    const [logHistory, setLogHistory] = useState([]);
    const [states, setStates] = useState([]);
    const [schoolHexColor, setSchoolHexColor] = useState(campus.school_hex_color || '');
    const [latitude, setLatitude] = useState(campus.latitude || '');
    const [longitude, setLongitude] = useState(campus.longitude || '');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const batchFetch = async () => {
            const universitiesData = await fetchCampusLogHistory(campus.id);
            const statesData = await fetchStates();
            setStates(statesData);
            setLogHistory(universitiesData);
        };
        batchFetch();
    }, [campus.id]);

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

    if (!isOpen) {
        return null;
    }

    const handleEditCampus = async (event) => {
        event.preventDefault();
        const newErrors = {};

        if (!latitude.trim()) newErrors.latitude = 'Latitude is required.';
        if (!longitude.trim()) newErrors.longitude = 'Longitude is required.';
        if (!schoolHexColor.trim()) newErrors.schoolHexColor = 'Hex Code is required.';
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        const campusData = {
            latitude,
            longitude,
            school_hex_color: schoolHexColor,
            message
        };

        try {
            await uniRequestCommand(campus.id, status, campusData, campus, adminId);
            alert('Campus updated successfully');
            onClose();
        } catch (error) {
            alert('Error updating campus: ' + error.message);
        }
    };

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
                        onSubmit={handleEditCampus}
                        className="flex flex-row flex-wrap gap-4 w-full sm:w-2/5">
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium">University Name</label>
                            <input
                                type="text"
                                value={campus.name}
                                className="border border-gray-300 p-2 rounded-lg placeholder:italic"
                                disabled
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium">City</label>
                            <input
                                type="text"
                                value={campus.city}
                                className="border border-gray-300 p-2 rounded-lg placeholder:italic"
                                disabled
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium">State</label>
                            <select
                                value={campus.States.abr}
                                className="border border-gray-300 p-2 rounded-lg "
                                disabled
                            >
                                {states.map((state) => (
                                    <option key={state.id} value={state.id}>{state.abr}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium">Hex Code</label>
                            <input
                                type="text"
                                value={schoolHexColor}
                                onChange={(e) => setSchoolHexColor(e.target.value)}
                                placeholder="Ex. #FFFFFF"
                                className={`border p-2 rounded-lg placeholder:italic ${errors.schoolHexColor ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.schoolHexColor && <p className="text-red-500 text-sm mt-1">{errors.schoolHexColor}</p>}
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium">Latitude</label>
                            <input
                                type="text"
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                                placeholder="Ex. 123.456"
                                className={`border p-2 rounded-lg placeholder:italic ${errors.latitude ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.latitude && <p className="text-red-500 text-sm mt-1">{errors.latitude}</p>}
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium">Longitude</label>
                            <input
                                type="text"
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                                placeholder="Ex. 123.456"
                                className={`border p-2 rounded-lg placeholder:italic ${errors.longitude ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.longitude && <p className="text-red-500 text-sm mt-1">{errors.longitude}</p>}
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
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
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
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
                        <div className="overflow-y-auto max-h-[55vh] space-y-4">
                            {logHistory.length > 0 ? (
                                logHistory.map((log, index) => (
                                    <div
                                        key={index}
                                        className={`p-4 rounded-lg space-y-1 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
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
    );
}

EditCampusModal.propTypes = {
    adminId: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    campus: PropTypes.object.isRequired,
};

export default EditCampusModal;
