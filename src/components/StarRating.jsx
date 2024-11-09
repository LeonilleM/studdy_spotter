import { Star } from 'lucide-react';


const StarRating = ({ rating, starSize = 24, color = "secondary" }) => {  // Add starSize prop with default
    const renderStars = (rating) => {
        const stars = [];
        const totalStars = 5;

        for (let i = 1; i <= totalStars; i++) {
            if (i <= Math.floor(rating)) {
                stars.push(
                    <Star
                        key={i}
                        className="fill-yellow-400 text-yellow-400"
                        size={starSize}  // Use starSize here
                    />
                );
            } else if (i - 0.5 <= rating) {
                stars.push(
                    <div key={i} className="relative">
                        <Star
                            className="text-gray-300"
                            size={starSize}  // Use starSize here
                        />
                        <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                            <Star
                                className="fill-yellow-400 text-yellow-400"
                                size={starSize}  // Use starSize here
                            />
                        </div>
                    </div>
                );
            } else {
                stars.push(
                    <Star
                        key={i}
                        className="text-gray-300"
                        size={starSize}  // Use starSize here
                    />
                );
            }
        }

        return (
            <div className="flex gap-1 items-center">
                {stars}
                <span className={`text-xs text-${color} items-center`}>
                    ({rating.toFixed(1)})
                </span>
            </div>
        );
    };

    return renderStars(rating);
};

export default StarRating;