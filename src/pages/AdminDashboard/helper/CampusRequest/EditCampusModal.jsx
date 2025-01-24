import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { uniRequestCommand, fetchCampusLogHistory } from '../../../../services/Admin/Admin';
import { fetchStates } from '../../../../services/helper/helper';
import { FaTimes } from 'react-icons/fa';
// Date formating import from fns
import { formatRelative } from 'date-fns';

function EditCampusModal({ adminId, isOpen, onClose, campus }) {
    const [status, setStatus] = useState(campus.status);
    const [logHistory, setLogHistory] = useState([]);
    const [states, setStates] = useState([]);
    const [schoolHexColor, setSchoolHexColor] = useState(campus.school_hex_color || '');
    const [latitude, setLatitude] = useState(campus.latitude || '');
    const [longitude, setLongitude] = useState(campus.longitude || '');

    useEffect(() => {
        const batchFetch = async () => {
            const universitiesData = await fetchCampusLogHistory(campus.id);
            const statesData = await fetchStates();
            setStates(statesData);
            setLogHistory(universitiesData);
        };
        batchFetch();

    }, [campus.id]);

    if (!isOpen) {
        return null;
    }

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };

    const handleHexColorChange = (event) => {
        setSchoolHexColor(event.target.value);
    };

    const handleLatitudeChange = (event) => {
        setLatitude(event.target.value);
    };

    const handleLongitudeChange = (event) => {
        setLongitude(event.target.value);
    };

    const handleEditCampus = async (event) => {
        event.preventDefault();

        const campusData = {
            latitude: latitude,
            longitude: longitude,
            school_hex_color: schoolHexColor
        };

        if (!campusData.latitude || !campusData.longitude || !campusData.school_hex_color) {
            alert("Please fill all fields");
            return;
        }

        try {
            await uniRequestCommand(campus.id, status, campusData, campus, adminId);
            alert("Campus updated successfully");
            onClose(); // Close the modal after successful update
        } catch (error) {
            alert("Error updating campus: " + error.message);
        }
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-12 w-full max-w-full rounded-xl overflow-y-auto sm:max-w-screen-xl max-h-[90vh]">
                <button onClick={onClose} className="relative -left-5 -top-7 text-2xl text-darkBlue hover:text-red-500 transition-colors duration-300">
                    <FaTimes />
                </button>
                <h1 className="text-darkBlue font-poppins font-bold text-2xl">Edit Campus</h1>
                <form
                    className="flex flex-col "
                    onSubmit={handleEditCampus}>
                    <label>University Name </label>
                    <input
                        type="text"
                        value={campus.name}
                        className="border border-gray-300 p-2 w-48 rounded-lg placeholder:italic"
                    />
                    <label>City</label>
                    <input
                        type="text"
                        value={campus.city}
                        className="border border-gray-300 p-2 w-48 rounded-lg placeholder:italic"
                    />
                    <label>State</label>
                    <select
                        value={campus.States.abr}
                        placeholder="Select State"
                        className="border border-gray-300 p-2 w-48 rounded-lg"
                    >
                        {states.map((state) => (
                            <option key={state.id} value={state.id}>{state.abr}</option>
                        ))}
                    </select>
                    <label>Hex Code</label>
                    <input
                        type="text"
                        value={schoolHexColor}
                        onChange={handleHexColorChange}
                        placeholder="Ex. #FFFFFF"
                        className="border border-gray-300 p-2 w-48 rounded-lg placeholder:italic"
                    />
                    <label>Latitude</label>
                    <input
                        type="text"
                        value={latitude}
                        onChange={handleLatitudeChange}
                        placeholder="Ex. 123.456"
                        className="border border-gray-300 p-2 w-48 rounded-lg placeholder:italic"
                    />
                    <label>Longitude</label>
                    <input
                        type="text"
                        value={longitude}
                        onChange={handleLongitudeChange}
                        placeholder="Ex. 123.456"
                        className="border border-gray-300 p-2 w-48 rounded-lg placeholder:italic"
                    />
                    <label>Status</label>
                    <select
                        value={status}
                        onChange={handleStatusChange}
                        className="border border-gray-300 p-2 w-48 rounded-lg"
                    >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Denied">Denied</option>
                    </select>
                    <button
                        type="submit"
                        className="bg-action text-white p-2 rounded-lg mt-4 flex"
                    >
                        Submit
                    </button>
                </form>
                <section>
                    <h1 className="text-darkBlue font-poppins font-bold text-2xl mt-8">Edit History</h1>
                    <div className="overflow-y-auto max-h-52">
                        {logHistory.length > 0 ? (
                            logHistory.map((log, index) => (
                                <div key={index} className="border border-gray-300 p-2 rounded-lg mt-2">
                                    <h1>{log.Users.first_name} {log.Users.last_name} - Updated {formatRelative(new Date(log.edit_time), new Date())}</h1>
                                    <ul className="flex gap-12">
                                        {Object.keys(log.action).map((key, index) => (
                                            <li key={index}>
                                                <h1>{key}</h1>
                                                <p>Old: {log.action[key].old}</p>
                                                <p>New: {log.action[key].new}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        ) : (
                            <p>No edit history available.</p>
                        )}
                    </div>
                </section>


            </div>
        </div>
    );
}

EditCampusModal.propTypes = {
    adminId: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    campus: PropTypes.object.isRequired
};

export default EditCampusModal;