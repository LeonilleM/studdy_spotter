import { fetchUniversityRequest } from '../../../../services/Admin/Admin';
import { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import Edit from './EditCampusModal';
import { statusButton } from '../StatusButton';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

function CampusRequest({ userId, selectedFilter }) {
    const [filteredUniversities, setFilteredUniversities] = useState([]);
    const [hoveredImage, setHoveredImage] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentCampus, setCurrentCampus] = useState(null);

    const handleEditModal = (university) => {
        setCurrentCampus(university);
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
    };

    useEffect(() => {
        const fetchUniversities = async () => {
            const universitiesData = await fetchUniversityRequest();
            setFilteredUniversities(universitiesData.
                filter(university => selectedFilter === 'all' || university.status === selectedFilter));
        };
        fetchUniversities();
    }, [selectedFilter]);

    const handleMouseMove = (event) => {
        setMousePosition({ x: event.pageX, y: event.pageY });
    };

    const handleMouseEnter = (image) => {
        setHoveredImage(image);
    };

    const handleMouseLeave = () => {
        setHoveredImage(null);
    };

    return (
        <div className="bg-white mt-2 p-6 rounded-xl border border-gray-borderColor" onMouseMove={handleMouseMove}>
            <div className="grid grid-cols-8 gap-8 bg-gray-200 p-4 rounded-xl items-center justify-center font-poppins">
                <h1 className="col-span-2">ID</h1>
                <h1 className="col-span-2">University</h1>
                <h1 className="col-span-1">State</h1>
                <h1 className="col-span-1 text-center">Image</h1>
                <h1 className="col-span-1 text-center">Status</h1>
                <h1 className="col-span-1 text-center">Action</h1>
            </div>
            {filteredUniversities.length === 0 ? (
                <div className="text-center py-12">
                    <p className="font-poppins text-semibold text-lg text-darkBlue">No {selectedFilter === 'all' ? '' : selectedFilter} entries</p>
                </div>
            ) :
                filteredUniversities.map((university, index) => (
                    <div
                        key={university.id}
                        className={`grid grid-cols-8 p-2 my-2 gap-8 items-center justify-center text-sm rounded-xl ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }`}
                    >
                        <div className="col-span-2">{university.id}</div>
                        {university.status === 'Approved' ? (
                            <NavLink
                                to={`/university/${encodeURIComponent(university.name)} ${encodeURIComponent(university.city)}`}
                                className="col-span-2 text-blue-500 underline"
                            >
                                {university.name}, {university.city}
                            </NavLink>
                        ) : (
                            <div className="col-span-2">{university.name}, {university.city}</div>
                        )}
                        <div className="col-span-1">{university.States.abr}</div>
                        <div
                            className="relative col-span-1"
                        >
                            <img src={university.image_url} alt={university.name} className="w-16 h-16 object-cover"
                                onMouseEnter={() => handleMouseEnter(university.image_url)}
                                onMouseLeave={handleMouseLeave}
                            />
                        </div>
                        <div className="col-span-1 ">{statusButton(university.status)}</div>
                        <button
                            onClick={() => handleEditModal(university)}
                            className="flex flex-row gap-1 text-blue-500 cursor-pointer hover:scale-105 hover:text-blue-600 transform transition-transform duration-300 ">
                            <FaEdit className="w-4 h-4" />
                            Edit
                        </button>
                    </div>
                ))}
            {hoveredImage && (
                <div
                    id="modal"
                    className="absolute z-50 pointer-events-none border shadow-sm"
                    style={{ top: mousePosition.y, left: mousePosition.x }}
                >
                    <img src={hoveredImage} alt="Hovered" className="w-60 h-60 object-cover" />
                </div>
            )}
            {isEditModalOpen && <Edit
                isOpen={isEditModalOpen}
                onClose={handleCloseModal}
                campus={currentCampus}
                adminId={userId}
            />}
        </div>
    );
}

CampusRequest.propTypes = {
    userId: PropTypes.string,
    selectedFilter: PropTypes.string,
    onFilterChange: PropTypes.func
};

export default CampusRequest;