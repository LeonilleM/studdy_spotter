import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../services/Auth/AuthContext.jsx';
import { FaUser } from 'react-icons/fa';
import Select from 'react-select';
import { fetchUniversities } from '../../services/University/University.js';
import { updateUserProfile } from '../../services/Auth/Auth.js';


const modalProfileImage = (onClose, user) => {
    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen bg-black/30">
                <div className="bg-white pt-12 rounded-lg shadow-lg text-center flex flex-col w-[50vh]">
                    <h2 className="text-xl font-semibold mb-4">Change Profile Image</h2>
                    <div className="px-24 border-t py-2 hover:bg-slate-300">
                        <input
                            type="file"
                            className="w-full text-slate-500 file:text-action file:cursor-pointer file:bg-transparent file:border-none file:outline-none hover:cursor-pointer"
                            placeholder="Choose Image"
                        />
                    </div>
                    {user.image_url && (
                        <button
                            type="button"
                            className=" text-red-500 border-t py-2 hover:bg-slate-300"
                        >
                            Remove Image
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-secondary border-t px-4 py-2 rounded hover:bg-slate-300 "
                    >

                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};



function Profile() {
    const { user } = useContext(AuthContext)
    const [universities, setUniversities] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedUniversity, setSelectedUniversity] = useState(null)


    const handleModalOpen = () => {
        setModalOpen(true)
    }

    const handleModalClose = () => {
        setModalOpen(false)
    }

    const handleUniversity = (selectedOption) => {
        setSelectedUniversity(selectedOption);

    };


    useEffect(() => {
        fetchUniversities()
            .then(data => {
                setUniversities(data)
            })
            .catch(error => {
                console.log(error)
            })
    }, [])

    const handleSubmitForm = (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        const profileData = {
            userId: user.id,
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            universityId: selectedUniversity?.value
        }



        updateUserProfile(profileData).then(() => {
            alert('Profile updated successfully');
        }).catch(error => {
            console.error(error);
            alert('An error occurred while sending study location request');
        });
    }

    return (
        <div className="h-screen flex justify-center items-center bg-primary">
            <div className="container mx-auto xl:px-96 md:px-44 px-4 text-secondary">
                <h1 className="text-2xl font-semibold font-poppins">Edit Profile</h1>
                <form
                    onSubmit={handleSubmitForm}
                    className="mt-4 font-lato space-y-6 ">
                    <div className="flex flex-row justify-between bg-white rounded-xl p-4">
                        <div className="flex flex-row gap-4">
                            {user.image_url ? (
                                <img src={user.image_url} alt="user avatar" className="w-14 h-14 rounded-full shadow-md" />
                            ) : (
                                <FaUser className="w-14 h-14 bg-gray-300 text-white rounded-full shadow-md border-2" />
                            )}
                            <div className="flex flex-col">
                                <h1 className="text-sm font-semibold mt-2">{user.first_name} {user.last_name}</h1>
                                <span className="text-sm">{user.University?.name || "No University Affiliation"}</span>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleModalOpen}
                            className="bg-action text-white my-2 py-2 px-2 rounded-lg hover:scale-105 transition duration-300 ease-in-out">
                            Change Image
                        </button>
                        {modalOpen && modalProfileImage(handleModalClose, user)}
                    </div>
                    <div className="flex flex-row gap-12">
                        <div className="flex flex-col  w-1/2">
                            <label htmlFor="firstName" className="text-sm font-semibold ">First Name</label>
                            <input type="text" name="firstName" className="border border-gray-300 rounded-md p-2 mt-1" />
                        </div>
                        <div className="flex flex-col w-1/2">
                            <label htmlFor="lastName" className="text-sm font-semibold ">Last Name</label>
                            <input type="text" name="lastName" className="border border-gray-300 rounded-md p-2 mt-1" />
                        </div>
                    </div>
                    <div className="flex flex-col pb-12">
                        <label htmlFor="university" className="text-sm font-semibold ">University</label>
                        <Select
                            name='university'
                            onChange={handleUniversity}
                            options={universities.map(uni => ({ value: uni.id, label: uni.name }))}
                            className="mt-1"
                        />
                    </div>
                    <button

                        type="submit" className="bg-action text-white py-2 px-4 rounded-md">Update Profile</button>
                </form>
            </div>
        </div>
    )
}

export default Profile