import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../services/Auth/AuthContext';
import { FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';
import BackButton from '../../components/shared/BackButton';

function SignIn() {
    const navigate = useNavigate();
    const { login, user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (user) {
            navigate(`/account/${user.first_name + user.last_name}`)
        }
    }, [user, navigate])

    const handleSignIn = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const email = e.target.email.value.trim();
        const password = e.target.password.value;

        try {
            const userData = await login(email, password);
            console.log("Sign In Successful");

            setTimeout(() => {
                if (userData) {
                    navigate(`/account/${userData.first_name + userData.last_name}`);
                } else {
                    navigate('/');
                }
            }, 100);


        } catch (error) {
            console.error("Sign in error:", error);
            setError(error.message || "Failed to sign in");
            setTimeout(() => {
                setError(null);
            }, 5000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-background min-h-screen">
            <div className="absolute md:translate-x-12 translate-x-6 sm:translate-y-12 translate-y-6 ">
                <BackButton location="/" />
            </div>
            <div className="flex items-center justify-center min-h-screen px-4 ">
                <div className="w-full max-w-md pt-16 sm:px-12 px-6 bg-white rounded-xl  flex flex-col  shadow-2xl text-black ">
                    <h1 className="font-poppins text-3xl pb-4 font-bold">
                        Log In
                    </h1>
                    {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 " role="alert"> {error} </div>}
                    {/* Form */}
                    <form className="flex flex-col space-y-5 mt-5 font-lato w-full text-lato font-bold" onSubmit={handleSignIn}>
                        {/* Email field */}
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="email" className={`text-sm ` + (error ? ' text-red-500' : '')}>
                                Email<span className="text-red-500">*</span>
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
                            <label htmlFor="password" className={`text-sm ` + (error ? ' text-red-500' : '')}>
                                Password<span className="text-red-500">*</span>
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
                        {/* Remember me checkbox
                        <div className="flex items-center space-x-2">
                            <input
                                id="remember"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-gray-800 accent-gray-600"
                                disabled={isLoading}
                            />
                            <label htmlFor="remember" className="text-sm  select-none">
                                Remember me?
                            </label>
                        </div> */}

                        {/* Sign in button */}
                        <div className="flex flex-col py-6 space-y-4 ">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="relative inline-flex items-center justify-center h-10 overflow-hidden  transition duration-300 ease-out border-2 bg-primary rounded-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-busy={isLoading}
                            >
                                <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-500 -translate-x-full bg-primary group-hover:translate-x-0 ease">
                                    <FaArrowRight />
                                </span>
                                <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">
                                    {isLoading ? 'Signing in...' : 'Sign in'}
                                </span>
                                <span className="relative invisible">Log In</span>
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