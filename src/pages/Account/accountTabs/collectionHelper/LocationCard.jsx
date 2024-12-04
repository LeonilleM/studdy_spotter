import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { SlOptions } from 'react-icons/sl';
import LocationCardOption from './LocationCardOption';



const LocationCard = ({ collectionName, item, userId, onLocationMoved }) => {
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const optionRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (optionRef.current && !optionRef.current.contains(event.target)) {
                setIsOptionsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);



    return (
        <div key={item.UserFavorites.StudyLocation.id} className="bg-white rounded-lg shadow">
            <img
                src={item.UserFavorites.StudyLocation.image_url}
                className="w-full h-48 object-cover rounded-t-lg"
                alt={item.UserFavorites.StudyLocation.name}
            />
            <div className="p-4 flex">
                <section>
                    <h3 className="font-semibold">{item.UserFavorites.StudyLocation.name}</h3>
                    <p className="text-sm text-gray-600">
                        {item.UserFavorites.StudyLocation.University.name}
                    </p>
                </section>
                <SlOptions
                    onClick={() => {
                        setIsOptionsOpen(!isOptionsOpen);
                    }}
                    className="ml-auto cursor-pointer"
                />
                {isOptionsOpen && (
                    <LocationCardOption
                        isOpen={isOptionsOpen}
                        item={item}
                        setIsOptionsOpen={setIsOptionsOpen}
                        userFavorite={item.UserFavorites.id}
                        userId={userId}
                        collectionName={collectionName}
                        onLocationMoved={onLocationMoved}
                    />
                )}
            </div>
        </div>
    );
};

LocationCard.propTypes = {
    item: PropTypes.object.isRequired,
    userId: PropTypes.string.isRequired,
    collectionName: PropTypes.string,
    onLocationMoved: PropTypes.func.isRequired,
};


export default LocationCard;