import { useLocation } from 'react-router-dom';
import { useState } from 'react';

function Suggestion() {
    const location = useLocation();
    const { locationDetails } = location.state || {};
    const [hours, setHours] = useState(locationDetails.study_location_hours);
    const [formData, setFormData] = useState({
        name: locationDetails.name,
        address: locationDetails.address,
        city: locationDetails.city,
        state: locationDetails.State.abr,
        zipcode: locationDetails.zipcode,
        study_location_hours: locationDetails.study_location_hours,
    });

    const handleHourChange = (index, field, value) => {
        const newHours = [...hours];
        newHours[index][field] = value;
        setHours(newHours);
        setFormData({ ...formData, study_location_hours: newHours });
    };

    const handleDayChange = (index, value) => {
        const day = [...hours];
        day[index].day_of_week = value;
        setHours(day);
        setFormData({ ...formData, study_location_hours: day });
    };

    const addNewHour = () => {
        setHours([...hours, { day_of_week: '', start_time: '', end_time: '' }]);
    }


    const handleFormSubmission = async (event) => {
        event.preventDefault();

        console.log(formData);

    }


    return (
        <div className="bg-background  min-h-screen">
            <div className="container mx-auto flex flex-col pt-36 sm:px-0 px-6 pb-32">
                <section>
                    <h1 className="font-poppins text-darkBlue font-bold text-lg">Request for Updating Information</h1>
                    <p className="font-poppins text-darkBlue text-sm mt-2">Please provide information below, suggestions are reviewed first.</p>
                </section>
                <form className="flex flex-col pt-6 w-1/3 space-y-2">
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">Name</label>
                        <input
                            disabled
                            type="text"
                            value={locationDetails.name}
                            className={`border p-2 rounded-lg bg-white placeholder:italic w-full focus:outline-none focus:ring-2 hover:ring-2 hover:ring-darkBlue 
                            transition duration-300 
                        focus:ring-accent focus:border-transparent
                             [&::-webkit-inner-spin-button]:appearance-none 
                             `}
                        />
                    </div>
                    <div className="flex flex-col ">
                        <label className="text-gray-700 font-medium">Address</label>
                        <input
                            disabled
                            type="text"
                            value={locationDetails.address}
                            className={`border p-2 rounded-lg bg-white placeholder:italic w-full focus:outline-none focus:ring-2 hover:ring-2 hover:ring-darkBlue 
                            transition duration-300 
                        focus:ring-accent focus:border-transparent
                             [&::-webkit-inner-spin-button]:appearance-none 
                             `}
                        />
                    </div>
                    <div className="flex flex-col ">
                        <label className="text-gray-700 font-medium">City</label>
                        <input
                            disabled
                            type="text"
                            value={locationDetails.city}
                            className={`border p-2 rounded-lg bg-white placeholder:italic w-full focus:outline-none focus:ring-2 hover:ring-2 hover:ring-darkBlue 
                            transition duration-300 
                        focus:ring-accent focus:border-transparent
                             [&::-webkit-inner-spin-button]:appearance-none 
                             `}
                        />
                    </div>
                    <div className="flex flex-col ">
                        <label className="text-gray-700 font-medium">State</label>
                        <input
                            disabled
                            type="text"
                            value={locationDetails.State.abr}
                            className={`border p-2 rounded-lg bg-white placeholder:italic w-full focus:outline-none focus:ring-2 hover:ring-2 hover:ring-darkBlue 
                            transition duration-300 
                        focus:ring-accent focus:border-transparent
                             [&::-webkit-inner-spin-button]:appearance-none 
                             `}
                        />
                    </div>
                    <div className="flex flex-col ">
                        <label className="text-gray-700 font-medium">Zipcode</label>
                        <input
                            disabled
                            type="text"
                            value={locationDetails.zipcode ? locationDetails.zipcode : "N/A"}
                            className={`border p-2 rounded-lg bg-white placeholder:italic w-full focus:outline-none focus:ring-2 hover:ring-2 hover:ring-darkBlue 
                            transition duration-300 
                        focus:ring-accent focus:border-transparent
                             [&::-webkit-inner-spin-button]:appearance-none 
                             `}
                        />
                    </div>
                    <div className="flex flex-col ">
                        <label className="text-gray-700 font-medium">Hours</label>
                        {hours.map((data, index) => (
                            <div key={index} className="flex flex-row gap-4 items-center pt-2">
                                <input
                                    onChange={(e) => handleDayChange(index, e.target.value)}
                                    placeholder="Day of the week"
                                    type="text"
                                    value={data.day_of_week}
                                    className={`border p-2 rounded-lg bg-white placeholder:italic w-full focus:outline-none focus:ring-2 hover:ring-2 hover:ring-darkBlue 
                                        transition duration-300 
                                    focus:ring-accent focus:border-transparent
                                         [&::-webkit-inner-spin-button]:appearance-none 
                                         `}
                                />
                                <input
                                    type="time"
                                    value={data.start_time}
                                    onChange={(e) => handleHourChange(index, 'start_time', e.target.value)}
                                    className={`border p-2 rounded-lg bg-white placeholder:italic w-full focus:outline-none focus:ring-2 hover:ring-2 hover:ring-darkBlue 
                                        transition duration-300 
                                    focus:ring-accent focus:border-transparent
                                         [&::-webkit-inner-spin-button]:appearance-none 
                                         `}
                                />
                                <span>-</span>
                                <input
                                    type="time"
                                    value={data.end_time}
                                    onChange={(e) => handleHourChange(index, 'end_time', e.target.value)}
                                    className={`border p-2 rounded-lg bg-white placeholder:italic w-full focus:outline-none focus:ring-2 hover:ring-2 hover:ring-darkBlue 
                                        transition duration-300 
                                    focus:ring-accent focus:border-transparent
                                         [&::-webkit-inner-spin-button]:appearance-none 
                                         `}
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addNewHour}
                            className="mt-4 bg-accent text-white py-2 px-4 rounded-lg hover:bg-accent-dark transition duration-300"
                        >
                            Add New Hour
                        </button>
                    </div>
                </form>
                <button
                    onClick={handleFormSubmission}
                    className="bg-accent text-white py-2 px-4 rounded-lg hover:bg-accent-dark transition duration-300 w-1/3 mt-4"
                >
                    Submit
                </button>
            </div>
        </div>
    );
}

export default Suggestion;