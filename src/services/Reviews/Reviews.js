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
                id,
                first_name,
                last_name,
                University:university_id (name),
                image_url
            )
        `)
        .eq('study_location_id', studyLocationID)

    if (error) {
        throw error
    }
    return data
}

// Returns all the users reviews
export const fetchUserReviews = async (userID) => {
    const { data, error } = await supabase
        .from('UserReview')
        .select(`
            id,
            description,
            rating,
            created_at,
            updated_at,
            StudyLocation:study_location_id (
                id,
                name,
                address,
                University:university_id (
                    name,
                    city
                ),
                image_url,
                category,
                LocationTagList(
                    TagTypes:tag_id (
                        name
                    )
                )
            )
        `).eq('user_id', userID)
    if (error) {
        throw error
    }
    return data
}

// Let's a user create a review for a given study location 
export const createReview = async (studyLocationID, userID, rating, review) => {
    const { data, error } = await supabase
        .from('UserReview')
        .insert({
            user_id: userID,
            study_location_id: studyLocationID,
            rating: rating,
            description: review
        })
        .select('*')
        .single()

    if (error) {
        throw error
    }

    return data
}

// Let's a user Delete a review for a given study location
export const deleteReview = async (userID, studyLocationID) => {
    const { data, error } = await supabase
        .from('UserReview')
        .delete()
        .eq('user_id', userID)
        .eq('study_location_id', studyLocationID)

    if (error) {
        throw error
    }

    return data
}

// Let's a user update a review for a given study location
export const updateReview = async (userId, studyLocationId, rating, review) => {
    const { data, error } = await supabase
        .from('UserReview')
        .update([
            {
                rating: rating,
                description: review,
                updated_at: new Date().toISOString()
            }])
        .eq('user_id', userId)
        .eq('study_location_id', studyLocationId)
        .select('*')
        .single()

    if (error) {
        throw error
    }

    return data
}