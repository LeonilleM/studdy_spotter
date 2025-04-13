import { fetchUniversityData } from '../../services/University/University';
import { useEffect, useState } from 'react';
import { fetchUniversityStudyLocations } from '../../services/StudyLocation/Study';
import { fetchTags } from '../../services/helper/helper';
import { loadingComponent } from '../../components/Loading';
import ErrorPage from '../../components/shared/ErrorPage';
import StudyLocationList from './StudyLocationList';
import Filter from './helper/filter';
import SelectedTags from './helper/selectedTags';

function University() {
    const [uniData, setUniData] = useState(null);
    const [studyLocations, setStudyLocations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [locationTags, setLocationTags] = useState([]);
    const [filterMode, setFilterMode] = useState('AND');
    const [sortBy, setSortBy] = useState('name');


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Extract the university name from the URL
                const universityNameWithCity = decodeURIComponent(window.location.pathname.split('/').pop());
                const universityData = await fetchUniversityData(universityNameWithCity);
                const data = await fetchTags();

                if (universityData.length === 0) {
                    setError(`${decodeURIComponent(universityNameWithCity)} isn't partnered with us`);
                    setLoading(false);
                    return;
                }
                const universityID = universityData[0].id;
                const studyLocationsData = await fetchUniversityStudyLocations(universityID);

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
    })

        .sort((a, b) => {
            // Apply sorting based on the selected option
            if (sortBy === 'name') {
                return a.name.localeCompare(b.name); // Sort by name (A-Z)
            } else if (sortBy === 'reviews') {
                return b.review_count - a.review_count; // Sort by number of reviews (descending)
            } else if (sortBy === 'rating') {
                return b.rating - a.rating; // Sort by rating (descending)
            }
            return 0;
        }) : [];


    const handleTagRemove = (tag) => {
        setSelectedTags(selectedTags.filter(t => t !== tag));
    }

    const clearAllTags = () => {
        setSelectedTags([]);
    }



    return (
        <div className="bg-background">
            {error ? (
                <ErrorPage
                    errorMessage={error}
                    customMessage="If you think this university should be added, send a university application below, please don't forget we need your University Name + City it's in"
                    link="/allschools"
                    linkText="Send Application"
                />
            ) : loading ? (
                loadingComponent("Loading Study Spots...")
            ) : (
                <>
                    {uniData && uniData.map((uni) => (
                        <div key={uni.id}
                            className="h-[55vh]"
                            style={{
                                backgroundImage: `url(${uni.image_url})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                width: '100%'
                            }}>
                            <div
                                className="lg:w-1/3 w-[60%] xl:px-36 lg:px-20 h-full font-lato flex flex-col justify-center px-4 gap-2 opacity-[90%]"
                                style={{ backgroundColor: uni.school_hex_color ? `${uni.school_hex_color}` : '#000000' }}
                            >
                                <h1 className="text-white font-bold lg:text-3xl text-xl ">{uni.name}</h1>
                                <div>
                                    <h1 className="text-white lg:text-xl">{uni.city}, {uni.States.name}</h1>
                                </div>
                            </div>
                        </div>
                    ))}
                    <section className="font-secondary lg:px-0 px-4 text-darkBlue pb-32">
                        <div className="container mx-auto flex flex-col gap-4 py-8 relative">
                            {/* <h1 className="font-poppins font-bold text-4xl">Popular Study Spots</h1>
                            {uniData && uniData[0] && (
                                <PopularLocations universityID={uniData[0].id} />
                            )} */}

                            <Filter
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                selectedTags={selectedTags}
                                setSelectedTags={setSelectedTags}
                                locationTags={locationTags}
                                filterMode={filterMode}
                                setFilterMode={setFilterMode}
                                setSortBy={setSortBy}
                            />
                            <SelectedTags
                                selectedTags={selectedTags}
                                handleTagRemove={handleTagRemove}
                                clearAllTags={clearAllTags}
                            />

                            {filteredStudyLocations.length > 0 ? (
                                <StudyLocationList studyLocations={filteredStudyLocations} uniName={uniData[0].name} uniCity={uniData[0].city} />
                            ) : (
                                <h1 className="text-2xl w-full">No study locations found for this university.</h1>
                            )}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}

export default University;