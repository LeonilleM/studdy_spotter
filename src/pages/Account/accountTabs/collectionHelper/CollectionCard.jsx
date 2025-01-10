import { useState, useEffect, memo, useRef } from 'react';
import PropTypes from 'prop-types';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { SlOptions } from "react-icons/sl";
import CollectionCardOptions from './CollectionCardOption';

const CollectionCard = memo(({ collection, onClick, handleDeleteCollection }) => {
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
        <div className="flex flex-col">
            <div
                role="button"
                tabIndex={0}
                onClick={() => onClick(collection)}
                onKeyDown={(e) => e.key === 'Enter' && onClick(collection)}
                aria-label={`${collection.name} collection with ${collection.Collectionlist.length} items`}
                className="cursor-pointer hover:opacity-90 transition-opacity w-full h-[22vh] bg-white rounded relative"
                style={{
                    backgroundImage: `url(${collection.Collectionlist[0]?.UserFavorites?.StudyLocation?.image_url || 'No image'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div
                    className="absolute bottom-0 right-0 flex items-center justify-center font-lato text-sm bg-white/70 rounded-tl rounded-br w-1/3 h-1/3 text-black">
                    <FaMapMarkerAlt className="text-black inline-flex " />
                    ({collection.Collectionlist.length})
                </div>
            </div>
            <h2
                ref={optionRef}
                className="text-xl font-bold pt-2 inline-flex items-center justify-between relative ">
                {collection.name}
                <SlOptions
                    className="ml-12 cursor-pointer"
                    onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                />
                {isOptionsOpen && (
                    <CollectionCardOptions
                        isOpen={isOptionsOpen}
                        collection={collection}
                        onDelete={handleDeleteCollection}
                        setIsOptionsOpen={setIsOptionsOpen}
                    />
                )}
            </h2>
        </div>
    );
});

CollectionCard.displayName = 'CollectionCard';

CollectionCard.propTypes = {
    collection: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        Collectionlist: PropTypes.array.isRequired,
    }).isRequired,
    onClick: PropTypes.func.isRequired,
    handleDeleteCollection: PropTypes.func.isRequired,
};

export default CollectionCard;