import { fetchUniversities, fetchUniversitiesWithMostReviews } from '../../services/University/University';
import { fetchTotalReviews, fetchRecentReviews } from '../../services/Reviews/Reviews';
import { fetchTotalLocations, fetchMostPopularStudyLocations } from '../../services/StudyLocation/Study';
import { useEffect, useState } from 'react';
import Select, { components } from 'react-select';
import { NavLink } from 'react-router-dom';
import { IoSearchOutline, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { FaUniversity } from "react-icons/fa";
import PropTypes from 'prop-types';
import StarRating from '../../components/StarRating';
import { formatDistanceToNow } from 'date-fns';
import { FaUser } from 'react-icons/fa';

function Home() {
    const [universities, setUniversities] = useState([]);
    const [topUniversities, setTopUniversities] = useState([]);
    const [topStudyLocations, setTopStudyLocations] = useState([]);
    const [totalLocationCount, setTotalLocationCount] = useState(0)
    const [totalCount, setTotalCount] = useState(0)
    const [recentReviews, setRecentReviews] = useState([])

    useEffect(() => {
        const batchFetch = async () => {
            try {
                const [
                    recentReviewData,
                    universitiesData,
                    topUniversitiesData,
                    topStudyLocationsData,
                    totalLocationsData,
                    totalReviewsData
                ] = await Promise.all([
                    fetchRecentReviews(),
                    fetchUniversities(),
                    fetchUniversitiesWithMostReviews(),
                    fetchMostPopularStudyLocations(),
                    fetchTotalLocations(),
                    fetchTotalReviews()
                ]);
                setRecentReviews(recentReviewData)
                setUniversities(universitiesData);
                setTopUniversities(topUniversitiesData);
                setTopStudyLocations(topStudyLocationsData);
                setTotalLocationCount(totalLocationsData);
                setTotalCount(totalReviewsData);
            } catch (error) {
                console.error('Error during batch fetch:', error);
            }
        };

        batchFetch();
    }, []);

    const options = universities.map(university => ({
        value: `${university.name} ${university.city}`,
        label: university.name + ', ' + university.city
    }));

    const handleChange = (selectedOption) => {
        if (selectedOption) {
            const nameWithCity = selectedOption.value;
            window.location.href = `/university/${encodeURIComponent(nameWithCity)}`;
        }
    };

    const DropdownIndicator = (props) => {
        return (
            <components.DropdownIndicator {...props}>
                <IoSearchOutline className="text-black " />
            </components.DropdownIndicator>
        );
    };

    const Option = (props) => {
        return (
            <components.Option {...props}>
                <FaUniversity className="mb-1 mr-2 inline-flex" />
                <span>{props.data.label}</span>
            </components.Option>
        );
    };
    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: 'white',
            boxShadow: 'none',
            borderRadius: '0.75rem',
            border: 'lightgray 2px solid',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: 'gray',
            fontWeight: 'bold',
            fontStyle: 'italic',
            fontSize: '16px',
        }),
        input: (provided) => ({
            ...provided,
            color: '#000000',
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#000000',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#DEEAF9' : 'white',
            color: state.isFocused ? '#15529C' : 'black',
        }),
        menuList: (provided) => ({
            ...provided,
            maxHeight: '160px', // Limit the height of the menu list
            overflowY: 'auto',  // Enable vertical scrolling for the list
            zIndex: 50
        }),
    };

    return (
        <>
            <section className="bg-gradient-to-br from-[#72D6F2] to-[#5151E5] flex flex-col text-white sm:pt-0 pt-10">
                <div className="flex items-center justify-center h-screen flex-col gap-8 px-4">
                    <h1 className="font-lato text-center text-secondary font-bold text-2xl">Discover the Best Study Spots Near You</h1>
                    <h1 className="text-center sm:text-7xl text-6xl font-poppins font-bold">Find new study places</h1>
                    <h1 className="font-lato font-bold sm:text-3xl text-2xl text-center md:w-[35vh]">Search your campus to get started!</h1>
                    <div className="flex flex-col items-center justify-center pt-8">
                        <Select
                            styles={customStyles}
                            options={options}
                            onChange={handleChange}
                            placeholder="Search for your university"
                            className="w-[22rem]"
                            noOptionsMessage={() => 'No universities found'}
                            components={{ DropdownIndicator, Option }}
                        />
                        <NavLink
                            to='/allschools'
                            className="font-lato pt-3 italic">Don&apos;t see your school? <span className='font-bold text-accent2'>Request here</span></NavLink>
                    </div>

                </div>
            </section>
            <section className="bg-secondary py-24 text-background">
                <div className="container mx-auto px-4 text-center font-lato">
                    <h1 className=" font-bold text-3xl font-poppins">Our Impact</h1>
                    <div className="flex justify-around my-6 ">
                        <div>
                            <h2 className="text-4xl font-bold">{universities.length}</h2>
                            <p>Universities</p>
                        </div>
                        <div>
                            <h2 className="text-4xl font-bold">{totalLocationCount}</h2>
                            <p>Study Locations</p>
                        </div>
                        <div>
                            <h2 className="text-4xl font-bold">{totalCount}</h2>
                            <p>Reviews</p>
                        </div>
                    </div>
                    <h2 className="text-xl font-bold mt-4">Join and Rate Study Spots</h2>
                    <p className="mt-2">
                        Share your experiences, find new places to learn, and connect with study partners
                        across campuses nationwide.
                    </p>
                </div>
            </section>
            <section className="bg-background py-24 font-lato">
                <div className="container mx-auto  px-4 space-y-24">
                    <div className="justify-center flex flex-col gap-4">
                        <h1 className="text-accent font-bold text-3xl font-poppins">Top Study Spots Across the Nation</h1>
                        <div className="relative">
                            <button
                                className="absolute md:-left-8 -left-3 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10"
                                onClick={() => {
                                    const container = document.querySelector(".scroll-container");
                                    container.scrollBy({ left: -250, behavior: "smooth" });
                                }}
                            >
                                <IoChevronBack size={24} />
                            </button>

                            <div className="flex overflow-x-scroll gap-12 mb-4 w-full hide-scrollbar scroll-container">
                                {topStudyLocations.map((location) => {
                                    const locationURL = `university/${location.university_name}/${location.name}`
                                    return (
                                        <NavLink
                                            to={locationURL}
                                            className="flex shrink-0 flex-col group"
                                            key={location.id}
                                        >
                                            <img
                                                src={location.image_url}
                                                className="w-[300px] h-[300px] object-cover rounded transition-transform duration-300 
                                                group-hover:scale-105 group-hover:border"
                                            />
                                            <h1 className="pt-2 font-semibold text-black">
                                                {location.name}
                                            </h1>
                                            <div className="flex flex-row gap-2 items-center">
                                                <StarRating
                                                    rating={location.avg_rating}
                                                    starSize={12}
                                                />
                                                <h1 className="text-sm"> {location.total_reviews} Reviews</h1>
                                            </div>
                                        </NavLink>
                                    )
                                })}
                            </div>

                            <button
                                className="absolute md:-right-8 -right-3 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10"
                                onClick={() => {
                                    const container = document.querySelector(".scroll-container");
                                    container.scrollBy({ left: 250, behavior: "smooth" });
                                }}
                            >
                                <IoChevronForward size={24} />
                            </button>
                        </div>
                    </div>
                    <div className="justify-center flex flex-col space-y-2">
                        <h1 className="text-accent font-bold text-3xl font-poppins">Top Universities Across the Nation</h1>
                        <div className="relative">

                            <button
                                className="absolute md:-left-8 -left-3 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10"
                                onClick={() => {
                                    const container = document.querySelector(".scroll-container-university");
                                    container.scrollBy({ left: -250, behavior: "smooth" });
                                }}
                            >
                                <IoChevronBack size={24} />
                            </button>
                            <div className="flex overflow-x-scroll gap-12 mb-4 w-full hide-scrollbar scroll-container-university">
                                {topUniversities.map((university) => {
                                    const universityUrl = `/university/${encodeURIComponent(university.name)} ${encodeURIComponent(university.city)}`;
                                    return (
                                        <NavLink
                                            to={universityUrl}
                                            className="flex shrink-0 flex-col group "
                                            key={university.id}
                                        >
                                            <img
                                                src={university.image_url}
                                                alt={university.name}
                                                className="w-[300px] h-[300px] object-cover rounded transition-transform duration-300 group-hover:scale-105 "
                                            />
                                            <h1 className="pt-2 font-semibold text-black">
                                                {university.name}, {university.city}
                                            </h1>
                                            <h1 className="text-sm text-black">
                                                {university.total_reviews} {university.total_reviews === 1 ? 'review' : 'reviews'}
                                            </h1>
                                        </NavLink>
                                    );
                                })}
                            </div>
                            <button
                                className="absolute md:-right-8 -right-3 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10"
                                onClick={() => {
                                    const container = document.querySelector(".scroll-container-university");
                                    container.scrollBy({ left: 250, behavior: "smooth" });
                                }}
                            >
                                <IoChevronForward size={24} />
                            </button>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-accent font-bold text-3xl font-poppins">Recent Reviews</h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
                            {recentReviews.map((review) => {
                                const url = `university/${review.StudyLocation.University.name} ${review.StudyLocation.University.city}/${review.StudyLocation.name}`;
                                return (
                                    <div key={review.id} className="border border-gray-300 rounded-md p-4 font-lato">
                                        <div className="flex flex-row items-center space-x-4 mb-4">
                                            {review.Users?.image_url ? (
                                                <img
                                                    src={review.Users.image_url}
                                                    alt="avatar"
                                                    className="w-14 h-14 rounded-full"
                                                />
                                            ) : (
                                                <FaUser className="w-14 h-14 text-white bg-gray-300 rounded-full" />
                                            )}
                                            <div>
                                                <p className="font-bold">
                                                    {review.Users
                                                        ? `${review.Users.first_name} ${review.Users.last_name}`
                                                        : "Anonymous"}
                                                </p>
                                                <div className="flex items-center mt-2">
                                                    <StarRating rating={review.rating} starSize={16} />
                                                    <p className="ml-2 text-sm text-gray-500">
                                                        Posted {formatDistanceToNow(new Date(review.created_at))} ago
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <hr className="border-gray-300  w-full my-5" />

                                        <NavLink
                                            to={url}
                                            className="hover:underline font-bold text-lg ">{review.StudyLocation.name}
                                        </NavLink>
                                        <p className="text-sm text-gray-600">{review.description.slice(0, 100)}...</p>

                                    </div>
                                )

                            })}
                        </div>
                    </div>
                </div>
            </section >
        </>
    );
}

Option.propTypes = {
    data: PropTypes.shape({
        label: PropTypes.string.isRequired,
    }).isRequired,
};

export default Home;