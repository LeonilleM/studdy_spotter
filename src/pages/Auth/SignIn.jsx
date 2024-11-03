import { NavLink } from 'react-router-dom'

function SignIn() {
    return (
        <div className="bg-secondary">
            <div className="flex items-center justify-center h-screen px-4">
                <div className="pt-20 sm:px-12 px-6 bg-primary rounded-lg flex flex-col items-center justify-center shadow-lg text-action">
                    <h1 className=" text-center font-poppins text-4xl pb-4 md:w-4/5"><span className="font-bold"> Welcome back </span>, Sign In!</h1>
                    <form className="flex flex-col space-y-5 mt-5 font-lato w-full ">
                        <div className="flex flex-col space-y-2">
                            <label>Email</label>
                            <input type="email" placeholder="Email" autoComplete="current-email" className="p-2 rounded-md border-action border-2" />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label>Password</label>
                            <input type="password" placeholder="Password" autoComplete="current-password" className="p-2 rounded-md  border-action border-2" />
                        </div>
                        <div className="flex items-start mb-5">
                            <div className="flex items-center h-5">
                                <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-gray-800  accent-gray-600" />
                            </div>
                            <label className="ms-2 text-sm font-medium ">Remember me?</label>
                        </div>
                        <div className="flex flex-col py-6">
                            <button className="relative inline-flex items-center justify-center py-2 overflow-hidden font-medium  transition duration-300 ease-out border-2 bg-action border-action rounded-3xl shadow-md group">
                                <span className="absolute inset-0 flex items-center justify-center  w-full h-full text-action duration-500 -translate-x-full bg-primary group-hover:translate-x-0 ease">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                </span>
                                <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">Log in</span>
                                <span className="relative invisible">Button Text</span>
                            </button>
                            <label className="self-end">Forgot password?</label>
                        </div>
                    </form>
                    <h1 className="py-10 text-secondary"> Need an account?
                        <NavLink href="/signup" className="text-action font-bold underline hover:text-black ease-in-out duration-500" > Sign Up</NavLink>
                    </h1>
                </div>
            </div >
        </div >
    )
}

export default SignIn