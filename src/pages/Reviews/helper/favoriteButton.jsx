import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import useFavorite from './useFavorite';
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
        <div>
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
                {isFavorite ? <FaBookmark className="mr-2" /> : <FaRegBookmark className="mr-2" />}
                {isLoading ? 'Loading...' : (
                    isOnCooldown ? (
                        `Wait ${formatCooldownTime(cooldownTimeLeft)}`
                    ) : (
                        isFavorite ? 'Saved' : 'Save'
                    )
                )}
            </button>
            {error && (
                alert(error.message)

            )}
        </div>
    );
};

FavoriteButton.propTypes = {
    studyLocationID: PropTypes.string,
    userID: PropTypes.string,
};

export default FavoriteButton;