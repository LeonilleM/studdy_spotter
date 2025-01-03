import BackButton from "../../components/shared/BackButton.jsx";
import { AuthContext } from '../../services/Auth/AuthContext.jsx';
import { loadingComponent } from "../../components/Loading.jsx";
import RequestLocationModal from "./helper/RequestLocationModal.jsx";
import { useState, useContext } from 'react';

function RequestLocation() {
    const { user } = useContext(AuthContext);
    const [openModal, setOpenModal] = useState(false);

    const handleModal = () => {
        if (!user) {
            alert("Please login to request a location");
            return;
        }
        setOpenModal(!openModal);
    }

    return (
        <>
            <div className="flex flex-col bg-background ">
                {openModal && <RequestLocationModal isOpen={openModal} onClose={handleModal} user={user.id} />}
                <div className="absolute top-28 sm:left-14 left-4" >
                    <BackButton />
                </div>
                <div className="pt-24 container mx-auto sm:px-0 px-4">
                    <section className="flex flex-row flex-wrap container justify-between mx-auto  text-secondary space-y-4 py-32">
                        <div className="lg:w-[43%] space-y-4 flex flex-col justify-center">
                            <h1 className="font-poppins ">REQUEST A STUDY SPOT</h1>
                            <h1 className="font-poppins text-4xl font-bold text-heading">Help expand our ever growing study network!</h1>
                            <p>
                                Please submit new study locations thoughtfully and in good faith. All submissions will be reviewed before they’re visible to other students.
                            </p>
                            <p className="font-bold">
                                Here are a few guidelines to follow:
                            </p>
                            <p><span className="font-bold">🏷️ Tag Accuracy:</span> Use tags that genuinely reflect the study spot’s qualities for better search results.
                            </p>
                            <p><span className="font-bold">💯 Complete Information:</span> Provide as many details as possible to help others understand the space.
                            </p>
                            <p><span className="font-bold">📍 Location Details:</span> Double-check that the name and address are accurate to help students find the spot.
                            </p>
                            <button
                                onClick={handleModal}
                                className="bg-accent text-white font-bold py-3 px-4 rounded-lg w-52 text-sm"
                            >Request Study Location</button>
                            <div className="pt-6">
                                <p className="font-bold">Thank you for helping make Study Spotter reliable and useful for everyone!</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center sm:w-[40%] w-full  sm:pt-0 pt-12">
                            <div className="h-[363px] w-[381px] bg-gray-200 flex flex-col items-center py-12 rounded-lg">
                            </div>
                        </div>
                    </section>
                    <hr className="border-[1px] border-black" />
                </div>
            </div >
        </>

    );
}

export default RequestLocation;