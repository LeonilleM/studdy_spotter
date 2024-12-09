import { useState, useEffect, useRef } from 'react';
import { fetchPopularLocations } from '../../../services/StudyLocation/Study';
import StarRating from '../../../components/StarRating';
import { NavLink } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const PopularLocations = ({ universityID }) => {
    const [popularLocations, setPopularLocations] = useState(null);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const fetchPopular = async () => {
            try {
                const popular = await fetchPopularLocations(universityID);
                setPopularLocations(popular);
            } catch (error) {
                console.error(error);
            }
        };

        if (universityID) {
            fetchPopular();
        }
    }, [universityID]);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -430, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 430, behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full relative">
            <button
                className="absolute  top-1/2 -left-6 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md"
                onClick={scrollLeft}
            >
                <FaChevronLeft />
            </button>
            <div className="bg-white rounded-lg shadow-md flex items-center p-6 overflow-x-scroll" ref={scrollContainerRef}>
                <div className="flex gap-8">
                    {popularLocations && popularLocations.map(location => (
                        <NavLink
                            to={'/university/' + location.University.name + '/' + location.name}
                            key={location.id}
                            className="flex flex-row gap-4 bg-gray-100 border border-gray-300 py-8 px-10 rounded-lg font-poppins min-w-[25rem] max-w-[25rem]">
                            <div className="flex flex-col items-center justify-center text-center">
                                <div className="text-2xl mb-2 font-light">{location.name}</div>
                                <StarRating
                                    rating={location.rating}
                                    noRating={false}
                                />
                            </div>
                            <img
                                src={location.image_url}
                                alt={location.name}
                                className="h-[154px] w-[177px] object-cover rounded-lg"
                            />
                        </NavLink>
                    ))}
                </div>
            </div>
            <button
                className="absolute -right-6 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md"
                onClick={scrollRight}
            >
                <FaChevronRight />
            </button>
        </div>
    );
}

export default PopularLocations;