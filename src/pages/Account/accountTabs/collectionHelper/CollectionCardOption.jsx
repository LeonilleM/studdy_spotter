import PropTypes from 'prop-types';

const CollectionCardOption = ({ isOpen, collection, onDelete, setIsOptionsOpen }) => (
    <div className={`absolute -top-20 -right-2 w-[150px]  ${isOpen ? 'block' : 'hidden'}`}>
        <div className="bg-white shadow-sm border flex flex-col gap-2 rounded-lg py-2">
            <button
                onClick={() => {
                    setIsOptionsOpen(false);
                    onDelete(collection.id)
                        .catch((error) => {
                            console.error('Error deleting collection:', error);
                        });
                }}
                className="text-red-500 text-sm p-1 "
            >
                Delete
            </button>
            <hr></hr>
            <button
                onClick={() => setIsOptionsOpen(false)}
                className="text-sm p-1 text-black"
            >
                Cancel
            </button>
        </div>
    </div >
);

CollectionCardOption.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    collection: PropTypes.shape({
        id: PropTypes.number.isRequired,
    }).isRequired,
    onDelete: PropTypes.func.isRequired,
    setIsOptionsOpen: PropTypes.func.isRequired,
};

export default CollectionCardOption;