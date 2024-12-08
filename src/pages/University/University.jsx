import { fetchUniversityData } from '../../services/University/University';
import { useEffect, useState } from 'react';
import { fetchUniversityStudyLocationsWithReviews } from '../../services/StudyLocation/Study';
import { fetchTags } from '../../services/helper/helper';
import { NavLink } from 'react-router-dom';
import StarRating from '../../components/StarRating';
import { loadingComponent } from '../../components/Loading';
import { IoSearchOutline } from "react-icons/io5";
import { FaTimes } from "react-icons/fa";
import { VscThreeBars } from "react-icons/vsc";
import ErrorPage from '../../components/shared/ErrorPage';

function University() {
    const [uniData, setUniData] = useState(null);
    const [studyLocations, setStudyLocations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [locationTags, setLocationTags] = useState([]);
    const [isSelectVisible, setIsSelectVisible] = useState(false);
    const [filterMode, setFilterMode] = useState('AND');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Extract the university name from the URL
                const universityNameFromURL = window.location.pathname.split('/').pop();
                const universityData = await fetchUniversityData(universityNameFromURL);
                const data = await fetchTags();

                if (universityData.length === 0) {
                    setError(`${decodeURIComponent(universityNameFromURL)} isn't partnered with us`);
                    setLoading(false);
                    return;
                }

                const universityID = universityData[0].id;
                const studyLocationsData = await fetchUniversityStudyLocationsWithReviews(universityID);

                const sortedByRatingAndName = studyLocationsData.sort((a, b) => {
                    if (b.rating === a.rating) {
                        // If ratings are equal, sort by name alphabetically
                        return a.name.localeCompare(b.name);
                    }
                    // Otherwise, sort by rating
                    return b.rating - a.rating;
                });

                setUniData(universityData);
                setLocationTags(data);
                setStudyLocations(sortedByRatingAndName);
            } catch (error) {
                console.error(error);
                setError('An error occurred while fetching data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const filteredStudyLocations = studyLocations ? studyLocations.filter(location => {
        const matchesSearchQuery = location.name.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesTags = selectedTags.length === 0 || (
            filterMode === 'AND'
                ? selectedTags.every(tag =>
                    location.LocationTagList.some(tagObj => tagObj.TagTypes.name === tag)
                )
                : selectedTags.some(tag =>
                    location.LocationTagList.some(tagObj => tagObj.TagTypes.name === tag)
                )
        );

        return matchesSearchQuery && matchesTags;
    }) : [];


    const handleTagRemove = (tagToRemove) => {
        setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
    };


    return (
        <div className="pt-32 overflow-x-hidden bg-background">
            {loading && loadingComponent("Loading Study Spots...")}
            {uniData && uniData.map((uni) => (
                <div key={uni.id} style={{ backgroundImage: `url(${uni.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '45vh', width: '100%' }}>
                    <div
                        className="lg:w-1/3 w-1/2 h-full font-lato flex flex-col items-center justify-center lg:px-12 px-4 gap-4 opacity-85"
                        style={{ backgroundColor: uni.school_hex_color ? `${uni.school_hex_color}` : '#000000' }}
                    >
                        <h1 className="text-white font-bold lg:text-4xl text-2xl text-center">{uni.name}</h1>
                        <div>
                            <h1 className="text-white font-bold lg:text-2xl text-lg text-center">{uni.city},</h1>
                            <h1 className="text-white font-bold lg:text-2xl text-lg text-center">{uni.States.name}</h1>
                        </div>
                    </div>
                </div>
            ))}
            <section className="font-secondary lg:px-0 px-6 text-secondary pb-32">
                <div className="container mx-auto flex flex-col gap-4 py-8">
                    <h1 className="font-poppins font-bold text-4xl">Explore</h1>
                    <div className="flex sm:flex-row flex-wrap justify-between w-full items-center pb-6">
                        <div className="flex flex-row items-center gap-1">
                            <div className="relative flex items-center sm:w-[35vh] ">
                                <IoSearchOutline className="text-black w-8 h-5 border-r-2 left-2 absolute border-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search for a study spot"
                                    className="pl-12 bg-white py-2 rounded-l-lg font-lato w-full"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="relative flex gap-2">
                                <button
                                    type="button"
                                    className="bg-white text-sm  px-4 h-[40px] rounded-r-lg font-lato font-bold flex items-center gap-2 active:text-action active:bg-gray-300 transition duration-500 ease-in-out "
                                    onClick={() => setIsSelectVisible(!isSelectVisible)}
                                >
                                    <VscThreeBars />
                                    Filter
                                </button>
                                <div className="text-xs flex items-center gap-2">
                                    <button
                                        className={`px-2 py-1 rounded ${filterMode === 'AND' ? 'bg-action text-white' : 'bg-gray-200'}`}
                                        onClick={() => setFilterMode('AND')}
                                    >
                                        Match All
                                    </button>
                                    <button
                                        className={`px-2 py-1 rounded ${filterMode === 'OR' ? 'bg-action text-white' : 'bg-gray-200'}`}
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
                    <div className="pb-4">
                        <div className="flex flex-row gap-6 pb-2">
                            <h1 className="font-lato font-bold text-primary">Applied Filters</h1>
                            {selectedTags.length > 2 && (
                                <button
                                    type="button"
                                    className=" text-red-500 rounded-lg font-lato hover:font-bold hover:underline  transition ease-in-out duration-300"
                                    onClick={() => setSelectedTags([])}
                                >
                                    Clear All
                                </button>
                            )}
                        </div>

                        <ul className="flex flex-row gap-2">
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
                    </div>

                    {filteredStudyLocations.length > 0 ? (
                        <div className="grid lg:grid-cols-3 2xl:gap-20 gap-16">
                            {filteredStudyLocations.map((studyLocation) => {
                                const studyLocationPath = `/university/${uniData[0].name}/${studyLocation.name}`;
                                return (
                                    <NavLink
                                        to={studyLocationPath}
                                        key={studyLocation.id}
                                        className="grid grid-cols-2 font-poppins text-secondary transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-blue-400/20 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-400/0 before:to-blue-400/10 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 hover:scale-105 group"
                                    >
                                        <img
                                            src={studyLocation.image_url}
                                            alt="placeholder"
                                            className="w-full h-full rounded-l-lg group-hover:opacity-85"
                                        />
                                        <div className="bg-white rounded-r-lg items-center justify-between text-center relative overflow-hidden flex flex-col py-6 px-2">
                                            <h1 className="text-2xl px-2 transition-transform duration-300 ease-in-out group-hover:-translate-y-2 group-hover:scale-110 pt-2">
                                                {studyLocation.name}
                                            </h1>
                                            <div className="items-center gap-2 flex flex-row transition-transform duration-300 ease-in-out group-hover:-translate-y-2 group-hover:scale-110">
                                                <StarRating rating={studyLocation.rating} starSize={12} />
                                                <h1 className="text-xs font-light">{studyLocation.review_count} reviews</h1>
                                            </div>
                                        </div>
                                    </NavLink>
                                );
                            })}
                        </div>
                    ) : (
                        <h1 className="text-2xl w-full">No study locations found for this university.</h1>
                    )}


                </div>
                {error && (
                    <ErrorPage
                        errorMessage={error}
                        customMessage="If you think this university should be added, send a university application below"
                        link="/allschools"
                        linkText="Send Application"
                    />
                )}
            </section >
        </div >
    );
}

export default University;