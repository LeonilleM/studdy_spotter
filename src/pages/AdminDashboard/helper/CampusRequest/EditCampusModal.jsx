import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { uniRequestCommand, fetchCampusLogHistory } from '../../../../services/Admin/Admin';
import { fetchStates } from '../../../../services/helper/helper';
import LogHistory from '../Shared/LogHistory';
import { FaTimes } from 'react-icons/fa';
import FormFields from '../Shared/FormField';
import FormFieldsSelect from '../Shared/FormFieldSelect';
import PopUpModal from '../../../../components/shared/popupModal';

function EditCampusModal({ adminId, isOpen, onClose, campus }) {
    const [initialFormData, setInitialFormData] = useState({});
    const [logHistory, setLogHistory] = useState([]);
    const [states, setStates] = useState([]);
    const [errors, setErrors] = useState({});
    const [popUp, setPopUp] = useState({ isVisible: false, type: '', message: '', timeout: 0 });
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        university_name: campus.name,
        city: campus.city,
        state: campus.states_id,
        address: campus.address || '',
        zipcode: campus.zipcode || '',
        status: campus.status,
        schoolHexColor: campus.school_hex_color || '',
        latitude: campus.latitude || '',
        longitude: campus.longitude || '',
        message: '',
        image: null
    });

    const hasChanges = () => {
        return Object.keys(formData).some((key) => formData[key] !== initialFormData[key]);
    };

    // Fetch log history and states on component mount
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
            setInitialFormData({ // Store initial form data
                university_name: campus.name,
                state: campus.states_id,
                city: campus.city,
                address: campus.address || '',
                zipcode: campus.zipcode || '',
                status: campus.status,
                schoolHexColor: campus.school_hex_color || '',
                latitude: campus.latitude || '',
                longitude: campus.longitude || '',
                message: '',
                image: null
            })
        }
    }, [isOpen, campus]);

    const handlePopUp = (type, message, timeout) => {
        setPopUp({ isVisible: true, type, message, timeout });
        setTimeout(() => {
            setPopUp({ isVisible: false, type: '', message: '', timeout: 0 });
            if (type === 'success') {
                onClose();
            }
        }, timeout);
    };

    // Disable body scroll when modal is open
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {
            setErrors({ ...errors, image: 'Image size must be less than 5MB' });
            return;
        }

        if (file && !['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
            setErrors({ ...errors, image: 'Invalid file type. Please upload a JPEG, JPG, or PNG file.' });
            return;
        }

        setFormData({ ...formData, image: file });
        setImagePreview(URL.createObjectURL(file));
        setErrors({ ...errors, image: '' });

    }

    const handleEditCampus = async (event) => {
        event.preventDefault();
        const newErrors = {};

        // Validation
        if (!formData.message.trim()) newErrors.message = 'Update Reason is required.';
        if (!hasChanges()) newErrors.form = 'No changes detected.';
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        const campusData = {
            name: formData.university_name,
            city: formData.city,
            states_id: formData.state,
            address: formData.address,
            zipcode: formData.zipcode,
            school_hex_color: formData.schoolHexColor,
            latitude: formData.latitude,
            longitude: formData.longitude,
            message: formData.message,
            image: formData.image // Image will be replaced using another function
        };

        try {
            await uniRequestCommand(campus.id, formData.status, campusData, campus, adminId);
            handlePopUp('success', 'Campus updated successfully', 3000);
        } catch (error) {
            alert('Error updating campus: ' + error.message);
        }
    };

    // Check if a specific field has been changed
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
                <h1 className="text-darkBlue font-poppins font-bold text-3xl mb-6">Edit Campus</h1>
                <section className="flex flex-col sm:flex-row gap-8">
                    <form
                        onSubmit={handleEditCampus}
                        className="flex flex-row flex-wrap gap-4 w-full sm:w-2/5">
                        <FormFields
                            type="text"
                            label="Campus Name"
                            value={formData.university_name}
                            placeholder={campus.name.toString()}
                            onChange={(e) => setFormData({ ...formData, university_name: e.target.value })}
                            isFieldChanged={isFieldChanged('university_name', formData.university_name)}
                        />
                        <FormFields
                            type="text"
                            label="Address"
                            value={formData.address}
                            placeholder={campus.address ?? 'N/A'}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            isFieldChanged={isFieldChanged('address', formData.address)}
                        />
                        <FormFields
                            type="text"
                            value={formData.city}
                            label="City"
                            placeholder={campus.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            isFieldChanged={isFieldChanged('city', formData.city)}

                        />
                        <FormFieldsSelect
                            label="State"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            options={states}
                            isFieldChanged={isFieldChanged('state', formData.state)}
                        />
                        <FormFields
                            type="number"
                            label="Zip Code"
                            width="25%"
                            value={formData.zipcode}
                            placeholder={campus.zipcode?.toString() ?? 'N/A'}
                            onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })}
                            isFieldChanged={isFieldChanged('zipcode', formData.zipcode)}
                        />
                        <FormFields
                            label="Hex Code"
                            value={formData.schoolHexColor}
                            onChange={(e) => setFormData({ ...formData, schoolHexColor: e.target.value })}
                            placeholder="Ex. #FFFFFF"
                            error={errors.schoolHexColor}
                            isFieldChanged={isFieldChanged('schoolHexColor', formData.schoolHexColor)}
                        />
                        <FormFields
                            label="Latitude"
                            value={formData.latitude}
                            onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                            placeholder="Ex. 123.456"
                            error={errors.latitude}
                            isFieldChanged={isFieldChanged('latitude', formData.latitude)}
                        />
                        <FormFields
                            label="Longitude"
                            value={formData.longitude}
                            onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                            placeholder="Ex. 123.456"
                            error={errors.longitude}
                            isFieldChanged={isFieldChanged('longitude', formData.longitude)}
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
                            isFieldChanged={isFieldChanged('status', formData.status)}
                            width="100%"
                        />
                        <div className="flex flex-col space-y-2 w-full">
                            <label htmlFor="image" className="text-sm font-medium">Upload Image <span className="text-xs italic font-normal">(this will be the location image)</span></label>
                            <div className="relative flex items-center  p-4 border border-l-8 border-l-accent rounded-3xl h-[5rem] hover:border-action focus:outline-none focus:ring-2 focus:ring-action"
                                style={{ backgroundImage: imagePreview ? `url(${imagePreview})` : 'none', backgroundSize: 'fill', backgroundPosition: 'center', backgroundBlendMode: 'darken' }}>
                                <input type="file"
                                    name="image"
                                    accept="image/jpeg, image/jpg, image/png"
                                    id="image" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleImageChange}
                                />
                                {!imagePreview &&
                                    <div className="flex flex-col space-y-2">
                                        <p className="text-sm">Drag & drop an image here, or click to select one</p>
                                    </div>
                                }
                            </div>

                        </div>

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

EditCampusModal.propTypes = {
    adminId: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    campus: PropTypes.object.isRequired,
};

export default EditCampusModal;