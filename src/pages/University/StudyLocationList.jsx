import { NavLink } from 'react-router-dom';
import StarRating from '../../components/StarRating';
import PropTypes from 'prop-types';

function StudyLocationList({ studyLocations, uniName }) {
    return (
        <div className="grid lg:grid-cols-3 2xl:gap-20 gap-16">
            {studyLocations.map((studyLocation) => {
                const studyLocationPath = `/university/${uniName}/${studyLocation.name}`;
                return (
                    <NavLink
                        to={studyLocationPath}
                        key={studyLocation.id}
                        className="grid grid-cols-2 font-poppins text-secondary transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-blue-400/20 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-400/0 before:to-blue-400/10 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 hover:scale-105 group"
                    >
                        <img
                            src={studyLocation.image_url}
                            alt="placeholder"
                            className="w-full h-full rounded-l-lg group-hover:opacity-85"
                        />
                        <div className="bg-white rounded-r-lg items-center justify-between text-center relative overflow-hidden flex flex-col py-6 px-2">
                            <h1 className="text-2xl px-2 transition-transform duration-300 ease-in-out group-hover:-translate-y-2 group-hover:scale-110 pt-2">
                                {studyLocation.name}
                            </h1>
                            <div className="items-center gap-2 flex flex-row transition-transform duration-300 ease-in-out group-hover:-translate-y-2 group-hover:scale-110">
                                <StarRating
                                    rating={studyLocation.rating}
                                    starSize={12} 
                                    
                                    />
                                <h1 className="text-xs font-light">{studyLocation.review_count} reviews</h1>
                            </div>
                        </div>
                    </NavLink>
                );
            })}
        </div>
    )
}

StudyLocationList.propTypes = {
    studyLocations: PropTypes.array.isRequired,
    uniName: PropTypes.string.isRequired
}

export default StudyLocationList