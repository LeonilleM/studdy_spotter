import PropTypes from 'prop-types'
import BackButton from '../../components/shared/BackButton';
import StarRating from '../../components/StarRating';

function LocationDetails({ locationDetails, totalReviews }) {
    return (
        <div
            style={{ backgroundImage: `url(${locationDetails.image_url})`, backgroundPosition: 'center', height: '45vh', }}>
            <div className="flex h-full">
                <div className={`lg:w-1/3 w-[60%] xl:px-36 lg:px-20 px-4 font-lato flex flex-col py-8 text-white justify-between  opacity-85`} style={{ backgroundColor: locationDetails.University.school_hex_color }}>
                    <section className="flex flex-col gap-2">
                        <BackButton color="white" />
                        <h1 className="lg:text-4xl text-2xl  font-poppins font-bold">{locationDetails.name}</h1>
                        <div className="flex flex-row gap-4 items-center">
                            <StarRating rating={locationDetails.rating} starSize={14} color="primary" />
                            <p className="text-xs">({totalReviews} reviews)</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

LocationDetails.propTypes = {
    locationDetails: PropTypes.object.isRequired,
    totalReviews: PropTypes.number.isRequired
}

export default LocationDetails