import React from 'react'
import Logo from '../../assets/studdyspotter.png'; // Adjust the path to your logo
import BackButton from '../../components/BackButton';

function About() {
  return (
    <div className=" bg-primary">
      <div className="h-[55vh] bg-secondary pt-24 " >
        <div className="container mx-auto flex flex-col items-center justify-center relative">
          <div className="absolute top-0 lg:left-0 left-4">
            <BackButton />
          </div>
          <img src={Logo} alt="logo" className="w-[400px] h-[200px] mt-6 " draggable='false' />
        </div>

      </div>
      <div className="flex flex-col container mx-auto sm:px-0 px-4 text-secondary space-y-4 py-28">
        <h1 className="font-poppins text-3xl font-bold">About </h1>
        <p className="font-lato">
          Studdy Spotter was a small project that I created within a two-week time frame for one my classes during Summer of 2024.
          After I did the original demo for my class, I wanted to bring more out of it, and to expand the core functionalities it had.
        </p>
        <p className="font-lato">
          My main goal after, was expanding it to be used by other campuses, but for now it only involves the UW Seattle and Bothell Campus. The web application is meant to help students find new study spots in campus, or near campus. As someone who enjoyed studying in cafes, I wanted to create a way for students to review study spots away from campus. This includes adding specific tags such as Outlets and WiFi which are the biggest things for students.
        </p>
        <p className="font-lato">
          If you have any suggestions for improvement please email at studdyspotter_support@gmail.com. The repository for the original application is open, and I do plan to publicize the repo for this project after I’m happy with what I’ve done.
        </p>
      </div>
    </div>
  )
}

export default About