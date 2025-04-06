import { Star } from 'lucide-react';
import PropTypes from 'prop-types';

const StarRating = ({ rating, starSize = 24, noRating = true }) => {
    const colors = ["text-starColor1", "text-starColor2", "text-starColor3", "text-starColor4", "text-starColor5"];

    const getColorClass = (rating) => {
        if (rating >= 4.5) return colors[4];
        if (rating >= 3.5) return colors[3];
        if (rating >= 2.5) return colors[2];
        if (rating >= 1.5) return colors[1];
        return colors[0];
    };

    const renderStars = (rating) => {
        const stars = [];
        const totalStars = 5;

        for (let i = 1; i <= totalStars; i++) {
            if (i <= Math.floor(rating)) {
                stars.push(
                    <Star
                        key={i}
                        className={`fill-current ${getColorClass(rating)}`}
                        size={starSize}
                    />
                );
            } else if (i - 0.5 <= rating) {
                stars.push(
                    <div key={i} className="relative">
                        <Star
                            className="text-gray-300"
                            size={starSize}
                        />
                        <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                            <Star
                                className={`fill-current ${getColorClass(rating)}`}
                                size={starSize}
                            />
                        </div>
                    </div>
                );
            } else {
                stars.push(
                    <Star
                        key={i}
                        className="text-gray-300"
                        size={starSize}
                    />
                );
            }
        }

        return <div className="flex gap-1">{stars}</div>;
    };

    return (
        <div className="flex flex-row    gap-1 font-poppins">
            {renderStars(rating)} {noRating && <span className="text-xs ml-2">({rating.toFixed(1)})</span>}
        </div>
    );
};
StarRating.propTypes = {
    rating: PropTypes.number.isRequired,
    starSize: PropTypes.number,
    noRating: PropTypes.bool
};

export default StarRating;
