import { FaCheck, FaMinus, FaTimes } from 'react-icons/fa';

export const statusButton = (status) => {
    if (status === 'Pending') {
        return (
            <div className="flex flex-row justify-center items-center gap-4 border rounded py-2">
                <FaMinus className="text-white bg-gray-500 rounded px-1 " />
                <h1 className="text-gray-500">Pending</h1>
            </div>
        );
    }
    if (status === 'Approved') {
        return (
            <div className="flex flex-row justify-center items-center gap-4 rounded py-2 bg-green-100 border-green-200">
                <FaCheck className="text-white bg-green-500 rounded px-1 " />
                <h1 className="text-green-500">Approved</h1>
            </div>
        );
    }
    if (status === 'Denied') {
        return (
            <div className="flex flex-row justify-center items-center gap-4 border rounded py-2 bg-red-100 border-red-200">
                <FaTimes className="text-white bg-red-500 rounded px-1 " />
                <h1 className="text-red-500">Denied</h1>
            </div>
        );
    }
};

