import PropTypes from 'prop-types';
import { useState } from 'react';
import { createCollection } from '../../../services/Collections/Collections';
import Modal from '../../../components/shared/popupModal.jsx';
import { loadingComponent } from '../../../components/Loading.jsx';



function CreateCollectionModal({ onClose, userId, onCollectionCreated }) {
    const [collectionName, setCollectionName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [modal, setModal] = useState(false);

    const handleCreateCollection = async () => {

        if (collectionName === '') return;
        setIsLoading(true);

        const newCollection = {
            name: collectionName,
            created_by: userId,
        };

        try {
            await createCollection(newCollection);
            setModal({
                type: 'success',
                message: 'Succesfully created collection',
                buttonText: 'close',
                onClick: () => {
                    setModal(null)
                }
            })
            setTimeout(() => {
                onClose();
            }, 500);
            onCollectionCreated();

        } catch (error) {
            setModal({
                type: 'failed',
                message: 'Error creating collection',
                buttonText: 'close',
                onClick: () => setModal(null),
            });
            console.error('Error creating collection:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 xl:px-0 px-4 ">
            {isLoading && (
                <>
                    {loadingComponent('Submitting...')}
                </>

            )}
            {modal && (
                <Modal
                    type={modal.type}
                    message={modal.message}
                    buttonText={modal.buttonText}
                    onClick={modal.onClick}
                />
            )}
            <div className="bg-white p-8 rounded-md shadow-lg w-[50vh] ">
                <h2 className="text-xl font-bold mb-4 font-poppins">Create New Collection</h2>
                <div className="flex flex-col gap-1 font-lato">
                    <label htmlFor="collectionName" className="text-secondary text-sm">Collection Name</label>
                    <input
                        type="text"
                        value={collectionName}
                        onChange={(e) => setCollectionName(e.target.value)}
                        placeholder="Enter collection name"
                        className="w-full p-2 border rounded-md mb-4"
                    />
                </div>
                <div className="flex  gap-2">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-black px-4 py-2 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreateCollection}
                        className="bg-action text-white px-4 py-2 rounded-md"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}

CreateCollectionModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
    onCollectionCreated: PropTypes.func.isRequired,
};

export default CreateCollectionModal;