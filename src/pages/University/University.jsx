import { fetchUniversityData } from '../../services/University/University';
import { useEffect, useState } from 'react';
import { fetchUniversityStudyLocationsWithReviews } from '../../services/StudyLocation/Study';
import { NavLink } from 'react-router-dom';
import StarRating from '../../components/StarRating';
import { loadingComponent } from '../../components/Loading';

function University() {
    const [uniData, setUniData] = useState(null);
    const [studyLocations, setStudyLocations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Extract the university name from the URL
        const universityNameFromURL = window.location.pathname.split('/').pop();

        // Fetch university data using the extracted name
        fetchUniversityData(universityNameFromURL).then((data) => {
            if (data.length === 0) {
                setError('The university you are looking isn\'t currently partnered with us.');
            } else {
                setUniData(data);
            }
        }).catch(error => {
            console.error(error);
            setError('An error occurred while fetching university data.');
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (uniData) {
            const universityID = uniData ? uniData[0].id : null;
            fetchUniversityStudyLocationsWithReviews(universityID).then((data) => {
                setStudyLocations(data);
            }).catch(error => {
                console.error(error);
            });
        }
    }, [uniData]);

    if (loading) {
        return loadingComponent();
    }

    if (error) {
        return (
            <div className="pt-20 overflow-x-hidden text-center h-[82vh] space-y-4  sm:px-0 px-4 flex flex-col items-center justify-center bg-primary text-secondary">
                <h1 className="text-3xl font-semibold font-poppins lg:w-1/2">{error}</h1>
                <p className="text-xl font-lato">Want your university to be a part of the website? Send an application.</p>
                <NavLink to="/allschools" className="mt-4 inline-block bg-action text-white py-2 px-4 rounded-lg hover:scale-110 transition duration-300">
                    Send Application
                </NavLink>
            </div>
        );
    }

    return (
        <div className="pt-20 overflow-x-hidden">
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
            <div className="bg-primary font-secondary lg:px-0 px-6 text-secondary pb-32">
                <div className="container mx-auto flex flex-col gap-4 py-8">
                    <h1 className="font-poppins font-semibold text-xl">Popular Study Spots</h1>
                    <h1 className="font-poppins font-semibold text-xl">Explore</h1>
                    <div className="grid lg:grid-cols-3 2xl:gap-20 gap-16">
                        {studyLocations && studyLocations.map((studyLocation) => {
                            const currentPath = window.location.pathname;
                            const studyLocationPath = `${currentPath}/${studyLocation.name}`;
                            return (
                                <NavLink to={studyLocationPath} key={studyLocation.id} className="grid grid-cols-2 font-poppins text-secondary transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-blue-400/20 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-400/0 before:to-blue-400/10 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 hover:scale-105 group">
                                    <img src={studyLocation.image_url} alt="placeholder" className="w-full h-full rounded-l-lg group-hover:opacity-85" />
                                    <div className="bg-white rounded-r-lg items-center justify-between text-center relative overflow-hidden flex flex-col py-6 px-2">
                                        <h1 className="text-2xl transition-transform duration-300 ease-in-out group-hover:-translate-y-2 group-hover:scale-110 pt-2">{studyLocation.name}</h1>
                                        <div className="items-center gap-2 flex flex-row transition-transform duration-300 ease-in-out group-hover:-translate-y-2 group-hover:scale-110">
                                            <StarRating rating={studyLocation.rating} starSize={12} />
                                            <h1 className="text-xs font-light">{studyLocation.review_count} reviews</h1>
                                        </div>
                                    </div>
                                </NavLink>
                            );
                        })}
                    </div>
                    <div
                        className="fter:h-px pt-24  w-full flex items-center before:h-px before:flex-1  before:bg-gray-300 before:content-[''] after:h-px after:flex-1 after:bg-gray-300  after:content-['']">
                        <button type="button"
                            className="flex items-center rounded-full border border-gray-300 bg-secondary-50 px-3 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mr-1 h-4 w-4">
                                <path fillRule="evenodd"
                                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                    clipRule="evenodd" />
                            </svg>
                            View More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default University;