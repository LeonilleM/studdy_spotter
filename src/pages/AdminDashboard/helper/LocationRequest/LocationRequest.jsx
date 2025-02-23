import { useEffect, useState } from 'react'
import { statusButton } from '../StatusButton'
import { fetchStudyRequest } from '../../../../services/Admin/Admin'
import { FaEdit } from 'react-icons/fa'
import EditLocationModal from './EditLocationModal'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

function LocationRequest({ userId, selectedFilter }) {
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [hoveredImage, setHoveredImage] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);

    const handleEditModal = (location) => {
        setCurrentLocation(location);
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
    };

    useEffect(() => {
        const fetchUniversities = async () => {
            const universitiesData = await fetchStudyRequest();
            setFilteredLocations(universitiesData.
                filter(studyLocation => selectedFilter === 'all' || studyLocation.status === selectedFilter));
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
            <div className="grid grid-cols-9 gap-4 bg-gray-200 p-4 rounded-xl items-center justify-center font-poppins">
                <h1 className="col-span-2">ID</h1>
                <h1 className="col-span-2">Location</h1>
                <h1 className="col-span-2">Address</h1>
                <h1 className="col-span-1 text-center">Image</h1>
                <h1 className="col-span-1 text-center">Status</h1>
                <h1 className="col-span-1 text-center">Action</h1>
            </div>
            {filteredLocations.length === 0 ? (
                <div className="text-center py-12">
                    <p className="font-poppins text-semibold text-lg text-darkBlue">No {selectedFilter === 'all' ? '' : selectedFilter} entries</p>
                </div>
            ) :
                filteredLocations.map((studyLocation, index) => (
                    <div
                        key={studyLocation.id}
                        className={`grid grid-cols-9 p-2 my-2 gap-4 items-center justify-center text-sm rounded-xl font-lato ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }`}
                    >
                        <div className="col-span-2">{studyLocation.id}</div>
                        {studyLocation.status === 'Approved' ? (
                            <NavLink
                                to={`/university/${studyLocation.University.name}/${encodeURIComponent(studyLocation.name)}`}
                                className="col-span-2 text-blue-500 underline"
                            >
                                {studyLocation.name}, {studyLocation.city}
                            </NavLink>
                        ) : (
                            <div className="col-span-2">{studyLocation.name}, {studyLocation.city}</div>
                        )}
                        <div className="col-span-2 italic ">
                            {studyLocation.address ? `${studyLocation.address}, ${studyLocation.city}, ${studyLocation.zipcode}, ${studyLocation.States.abr}` : "N/A"}
                        </div>
                        <div className="relative col-span-1 flex items-center justify-center">
                            <img src={studyLocation.image_url} alt={studyLocation.name} className="w-16 h-16 object-cover"
                                onMouseEnter={() => handleMouseEnter(studyLocation.image_url)}
                                onMouseLeave={handleMouseLeave} />
                        </div>
                        <div className="col-span-1">{statusButton(studyLocation.status)}</div>
                        <div className="col-span-1 flex items-center justify-center">
                            <button
                                onClick={() => handleEditModal(studyLocation)}
                                className="flex flex-row gap-1 text-blue-500 cursor-pointer hover:scale-105 hover:text-blue-600 transform transition-transform duration-300"
                            >
                                <FaEdit className="w-4 h-4" />
                                Edit
                            </button>
                        </div>
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
            {isEditModalOpen && <EditLocationModal
                isOpen={isEditModalOpen}
                onClose={handleCloseModal}
                location={currentLocation}
                adminId={userId}
            />}
        </div>
    );
}

LocationRequest.propTypes = {
    userId: PropTypes.string.isRequired,
    selectedFilter: PropTypes.string.isRequired
}


export default LocationRequest