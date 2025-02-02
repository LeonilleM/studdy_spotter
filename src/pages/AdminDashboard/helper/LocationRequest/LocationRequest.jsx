import { useEffect, useState } from 'react'
import { statusButton } from '../StatusButton'
import { fetchStudyRequest } from '../../../../services/Admin/Admin'
import { FaEdit } from 'react-icons/fa'
import EditLocationModal from './EditLocationModal'

function LocationRequest({ userId, selectedFilter }) {

    const [studyRequests, setStudyRequests] = useState([])
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [location, setLocation] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            const studyRequestLocation = await fetchStudyRequest();
            setStudyRequests(studyRequestLocation);
        };
        fetchRequests();
    }, [])

    const handleEditModal = (StudyLocation) => {
        setLocation(StudyLocation);
        setIsEditModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
    }

    return (
        <div className="bg-white mt-2 p-6 rounded-xl h-full border border-borderColor">
            <div className="grid grid-cols-11 gap-2 bg-gray-200  p-4 rounded-xl  items-center justify-center font-poppins">
                <h1 className="col-span-2">ID</h1>
                <h1 className="col-span-1">University</h1>
                <h1 className="col-span-1">Address</h1>
                <h1 className="col-span-1">City</h1>
                <h1 className="col-span-1">State</h1>
                <h1 className="col-span-1">Zipcode</h1>
                <h1 className="col-span-1">Tags</h1>
                <h1 className="col-span-1">Category</h1>
                <h1 className="col-span-1">Status</h1>
                <h1 className="col-span-1">Action</h1>
            </div>
            {studyRequests.map((request, index) => (
                <div
                    key={request.id}
                    className={`grid grid-cols-11 gap-2 p-2 my-2 items-center justify-center text-sm rounded-xl ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <div className="col-span-2">{request.id}</div>
                    <div className="col-span-1">{request.University ? request.University.name : 'N/A'}</div>
                    <div className="col-span-1">{request.address}</div>
                    <div className="col-span-1">{request.city}</div>
                    <div className="col-span-1">{request.States.abr}</div>
                    <div className="col-span-1">{request.zipcode}</div>
                    <div className="col-span-1">{request.locationtag ? request.locationtag.join(', ') : 'N/A'}</div>
                    <div className="col-span-1">{request.category}</div>
                    <div className="col-span-1">{statusButton(request.status)}</div>
                    <button
                        className="flex flex-row gap-1 text-blue-500 cursor-pointer hover:scale-105 hover:text-blue-600 transform transition-transform duration-300 ">
                        <FaEdit className="w-4 h-4" />
                        Edit
                    </button>
                </div>
            ))}
            {
                isEditModalOpen && (
                    <EditLocationModal
                        isOpen={isEditModalOpen}
                        onClose={handleCloseModal}
                        location={location}
                        adminId={userId}
                    />
                )
            }
        </div>
    );
}

export default LocationRequest