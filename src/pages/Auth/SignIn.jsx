import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../../services/Auth/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import BackButton from '../../components/BackButton';

function SignIn() {
    const navigate = useNavigate();
    const { login, user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSignIn = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);



        const email = e.target.email.value.trim();
        const password = e.target.password.value;

        try {
            await login(email, password, rememberMe);
            console.log("Sign In Successful");

            setTimeout(() => {
                if (user?.University) {
                    navigate(`/university/${user.university_id}`);
                }else{
                    navigate()
                }
            }, 5);

        } catch (error) {
            console.error("Sign in error:", error);
            setError(error.message || "Failed to sign in");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-primary min-h-screen">
            <div className="absolute flex container mx-auto">
                <BackButton />
            </div>

            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="w-full max-w-md py-16 sm:px-12 px-6 bg-white rounded-lg flex flex-col  shadow-lg text-black ">
                    {/* Title section */}
                    <h1 className="font-poppins text-3xl pb-4 font-bold">
                        Login
                    </h1>

                    {/* Error message */}
                    {error && (
                        <div className="w-full p-3 mb-4 text-sm text-red-500 bg-red-100 rounded-md" role="alert">
                            {error}
                        </div>
                    )}
                    {/* Form */}
                    <form className="flex flex-col space-y-5 mt-5 font-lato w-full" onSubmit={handleSignIn}>
                        {/* Email field */}
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="email" className={`text-sm font-medium` + (error ? ' text-red-500' : '')}>
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                autoComplete="email"
                                disabled={isLoading}
                                className={`p-2 rounded-md border-action border-2 focus:outline-none focus:ring-2 focus:ring-action focus:border-transparent` + (error ? ' border-red-500 error-shake ' : '')}
                                required
                                aria-required="true"
                            />
                        </div>

                        {/* Password field */}
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="password" className={`text-sm font-medium` + (error ? ' text-red-500' : '')}>
                                Password
                            </label>
                            <div className="relative flex items-center">
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 text-black"
                                    aria-label={showPassword ? "Hide password" : "Show password"}

                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    disabled={isLoading}
                                    className={`w-full p-2 rounded-md border-action border-2 focus:outline-none focus:ring-2 focus:ring-action focus:border-transparent` + (error ? ' border-red-500 error-shake ' : '')}
                                    required
                                    aria-required="true"

                                />
                            </div>
                        </div>
                        {/* Remember me checkbox */}
                        <div className="flex items-center space-x-2">
                            <input
                                id="remember"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-gray-800 accent-gray-600"
                                disabled={isLoading}
                            />
                            <label htmlFor="remember" className="text-sm font-medium select-none">
                                Remember me
                            </label>
                        </div>

                        {/* Sign in button */}
                        <div className="flex flex-col py-6 space-y-4 ">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="relative inline-flex items-center justify-center h-8 overflow-hidden font-medium transition duration-300 ease-out border-2 bg-accent border-action rounded-md shadow-md group disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-busy={isLoading}
                            >
                                <span className="absolute inset-0 flex items-center justify-center w-full h-full text-action duration-500 -translate-x-full bg-primary group-hover:translate-x-0 ease">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                    </svg>
                                </span>
                                <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">
                                    {isLoading ? 'Signing in...' : 'Sign in'}
                                </span>
                                <span className="relative invisible">Sign in</span>
                            </button>

                            {/* Forgot password link */}
                            <NavLink
                                to="/forgot-password"
                                className="self-end text-sm text-action hover:text-black transition-colors duration-300"
                            >
                                Forgot password?
                            </NavLink>
                        </div>
                    </form>
                    {/* Sign up link */}
                    <div className="pt-4 pb-8 text-secondary text-center">
                        Need an account?{' '}
                        <NavLink
                            to="/signup"
                            className="text-action font-bold underline hover:text-black transition-colors duration-300"
                        >
                            Sign Up
                        </NavLink>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default SignIn;