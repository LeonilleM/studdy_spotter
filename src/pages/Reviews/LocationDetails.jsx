import PropTypes from 'prop-types'
import BackButton from '../../components/shared/BackButton';
import StarRating from '../../components/StarRating';

function LocationDetails({ locationDetails, totalReviews }) {
    return (
        <div
            style={{
                backgroundImage: `url(${locationDetails.image_url})`,
                backgroundPosition: 'center',
                backgroundRepeat: 'repeat',
                height: '55vh'
            }}>
            <div className={`lg:w-[40%] w-[60%]  sm:px-20 px-4  font-lato flex flex-col space-y-2 pt-36 pb-4 text-white   opacity-90 h-full `} style={{ backgroundColor: locationDetails.University.school_hex_color }}>
                <BackButton color="white" />
                <h1 className="lg:text-4xl text-2xl font-poppins font-bold">{locationDetails.name}</h1>
                <div className="flex flex-row gap-4 items-center">
                    <StarRating rating={locationDetails.rating} starSize={14} color="primary" />
                    <p className="text-xs">({totalReviews} reviews)</p>
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