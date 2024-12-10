import { FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';


const SelectedTags = ({ selectedTags, handleTagRemove, clearAllTags }) => {
    return (
        < div className="pb-4" >
            <div className="flex flex-row gap-6 pb-2">
                <h1 className="font-lato font-bold text-black">Applied Filters</h1>
                {selectedTags.length > 2 && (
                    <button
                        type="button"
                        className=" text-red-500 rounded-lg font-lato hover:font-bold hover:underline  transition ease-in-out duration-300"
                        onClick={clearAllTags}
                    >
                        Clear All
                    </button>
                )}
            </div>
            <ul className="flex flex-wrap gap-2">
                {selectedTags.length > 0 ?
                    selectedTags.map(tag => (
                        <li key={tag}>
                            <div className="flex items-center bg-white text-secondary px-2 py-1 rounded-md text-sm">
                                <button
                                    type="button"
                                    className="mr-2"
                                    onClick={() => handleTagRemove(tag)}
                                >
                                    <FaTimes />
                                </button>
                                <span>{tag}</span>
                            </div>
                        </li>

                    ))
                    :
                    <h1>No filters Applied</h1>
                }
            </ul>
        </div >
    )
}

SelectedTags.propTypes = {
    selectedTags: PropTypes.array.isRequired,
    handleTagRemove: PropTypes.func.isRequired,
    clearAllTags: PropTypes.func.isRequired
}

export default SelectedTags;