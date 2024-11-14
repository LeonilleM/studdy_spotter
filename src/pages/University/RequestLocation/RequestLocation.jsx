import { useState, useEffect } from "react";
import { fetchStates, fetchTags, fetchCategory } from '../../../services/helper/helper';
import BackButton from "../../../components/BackButton";
import Select from 'react-select';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { requestStudyLocation } from '../../../services/StudyLocation/Study';
import { FaTimes } from 'react-icons/fa';




function RequestLocation() {
    const [states, setStates] = useState([]);
    const [tags, setTags] = useState([]);
    const [category, setCategory] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);


    const handleRequestSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', event.target.name.value);
        formData.append('address', event.target.address.value);
        formData.append('city', event.target.city.value);
        formData.append('state_id', states.find(state => state.abr === event.target.state.value).id);
        formData.append('tags', selectedTags.map(tag => tag.value).join(','));
        formData.append('category', event.target.category.value);
        formData.append('image', selectedFile);
        if (formData.category === 'On Campus') {
            formData.append();
        }
        requestStudyLocation(formData);
        if (error) {
            console.error(error);
            alert('An error occurred while submitting request');
        }
        alert('Request submitted successfully');
    };


    const handleTagChange = (selectedOptions) => {
        setSelectedTags(selectedOptions || []);
    };

    const handleTagRemove = (tagToRemove) => {
        setSelectedTags(selectedTags.filter(tag => tag.value !== tagToRemove.value));
    };

    // Promise to fetch all data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statesData, tagsData, categoriesData] = await Promise.all([
                    fetchStates(),
                    fetchTags(),
                    fetchCategory()

                ]);
                setStates(statesData);
                setTags(tagsData);
                setCategory(categoriesData);
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
        <div className="bg-primary pt-20">
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
                <form className="flex flex-row flex-wrap gap-4 text-xl">
                    <div className="flex flex-col gap-1 lg:w-1/3 w-1/3">
                        <label htmlFor="name" className="font-semibold ">Name</label>
                        <input type="text" id="name" placeholder="Location Name" className="p-2 rounded-md hover:outline hover:outline-2 placeholder:italic hover:outline-action  focus:outline-none focus:ring-2 focus:ring-action lg:text-base text-sm " />
                    </div>
                    <div className="flex flex-col gap-1 lg:w-1/3 w-1/2">
                        <label htmlFor="address" className="font-semibold ">Address</label>
                        <input type="text" id="Address" placeholder="ex. 1234 University Ave NE, Seattle, WA 98105" className="p-2 rounded-md hover:outline hover:outline-2 placeholder:italic hover:outline-action  focus:outline-none focus:ring-2 focus:ring-action lg:text-base text-sm " />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="city" className="font-semibold ">City</label>
                        <input type="text" id="city" placeholder="Seattle" className="p-2 rounded-md hover:outline hover:outline-2 placeholder:italic hover:outline-action  focus:outline-none focus:ring-2 focus:ring-action lg:text-base text-sm " />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="state" className="font-semibold ">State</label>
                        <Select
                            className="text-base"
                            options={states.map(state => ({ value: state.name, label: state.abr }))}
                            isSearchable={false}
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
                                isSearchable={false}
                                placeholder="Select Tags"
                            />
                        </div>
                        <div className="flex flex-col gap-1 lg:w-1/3">
                            <label htmlFor="category" className="font-semibold ">Select Category</label>
                            <Select
                                className="text-base"
                                options={category.map(cat => ({ value: cat.name, label: cat.name }))}
                                isSearchable={false}
                            />
                        </div>
                    </div>
                    <div className="w-full flex flex-col flex-wrap gap-4 ">
                        <h1 className="font-semibold">   Selected Tags</h1>
                        <div className="flex flex-row flex-wrap gap-4">
                            {selectedTags.map(tag => (
                                <div key={tag.value} className="flex  items-center bg-white text-secondary px-2 py-1 rounded-md ">
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
                </form>

            </div>
        </div>
    )
}

export default RequestLocation