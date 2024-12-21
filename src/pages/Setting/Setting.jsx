import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../services/Auth/AuthContext.jsx';
import { FaUser } from 'react-icons/fa';
import Select from 'react-select';
import { fetchUniversities } from '../../services/University/University.js';
import EditImageButton from './helper/editImage.jsx';

function Profile() {
    const { user, profileUpdate } = useContext(AuthContext);
    const [universities, setUniversities] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [firstName, setFirstName] = useState(user.first_name);
    const [lastName, setLastName] = useState(user.last_name);
    const [university] = useState(user.University?.name || "No University Affiliation");

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleUniversity = (selectedOption) => {
        setSelectedUniversity(selectedOption);
    };

    useEffect(() => {
        fetchUniversities()
            .then(data => {
                setUniversities(data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const handleSubmitForm = (e) => {
        e.preventDefault();

        const profileData = {
            userId: user.id,
            firstName: firstName,
            lastName: lastName,
            universityId: selectedUniversity?.value
        };

        profileUpdate(profileData, false).then(() => {
            alert('Profile updated successfully');
        }).catch(error => {
            console.error(error);
            alert('An error occurred while updating the profile');
        });
    };

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            color: state.data.isDisabled ? 'gray' : 'black',
            backgroundColor: state.data.isDisabled ? '#f0f0f0' : 'white',
            cursor: state.isDisabled ? 'not-allowed' : 'default',
        }),
    };

    const userUniversity = universities.find(uni => uni.name === university);
    const otherUniversities = universities.filter(uni => uni.name !== university);

    const universityOptions = [
        ...(userUniversity ? [{
            value: userUniversity.id,
            label: userUniversity.name + ", " + userUniversity.city,
            isDisabled: true,
        }] : []),
        ...otherUniversities
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(uni => ({
                value: uni.id,
                label: uni.name + ", " + uni.city,
                isDisabled: false,
            }))
    ];

    return (
        <div className="xl:h-screen flex justify-center items-center bg-background">
            <div className="container mx-auto md:px-44 px-4 py-32 text-secondary">
                <form
                    onSubmit={handleSubmitForm}
                    className="mt-4 font-lato gap-4 flex xl:flex-row flex-col justify-center">
                    <div className="flex flex-col justify-center items-center bg-secondary rounded-xl py-32 text-white 2xl:w-[30%] xl:w-[35%] w-full">
                        {user.image_url ? (
                            <img
                                src={user.image_url}
                                draggable="false"
                                alt="user avatar"
                                className="w-24 h-24 rounded-full shadow-md"
                            />
                        ) : (
                            <FaUser className="w-24 h-24 bg-gray-300 text-white rounded-full shadow-md border-2" />
                        )}
                        <h1 className="text-lg font-semibold mt-4">{user.first_name} {user.last_name}</h1>
                        <span>{user.University?.name || "No University Affiliation"}</span>
                        <button
                            type="button"
                            onClick={handleModalOpen}
                            className="bg-action text-white p-2 mt-4 rounded-lg hover:scale-105 transition duration-300 ease-in-out w-36"
                        >
                            Change Photo
                        </button>
                        {modalOpen && (
                            <EditImageButton
                                onClose={handleModalClose}
                                user={user}
                                profileUpdate={profileUpdate}
                            />
                        )}
                    </div>
                    <div className="flex flex-col gap-4 bg-white rounded-xl xl:w-7/12 px-10 py-16">
                        <h1 className="font-poppins font-semibold text-2xl pb-6">Edit Profile</h1>
                        <div className="flex lg:flex-row gap-4 flex-col">
                            <div className="flex flex-col w-full">
                                <label htmlFor="firstName" className="text-sm font-semibold">First Name</label>
                                <input
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    type="text"
                                    name="firstName"
                                    className="border border-gray-300 rounded-md p-2 mt-1"
                                />
                            </div>
                            <div className="flex flex-col w-full">
                                <label htmlFor="lastName" className="text-sm font-semibold">Last Name</label>
                                <input
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    type="text"
                                    name="lastName"
                                    className="border border-gray-300 rounded-md p-2 mt-1"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col pb-6">
                            <label htmlFor="university" className="text-sm font-semibold">University</label>
                            <Select
                                name='university'
                                placeholder={university}
                                onChange={handleUniversity}
                                options={universityOptions}
                                styles={customStyles}
                                className="mt-1"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-action text-white p-2 rounded-md w-36 font-bold">
                            Update Profile
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
}

export default Profile;