import { useLocation } from 'react-router-dom';
import { useState, useContext } from 'react';
import { dayOrder } from '../../components/shared/TimeUtility';
import { locationSuggestions } from '../../services/StudyLocation/Study';
import { AuthContext } from '../../services/Auth/AuthContext';

function Suggestion() {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const { locationDetails } = location.state || {};


    // Build predefinedHours ensuring all days are present
    const predefinedHours = Object.keys(dayOrder).map((day) => {
        const existingDay = locationDetails.study_location_hours?.find(
            (hour) => hour.day_of_week === day
        );
        return (
            existingDay || {
                day_of_week: day,
                start_time: '',
                end_time: '',
                is_open: false,
            }
        );
    });

    const [currentData] = useState({
        name: locationDetails.name,
        address: locationDetails.address,
        study_location_hours: JSON.parse(JSON.stringify(predefinedHours)),
    });

    const [formData, setFormData] = useState({
        name: locationDetails.name,
        address: locationDetails.address,
        study_location_hours: JSON.parse(JSON.stringify(predefinedHours)),
    });

    const handleHourChange = (index, field, value) => {
        const newHours = [...formData.study_location_hours];
        newHours[index][field] = value;
        setFormData({ ...formData, study_location_hours: newHours });
    };

    // Determine if any changes were made by simple string comparison
    const changesMade = JSON.stringify(formData) !== JSON.stringify(currentData);

    const handleFormSubmission = async (event) => {
        event.preventDefault();
        try {
            await locationSuggestions(user.id, locationDetails.id, formData, currentData);
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div className="bg-background min-h-screen">
            <div className="container mx-auto flex flex-col pt-36 sm:px-0 px-6 pb-32">
                <section>
                    <h1 className="font-poppins text-darkBlue font-bold text-lg">
                        Request for Updating Information
                    </h1>
                    <p className="font-poppins text-darkBlue text-sm mt-2">
                        Please provide information below, suggestions are reviewed first.
                    </p>
                </section>
                <form className="flex flex-col pt-6 md:w-[60vw] w-full space-y-2">
                    {/* Editable Name Field */}
                    <div className="flex flex-col w-1/2">
                        <label className="text-gray-700 font-medium">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="border p-2 rounded-lg bg-white placeholder:italic w-full focus:outline-none focus:ring-2 hover:ring-2 hover:ring-darkBlue transition duration-300 focus:ring-accent focus:border-transparent [&::-webkit-inner-spin-button]:appearance-none"
                        />
                    </div>
                    {/* Editable Address Field */}
                    <div className="flex flex-col w-1/2">
                        <label className="text-gray-700 font-medium">Address</label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="border p-2 rounded-lg bg-white placeholder:italic w-full focus:outline-none focus:ring-2 hover:ring-2 hover:ring-darkBlue transition duration-300 focus:ring-accent focus:border-transparent [&::-webkit-inner-spin-button]:appearance-none"
                        />
                    </div>
                    {/* Hours Section */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">Hours</label>
                        {formData.study_location_hours.map((data, index) => (
                            <div key={index} className="flex flex-row gap-4 items-center pt-2 w-full">
                                <input
                                    type="text"
                                    value={data.day_of_week}
                                    disabled
                                    className="border p-2 rounded-lg bg-gray-100 placeholder:italic w-full focus:outline-none"
                                />
                                <input
                                    type="time"
                                    value={data.start_time}
                                    onChange={(e) =>
                                        handleHourChange(index, 'start_time', e.target.value)
                                    }
                                    className="border p-2 rounded-lg bg-white placeholder:italic w-full focus:outline-none focus:ring-2 hover:ring-2 hover:ring-darkBlue transition duration-300 focus:ring-accent focus:border-transparent [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <input
                                    type="time"
                                    value={data.end_time}
                                    onChange={(e) =>
                                        handleHourChange(index, 'end_time', e.target.value)
                                    }
                                    className="border p-2 rounded-lg bg-white placeholder:italic w-full focus:outline-none focus:ring-2 hover:ring-2 hover:ring-darkBlue transition duration-300 focus:ring-accent focus:border-transparent [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <select
                                    value={data.is_open}
                                    onChange={(e) =>
                                        handleHourChange(index, 'is_open', e.target.value === 'true')
                                    }
                                    className="border p-2 rounded-lg bg-white placeholder:italic w-full focus:outline-none focus:ring-2 hover:ring-2 hover:ring-darkBlue transition duration-300 focus:ring-accent focus:border-transparent [&::-webkit-inner-spin-button]:appearance-none"
                                >
                                    <option value="true">Open</option>
                                    <option value="false">Closed</option>
                                </select>
                            </div>
                        ))}
                    </div>
                </form>
                <button
                    onClick={handleFormSubmission}
                    disabled={!changesMade}
                    className="bg-accent text-white py-2 px-4 rounded-lg hover:bg-accent-dark transition duration-300 w-1/3 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Submit
                </button>
            </div>
        </div>
    );
}

export default Suggestion;
