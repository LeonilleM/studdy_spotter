import { useState, useContext } from 'react';
import CampusRequest from './helper/CampusRequest/CampusRequest';
import LocationRequest from './helper/LocationRequest/LocationRequest';
import { AuthContext } from '../../services/Auth/AuthContext';

const renderTabContents = (selectedOption, userId) => {
    switch (selectedOption) {
        case 'campus':
            return <CampusRequest userId={userId} />;
        case 'location':
            return <LocationRequest userId={userId} />;


    }
};

const handleFilter = (selectedOption) => {
    switch (selectedOption) {
        case 'all':
            return 'All';
        case 'approved':
            return 'Approved';
        case 'denied':
            return 'Denied';
        default:
            return 'pending';
    }
}

function AdminDashboard() {
    const { user } = useContext(AuthContext);
    const [selectedOption, setSelectedOption] = useState('campus');

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    return (
        <div className=" bg-background">
            <div className="py-36 container mx-auto flex flex-col">
                <h1 className="text-darkBlue font-poppins text-2xl font-bold">Admin Dashboard</h1>
                <div className="flex justify-between items-center">
                    <div className="space-x-3 flex items-center">
                        <h1>Pending</h1>
                        <h1 className="border-gray-400 border-l-2 border-r-2 px-2">Approved</h1>
                        <h1 className="border-r-2 border-gray-400 pr-2">Denied</h1>
                        <h1>All</h1>
                    </div>
                    <div className="flex">
                        <button
                            className={`px-4 py-2 ${selectedOption === 'campus' ? 'bg-action text-white' : 'bg-gray-400 text-white'} ${selectedOption !== 'location' ? 'border-r border-gray-300' : ''} rounded-l-lg`}
                            onClick={() => handleOptionChange('campus')}
                        >
                            Campus
                        </button>
                        <button
                            className={`px-4 py-2 ${selectedOption === 'location' ? 'bg-action text-white' : 'bg-gray-400 text-white'} rounded-r-lg`}
                            onClick={() => handleOptionChange('location')}
                        >
                            Study Spot
                        </button>
                    </div>
                </div>
                {renderTabContents(selectedOption, user.id)}
            </div>
        </div>
    );
}

export default AdminDashboard;