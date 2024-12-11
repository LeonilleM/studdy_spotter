import { useState } from "react";
import PropTypes from "prop-types";
import { Star } from "lucide-react";

const StarRating = ({ rating, setRating, starSize = 24 }) => {
    const [hover, setHover] = useState(null);

    const messages = ["Bad", "Poor", "Average", "Good", "Amazing"];
    const colors = ["text-starColor1", "text-starColor2", "text-starColor3", "text-starColor4", "text-starColor5"];

    const renderInteractiveStars = () => {
        const stars = [];
        const totalStars = 5;

        for (let i = 1; i <= totalStars; i++) {
            const isFilled = i <= (hover || rating);
            const colorClass = colors[(hover || rating) - 1];

            stars.push(
                <label key={i} className="relative cursor-pointer">
                    <input
                        type="radio"
                        name="rating"
                        value={i}
                        className="hidden"
                        onClick={() => setRating(i)}
                    />
                    <Star
                        size={starSize}
                        className={`${isFilled ? colorClass : "text-gray-300 "} fill-current`}
                        onMouseEnter={() => setHover(i)}
                        onMouseLeave={() => setHover(null)}
                    />
                </label>
            );
        }

        return <div className="flex gap-1">{stars}</div>;
    };

    return (
        <div className="flex flex-row items-center gap-2 absolute top-5 left-4 z-50 bg-white/95 pr-4 rounded-lg">
            {renderInteractiveStars()}
            <span className="">
                ({(hover || rating).toFixed(0)})
            </span >
            <span className="font-semibold ">
                {messages[(hover || rating) - 1]}
            </span>
        </div >
    );
};

StarRating.propTypes = {
    rating: PropTypes.number.isRequired,
    setRating: PropTypes.func.isRequired,
    starSize: PropTypes.number,
    color: PropTypes.string,
};

export default StarRating;
