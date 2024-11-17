import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { returnUserCollections, moveStudyLocationToCollection } from '../../../../services/Collections/Collections';



const LocationCardOption = ({ collectionName, userFavorite, isOpen, setIsOptionsOpen, userId, onLocationMoved }) => {
    const optionRef = useRef(null)
    const [availableCollections, setAvailableCollections] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchAvailableCollections = async () => {
            const collections = await returnUserCollections(userId);
            setAvailableCollections(collections);
        };
        fetchAvailableCollections();
    }, [userId, collectionName]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (optionRef.current && !optionRef.current.contains(event.target)) {
                setIsOptionsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setIsOptionsOpen]);


    const handleMoveLocation = async (locationID, collectionId) => {
        setIsLoading(true);
        try {
            await moveStudyLocationToCollection(locationID, collectionId);
            onLocationMoved(locationID, collectionId);
            setIsOptionsOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }



    return (
        <div
            ref={optionRef}
            className={`fixed inset-0 w-full   bg-black/75 flex justify-center items-center   ${isOpen ? 'block' : 'hidden'}`}
        >
            <div className="bg-white text-secondary flex flex-col gap-5 rounded-lg  shadow-lg w-[50vh] p-6">
                <h1 className="font-poppins ">Move Collections</h1>
                <div className="border border-secondary p-4 font-lato flex flex-col gap-4">
                    {availableCollections.map((collection) => (
                        <div key={collection.id} className="flex justify-between p-4  items-center border">
                            
                            <h1 className="items-center font-semibold"> {collection.name} </h1>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsOptionsOpen(false);
                                    handleMoveLocation(userFavorite, collection.id);

                                }}
                                disabled={isLoading || collection.name === collectionName}
                                className={`text-sm px-4 py-2 rounded
                                ${collection.name === collectionName
                                        ? ' text-red-600  cursor-not-allowed'
                                        : 'bg-action text-white'
                                    }`}
                            >
                                {collection.name === collectionName ? 'Current' : 'Save'}

                            </button>

                        </div>
                    ))}

                </div>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsOptionsOpen(false);
                    }}
                    disabled={isLoading}
                    className="text-sm p-1 w-fit  text-secondary hover:underline rounded-lg self-center"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

LocationCardOption.propTypes = {
    collectionName: PropTypes.string,
    userFavorite: PropTypes.number,
    userId: PropTypes.string,
    isOpen: PropTypes.bool,
    setIsOptionsOpen: PropTypes.func,
    onLocationMoved: PropTypes.func,
};



export default LocationCardOption;