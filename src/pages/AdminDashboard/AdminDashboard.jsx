import { useState, useContext } from 'react';
import CampusRequest from './helper/CampusRequest/CampusRequest';
import LocationRequest from './helper/LocationRequest/LocationRequest';
import { AuthContext } from '../../services/Auth/AuthContext';
import BackButton from '../../components/shared/BackButton';

const renderTabContents = (selectedOption, userId, selectedFilter, handleFilterChange) => {
    switch (selectedOption) {
        case 'campus':
            return <CampusRequest userId={userId} selectedFilter={selectedFilter} onFilterChange={handleFilterChange} />;
        case 'location':
            return <LocationRequest userId={userId} selectedFilter={selectedFilter} onFilterChange={handleFilterChange} />;
    }
};

function AdminDashboard() {
    const { user } = useContext(AuthContext);
    const [selectedOption, setSelectedOption] = useState('campus');
    const [selectedFilter, setSelectedFilter] = useState('Pending');

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
    };

    return (
        <div className="bg-background min-h-screen">
            <div className="absolute top-32 sm:left-14 left-4">
                <BackButton />
            </div>
            <div className="lg:block hidden pt-20">
                <div className="py-36 container mx-auto flex flex-col">
                    <h1 className="text-darkBlue font-poppins text-2xl font-bold">Admin Dashboard</h1>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => handleFilterChange('Pending')}
                                className={`rounded ${selectedFilter === 'Pending' ? 'text-blue-500 ' : 'text-secondary'}`}
                            >
                                Pending
                            </button>
                            <button
                                onClick={() => handleFilterChange('Approved')}
                                className={`rounded ${selectedFilter === 'Approved' ? 'text-blue-500 ' : 'text-secondary'}`}
                            >
                                Approved
                            </button>
                            <button
                                onClick={() => handleFilterChange('Denied')}
                                className={`rounded ${selectedFilter === 'Denied' ? 'text-blue-500 ' : 'text-secondary'}`}
                            >
                                Denied
                            </button>
                            <button
                                onClick={() => handleFilterChange('all')}
                                className={`rounded ${selectedFilter === 'all' ? 'text-blue-500 ' : 'text-secondary'}`}
                            >
                                All
                            </button>
                        </div>
                        <div className="flex">
                            <button
                                className={`px-4 py-2 ${selectedOption === 'campus' ? 'bg-blueAlt ' : 'bg-gray-400 '} ${selectedOption !== 'location' ? 'border-r border-gray-300' : ''} rounded-l-lg`}
                                onClick={() => handleOptionChange('campus')}
                            >
                                Campus
                            </button>
                            <button
                                className={`px-4 py-2 ${selectedOption === 'location' ? 'bg-blueAlt ' : 'bg-gray-400 '} rounded-r-lg`}
                                onClick={() => handleOptionChange('location')}
                            >
                                Study Spot
                            </button>
                        </div>
                    </div>
                    {renderTabContents(selectedOption, user.id, selectedFilter, handleFilterChange)}
                </div>
            </div>
            <div className="block lg:hidden text-center text-3xl  font-bold font-poppins sm:px-36 py-36 px-4 ">
                Admin dashboard meant for Computers / Laptops (need large screen)
            </div>
        </div >
    );
}

export default AdminDashboard;