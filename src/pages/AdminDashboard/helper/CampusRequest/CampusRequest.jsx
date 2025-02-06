import { fetchUniversityRequest } from '../../../../services/Admin/Admin';
import EntityRequest from '../Shared/EntityRequest';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import EditCampusModal from './EditCampusModal';

function CampusRequest({ userId, selectedFilter }) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentCampus, setCurrentCampus] = useState(null);
    const [universities, setUniversities] = useState([]);

    useEffect(() => {
        const fetchUniversities = async () => {
            const universitiesData = await fetchUniversityRequest();
            setUniversities(universitiesData.filter(university => selectedFilter === 'all' || university.status === selectedFilter));
        };
        fetchUniversities();
    }, [selectedFilter]);

    const handleEditModal = (campus) => {
        setCurrentCampus(campus);
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
    };

    return (
        <>
            <EntityRequest
                entities={universities}
                entityType="university"
                handleEditModal={handleEditModal}
            />
            {isEditModalOpen && (
                <EditCampusModal
                    isOpen={isEditModalOpen}
                    onClose={handleCloseModal}
                    campus={currentCampus}
                    adminId={userId}
                />
            )}
        </>
    );
}

CampusRequest.propTypes = {
    userId: PropTypes.string,
    selectedFilter: PropTypes.string,
};

export default CampusRequest;