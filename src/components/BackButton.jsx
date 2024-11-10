import { FaArrowLeft } from "react-icons/fa";

const BackButton = () => {
    return (
        <button
            onClick={() => window.history.back()}
            className="text-white font-poppins font-bold py-2  rounded-lg flex items-center self-start hover:text-gray-500 transition duration-300 transform hover:-translate-x-2"
        >
            <FaArrowLeft className="mr-2" />
            Back
        </button>
    );
};

export default BackButton