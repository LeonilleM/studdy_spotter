import { useState } from 'react';
import { IoSearchOutline } from "react-icons/io5";
import { VscThreeBars } from "react-icons/vsc";
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const Filter = ({ searchQuery, setSearchQuery, selectedTags, setSelectedTags, locationTags, filterMode, setFilterMode }) => {
    const [isSelectVisible, setIsSelectVisible] = useState(false);

    return (
        <>
            <h1 className="font-poppins font-bold text-4xl">Explore</h1>
            <NavLink
                to={`/university/request-location`}
                className="bg-action  sm:hidden block text-white px-4 py-2 rounded-lg font-lato hover:scale-105 hover:shadow-lg hover:shadow-action/30 transition ease-in-out duration-300">
                Request Location
            </NavLink>
            <div className="flex sm:flex-row flex-wrap justify-between w-full  pb-6 gap-2 pt-4">
                <div className="flex sm:flex-row flex-col gap-2">
                    <div className="relative flex sm:w-[25vw] w-[90vw] h-10 gap-0.5 ">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                            <IoSearchOutline className="text-darkBlue w-8 h-5 border-r border-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for a study spot"
                            className="pl-12 bg-white py-2 rounded-l-lg font-lato w-full border border-gray-300 h-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="relative">
                            <button
                                type="button"
                                className="h-full bg-white text-sm text-darkBlue px-4 rounded-r-lg font-lato font-bold flex items-center gap-2 border border-gray-300 active:bg-gray-300 transition duration-500 ease-in-out"

                                onClick={() => setIsSelectVisible(!isSelectVisible)}
                            >
                                <VscThreeBars />
                                Filter

                            </button>
                            {isSelectVisible && (
                                <div className="absolute top-10 right-0 bg-white rounded-md shadow-lg p-2 min-w-[150px] z-50 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                                    {locationTags.map(tag => (
                                        <div key={tag.id} className="flex items-center gap-2 p-1 hover:bg-gray-100">
                                            <input
                                                type="checkbox"
                                                id={`tag-${tag.id}`}
                                                value={tag.name}
                                                checked={selectedTags.includes(tag.name)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedTags([...selectedTags, tag.name]);
                                                    } else {
                                                        setSelectedTags(selectedTags.filter(t => t !== tag.name));
                                                    }
                                                }}
                                            />
                                            <label htmlFor={`tag-${tag.id}`} className="cursor-pointer">
                                                {tag.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2 h-10 text-xs ">
                        <button
                            className={`px-3 py-1 rounded-xl font-bold ${filterMode === 'AND' ? 'bg-accent text-white' : 'bg-gray-200 border border-gray-300 text-secondary'}`}
                            onClick={() => setFilterMode('AND')}
                        >
                            Require All Filter
                        </button>
                        <button
                            className={`px-3 py-1 rounded-xl font-bold ${filterMode === 'OR' ? 'bg-accent text-white' : 'bg-gray-200 border border-gray-300 text-secondary'}`}
                            onClick={() => setFilterMode('OR')}
                        >
                            Require Any Filter
                        </button>
                    </div>
                </div>
                <NavLink
                    to={`/university/request-location`}
                    className="bg-accent sm:block hidden text-white px-4 py-2 rounded-lg font-lato hover:scale-105 hover:shadow-lg hover:shadow-action/30 transition ease-in-out duration-300">
                    Request Location
                </NavLink>
            </div>
        </>

    );
};

Filter.propTypes = {
    searchQuery: PropTypes.string.isRequired,
    setSearchQuery: PropTypes.func.isRequired,
    selectedTags: PropTypes.array.isRequired,
    setSelectedTags: PropTypes.func.isRequired,
    locationTags: PropTypes.array.isRequired,
    filterMode: PropTypes.string.isRequired,
    setFilterMode: PropTypes.func.isRequired,
};

export default Filter;