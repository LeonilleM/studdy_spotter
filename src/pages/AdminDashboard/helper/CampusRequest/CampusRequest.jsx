import { fetchUniversityRequest } from '../../../../services/Admin/Admin';
import { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import Edit from './EditCampusModal';
import { statusButton } from '../StatusButton';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

function CampusRequest({ userId, selectedFilter }) {
    const [universities, setUniversities] = useState([]);
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
            setUniversities(universitiesData);
            setFilteredUniversities(universitiesData.filter(university => university.status === selectedFilter));
        };
        fetchUniversities();
    }, [selectedFilter]);

    useEffect(() => {
        const sortUniversities = (universities) => {
            // Sort universities by status
            const statusOrder = { 'Approved': 1, 'Denied': 2, 'Pending': 3 };
            return universities.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
        };
        if (selectedFilter === 'all') {
            setFilteredUniversities(sortUniversities([...universities]));
        } else {
            setFilteredUniversities(universities.filter(university => university.status === selectedFilter));
        }
    }, [selectedFilter, universities]);

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
<<<<<<< HEAD
        <div className="bg-white mt-2 p-6 rounded-xl border border-gray-300" onMouseMove={handleMouseMove}>
            <div className="grid grid-cols-10 bg-gray-200 py-4 px-2 rounded-xl items-center justify-center font-poppins">
                <h1 className="col-span-3">ID</h1>
                <h1 className="col-span-3">University</h1>
=======
        <div className="bg-white mt-2 p-6 rounded-xl border border-gray-borderColor" onMouseMove={handleMouseMove}>
            <div className="grid grid-cols-8 gap-8 bg-gray-200 p-4 rounded-xl items-center justify-center font-poppins">
                <h1 className="col-span-2">ID</h1>
                <h1 className="col-span-2">University</h1>
>>>>>>> 3b24f29126eed6caa4e89947a147c3e898bc5e72
                <h1 className="col-span-1">State</h1>
                <h1 className="col-span-1 text-center">Image</h1>
                <h1 className="col-span-1 text-center">Status</h1>
                <h1 className="col-span-1 text-center">Action</h1>
            </div>
            {filteredUniversities.map((university, index) => (
                <div
                    key={university.id}
<<<<<<< HEAD
                    className={`grid grid-cols-10 p-2 my-2 items-center justify-center text-sm rounded-xl ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
=======
                    className={`grid grid-cols-8 p-2 my-2 gap-8 items-center justify-center text-sm rounded-xl ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
>>>>>>> 3b24f29126eed6caa4e89947a147c3e898bc5e72
                        }`}
                >
                    <div className="col-span-2">{university.id}</div>
                    {university.status === 'Approved' ? (
                        <NavLink
                            to={`/university/${encodeURIComponent(university.name)} ${encodeURIComponent(university.city)}`}
                            className="col-span-2 text-blue-500 underline"
                        >
                            {university.name},{university.city}
                        </NavLink>
                    ) : (
                        <div className="col-span-2">{university.name}, {university.city}</div>
                    )}
                    <div className="col-span-1">{university.States.abr}</div>
                    <div
                        className="relative col-span-1 justify-center items-center flex flex-row"

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