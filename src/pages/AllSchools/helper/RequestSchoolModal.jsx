import { useState, useEffect } from 'react';
import Select from 'react-select';
import { sendCampusRequest } from '../../../services/University/University';
import { fetchStates } from '../../../services/helper/helper';
import PropTypes from 'prop-types';
import PopUpModal from '../../../components/shared/popupModal';


function RequestSchoolModal({ isOpen, onClose }) {
    const [states, setStates] = useState([]);
    const [selectedStateId, setSelectedStateId] = useState(null);
    const [universityName, setUniversityName] = useState('');
    const [city, setCity] = useState('');
    const [image, setImage] = useState(null);
    const [popUp, setPopUp] = useState(false);

    useEffect(() => {
        fetchStates().then((data) => {
            setStates(data);
        }).catch(error => {
            console.error(error);
        });
    }, []);

    const handleStateChange = (selectedOption) => {
        const selectedState = states.find(state => state.name === selectedOption.value);
        setSelectedStateId(selectedState ? selectedState.id : null);
    };

    const handleRequestCampus = () => {
        sendCampusRequest({
            name: universityName,
            city: city,
            states_id: selectedStateId
        }, image).then(() => {
            alert('Campus request sent successfully');
            onClose();
        }).catch(error => {
            console.error(error);
            if (error === 'duplicate key value violates unique constraint "University_name_key"') {
                alert('University already exists');
            } else {
                setPopUp({
                    type: 'noAuth',
                    message: 'Please log in to save this location',
                    onClick: () => setPopUp(null),
                    timeout: 5000
                });
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg py-8 px-12 border-2 text-secondary flex flex-col font-poppins">
                <h1 className="text-2xl font-bold font-poppins text-center">Request your Campus</h1>
                <div className="flex flex-col mt-4">
                    <label htmlFor="university_name" className="text-sm font-medium rounded-lg">
                        University
                    </label>
                    <input
                        type="text"
                        placeholder="University Name"
                        className="border border-secondary rounded-lg p-2"
                        value={universityName}
                        onChange={(e) => setUniversityName(e.target.value)}
                    />
                </div>
                <div className="flex flex-row gap-4">
                    <div className="flex flex-col mt-4">
                        <label htmlFor="city" className="text-sm font-medium">
                            City
                        </label>
                        <input
                            type="text"
                            placeholder="City"
                            className="border border-secondary rounded-lg p-2"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col mt-4">
                        <label htmlFor="state" className="text-sm font-medium">
                            State
                        </label>
                        <Select
                            onChange={handleStateChange}
                            options={states.map(state => ({ value: state.name, label: state.abr }))}
                        />
                    </div>
                </div>
                <div className="flex flex-col mt-4">
                    <label htmlFor="image" className="text-sm font-medium">
                        University Image
                    </label>
                    <input
                        type="file"
                        className="border border-secondary rounded-lg p-2"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>
                <button
                    className="w-full bg-action text-white rounded-xl mt-4 p-2"
                    onClick={handleRequestCampus}
                >
                    Submit
                </button>
            </div>
            {popUp && <PopUpModal {...popUp} />}
        </div>

    );
}

RequestSchoolModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default RequestSchoolModal;