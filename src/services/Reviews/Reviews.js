import { supabase } from '../supabase/supabase'

// Returns all Reviews for a given study location
export const fetchAllReviews = async (studyLocationID) => {
    const { data, error } = await supabase
        .from('UserReview')
        .select(`
            id,
            description,
            rating,
            created_at,
            updated_at,
            Users:user_id (
                first_name,
                last_name,
                University:university_id (name)
            )
        `)
        .eq('study_location_id', studyLocationID)

    if (error) {
        throw error
    }

    return data
}

// Let's a user create a review for a given study location 
export const createReview = async (studyLocationID, userID, rating, description) => {
    const { data, error } = await supabase
        .from('UserReview')
        .insert({
            user_id: userID,
            study_location_id: studyLocationID,
            rating: rating,
            description: description
        })

    if (error) {
        throw error
    }

    return data
}