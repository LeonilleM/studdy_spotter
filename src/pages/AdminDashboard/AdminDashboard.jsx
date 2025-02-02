import { useState, useContext } from 'react';
import CampusRequest from './helper/CampusRequest/CampusRequest';
import LocationRequest from './helper/LocationRequest/LocationRequest';
import { AuthContext } from '../../services/Auth/AuthContext';
import BackButton from '../../components/shared/BackButton';

const renderTabContents = (selectedOption, userId, selectedFilter) => {
    switch (selectedOption) {
        case 'campus':
            return <CampusRequest userId={userId} selectedFilter={selectedFilter} />;
        case 'studyspot':
            return <LocationRequest userId={userId} selectedFilter={selectedFilter} />;
    }
};

function AdminDashboard() {
    const { user } = useContext(AuthContext);
    const [selectedOption, setSelectedOption] = useState('studyspot');
    const [selectedFilter, setSelectedFilter] = useState('all');

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
                    <h1 className="text-darkBlue font-poppins text-4xl font-bold">Admin Dashboard</h1>
                    <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-6 font-poppins">
                            <button
                                onClick={() => handleFilterChange('Pending')}
                                className={` ${selectedFilter === 'Pending' ? 'text-accent ' : 'text-secondary'}`}
                            >
                                Pending
                            </button>
                            <button
                                onClick={() => handleFilterChange('Approved')}
                                className={`border-l border-r border-black px-4 ${selectedFilter === 'Approved' ? 'text-accent ' : 'text-secondary'}`}
                            >
                                Approved
                            </button>
                            <button
                                onClick={() => handleFilterChange('Denied')}
                                className={`border-r border-black pr-5 ${selectedFilter === 'Denied' ? 'text-accent ' : 'text-secondary'}`}
                            >
                                Denied
                            </button>
                            <button
                                onClick={() => handleFilterChange('all')}
                                className={` ${selectedFilter === 'all' ? 'text-accent ' : 'text-secondary'}`}
                            >
                                All
                            </button>
                        </div>
                        <div className="flex gap-1 font-poppins">
                            <button
                                className={`px-4 py-2 ${selectedOption === 'campus' ? 'bg-accent text-white ' : 'bg-white '} rounded-l-lg`}
                                onClick={() => handleOptionChange('campus')}
                            >
                                Campus
                            </button>
                            <button
                                className={`px-4 py-2 ${selectedOption === 'studyspot' ? 'bg-accent text-white ' : 'bg-white '} rounded-r-lg`}
                                onClick={() => handleOptionChange('studyspot')}
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