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
        // If it exists, delete it, otherwise insert it
        if (existing) {
            const { data } = await supabase
                .from('UserFavorites')
                .delete()
                .eq('user_id', userID)
                .eq('study_location_id', studyLocationID)
                .select();
            return { isFavorited: false, data };
        } else {

            let { data: collections, error: collectionError } = await supabase
                .from('Collections')
                .select('id')
                .eq('created_by', userID);
            if (collectionError) {
                console.error('Error fetching collections:', collectionError);
                throw collectionError
            }

            if (collections.length === 0) {
                const { data: defaultCollection, error: defaultCollectionError } = await supabase
                    .from('Collections')
                    .insert({
                        created_by: userID,
                        name: 'My bookmarks'
                    })
                    .select();
                if (defaultCollectionError) {
                    throw defaultCollectionError
                }

                collections = defaultCollection;
            }

            const collectionId = collections[0].id;

            const { data: newFavorite } = await supabase
                .from('UserFavorites')
                .insert({
                    user_id: userID,
                    study_location_id: studyLocationID
                })
                .select();

            try {
                const { error } = await supabase
                    .from('Collectionlist')
                    .insert({
                        user_favorite_id: newFavorite[0].id,
                        collection_id: collectionId
                    });

                if (error) {
                    console.error('Error inserting into Collectionlist:', error);
                    throw error;
                }

            } catch (error) {
                console.error('Failed to insert into Collectionlist:', error.message);
            }

            return { isFavorited: true, newFavorite };
        }
    } catch (error) {
        throw new Error(`Failed to toggle favorite: ${error.message}`);
    }
};

// Fetches the user's favorite study locations
export const fetchUserFavorites = async (userID) => {
    const { data, error } = await supabase
        .from('Collections')
        .select(`
        id,
        name,
        Collectionlist(
            UserFavorites!inner(
                id,
                StudyLocation!inner(
                    id,
                    name,
                    university_id,
                    image_url,
                    University!inner(
                        name
                    )
                )
            )
        )
    `)
        .eq('created_by', userID);

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
export const fetchStudyLocationData = async (studyName, universityName) => {
    const { data, error } = await supabase
        .from('StudyLocation')
        .select(`
            id,
            name, 
            image_url,
            address,
            city,
            LocationTagList (
                TagTypes:tag_id (name)
            ),
            UserReview (
                rating
            ),
            University:university_id!inner (
                name
            )
        `)
        .eq('name', studyName)
        .eq('University.name', universityName)
        .single()

    if (error) {
        if (error.code === 'PGRST116') {
            // No rows returned
            throw new Error(`${studyName} is not associated with ${universityName}`);
        }
        throw error;
    }

    if (!data) {
        throw new Error(`${studyName} is not associated with ${universityName}`);
    }

    // Calculate review statistics
    const reviews = data.UserReview || []
    const review_count = reviews.length
    const rating = review_count > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / review_count
        : 0

    // Return a single processed location instead of mapping
    return {
        ...data,
        review_count,
        rating: rating ? Number(rating.toFixed(1)) : 0
    }
}

// Let's Users Request for a study location to be added to the database
export const requestStudyLocation = async (studyLocationData) => {

    const { data, error } = await supabase
        .from('studylocationrequest')
        .insert([
            {
                name: studyLocationData.name,
                address: studyLocationData.address,
                city: studyLocationData.city,
                state_id: studyLocationData.state_id,
                university_id: studyLocationData.university_id || null,
                submitted_by: studyLocationData.user_id,
                category: studyLocationData.category,
                locationtag: studyLocationData.tags,
            }
        ])

    if (error) {
        throw error;
    } else {
        console.log("Study Location Requested, wait for approval", data);
    }


}