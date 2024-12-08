import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../services/Auth/AuthContext.jsx';
import { FaUser } from 'react-icons/fa';
import Select from 'react-select';
import { fetchUniversities } from '../../services/University/University.js';
import { updateUserProfile } from '../../services/Auth/Auth.js';
import EditImageButton from './helper/editImage.jsx'



function Profile() {
    const { user } = useContext(AuthContext);
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

        updateUserProfile(profileData).then(() => {
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
        <div className="h-screen flex justify-center items-center bg-background">
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
                        {modalOpen && <EditImageButton onClose={handleModalClose} user={user} />}

                    </div>
                    <div className="flex flex-row gap-12">
                        <div className="flex flex-col w-1/2">
                            <label htmlFor="firstName" className="text-sm font-semibold">First Name</label>
                            <input
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                type="text"
                                name="firstName"
                                className="border border-gray-300 rounded-md p-2 mt-1"
                            />
                        </div>
                        <div className="flex flex-col w-1/2">
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
                    <div className="flex flex-col pb-12">
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
                        className="bg-action text-white py-2 px-4 rounded-md">
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Profile;