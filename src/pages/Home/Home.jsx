import { fetchUniversities } from '../../services/University/University'
import { useEffect, useState } from 'react'
import Select, { components } from 'react-select'
import { NavLink } from 'react-router-dom'
import { IoSearchOutline } from "react-icons/io5";
import { FaUniversity } from "react-icons/fa";
import PropTypes from 'prop-types';

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
                <FaUniversity className="mr-2 text-black inline-flex gap-2" />
                {props.data.label}
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
            color: 'lightgray',
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
            backgroundColor: state.isFocused ? '#72D6F2' : 'white',
            color: state.isFocused ? 'white' : 'black',
        }),
    }

    return (
        <div className="bg-gradient-to-br from-[#72D6F2] to-[#5151E5] flex flex-col text-primary ">
            <div className="flex items-center justify-center h-screen  flex-col gap-12 ">
                <h1 className="text-center text-6xl font-poppins font-bold">Find new study places</h1>
                <h1 className="font-lato font-bold text-2xl  text-center w-[30vh] ">Search your campus to get started</h1>
                <div className="flex flex-col items-center justify-center">
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
                        className="font-lato  pt-2">Don&apos;t see your school? Request here</NavLink>
                </div>

            </div>
        </div >
    )
}

Option.propTypes = {
    data: PropTypes.shape({
        label: PropTypes.string.isRequired,
    }).isRequired,
};

export default Home
