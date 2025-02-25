import { useEffect, useState } from 'react'
import { fetchStudyRequest } from '../../../../services/Admin/Admin'
import EditLocationModal from './EditLocationModal'
import PropTypes from 'prop-types'
import EntityRequest from '../Shared/EntityRequest'


function LocationRequest({ userId, selectedFilter }) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [universities, setUniversities] = useState([]);

    useEffect(() => {
        const fetchUniversities = async () => {
            const universitiesData = await fetchStudyRequest();
            setUniversities(universitiesData.filter(university => selectedFilter === 'all' || university.status === selectedFilter));
        };
        fetchUniversities();
    }, [selectedFilter]);

    const handleEditModal = (location) => {
        setCurrentLocation(location);
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setCurrentLocation(null);
    };

    return (
        <>
            <EntityRequest
                entities={universities}
                entityType="location"
                handleEditModal={handleEditModal}
            />
            {isEditModalOpen && (
                <EditLocationModal
                    isOpen={isEditModalOpen}
                    onClose={handleCloseModal}
                    location={currentLocation}
                    adminId={userId}
                />
            )}
        </>
    );
}

LocationRequest.propTypes = {
    userId: PropTypes.string,
    selectedFilter: PropTypes.string,
};

export default LocationRequest;