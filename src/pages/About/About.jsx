import BackButton from '../../components/shared/BackButton';
import Creators from '../../assets/littlemonkey.png'
import { NavLink } from 'react-router-dom';



function About() {
  return (
    <div className=" bg-background ">
      <div className="absolute top-32 sm:left-14 left-4" >
        <BackButton />
      </div>
      <section className="pt-24 container mx-auto sm:px-0 px-4">

        <div className="flex flex-row flex-wrap container justify-between mx-auto  text-secondary space-y-4 py-32">
          <div className="lg:w-[43%] space-y-4 flex flex-col justify-center">
            <h1 className="font-poppins">ABOUT US</h1>
            <h1 className="font-poppins text-4xl font-bold text-heading">Helping students find the <span>best</span> study spots in the nation</h1>
            <p>
              Studdy Spotter was a small project that I created within a two-week time frame for one my (Leo) classes during Summer of 2024.
            </p>
            <p>
              After I did the original demo for my class, I wanted to bring more out of it, and to expand the core functionalities it had.
            </p>
            <p>
              My main goal after, was expanding it to be used by other campuses, but for now it only involves the UW Seattle and Bothell Campus. The web application is meant to help students find new study spots in campus, or near campus. As someone who enjoyed studying in cafes, I wanted to create a way for students to review study spots away from campus.
            </p>
            <p >
              The repository for the original application is open, and I do plan to publicize the repository for this project after I’m happy with what I’ve done.
            </p>

            <div className="pt-6">
              <NavLink to="/signup">
                <button
                  aria-label="Register for Studdy Spotter"
                  className="bg-accent text-white font-poppins  py-3 rounded-lg w-24 text-sm ">
                  Register
                </button>
              </NavLink>
            </div>
          </div>

          <div className="flex items-center justify-center sm:w-[40%] w-full  sm:pt-0 pt-12">
            <div className="h-[471px] w-[350px] bg-white flex flex-col items-center py-8 border-[1px] border-borderColor">
              <img src={Creators} alt="Creators" />
              <h1 className="font-poppins text-xl font-semibold mt-8">Leonille & Ethan</h1>
            </div>
          </div>
        </div>
      </section >
      <section className="bg-[#DEEAF9] sm:h-[385px] w-full ">
        <div className="container mx-auto flex flex-row flex-wrap justify-between  py-24 text-[#0B4073] sm:px-0 px-4 gap-12">
          <div className="flex flex-col space-y-4 font-poppins xl:w-1/3 ">
            <h1>HELP MAKE OUR WEBSITE BETTER! </h1>
            <h1 className="text-4xl font-bold w-">WANT TO HELP MAKE SUGGESTIONS?</h1>
          </div>
          <div className="flex flex-col space-y-2 font-lato">
            <h1 className="font-bold font-poppins text-lg">Contact Us</h1>
            <h1 className="font-bold">support_studdyspotter@gmail.com</h1>
            <h1>Email our team and we will try to improve all suggestions! To the best of our ability! Thanks</h1>
            <h1 className="font-bold pt-8">- Studdy Spotter Team</h1>
          </div>
        </div>
      </section>

    </div >
  )
}

export default About