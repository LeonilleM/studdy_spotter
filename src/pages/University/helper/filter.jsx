import { useState, useRef, useEffect } from 'react';
import { IoSearchOutline } from "react-icons/io5";
import { VscThreeBars } from "react-icons/vsc";
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const Filter = ({ searchQuery, setSearchQuery, selectedTags, setSelectedTags, locationTags, filterMode, setFilterMode, setSortBy }) => {
    const [isSelectVisible, setIsSelectVisible] = useState(false);
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsSelectVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [])


    return (
        <div className="flex flex-col space-y-4 mt-12 mb-2">
            <div className="flex justify-between">
                <h1 className="font-poppins font-bold text-4xl">Explore</h1>
                <NavLink
                    to={`/university/request-location`}
                    className="bg-accent  text-white px-4 py-2 rounded-lg font-lato hover:scale-105 hover:shadow-lg hover:shadow-action/30 transition ease-in-out duration-300">
                    Request Location
                </NavLink>
            </div>
            <div className="flex lg:flex-row flex-col gap-4">
                <section className="flex sm:flex-nowrap flex-wrap h-10 gap-0.5">
                    <div className="relative flex sm:w-auto w-full">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                            <IoSearchOutline className="text-darkBlue w-8 h-5 border-r border-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for a study spot"
                            className="pl-12 bg-white py-2 rounded-l-lg font-lato sm:w-96 w-full border border-gray-300"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="relative flex items-center font-lato w-[49%]">
                        <VscThreeBars className="absolute ml-4 text-darkBlue w-4 h-4" />
                        <select
                            defaultValue=""
                            onChange={(e) => setSortBy(e.target.value)}
                            className="pl-8 h-10 sm:w-auto w-full  bg-white font-lato text-sm font-bold border border-gray-300"
                        >
                            <option value="" disabled>
                                Sort By
                            </option>
                            <option value="name">Name (A-Z)</option>
                            <option value="reviews"># of Reviews</option>
                            <option value="rating">Rating</option>
                        </select>
                    </div>
                    <button
                        type="button"
                        className="relative sm:w-24 w-[50%] h-full bg-white text-sm text-darkBlue px-4 rounded-r-lg font-lato font-bold flex items-center border border-gray-300"

                        onClick={() => setIsSelectVisible(!isSelectVisible)}
                    >
                        <VscThreeBars className="text-darBlue w-4 h-4" />
                        Filter
                        {isSelectVisible && (
                            <div
                                onClick={(e) => e.stopPropagation()}
                                ref={dropdownRef}
                                className="absolute top-10 right-0 bg-white rounded-md shadow-lg p-2 min-w-[180px] z-50 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                                {locationTags.map(tag => (
                                    <div key={tag.id} className="flex items-center gap-2 p-1 hover:bg-gray-100">
                                        <input
                                            className="cursor-pointer"
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
                                        <label
                                            htmlFor={`tag-${tag.id}`} >
                                            {tag.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </button>
                </section>
                <div className="flex gap-2 text-xs h-10 sm:mt-0 mt-10 ">
                    <button
                        className={`px-3 py-1 rounded-xl font-bold ${filterMode === 'AND' ? 'bg-accent text-white' : 'bg-gray-200 border border-gray-300 text-secondary'}`}
                        onClick={() => setFilterMode('AND')}
                    >
                        Match All
                    </button>
                    <button
                        className={`px-3 py-1 rounded-xl font-bold ${filterMode === 'OR' ? 'bg-accent text-white' : 'bg-gray-200 border border-gray-300 text-secondary'}`}
                        onClick={() => setFilterMode('OR')}
                    >
                        Match Any
                    </button>
                </div>
            </div>
        </div >

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
    setSortBy: PropTypes.func.isRequired
};

export default Filter;