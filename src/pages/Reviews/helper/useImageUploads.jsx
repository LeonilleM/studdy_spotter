import { useState } from 'react';

const useImageUpload = () => {
    const [images, setImages] = useState([]); // Array of { file, preview }
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dragging, setDragging] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const newFiles = Array.from(e.dataTransfer.files).slice(0, 4 - images.length);
            const newImages = newFiles.map((file) => ({
                file,
                preview: URL.createObjectURL(file),
            }));
            setImages((prevImages) => [...prevImages, ...newImages]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files).slice(0, 4 - images.length);
            const newImages = newFiles.map((file) => ({
                file,
                preview: URL.createObjectURL(file),
            }));
            setImages((prevImages) => [...prevImages, ...newImages]);
        }
    };

    const handleNextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return {
        images, // Array of { file, preview }
        setImages,
        currentIndex,
        dragging,
        handleDrop,
        handleDragOver,
        handleDragLeave,
        handleFileChange,
        handleNextImage,
        handlePrevImage,
    };
};

export default useImageUpload;