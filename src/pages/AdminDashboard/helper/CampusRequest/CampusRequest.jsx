import { fetchUniversityRequest } from '../../../../services/Admin/Admin';
import { useEffect, useState } from 'react';
import { FaCheck, FaTimes, FaMinus } from 'react-icons/fa';

const statusButton = (status) => {
    if (status === 'Pending') {
        return (
            <div className="flex flex-row justify-center items-center gap-4 border rounded py-2">
                <FaMinus className="text-gray-500" />
                <h1 className="text-gray-500">Pending</h1>
            </div>
        );
    }
};

function CampusRequest() {
    const [universities, setUniversities] = useState([]);
    const [hoveredImage, setHoveredImage] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const fetchUniversities = async () => {
            const universitiesData = await fetchUniversityRequest();
            setUniversities(universitiesData);
        };
        fetchUniversities();
    }, []);

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
        <div className="bg-white mt-4 p-6 rounded-xl" onMouseMove={handleMouseMove}>
            <div className="grid grid-cols-12 gap-4 bg-gray-200 p-4 rounded-full">
                <h1 className="font-bold col-span-3">Id</h1>
                <h1 className="font-bold col-span-4">University</h1>
                <h1 className="font-bold col-span-1">City</h1>
                <h1 className="font-bold col-span-1">State</h1>
                <h1 className="font-bold col-span-1">Image</h1>
                <h1 className="font-bold col-span-1">Status</h1>
                <h1 className="font-bold col-span-1">Action</h1>
            </div>
            {universities.map((university, index) => (
                <div
                    key={university.id}
                    className={`grid grid-cols-12 p-2 my-2 items-center text-sm rounded-xl ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                >
                    <div className="col-span-3">{university.id}</div>
                    <div className="col-span-4">{university.name}</div>
                    <div className="col-span-1">{university.city}</div>
                    <div className="col-span-1">{university.States.abr}</div>
                    <div
                        className="relative col-span-1"
                        onMouseEnter={() => handleMouseEnter(university.image_url)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <img src={university.image_url} alt={university.name} className="w-16 h-16 object-cover" />
                    </div>
                    <div className="col-span-1">{statusButton(university.status)}</div>
                </div>
            ))}
            {hoveredImage && (
                <div
                    id="modal"
                    className="fixed z-50 pointer-events-none border shadow-sm"
                    style={{ top: mousePosition.y, left: mousePosition.x + 12 }}
                >
                    <img src={hoveredImage} alt="Hovered" className="w-96 object-cover" />
                </div>
            )}
        </div>
    );
}

export default CampusRequest;