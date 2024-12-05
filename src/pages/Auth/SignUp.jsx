import { NavLink } from 'react-router-dom'
import { FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../services/Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';


const SignUp = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { signup, user } = useContext(AuthContext);


    useEffect(() => {
        if (user) {
            navigate(`/account/${user.first_name + user.last_name}`)
        }
    }, [user, navigate])

    const handleSignUp = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        const firstName = e.target.firstName.value.trim()
        const lastName = e.target.lastName.value.trim()
        const email = e.target.email.value.trim()
        const password = e.target.password.value

        try {
            const userData = await signup(email, password, firstName, lastName)
            console.log("Sign Up Successful")
            setTimeout(() => {
                if (userData) {
                    navigate(`/account/${userData.first_name + userData.last_name}`)
                } else {
                    navigate('/')
                }
            }, 100)
        } catch (error) {
            console.error("Sign up error:", error)
            setError(error.message || "Failed to sign up")
            setTimeout(() => {
                setError(null)
            }, 5000)
        }
        finally {
            setIsLoading(false)
        }

    }

    const [showPassword, setShowPassword] = useState(false);


    return (
        <div className="bg-background min-h-screen">
            <div className="absolute md:translate-x-12 translate-x-6 translate-y-12 ">
                <BackButton location="/" />
            </div>
            <div className="flex flex-col items-center justify-center px-4 h-screen">
                <div className="pt-20 sm:px-12 px-6 bg-white rounded-lg flex flex-col  shadow-2xl text-black items-center">
                    <h1 className="text-start font-poppins text-3xl pb-4 font-bold self-start">Register </h1>
                    {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 self-start w-full" role="alert"> {error} </div>}
                    <form className="flex flex-col space-y-5 mt-5 font-lato w-full text-sm font-bold" onSubmit={handleSignUp}>
                        <div className="flex flex-row space-x-5 ">
                            <div className="flex flex-col">
                                <label>First Name<span className="text-red-500">*</span></label>
                                <input type="text" name="firstName" placeholder="First Name" className="p-2 rounded-md border-action border-2" />
                            </div>
                            <div className="flex flex-col">
                                <label>Last Name<span className="text-red-500">*</span></label>
                                <input type="text" name="lastName" placeholder="Last Name" className="p-2 rounded-md border-action border-2" />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label>Email<span className="text-red-500">*</span></label>
                            <input type="email" name="email" placeholder="Email" className="p-2 rounded-md border-action border-2" />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label>Password<span className="text-red-500">*</span></label>
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
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    autoComplete="off"
                                    placeholder="Password"
                                    className="p-2 rounded-md border-2 border-action w-full"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col py-6">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="relative inline-flex items-center justify-center h-10 overflow-hidden font-medium transition duration-300 ease-out border-2 bg-primary rounded-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-busy={isLoading}
                            >
                                <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-500 -translate-x-full bg-primary group-hover:translate-x-0 ease">
                                    <FaArrowRight />
                                </span>
                                <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">
                                    {isLoading ? 'Signing up...' : 'Sign up'}
                                </span>
                                <span className="relative invisible">Register</span>
                            </button>
                        </div>
                    </form>
                    <h1 className="py-10 text-secondary"> Have an account?
                        <NavLink to="/signin" className="text-action font-bold underline hover:text-black ease-in-out duration-500"> Sign In</NavLink>
                    </h1>
                </div>
            </div>
        </div>
    );
};

export default SignUp;