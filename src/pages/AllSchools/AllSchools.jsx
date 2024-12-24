import { useState, useEffect } from 'react';
import BackButton from '../../components/shared/BackButton';
import { fetchUniversities } from '../../services/University/University';
import { NavLink } from 'react-router-dom';
import RequestSchoolModal from './helper/RequestSchoolModal';

function AllSchools() {
    const [uniData, setUniData] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);


    useEffect(() => {
        fetchUniversities().then((data) => {
            const groupedData = data.reduce((acc, uni) => {
                const stateName = uni.States ? uni.States.name : 'No State';
                if (!acc[stateName]) {
                    acc[stateName] = [];
                }
                acc[stateName].push(uni);
                return acc;
            }, {});

            const sortedStates = Object.keys(groupedData).sort();
            setUniData({ groupedData, sortedStates });
        }).catch(error => {
            console.error(error);
        });
    }, []);

    const handleModalOpen = () => {
        console.log("open")
        setModalOpen(true);
    }

    const handleModalClose = () => {
        setModalOpen(false);
    };


    return (
        <div className="flex flex-col bg-background ">
            <div className="absolute top-28 sm:left-14 left-4" >
                <BackButton />
            </div>
            <div className="pt-24 container mx-auto sm:px-0 px-4">
                <section className="flex flex-row flex-wrap container justify-between mx-auto  text-secondary space-y-4 py-32">
                    <div className="lg:w-[43%] space-y-4 flex flex-col justify-center">
                        <h1 className="font-poppins ">PARTNERED CAMPUSES</h1>
                        <h1 className="font-poppins text-4xl font-bold text-heading">Want to connect your school?</h1>
                        <p>
                            Please submit new study locations thoughtfully and in good faith. All submissions will be reviewed before theyre visible to other students.
                        </p>
                        <p>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s.
                        </p>
                        <div className="pt-6">
                            <button
                                onClick={handleModalOpen}
                                aria-label="Register for Studdy Spotter"
                                className="bg-accent text-white font-poppins  py-3 rounded-lg w-32 text-sm ">
                                Request School
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-center sm:w-[40%] w-full  sm:pt-0 pt-12">
                        <div className="h-[363px] w-[381px] bg-gray-200 flex flex-col items-center py-12 rounded-lg">
                        </div>
                    </div>
                </section>
                <hr className="border-black border-2 rounded-full" />
                <h1 className="font-poppins text-3xl font-bold text-heading mb-10 mt-16 text-center">Partnered Campuses</h1>
                <section className="grid sm:grid-cols-3 grid-cols-1 gap-4 pb-36">
                    {uniData && uniData.sortedStates.map(state => {
                        return (
                            <div key={state} className="flex flex-col ">
                                <h1 className="font-poppins text-2xl font-bold text-secondary">{state}</h1>
                                {uniData.groupedData[state].map(uni => {
                                    return (
                                        <NavLink
                                            key={uni.id}
                                            to={`/university/${uni.name}`}>
                                            <h1 className="font-lato tracking-wide">{uni.name} - {uni.city}</h1>
                                        </NavLink>
                                    );
                                })}
                            </div>
                        );
                    }
                    )}
                </section>
            </div>
            <RequestSchoolModal isOpen={modalOpen} onClose={handleModalClose} />
        </div >
    );
}

export default AllSchools;