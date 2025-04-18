import { NavLink } from 'react-router-dom'; // Assuming you use React Router

function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[90vh] text-center px-4 py-28 bg-background">
            <h1 className="text-7xl font-bold mb-2">404</h1>
            <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-6">We couldnt find the page youre looking for.</p>
            <NavLink to="/" className="text-blue-600 hover:text-blue-800 font-medium hover:underline">
                Return to Home
            </NavLink>
        </div>
    );
}

export default NotFound;