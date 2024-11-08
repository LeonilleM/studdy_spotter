import { FaRegBookmark } from 'react-icons/fa';
import { useFavorite } from './useFavorite'; // Correct import path
import PropTypes from 'prop-types';

const FavoriteButton = ({ studyLocationID, userID }) => {
    const {
        isFavorite,
        isLoading,
        error,
        isOnCooldown,
        cooldownTimeLeft,
        toggleFavorite
    } = useFavorite(studyLocationID, userID);

    const formatCooldownTime = (ms) => {
        return `${Math.ceil(ms / 1000)}s`;
    };

    return (
        <div className="lg:w-1/2">
            <button
                onClick={toggleFavorite}
                disabled={isLoading || isOnCooldown}
                className={`border 
                    ${isFavorite
                        ? 'border-action text-white font-bold bg-action'
                        : 'border-secondary text-secondary'
                    }
                    ${isOnCooldown ? 'opacity-75 cursor-not-allowed' : 'hover:opacity-90'}
                    py-3 px-4 rounded-lg flex items-center justify-center
                    transition-all duration-200
                `}
            >
                <FaRegBookmark className="mr-2 w-4 h-4 " />
                {isLoading ? 'Loading...' : (
                    isOnCooldown ? (
                        `Wait ${formatCooldownTime(cooldownTimeLeft)}`
                    ) : (
                        isFavorite ? 'Saved' : 'Save'
                    )
                )}
            </button>
            {error && (
                <div className="absolute top-full left-0 mt-1 text-red-500 text-sm">
                    {error.message}
                </div>
            )}
        </div>
    );
};

FavoriteButton.propTypes = {
    studyLocationID: PropTypes.string.isRequired,
    userID: PropTypes.string.isRequired,
};

export default FavoriteButton;