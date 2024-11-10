import { useState, useEffect } from 'react';
import BackButton from '../../components/BackButton';
import { fetchUniversities, sendCampusRequest } from '../../services/University/University';
import { NavLink } from 'react-router-dom';
import Select from 'react-select';
import { fetchStates } from '../../services/helper/helper';

function AllSchools() {
    const [uniData, setUniData] = useState(null);
    const [states, setStates] = useState([]);
    const [selectedStateId, setSelectedStateId] = useState(null);
    const [universityName, setUniversityName] = useState('');
    const [city, setCity] = useState('');
    const [image, setImage] = useState(null);

    useEffect(() => {
        fetchStates().then((data) => {
            setStates(data);
        }).catch(error => {
            console.error(error);
        });
    }, []);

    useEffect(() => {
        fetchUniversities().then((data) => {
            // Group universities by state
            const groupedData = data.reduce((acc, uni) => {
                const stateName = uni.States ? uni.States.name : 'No State';
                if (!acc[stateName]) {
                    acc[stateName] = [];
                }
                acc[stateName].push(uni);
                return acc;
            }, {});

            // Sort states alphabetically
            const sortedStates = Object.keys(groupedData).sort();

            setUniData({ groupedData, sortedStates });
        }).catch(error => {
            console.error(error);
        });
    }, []);

    const handleStateChange = (selectedOption) => {
        const selectedState = states.find(state => state.name === selectedOption.value);
        setSelectedStateId(selectedState ? selectedState.id : null);
    };

    const handleRequestCampus = () => {
        sendCampusRequest({
            name: universityName,
            city: city,
            states_id: selectedStateId
        }, image).then(() => {
            alert('Campus request sent successfully');
        }).catch(error => {
            console.error(error);
            if (error === 'duplicate key value violates unique constraint "University_name_key"') {
                alert('University already exists');
            } else {
                alert('An error occurred while sending campus request');
            }
        });
    };



    return (
        <div className="flex flex-col bg-primary">
            <div className="bg-secondary h-[50vh] pt-24">
                <div className="container mx-auto flex flex-col items-center justify-center relative py-24">
                    <div className="absolute top-0 lg:left-0 left-4">
                        <BackButton />
                    </div>
                    <h1 className="font-poppins text-4xl font-bold text-white">Partnered Campuses</h1>
                </div>
            </div>
            <div className="container mx-auto flex lg:flex-row flex-col justify-between py-24 sm:px-0 px-4 gap-12">
                <div className="lg:order-1 order-2">
                    {uniData && uniData.sortedStates.map((state, index) => (
                        <div key={index} className="pb-12">
                            <h2 className="font-poppins text-4xl font-bold text-secondary mb-2">{state}</h2>
                            <div className="flex flex-col">
                                {uniData.groupedData[state].map((uni, uniIndex) => (
                                    <div key={uniIndex} className="hover:-translate-y-1 transition duration-300">
                                        <NavLink to={`/university/${uni.name}`} className="flex flex-row text-secondary items-center">
                                            <h1 className="font-bold text-lg">{uni.name}</h1>
                                            <h1 className="italic">, {uni.city}</h1>
                                        </NavLink>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="2xl:w-[45vh] lg:order-2 order-1">
                    <div className="bg-white rounded-lg py-8 px-12 border-2 text-secondary flex flex-col font-poppins">
                        <h1 className="text-2xl font-bold font-poppins text-center">Request your Campus</h1>
                        <div className="flex flex-col mt-4">
                            <label htmlFor="university_name" className="text-sm font-medium rounded-lg">
                                University
                            </label>
                            <input
                                type="text"
                                placeholder="University Name"
                                className="border border-secondary rounded-lg p-2"
                                value={universityName}
                                onChange={(e) => setUniversityName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-row gap-4">
                            <div className="flex flex-col mt-4">
                                <label htmlFor="city" className="text-sm font-medium">
                                    City
                                </label>
                                <input
                                    type="text"
                                    placeholder="City"
                                    className="border border-secondary rounded-lg p-2"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col mt-4">
                                <label htmlFor="state" className="text-sm font-medium">
                                    State
                                </label>
                                <Select
                                    onChange={handleStateChange}
                                    options={states.map(state => ({ value: state.name, label: state.abr }))}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col mt-4">
                            <label htmlFor="image" className="text-sm font-medium">
                                University Image
                            </label>
                            <input
                                type="file"
                                className="border border-secondary rounded-lg p-2"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </div>
                        <button
                            className="w-full bg-action text-white rounded-xl mt-4 p-2"
                            onClick={handleRequestCampus}
                        >
                            Request
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default AllSchools;