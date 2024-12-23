import { fetchUniversities } from '../../services/University/University'
import { useEffect, useState } from 'react'
import Select, { components } from 'react-select'
import { NavLink } from 'react-router-dom'
import { IoSearchOutline } from "react-icons/io5";
import { FaUniversity } from "react-icons/fa";
import PropTypes from 'prop-types';
import PopupModal from '../../components/shared/popupModal'

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


    const DropdownIndicator = (props) => {
        return (
            <components.DropdownIndicator {...props}>
                <IoSearchOutline className="text-black " />
            </components.DropdownIndicator>
        )
    }

    const Option = (props) => {
        return (
            <components.Option {...props}>
                <FaUniversity className="mb-1 mr-2 inline-flex" />
                <span>{props.data.label}</span>
            </components.Option>
        );
    };

    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: 'white',
            boxShadow: 'none',
            borderRadius: '0.75rem',
            border: 'lightgray 2px solid',
        }), placeholder: (provided) => ({
            ...provided,
            color: 'gray',
            fontWeight: 'bold',
            fontStyle: 'italic',
            fontSize: '16px'
        }), input: (provided) => ({
            ...provided,
            color: '#000000',
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#000000',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#DEEAF9' : 'white',
            color: state.isFocused ? '#15529C' : 'black',
        }),
    }

    return (
        <>
            <section className="bg-gradient-to-br from-[#72D6F2] to-[#5151E5] flex flex-col text-white sm:pt-0 pt-10">
                <div className="flex items-center justify-center h-screen flex-col gap-8 px-4">
                    <h1 className="font-lato text-center text-secondary font-bold text-2xl">Discover the Best Study Spots Near You</h1>
                    <h1 className="text-center sm:text-7xl text-6xl font-poppins font-bold">Find new study places</h1>
                    <h1 className="font-lato font-bold sm:text-3xl text-2xl  text-center md:w-[35vh]">Search your campus to get started!</h1>
                    <div className="flex flex-col items-center justify-center pt-8">
                        <Select
                            styles={customStyles}
                            options={options}
                            onChange={handleChange}
                            placeholder="Search for your university"
                            className="w-[22rem]"
                            noOptionsMessage={() => 'No universities found'}
                            components={{ DropdownIndicator, Option }}

                        />
                        <NavLink
                            to='/allschools'
                            className="font-lato pt-3 italic">Don&apos;t see your school? <span className='font-bold text-accent2'>Request here</span></NavLink>
                    </div>
                </div>
            </section >
            <section className="bg-secondary h-24 w-full">
            </section>

            <section className="h-screen bg-background">

            </section>
        </>
    )
}

Option.propTypes = {
    data: PropTypes.shape({
        label: PropTypes.string.isRequired,
    }).isRequired,
};

export default Home
