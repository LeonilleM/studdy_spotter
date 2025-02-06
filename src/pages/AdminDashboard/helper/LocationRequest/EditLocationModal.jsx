import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { fetchStudyLocationLogHistory, studyRequestCommand } from '../../../../services/Admin/Admin';
import { fetchUniversities } from '../../../../services/University/University';
import { fetchStates } from '../../../../services/helper/helper';
import LogHistory from '../Shared/LogHistory';
import { FaTimes } from 'react-icons/fa';
import FormFields from '../Shared/FormField';
import FormFieldsSelect from '../Shared/FormFieldSelect';
import PopUpModal from '../../../../components/shared/popupModal';

function EditLocationModal({ adminId, isOpen, onClose, location }) {
    const [initialFormData, setInitialFormData] = useState({});
    const [logHistory, setLogHistory] = useState([]);
    const [states, setStates] = useState([]);
    const [universities, setUniversities] = useState([]);
    const [errors, setErrors] = useState({});
    const [popUp, setPopUp] = useState({ isVisible: false, type: '', message: '', timeout: 0 });
    const [formData, setFormData] = useState({
        university_id: location?.university_id || '',
        name: location.name,
        address: location.address || '',
        city: location.city,
        state: location.state_id,
        zipcode: location.zipcode || '',
        latitude: location.latitude || '',
        longitude: location.longitude || '',
        status: location.status,
        message: '',
    });

    const hasChanges = () => {
        return Object.keys(formData).some((key) => formData[key] !== initialFormData[key]);
    };

    useEffect(() => {
        const batchFetch = async () => {
            const logHistoryData = await fetchStudyLocationLogHistory(location.id);
            const universitiesData = await fetchUniversities();
            const statesData = await fetchStates();
            setLogHistory(logHistoryData);
            setUniversities(universitiesData);
            setStates(statesData);
        };
        batchFetch();
    }, [location.id]);

    useEffect(() => {
        if (isOpen) {
            setInitialFormData({
                university_id: location.university_id,
                name: location.name,
                address: location.address || '',
                city: location.city,
                state: location.state_id,
                zipcode: location.zipcode || '',
                latitude: location.latitude || '',
                longitude: location.longitude || '',
                status: location.status,
                message: '',
            });
        }
    }, [isOpen, location]);

    const handlePopUp = (type, message, timeout) => {
        setPopUp({ isVisible: true, type, message, timeout });
        setTimeout(() => {
            setPopUp({ isVisible: false, type: '', message: '', timeout: 0 });
            if (type === 'success') {
                onClose();
            }
        }, timeout);
    };

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

    const handleEditLocation = async (event) => {
        event.preventDefault();
        const newErrors = {};

        if (!formData.message.trim()) newErrors.message = 'Update Reason is required.';
        if (!hasChanges()) newErrors.form = 'No changes detected.';
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;


        const locationData = {
            university_id: formData.university_id,
            name: formData.name,
            address: formData.address,
            city: formData.city,
            state_id: formData.state,
            zipcode: formData.zipcode,
            latitude: formData.latitude,
            longitude: formData.longitude,
            message: formData.message,
        };

        try {
            await studyRequestCommand(location.id, formData.status, locationData, location, adminId);
            handlePopUp('success', 'Location updated successfully', 3000);
        } catch (error) {
            alert('Error updating location: ' + error.message);
        }
    };

    const isFieldChanged = (fieldName, currentValue) => {
        return currentValue !== initialFormData[fieldName];
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
            {popUp.isVisible && (
                <PopUpModal
                    type={popUp.type}
                    message={popUp.message}
                    onClick={() => setPopUp({ isVisible: false, type: '', message: '', timeout: 0 })}
                    timeout={popUp.timeout}
                />
            )}
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-8 2xl:max-w-[80%] max-w-7xl rounded-xl overflow-y-auto h-[85vh] relative">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4  text-xl text-darkBlue hover:text-red-500 transition-colors duration-300">
                    <FaTimes />
                </button>
                <h1 className="text-darkBlue font-poppins font-bold text-3xl mb-6">Edit Study Location</h1>
                <section className="flex flex-col sm:flex-row gap-8">
                    <form
                        onSubmit={handleEditLocation}
                        className="flex flex-row flex-wrap gap-4 w-full sm:w-2/5">
                        <FormFieldsSelect
                            label="University"
                            value={formData.university_id}
                            onChange={(e) => setFormData({ ...formData, university_id: e.target.value })}
                            options={universities}
                            isFieldChanged={isFieldChanged('university_id', formData.university_id)}
                            renderOption={(option) => `${option.name}, ${option.city}`}
                            width="88%"
                        />
                        <FormFields
                            label="Location Name"
                            name="location"
                            value={formData.name}
                            type="text"
                            width="55%"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            isFieldChanged={isFieldChanged('name', formData.name)}
                        />
                        <FormFields
                            label="Category"
                            value={location.category}
                            type="text"
                            width="30%"
                            disabled
                        />
                        <FormFields
                            label="Address"
                            name="address"
                            value={formData.address}
                            type="text"
                            width="88%"
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            isFieldChanged={isFieldChanged('address', formData.address)}
                        />
                        <FormFields
                            type="text"
                            value={formData.city}
                            label="City"
                            placeholder={location.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            isFieldChanged={isFieldChanged('city', formData.city)}
                        />
                        <FormFieldsSelect
                            label="State"
                            value={formData.state}
                            onChange={(e) => {
                                console.log('Selected State ID:', e.target.value);
                                setFormData({ ...formData, state: e.target.value });
                            }}
                            options={states}
                            isFieldChanged={isFieldChanged('state', formData.state)}
                            renderOption={(option) => option.abr}
                        />

                        <FormFields
                            type="number"
                            label="Zip Code"
                            width="25%"
                            value={formData.zipcode}
                            placeholder={location.zipcode?.toString() ?? 'N/A'}
                            onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })}
                            isFieldChanged={isFieldChanged('zipcode', formData.zipcode)}
                        />
                        <FormFields
                            label="Latitude"
                            value={formData.latitude}
                            placeholder={location.latitude ?? 'N/A'}
                            onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                            isFieldChanged={isFieldChanged('latitude', formData.latitude)}
                            width="43%"
                        />
                        <FormFields
                            label="Longitude"
                            value={formData.longitude}
                            placeholder={location.longitude ?? 'N/A'}
                            onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                            isFieldChanged={isFieldChanged('longitude', formData.longitude)}
                            width="43%"
                        />
                        <FormFieldsSelect
                            label="Status"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            options={[
                                { id: 'Pending', abr: 'Pending' },
                                { id: 'Approved', abr: 'Approved' },
                                { id: 'Denied', abr: 'Denied' }
                            ]}
                            width="30%"
                            isFieldChanged={isFieldChanged('status', formData.status)}
                            renderOption={(option) => option.abr}
                        />
                        {!hasChanges() && <p className="text-red-500 text-sm mt-1 w-full">No changes, requires one field to be changed to update.</p>}
                        <div className="flex flex-col w-full">
                            <label className="text-gray-700 font-medium">Update Reason</label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className={`border p-2 rounded-lg placeholder:italic 
                                focus:outline-none focus:ring-2 hover:ring-2 hover:ring-darkBlue transition duration-300
                                focus:ring-accent focus:border-transparent
                                    ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter your reason..."
                            />
                            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                        </div>
                        {errors.form && <p className="text-red-500 text-sm mt-1">{errors.form}</p>}
                        {hasChanges() && !formData.message.trim() && (
                            <p className="text-red-500 text-sm mt-1">You must provide an update reason to submit changes.</p>
                        )}
                        <button
                            type="submit"
                            className={`w-full bg-action text-white rounded-lg p-2 hover:scale-105 transform transition-transform duration-300 disabled:opacity-50 ${!hasChanges() || !formData.message.trim() ? 'cursor-not-allowed' : ''}`}
                            disabled={!hasChanges() || !formData.message.trim()}
                        >
                            Submit
                        </button>
                    </form>
                    <LogHistory logHistory={logHistory} />
                </section>
            </div>
        </div>
    );
}

EditLocationModal.propTypes = {
    adminId: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
};

export default EditLocationModal;