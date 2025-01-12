import { useEffect, useState } from 'react'
import { statusButton } from '../StatusButton'
import { fetchStudyRequest } from '../../../../services/Admin/Admin'

function LocationRequest() {
    const [studyRequests, setStudyRequests] = useState([])

    useEffect(() => {
        const fetchRequests = async () => {
            const studyRequestLocation = await fetchStudyRequest();
            setStudyRequests(studyRequestLocation);
        };
        fetchRequests();
    }, [])


    console.log(studyRequests)

    return (
        <div className="bg-white mt-4 p-6 rounded-xl h-full">
            <div className="grid grid-cols-12  bg-gray-200 p-4 rounded-full  items-center justify-center">
                <h1 className="font-bold col-span-1">Id</h1>
                <h1 className="font-bold col-span-1">University</h1>
                <h1 className="font-bold col-span-1">Name</h1>
                <h1 className="font-bold col-span-1">Address</h1>
                <h1 className="font-bold col-span-1">City</h1>
                <h1 className="font-bold col-span-1">State</h1>
                <h1 className="font-bold col-span-1">Zipcode</h1>
                <h1 className="font-bold col-span-1">Tags</h1>
                <h1 className="font-bold col-span-1">Category</h1>
                <h1 className="font-bold col-span-1">Status</h1>
                <h1 className="font-bold col-span-1">Action</h1>
            </div>
            {studyRequests.map((request, index) => (
                <div
                    key={request.id}
                    className={`grid grid-cols-12 p-2 my-2 items-center justify-center text-sm rounded-xl ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <div className="col-span-1">{request.id}</div>
                    <div className="col-span-1">{request.University ? request.University.name : 'N/A'}</div>
                    <div className="col-span-1">{request.name}</div>
                    <div className="col-span-1">{request.address}</div>
                    <div className="col-span-1">{request.city}</div>
                    <div className="col-span-1">{request.States.abr}</div>
                    <div className="col-span-1">{request.zipcode}</div>
                    <div className="col-span-1">{request.locationtag ? request.locationtag.join(', ') : 'N/A'}</div>
                    <div className="col-span-1">{request.category}</div>
                    <div className="col-span-1">{statusButton(request.status)}</div>
                    <div className="col-span-1">

                    </div>
                </div>
            ))}

        </div>
    );

}

export default LocationRequest