import PropTypes from 'prop-types'
import BackButton from '../../components/shared/BackButton';
import StarRating from '../../components/StarRating';

function LocationDetails({ locationDetails, totalReviews }) {
    return (
        <div
            style={{ backgroundImage: `url(${locationDetails.image_url})`, backgroundPosition: 'center', height: '45vh', }}>
            <div className="flex container mx-auto h-full">
                <div className="lg:w-1/3  font-lato flex flex-col py-8 text-white justify-between rounded-l-md">
                    <section className="flex flex-col gap-2">
                        <BackButton color="white" />
                        <h1 className="lg:text-4xl text-2xl  font-poppins font-bold">{locationDetails.name}</h1>
                        <div className="flex flex-row gap-4 items-center">
                            <StarRating rating={locationDetails.rating} starSize={14} color="primary" />
                            <p className="text-xs">({totalReviews} reviews)</p>
                        </div>
                    </section>
                    <div className="flex flex-row flex-wrap gap-2 ">
                        {locationDetails.LocationTagList.map((tag, index) => {
                            const tagName = tag.TagTypes?.name || 'no-name';
                            return (
                                <span key={`tag-${index}-${tagName}`} className="bg-gray-200 text-secondary font-bold md:text-sm text-xs px-3 py-1.5 rounded-xl font-poppins">
                                    {tagName}
                                </span>
                            );
                        })}
                    </div>
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