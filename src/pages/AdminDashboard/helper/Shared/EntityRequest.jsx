import { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaEdit } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { statusButton } from '../StatusButton';

function EntityRequest({ entities, entityType, handleEditModal }) {
    const [hoveredImage, setHoveredImage] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 5;

    const indexOfLastPage = currentPage * reviewsPerPage;
    const indexOfFirstPage = indexOfLastPage - reviewsPerPage;
    const currentReviews = entities.slice(indexOfFirstPage, indexOfLastPage);
    const totalPages = Math.ceil(entities.length / reviewsPerPage);

    const handleMouseMove = (event) => {
        setMousePosition({ x: event.pageX, y: event.pageY });
    };

    const handleMouseEnter = (image) => {
        setHoveredImage(image);
    };

    const handleMouseLeave = () => {
        setHoveredImage(null);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="bg-white mt-2 p-6 rounded-xl border border-gray-borderColor" onMouseMove={handleMouseMove}>
            <div className="grid grid-cols-9 gap-4 bg-gray-200 p-4 rounded-xl items-center justify-center font-poppins">
                <h1 className="col-span-2">ID</h1>
                <h1 className="col-span-2">{entityType === 'campus' ? 'University' : 'Location'}</h1>
                <h1 className="col-span-2">Address</h1>
                <h1 className="col-span-1 text-center">Image</h1>
                <h1 className="col-span-1 text-center">Status</h1>
                <h1 className="col-span-1 text-center">Action</h1>
            </div>
            {entities.length === 0 ? (
                <div className="text-center py-12">
                    <p className="font-poppins text-semibold text-lg text-darkBlue">No {entityType === 'all' ? '' : entityType} entries</p>
                </div>
            ) :
                currentReviews.map((entity, index) => (
                    <div
                        key={entity.id}
                        className={`grid grid-cols-9 p-2 px-4 my-2 gap-4 items-center justify-center text-sm rounded-xl font-lato ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }`}
                    >
                        <div className="col-span-2">{entity.id}</div>
                        {entity.status === 'Approved' ? (
                            <NavLink
                                to={
                                    entityType === 'location'
                                        ? `/university/${encodeURIComponent(entity.University.name)} ${encodeURIComponent(entity.University.city)}/${encodeURIComponent(entity.name)}`
                                        : `/university/${encodeURIComponent(entity.name)} ${encodeURIComponent(entity.city)}`
                                }
                                className="col-span-2 text-blue-500 underline"
                            >
                                {entity.name}, {entity.city}
                            </NavLink>
                        ) : (
                            <div className="col-span-2">{entity.name}, {entity.city}</div>
                        )}
                        <div className="col-span-2">{entity.address}, {entity.States.abr}, {entity.zipcode}</div>
                        <div
                            className="relative col-span-1"
                        >
                            <div className="flex flex-row justify-center items-center">
                                <img src={entity.image_url} alt={entity.name} className="w-16 h-16 object-cover"
                                    onMouseEnter={() => handleMouseEnter(entity.image_url)}
                                    onMouseLeave={handleMouseLeave}
                                />
                            </div>
                        </div>
                        <div className="col-span-1">{statusButton(entity.status)}</div>
                        <div className="col-span-1 flex items-center justify-center">
                            <div className="flex flex-row justify-center items-center gap-2 rounded py-2">
                                <button
                                    onClick={() => handleEditModal(entity)}
                                    className="flex flex-row gap-1 text-blue-500 cursor-pointer hover:scale-105 hover:text-blue-600 transform transition-transform duration-300"
                                >
                                    <FaEdit className="w-4 h-4" />
                                    Edit
                                </button>
                            </div>
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
            {currentReviews.length > 0 && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`text-darkBlue mr-2`}
                    >
                        <FaChevronLeft />
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={`mx-1 px-3 py-1 rounded-lg ${currentPage === index + 1 ? 'bg-accent text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`text-darkBlue ml-2`}
                    >
                        <FaChevronRight />
                    </button>
                </div>
            )}
        </div>
    );
}

EntityRequest.propTypes = {
    entities: PropTypes.array.isRequired,
    entityType: PropTypes.oneOf(['university', 'location']).isRequired,
    handleEditModal: PropTypes.func.isRequired,
};

export default EntityRequest;