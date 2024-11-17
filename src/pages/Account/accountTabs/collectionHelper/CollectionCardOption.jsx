import PropTypes from 'prop-types';

const CollectionCardOption = ({ isOpen, collection, onDelete, setIsOptionsOpen }) => (
    <div className={`absolute  -translate-y-2 -top-20 -right-2 w-3/4  ${isOpen ? 'block' : 'hidden'}`}>
        <div className="bg-secondary  flex flex-col gap-2 rounded-lg py-2">
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
                className="text-sm p-1 text-white"
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