import { useState, useEffect, useRef } from 'react';
import { fetchPopularLocations } from '../../../services/StudyLocation/Study';
import StarRating from '../../../components/StarRating';
import { NavLink } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import PropTypes from 'prop-types';

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
                className="absolute top-1/2 sm:-left-10 -left-5 transform -translate-y-1/2"
                onClick={scrollLeft}
            >
                <FaChevronLeft className="w-8 h-8" />
            </button>
            <div className="bg-white rounded-lg shadow-md flex items-center p-10 overflow-x-auto border border-gray-300" ref={scrollContainerRef}>
                <div className="flex gap-4 sm:gap-8">
                    {popularLocations && popularLocations.map(location => (
                        <NavLink
                            to={'/university/' + location.University.name + '/' + location.name}
                            key={location.id}
                            className="flex flex-col items-center  sm:flex-row gap-4 bg-gray-100 border border-gray-300 py-4 sm:py-8 px-4 sm:px-10 rounded-lg font-poppins min-w-[15rem] sm:min-w-[25rem] max-w-[15rem] sm:max-w-[25rem]"
                        >
                            <div className="flex flex-col items-center justify-center text-center">
                                <div className="text-xl sm:text-2xl mb-2 font-light">{location.name}</div>
                                <StarRating
                                    rating={location.rating}
                                    noRating={false}
                                />
                            </div>
                            <img
                                src={location.image_url}
                                alt={location.name}
                                className="h-[100px] sm:h-[154px] w-[100px] sm:w-[177px] object-cover rounded-lg"
                            />
                        </NavLink>
                    ))}
                </div>
            </div>
            <button
                className="absolute sm:-right-10 -right-5 top-1/2 transform -translate-y-1/2"
                onClick={scrollRight}
            >
                <FaChevronRight className="w-8 h-8" />
            </button>
        </div>
    );
}

PopularLocations.propTypes = {
    universityID: PropTypes.string.isRequired,
}

export default PopularLocations;