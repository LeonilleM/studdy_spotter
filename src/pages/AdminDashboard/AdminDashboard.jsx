import { useState } from 'react'
import CampusRequest from './helper/CampusRequest/CampusRequest'
import LocationRequest from './helper/LocationRequest/LocationRequest'
import Filter from './helper/AdminFilter'

const renderTabContents = (selectedOption, userId) => {
    switch (selectedOption) {
        case 'campus':
            return <CampusRequest userId={userId} />;
        case 'location':
            return <LocationRequest userId={userId} />;
        default:
            return null;
    }
}

function AdminDashboard() {
    const [selectedOption, setSelectedOption] = useState('campus');

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    }


    return (
        <div className="h-screen bg-background ">
            <div className="pt-36 container mx-auto flex flex-col">
                <div>
                    <h1 className="text-darkBlue font-poppins text-2xl font-bold">Admin Dashboard</h1>
                    <button className="bg-primary text-white px-4 py-2 rounded-lg ml-auto"
                        onClick={() => handleOptionChange('campus')}>
                        Campus
                    </button>
                    <button className="bg-primary text-white px-4 py-2 rounded-lg ml-4"
                        onClick={() => handleOptionChange('location')}>
                        Study Spot
                    </button>
                </div>
        
                {renderTabContents(selectedOption)}
            </div>
        </div >
    )
}

export default AdminDashboard