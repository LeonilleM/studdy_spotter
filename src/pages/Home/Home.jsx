import { fetchUniversities } from '../../services/University/University'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import { NavLink } from 'react-router-dom'

function Home() {
    // Define state to hold universities
    const [universities, setUniversities] = useState([]);

    useEffect(() => {
        fetchUniversities()
            .then(data => {
                setUniversities(data);
            })
            .catch(error => console.error(error));
    }, []);


    // Map universities to options for react-select
    const options = universities.map(university => ({
        value: university.name,
        label: university.name + ', ' + university.city
    }));

    const handleChange = (selectedOption) => {
        if (selectedOption) {
            window.location.href = `/university/${selectedOption.value}`;
        }
    };

    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: 'transparent',
            border: '2px solid white',
            boxShadow: 'none',
            borderRadius: '0.375rem',
            '&:hover': {
                border: '2px solid white',
            },
        }), placeholder: (provided) => ({
            ...provided,
            color: '#FFFFFF',
        }), input: (provided) => ({
            ...provided,
            color: '#FFFFFF',
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#FFFFFF',
        }),
    }

    return (
        <div className="bg-secondary flex flex-col text-primary ">
            <div className="flex items-center justify-center h-screen  flex-col ">
                <h1 className="md:text-[80px] md:w-[635px] text-center font-poppins font-light">Find new study places</h1>
                <div className="flex flex-col items-center space-y-2">
                    <h1 className="font-lato font-bold text-lg w-2/3 text-center  ">Search your campus to get started</h1>
                    <Select
                        styles={customStyles}
                        options={options}
                        onChange={handleChange}
                        placeholder="Search for your university"
                        className="w-[22rem] text-black"

                    />
                </div>
                <NavLink
                    to='/allschools'
                    className="text-sm font-lato italic pt-2">Don&apos;t see your school? request here</NavLink>
            </div>
        </div>
    )
}

export default Home