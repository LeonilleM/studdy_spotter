import { useState, useEffect, useCallback } from 'react';
import { toggleFavorite, fetchUserFavorites } from '../../../services/StudyLocation/Study';


export const useFavorite = (studyLocationID, userID, initialState = false) => {
    const [isFavorite, setIsFavorite] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isOnCooldown, setIsOnCooldown] = useState(false);
    const [cooldownEndTime, setCooldownEndTime] = useState(null);
    const [cooldownTimeLeft, setCooldownTimeLeft] = useState(0);

    const COOLDOWN_DURATION = 6000;

    // Check initial favorite status
    useEffect(() => {
        const checkInitialStatus = async () => {
            if (!userID || !studyLocationID) return;

            setIsLoading(true);
            try {
                const favorites = await fetchUserFavorites(userID);
                const favoriteIds = favorites.map(fav => fav.study_location_id);
                setIsFavorite(favoriteIds.includes(studyLocationID));
                setError(null);
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        checkInitialStatus();
    }, [studyLocationID, userID]);

    // Handle cooldown timer
    useEffect(() => {
        let timer;
        if (isOnCooldown && cooldownEndTime) {
            timer = setInterval(() => {
                const timeLeft = cooldownEndTime - Date.now();
                if (timeLeft <= 0) {
                    setIsOnCooldown(false);
                    setCooldownEndTime(null);
                    setCooldownTimeLeft(0);
                    clearInterval(timer);
                } else {
                    setCooldownTimeLeft(timeLeft);
                }
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isOnCooldown, cooldownEndTime]);

    const startCooldown = () => {
        setIsOnCooldown(true);
        const endTime = Date.now() + COOLDOWN_DURATION;
        setCooldownEndTime(endTime);
        setCooldownTimeLeft(COOLDOWN_DURATION);
    };

    const handleToggle = useCallback(async () => {
        if (!userID) {
            setError(new Error('User must be logged in'));
            return;
        }

        if (isOnCooldown) {
            return;
        }

        setIsLoading(true);
        try {
            const { isFavorited } = await toggleFavorite(studyLocationID, userID);
            setIsFavorite(isFavorited);
            setError(null);
            startCooldown();
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, [studyLocationID, userID, isOnCooldown]);

    return {
        isFavorite,
        isLoading,
        error,
        isOnCooldown,
        cooldownTimeLeft,
        toggleFavorite: handleToggle
    };
};


