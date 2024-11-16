import { NavLink } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState } from 'react';


const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="bg-secondary ">
            <div className="flex items-center justify-center px-4 h-screen">
                <div className="pt-20 sm:px-12 px-6 bg-primary rounded-lg flex flex-col items-center justify-center shadow-lg text-action">
                    <h1 className=" text-center font-poppins text-4xl pb-4 "><span className="font-bold">Welcome</span>, Sign up!</h1>
                    <form className="flex flex-col space-y-5 mt-5 font-lato w-full ">
                        <div className="flex flex-row space-x-5">
                            <div className="flex flex-col">
                                <label>First Name</label>
                                <input type="name" placeholder="First Name" className="p-2 rounded-md border-action border-2" />
                            </div>
                            <div className="flex flex-col">
                                <label>Last Name</label>
                                <input type="name" placeholder="Last Name" className="p-2 rounded-md border-action border-2" />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label>Email</label>
                            <input type="email" placeholder="Email" className="p-2 rounded-md border-action border-2" />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label>Password</label>
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
                                    autoComplete="off"
                                    placeholder="Password"
                                    className="p-2 rounded-md border-2 border-action w-full"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col py-6">
                            <button className="relative inline-flex items-center justify-center py-2 overflow-hidden font-medium  transition duration-300 ease-out border-2 bg-action border-action rounded-3xl shadow-md group">
                                <span className="absolute inset-0 flex items-center justify-center  w-full h-full text-action duration-500 -translate-x-full bg-primary group-hover:translate-x-0 ease">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                </span>
                                <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">Log in</span>
                                <span className="relative invisible py-3"></span>
                            </button>

                        </div>
                    </form>
                    <h1 className="py-10 text-secondary"> Have an account?
                        <NavLink to="/signin" className="text-action font-bold underline hover:text-black ease-in-out duration-500" > Sign In</NavLink>
                    </h1>
                </div>
            </div >
        </div>
    )
}

export default SignUp;