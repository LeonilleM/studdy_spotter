import { useState, useEffect, useContext, useRef } from "react";
import Select from 'react-select';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import { fetchStates, fetchTags, fetchCategory } from '../../../services/helper/helper';
import BackButton from "../../../components/BackButton";
import { requestStudyLocation } from '../../../services/StudyLocation/Study';
import { fetchUniversities } from '../../../services/University/University';
import { AuthContext } from '../../../services/Auth/AuthContext';
import { loadingComponent } from "../../../components/Loading.jsx";
import Modal from "../../../components/shared/popupModal.jsx";

function RequestLocation() {
    const { user } = useContext(AuthContext);
    const [states, setStates] = useState([]);
    const [tags, setTags] = useState([]);
    const [category, setCategory] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [universities, setUniversities] = useState([]);
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const formRef = useRef(null);
    const [modal, setModal] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleRequestSubmit = async (event) => {
        event.preventDefault();
        if (!user) {
            setModal({
                type: 'notAuthenticated',
                message: 'Please log in to request a new study location',
                buttonText: 'Log In',
                onClick: () => setModal(null),
            })
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        const formData = new FormData(event.target);

        const studyLocationData = {
            name: formData.get('name'),
            address: formData.get('address'),
            city: formData.get('city'),
            state_id: selectedState.id,
            tags: selectedTags.map(tag => tag.value),
            user_id: user.id,
            category: formData.get('category'),
            university_id: selectedCategory.value === 'On-Campus' ? selectedUniversity.value : null,
            image: selectedFile
        };


        try {
            await requestStudyLocation(studyLocationData);
            setModal({
                type: 'success',
                message: 'Study location request sent successfully.',
                buttonText: 'Submit Another',
                onClick: () => setModal(null),
            });
            formRef.current.reset();
            setSelectedTags([]);
            setSelectedFile(null);
            setImagePreview(null);
            setSelectedState(null);
            setSelectedCategory(null);
            setSelectedUniversity(null);
        } catch (error) {
            setModal({
                type: 'failed',
                message: error.message || 'Failed to submit request. Please try again.',
                buttonText: 'Retry',
                onClick: () => setModal(null),
            });
        } finally {
            setIsLoading(false);
        }
    };


    const handleTagChange = (selectedOptions) => {
        setSelectedTags(selectedOptions || []);
    };

    const handleTagRemove = (tagToRemove) => {
        setSelectedTags(selectedTags.filter(tag => tag.value !== tagToRemove.value));
    };

    const handleStateChange = (selectedOption) => {
        setSelectedState(states.find(state => state.name === selectedOption.value));
    };

    const handleCategoryChange = (selectedOption) => {
        setSelectedCategory(selectedOption);
    };

    const handleUniversity = (selectedOption) => {
        setSelectedUniversity(selectedOption);
        console.log(selectedOption);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statesData, tagsData, categoriesData, universityData] = await Promise.all([
                    fetchStates(),
                    fetchTags(),
                    fetchCategory(),
                    fetchUniversities()
                ]);
                setStates(statesData);
                setTags(tagsData);
                setCategory(categoriesData);
                setUniversities(universityData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    return (
        <>
            <div className="bg-primary pt-20 relative">
                {isLoading && (
                    <>
                        {loadingComponent('Submitting...')}
                    </>

                )}
                {modal && (
                    <Modal
                        type={modal.type}
                        message={modal.message}
                        buttonText={modal.buttonText}
                        onClick={modal.onClick}
                    />
                )}
                <div className="bg-secondary pb-12 ">
                    <div className="container mx-auto flex flex-col space-y-2 items-center sm:px-0 px-4 py-4">
                        <BackButton />
                        <h1 className="lg:text-5xl text-3xl font-bold font-poppins text-center text-white">Request to Add a New Study Spot</h1>
                        <p className="font-lato text-center text-white pt-4 xl:w-3/4">
                            Please submit new study locations thoughtfully and in good faith. All submissions will be reviewed before they’re visible to other students. Here are a few guidelines to follow:
                            <br /><br />
                            <strong>Location Details:</strong> Double-check that the name and address are accurate to help students find the spot.
                            <br />
                            <strong>Tag Accuracy:</strong> Use tags that genuinely reflect the study spot’s qualities for better search results.
                            <br />
                            <strong>Complete Information:</strong> Provide as many details as possible to help others understand the space.
                            <br /><br />
                            Thank you for helping make StudySpotter reliable and useful for everyone!
                        </p>
                    </div>
                </div>
                <div className="container mx-auto pt-24 pb-48 xl:px-36 px-4 flex flex-col space-y-4 font-poppins text-secondary">
                    <form className="flex flex-row flex-wrap gap-4 text-xl"
                        ref={formRef}
                        onSubmit={handleRequestSubmit}>
                        <div className="flex flex-col gap-1 lg:w-1/3 w-1/3">
                            <label htmlFor="name" className="font-semibold ">Name</label>
                            <input type="text" id="name" name="name" placeholder="Location Name" className="p-2 rounded-md hover:outline hover:outline-2 placeholder:italic hover:outline-action  focus:outline-none focus:ring-2 focus:ring-action lg:text-base text-sm " required />
                        </div>
                        <div className="flex flex-col gap-1 lg:w-1/3 w-1/2">
                            <label htmlFor="address" className="font-semibold ">Address</label>
                            <input type="text" id="address" name="address" placeholder="ex. 1234 University Ave NE, Seattle, WA 98105" className="p-2 rounded-md hover:outline hover:outline-2 placeholder:italic hover:outline-action  focus:outline-none focus:ring-2 focus:ring-action lg:text-base text-sm " required />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="city" className="font-semibold ">City</label>
                            <input type="text" id="city" name="city" placeholder="Seattle" className="p-2 rounded-md hover:outline hover:outline-2 placeholder:italic hover:outline-action  focus:outline-none focus:ring-2 focus:ring-action lg:text-base text-sm " required />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="state" className="font-semibold ">State</label>
                            <Select
                                className="text-base"
                                name="state"
                                options={states.map(state => ({ value: state.name, label: state.abr }))}
                                onChange={handleStateChange}
                                required
                            />
                        </div>
                        <div className="w-full flex flex-row gap-4 py-4">
                            <div className="flex flex-col flex-wrap gap-1 lg:w-1/3">
                                <label htmlFor="tags" className="font-semibold ">Select Tags</label>
                                <Select
                                    isMulti
                                    isClearable
                                    value={selectedTags}
                                    className="text-base"
                                    onChange={handleTagChange}
                                    options={tags.map(tag => ({ value: tag.id, label: tag.name }))}
                                    isSearchable={true}
                                    placeholder="Select Tags"
                                />
                            </div>
                            <div className="flex flex-col gap-1 lg:w-1/3">
                                <label htmlFor="category" className="font-semibold ">Select Category</label>
                                <Select
                                    className="text-base"
                                    name="category"
                                    options={category.map(cat => ({ value: cat.name, label: cat.name }))}
                                    isSearchable={false}
                                    onChange={handleCategoryChange}
                                    required
                                />
                            </div>
                            {selectedCategory && (selectedCategory.value === 'On-Campus') && (
                                <div className="flex flex-col gap-1 ">
                                    <label htmlFor="university" className="font-semibold ">University</label>
                                    <Select
                                        className="text-base"
                                        name="university"
                                        options={universities.map(university => ({ value: university.id, label: university.name }))}
                                        onChange={handleUniversity}
                                        required
                                    ></Select>
                                </div>
                            )}
                        </div>
                        <div className="w-full flex flex-col flex-wrap gap-4 ">
                            <h1 className="font-semibold">Selected Tags</h1>
                            <div className="flex flex-row flex-wrap gap-4">
                                {selectedTags.map(tag => (
                                    <div key={tag.value} className="flex items-center bg-white text-secondary px-2 py-1 rounded-md ">
                                        <button
                                            type="button"
                                            className="mr-2 "
                                            onClick={() => handleTagRemove(tag)}
                                        >
                                            <FaTimes />
                                        </button>
                                        <span>{tag.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="w-full">
                            <label htmlFor="image" className="font-semibold">Upload Image <span className="text-xs italic font-normal">(this will be the location image)</span></label>
                            <div className="relative flex items-center justify-center p-4 border-2 border-dashed rounded-md h-[15vh] hover:border-action focus:outline-none focus:ring-2 focus:ring-action" style={{ backgroundImage: imagePreview ? `url(${imagePreview})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', backgroundBlendMode: 'darken' }}>
                                <input type="file" id="image" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
                                <div className="flex flex-col items-center space-y-2 ">
                                    <FaCloudUploadAlt className="text-4xl text-white" />
                                    <p className="text-sm text-white">Drag & drop an image here, or click to select one</p>
                                    {selectedFile && <p className="text-sm text-primary mt-2">{selectedFile.name}</p>}
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="bg-action text-white rounded-lg p-2 w-full mt-4 hover:scale-105 transition duration-300 ease-in-out">Submit</button>
                    </form>
                </div>

            </div>
        </>

    );
}

export default RequestLocation;