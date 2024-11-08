import { supabase } from '../supabase/supabase'

// Lets a user favorite a study location
export const toggleFavorite = async (studyLocationID, userID) => {
    // First check if the favorite exists
    const { data: existing } = await supabase
        .from('UserFavorites')
        .select('id')
        .eq('user_id', userID)
        .eq('study_location_id', studyLocationID)
        .maybeSingle();

    try {
        if (existing) {
            const { data } = await supabase
                .from('UserFavorites')
                .delete()
                .eq('user_id', userID)
                .eq('study_location_id', studyLocationID)
                .select();

            return { isFavorited: false, data };
        } else {
            const { data } = await supabase
                .from('UserFavorites')
                .insert({
                    user_id: userID,
                    study_location_id: studyLocationID
                })
                .select();

            return { isFavorited: true, data };
        }
    } catch (error) {
        throw new Error(`Failed to toggle favorite: ${error.message}`);
    }
};

// Fetches the user's favorite study locations
export const fetchUserFavorites = async (userID) => {
    const { data, error } = await supabase
        .from('UserFavorites')
        .select('study_location_id')
        .eq('user_id', userID);

    if (error) {
        throw error;
    }

    return data;
};

// Returns study locations for a given university id, used to show the study locations for a university, as well as the reviews for a study location
export const fetchUniversityStudyLocationsWithReviews = async (uniID) => {
    const { data, error } = await supabase
        .from('StudyLocation')
        .select(`
            id,
            name,
            image_url,
            UserReview (
                rating
            )
        `)
        .eq('university_id', uniID)

    if (error) {
        throw error
    }

    // Process the results to calculate averages and counts
    return data.map(location => {
        const reviews = location.UserReview || []
        const review_count = reviews.length
        const rating = review_count > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / review_count
            : null

        return {
            ...location,
            review_count,
            rating: rating ? Number(rating.toFixed(1)) : 0 // Round to 1 decimal place
        }
    })
}

// Reteurns the Data for a given study location, used to show the reviews for a study location
export const fetchStudyLocationData = async (studyName) => {
    const { data, error } = await supabase
        .from('StudyLocation')
        .select(`
            id,
            name, 
            image_url,
            address,
            city,
            States:state_id (name),
            LocationTagList (
                TagTypes:tag_id (name)
            ),
            UserReview (
                rating
            )
        `)
        .eq('name', studyName)
    if (error) {
        throw error
    }

    // Process the results to calculate averages and counts
    return data.map(location => {
        const reviews = location.UserReview || []
        const review_count = reviews.length
        const rating = review_count > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / review_count
            : null

        return {
            ...location,
            review_count,
            rating: rating ? Number(rating.toFixed(1)) : 0 // Round to 1 decimal place
        }
    })
}