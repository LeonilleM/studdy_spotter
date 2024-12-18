import BackButton from '../../components/shared/BackButton';
import Creators from '../../assets/littlemonkey.png'

function About() {
  return (
    <div className=" bg-background ">
      <section className="pt-24 container mx-auto">
        <div className="absolute sm:left-14 left-5 pt-8">
          <BackButton />
        </div>
        <div className="flex flex-row flex-wrap container justify-between mx-auto sm:px-0 px-4 text-secondary space-y-4 py-32">
          <div className="sm:w-[43%] space-y-4 flex flex-col justify-center">
            <h1 className="font-poppins">ABOUT US</h1>
            <h1 className="font-poppins text-4xl font-bold">Helping students find the <span>best</span> study spots in the nation</h1>
            <p>
              Studdy Spotter was a small project that I created within a two-week time frame for one my (Leo) classes during Summer of 2024.
              <br />
              After I did the original demo for my class, I wanted to bring more out of it, and to expand the core functionalities it had.
              <br />
              My main goal after, was expanding it to be used by other campuses, but for now it only involves the UW Seattle and Bothell Campus. The web application is meant to help students find new study spots in campus, or near campus. As someone who enjoyed studying in cafes, I wanted to create a way for students to review study spots away from campus.
              <br />
              The repository for the original application is open, and I do plan to publicize the repository for this project after I’m happy with what I’ve done.
            </p>
            <button className="bg-accent text-white font-poppins  py-3.5 rounded-lg w-36">Register</button>
          </div>
          <div className="flex items-center justify-center sm:w-[40%] w-full">
            <div className="h-[471px] w-[387px] bg-white flex flex-col items-center py-12">
              <img src={Creators} alt="Creators" />
              <h1 className="font poppins text-xl font-semibold mt-5">Leonille & Ethan</h1>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#DEEAF9] h-[385px] w-full">
        <div className="container mx-auto flex flex-row flex-wrap justify-between items-center text-[#0B4073] py-12 px-4 ">
          <div className="flex flex-col space-y-4 font-poppins ">
            <h1>HELP MAKE OUR WEBSITE BETTER! </h1>
            <h1 className="text-3xl font-bold w-">WANT TO HELP MAKE SUGGESTIONS?</h1>
          </div>
          <div className="flex flex-col space-y-6 font-lato">
            <h1>Contact Us</h1>
            <h1>Email our team and we will try to improve all suggestions! To the best of our ability!. Thanks</h1>

          </div>
        </div>
      </section>

    </div>
  )
}

export default About