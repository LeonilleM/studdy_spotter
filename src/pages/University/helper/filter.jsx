import React, { useState } from 'react';
import { IoSearchOutline } from "react-icons/io5";
import { VscThreeBars } from "react-icons/vsc";
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const Filter = ({ searchQuery, setSearchQuery, selectedTags, setSelectedTags, locationTags, filterMode, setFilterMode }) => {
    const [isSelectVisible, setIsSelectVisible] = useState(false);

    const handleTagRemove = (tagToRemove) => {
        setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="flex sm:flex-row flex-wrap justify-between w-full items-center pb-6">
            <div className="flex flex-row items-center gap-1">
                <div className="relative flex items-center sm:w-[35vh]">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <IoSearchOutline className="text-black w-8 h-5 border-r border-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for a study spot"
                        className="pl-12 bg-white py-2 rounded-l-lg font-lato w-full border border-gray-300"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="relative flex gap-2">
                    <button
                        type="button"
                        className="bg-white text-sm text-action px-4 h-[40px] rounded-r-lg font-lato font-bold flex items-center gap-2 border border-gray-300 active:bg-gray-300 transition duration-500 ease-in-out "
                        onClick={() => setIsSelectVisible(!isSelectVisible)}
                    >
                        <VscThreeBars />
                        Filter
                    </button>
                    <div className="text-xs flex items-stretch gap-2">
                        <button
                            className={`px-2 py-1 rounded ${filterMode === 'AND' ? 'bg-primary text-white' : 'bg-gray-200 border-2'}`}
                            onClick={() => setFilterMode('AND')}
                        >
                            Match All
                        </button>
                        <button
                            className={`px-2 py-1 rounded ${filterMode === 'OR' ? 'bg-primary text-white' : 'bg-gray-200 border-2'}`}
                            onClick={() => setFilterMode('OR')}
                        >
                            Match Any
                        </button>
                    </div>
                    {isSelectVisible && (
                        <div className="absolute left-0 top-10 bg-white rounded-md shadow-lg p-2 min-w-[150px] z-50 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
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
            <NavLink
                to={`/university/request-location`}
                className="bg-action text-white px-4 py-2 rounded-lg font-lato hover:scale-105 hover:shadow-lg hover:shadow-action/30 transition ease-in-out duration-300">
                Request Location
            </NavLink>
        </div>
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