import React, { useState, useEffect } from 'react';
import BackButton from '../../components/BackButton';
import { fetchUniversities } from '../../services/University/University';
import { NavLink } from 'react-router-dom';

function AllSchools() {
    const [uniData, setUniData] = useState(null);

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

    return (
        <div className=" flex flex-col bg-primary">
            <div className="bg-secondary h-[50vh] pt-24">
                <div className="container mx-auto flex flex-col items-center justify-center relative py-24">
                    <div className="absolute top-0 lg:left-0 left-4">
                        <BackButton />
                    </div>
                    <h1 className="font-poppins text-4xl font-bold text-white">Partnered Campuses</h1>
                </div>
            </div>
            <div className="container mx-auto flex flex-col items-center justify-center py-24">
                {uniData && uniData.sortedStates.map((state, index) => (
                    <div key={index} className="w-full pb-12">
                        <h2 className="font-poppins text-4xl font-bold text-secondary mb-2">{state}</h2>
                        <div className="flex flex-col">
                            {uniData.groupedData[state].map((uni, uniIndex) => (
                                <div key={uniIndex} className="hover:-translate-y-1   transition duration-300" >
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
        </div>
    );
}

export default AllSchools;