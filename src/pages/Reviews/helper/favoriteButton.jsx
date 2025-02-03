import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import useFavorite from './useFavorite';
import PropTypes from 'prop-types';

const FavoriteButton = ({ studyLocationID, userID, onClick }) => {
    const {
        isFavorite,
        isLoading,
        isOnCooldown,
        cooldownTimeLeft,
        toggleFavorite
    } = useFavorite(studyLocationID, userID);

    const handleToggleFavorite = async () => {
        if (!userID) {
            onClick();
        }
        else {
            toggleFavorite();
        }
    }


    const formatCooldownTime = (ms) => {
        return `${Math.ceil(ms / 1000)}s`;
    };

    return (
        <div>
            <button
                onClick={handleToggleFavorite}
                disabled={isLoading || isOnCooldown}
                className={`border flex flex-row items-center justify-center py-3 px-4 rounded-lg 
                    transition-all duration-200
                    ${isFavorite
                        ? 'border-action text-white font-bold bg-action '
                        : 'border-gray-300 text-secondary bg-white'
                    }
                    ${isOnCooldown ? 'opacity-75 cursor-not-allowed ' : 'hover:opacity-90 '}
                 
                `}
            >
                {!isOnCooldown && (isFavorite ? <FaBookmark className="mr-2" /> : <FaRegBookmark className="mr-2" />)}
                {isOnCooldown ? (
                    <>
                        <span className="mr-2"> Wait </span><span>{formatCooldownTime(cooldownTimeLeft)}</span>
                    </>

                ) : (
                    isFavorite ? 'Saved' : 'Save'
                )
                }
            </button>
        </div>
    );
};

FavoriteButton.propTypes = {
    studyLocationID: PropTypes.string,
    userID: PropTypes.string,
    onClick: PropTypes.func
};

export default FavoriteButton;