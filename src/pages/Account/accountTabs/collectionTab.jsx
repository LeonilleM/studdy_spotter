import { useState, useEffect } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import PropTypes from 'prop-types';
import CreateCollectionModal from '../helper/createCollectionModal';
import { fetchUserFavorites } from '../../../services/StudyLocation/Study';
import { deleteCollection } from '../../../services/Collections/Collections';
import { loadingComponent } from '../../../components/Loading.jsx';
import PopupModal from '../../../components/shared/popupModal.jsx';
import CollectionCard from './collectionHelper/CollectionCard.jsx';
import LocationCard from './collectionHelper/LocationCard.jsx';

const NO_COLLECTIONS_MESSAGE = {
    title: 'No Collections Found',
    description: 'Create a collection to add study locations'
};

const NO_SAVED_LOCATIONS_MESSAGE = {
    title: 'No Saved Locations Found',
    description: 'Save a location to add to your collection'
};

function CollectionTab({ userId }) {
    const [collections, setCollections] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeCollection, setActiveCollection] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [popUp, setPopUp] = useState(false);


    const showPopup = (type, message) => {
        setPopUp({
            type,
            message,
            buttonText: 'Close',
            onClick: () => setPopUp(null)
        });
        setTimeout(() => setPopUp(null), 500);
    };

    useEffect(() => {
        const fetchCollections = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const collectionsData = await fetchUserFavorites(userId);
                setCollections(collectionsData);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCollections();
    }, [userId]);


    const handleLocationMoved = async (locationId, destinationCollectionId) => {
        setIsLoading(true);
        try {

            setActiveCollection(prevCollection => ({
                ...prevCollection,
                Collectionlist: prevCollection.Collectionlist.filter(
                    item => item.UserFavorites.id !== locationId
                )
            }));
            setCollections(prevCollections =>
                prevCollections.map(collection => {
                    if (collection.id === activeCollection.id) {
                        return {
                            ...collection,
                            Collectionlist: collection.Collectionlist.filter(
                                item => item.UserFavorites.id !== locationId
                            )
                        };
                    }

                    if (collection.id === destinationCollectionId) {
                        const movedItem = activeCollection.Collectionlist.find(
                            item => item.UserFavorites.id === locationId
                        );
                        return {
                            ...collection,
                            Collectionlist: [...collection.Collectionlist, movedItem]
                        };
                    }
                    return collection;
                })
            )
            showPopup('success', 'Location moved successfully');

        } catch (error) {
            showPopup('failed', 'Failed to move location');
            console.error('Error moving location:', error);
        } finally {
            setIsLoading(false);
        }
    };


    const handleDeleteCollection = async (collectionId) => {
        console.log(collectionId);
        setIsLoading(true);
        try {
            console.log("deleting")
            await deleteCollection(collectionId, userId);
            showPopup('success', 'Collection deleted successfully');
            setTimeout(() => {
                setPopUp(null);
            }, 500);

            setCollections(prevCollections =>
                prevCollections.filter(collection => collection.id !== collectionId)
            );
        } catch (error) {
            showPopup('failed', 'Failed to delete collection');
            console.error('Error deleting collection:', error);
            setError('Failed to delete collection.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="mb-6 py-4 mt-6 flex justify-between items-center border-b border-gray-300">
                {popUp && (
                    <PopupModal
                        type={popUp.type}
                        message={popUp.message}
                        buttonText={popUp.buttonText}
                        onClick={popUp.onClick}
                    />
                )}
                <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-action text-white text-xs rounded-md py-2 px-2"
                            >
                                Create New Collection
                            </button>
                <div className="flex items-center gap-2 font-lato">
                    {activeCollection && (
                        <>
                            <span
                                className="text-secondary cursor-pointer hover:underline font-semibold"
                                onClick={() => setActiveCollection(null)}
                            >
                                Collection List
                            </span>
                            <FaChevronRight className="text-gray-400 font-lato" />
                            <span className="font-semibold">{activeCollection.name}</span>
                        </>
                    )}
                </div>
            </div>
            {isLoading &&
                (
                    <div className="relative">
                        {loadingComponent('Loading your collections...')}
                    </div>
                )
            }
            {error ? (
                <div className="text-red-500 text-center mt-8">{error}</div>
            ) : activeCollection ? (
                <>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeCollection.Collectionlist.map((item) => (
                            <LocationCard
                                key={item.UserFavorites.StudyLocation.id}
                                item={item}
                                userId={userId}
                                collectionName={activeCollection.name}
                                onLocationMoved={handleLocationMoved}
                            />
                        ))}
                    </div>

                    {activeCollection.Collectionlist.length === 0 && (
                        <div className="text-center mt-8">
                            <h2 className="text-xl font-bold">{NO_SAVED_LOCATIONS_MESSAGE.title}</h2>
                            <p className="text-gray-500">{NO_SAVED_LOCATIONS_MESSAGE.description}</p>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-12">
                        {collections.map((collection) => (
                            <CollectionCard
                                key={collection.id}
                                collection={collection}
                                onClick={setActiveCollection}
                                handleDeleteCollection={handleDeleteCollection}
                            />
                        ))}
                    </div>
                    {collections.length === 0 && (
                        <div className="text-center mt-8">
                            <h2 className="text-xl font-bold">{NO_COLLECTIONS_MESSAGE.title}</h2>
                            <p className="text-gray-500">{NO_COLLECTIONS_MESSAGE.description}</p>
                        </div>
                    )}
                </>
            )}

            {isModalOpen && (
                <CreateCollectionModal
                    onClose={() => setIsModalOpen(false)}
                    userId={userId}
                    onCollectionCreated={async () => {
                        const collectionsData = await fetchUserFavorites(userId);
                        setCollections(collectionsData);
                    }}
                />
            )}
        </>
    );
}

CollectionTab.propTypes = {
    userId: PropTypes.string.isRequired
};

export default CollectionTab;