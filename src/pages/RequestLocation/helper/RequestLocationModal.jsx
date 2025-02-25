import { useState, useEffect, useRef } from "react";
import Select from 'react-select';
import { FaTimes } from 'react-icons/fa';
import { fetchStates, fetchTags, fetchCategory } from '../../../services/helper/helper.js';
import { requestStudyLocation } from '../../../services/StudyLocation/Study.js';
import { fetchUniversities } from '../../../services/University/University.js';
import { loadingComponent } from "../../../components/Loading.jsx";
import Modal from "../../../components/shared/popupModal";
import PropTypes from 'prop-types';

function RequestLocationModal({ isOpen, onClose, user }) {
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

    const handleRequestSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const formData = new FormData(event.target);

        // Used more for our database, helps to santize links used to know
        // Cities, using the hyphen as delimiters
        const cityWithHyphen = formData.get('city').replace(/\s+/g, '-');

        const studyLocationData = {
            name: formData.get('name'),
            address: formData.get('address'),
            city: cityWithHyphen,
            state_id: selectedState ? selectedState.id : null,
            tags: selectedTags.map(tag => tag.value),
            user_id: user,
            category: formData.get('category'),
            university_id: selectedCategory.value === 'On-Campus' ? selectedUniversity.value : null,
            image: selectedFile
        };

        if (!studyLocationData.name || !studyLocationData.address || !studyLocationData.city || !studyLocationData.state_id
            || !studyLocationData.category || !studyLocationData.image) {
            setModal({
                type: 'failed',
                message: 'Please fill in all the required fields',
                onClick: () => setModal(null),
            });
            setIsLoading(false);
            return;
        }


        try {
            await requestStudyLocation(studyLocationData);
            setModal({
                type: 'success',
                message: 'Study location request sent successfully.',
                onClick: () => setModal(null),
                timeout: 3000
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
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {
            setModal({
                type: 'failed',
                message: 'Only image files (jpeg, jpg, png) are allowed.',
                timeout: 3000,
                onClick: () => setModal(null)
            });
            return;
        }

        if (file && !['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
            setModal({
                type: 'failed',
                message: 'Only image files (jpeg, jpg, png) are allowed.',
                timeout: 3000,
                onClick: () => setModal(null)
            });
            return;
        }

        setSelectedFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setSelectedFile(null);
        setImagePreview(null);
        if (formRef.current) {
            formRef.current.querySelector('input[type="file"]').value = '';
        }
    };

    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 sm:px-12 px-4">
            <>
                {isLoading && (
                    <>
                        {loadingComponent('Submitting...')}
                    </>

                )}
                {modal && (
                    <Modal
                        type={modal.type}
                        message={modal.message}
                        onClick={modal.onClick}
                        timeout={modal.timeout}
                    />
                )}</>
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-12 w-full max-w-full rounded-xl overflow-y-auto sm:max-w-screen-xl max-h-[90vh]">
                <h1 className="text-heading font-bold text-2xl">Request New Location</h1>
                <form className="pt-4 flex flex-col  gap-4" ref={formRef} onSubmit={handleRequestSubmit}>
                    <div className="flex flex-row flex-wrap gap-4">
                        <div className="flex flex-col">
                            <label htmlFor="name" className="text-sm font-medium">Location</label>
                            <input type="text" id="name" name="name" placeholder="Location Name" className="border border-secondary p-2" required />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="address" className="text-sm font-medium">Address</label>
                            <input type="text" id="address" name="address" placeholder="Address" className="border border-secondary p-2" required />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="city" className="text-sm font-medium">City</label>
                            <input type="text" id="city" name="city" placeholder="City" className="border border-secondary p-2" required />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="state" className="text-sm font-medium">State</label>
                            <Select
                                className="text-base"
                                name="state"
                                options={states.map(state => ({ value: state.name, label: state.abr }))}
                                onChange={handleStateChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="flex flex-row flex-wrap gap-4">
                        <div className="flex flex-col">
                            <label htmlFor="tags" className="text-sm font-medium">Select Tags</label>
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
                        <div className="flex flex-col">
                            <label htmlFor="category" className="text-sm font-medium">Select Category</label>
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
                            <div className="flex flex-col">
                                <label htmlFor="university" className="text-sm font-medium">University</label>
                                <Select
                                    className="text-base w-[25rem]"
                                    name="university"
                                    options={universities.map(university => ({
                                        value: university.id,
                                        label: `${university.name} (${university.city})`
                                    }))}
                                    onChange={handleUniversity}
                                    required
                                />
                            </div>
                        )}
                    </div>

                    {selectedTags.length > 0 && (
                        <div className="flex flex-row flex-wrap gap-2">
                            {selectedTags.map(tag => (
                                <div key={tag.value} className="flex items-center bg-primary text-white p-2 rounded">
                                    {tag.label}
                                    <FaTimes className="ml-2 cursor-pointer" onClick={() => handleTagRemove(tag)} />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-col space-y-2">
                        <label htmlFor="image" className="text-sm font-medium">Upload Image <span className="text-xs italic font-normal">(this will be the location image)</span></label>
                        <div className="relative flex items-center  p-4 border border-l-8 border-l-accent rounded-3xl h-[10rem] hover:border-action focus:outline-none focus:ring-2 focus:ring-action"
                            style={{ backgroundImage: imagePreview ? `url(${imagePreview})` : 'none', backgroundSize: 'fill', backgroundPosition: 'center', backgroundBlendMode: 'darken' }}>
                            <input type="file"
                                name="image"
                                accept="image/jpeg, image/jpg, image/png"
                                id="image" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} required />
                            {!imagePreview &&
                                <div className="flex flex-col space-y-2">
                                    <p className="text-sm">Drag & drop an image here, or click to select one</p>
                                </div>
                            }
                        </div>
                        {selectedFile && <button type="button" className="text-sm text-red-500 mt-2 t" onClick={removeImage}>Remove Image</button>}
                    </div>
                    <button type="submit" className="bg-primary text-white p-2 rounded">Submit</button>
                </form>
            </div>
        </div>
    );
}


RequestLocationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    user: PropTypes.string.isRequired
}

export default RequestLocationModal;