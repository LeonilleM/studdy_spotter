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
export const fetchUniversityStudyLocations = async (uniID) => {
    const { data, error } = await supabase
        .from('StudyLocation')
        .select(`
            id,
            name,
            image_url,
            UserReview (
                rating
            ),
            LocationTagList (
                TagTypes:tag_id (name)
            )
        `)
        .eq('university_id', uniID)
        .eq('status', "Approved")
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
export const fetchStudyLocationData = async (studyName, universityName, uniCity) => {
    const { data, error } = await supabase
        .from('StudyLocation')
        .select(`
            id,
            name, 
            image_url,
            address,
            city,
            category,
            zipcode,
            LocationTagList (
                TagTypes:tag_id (name)
            ),
            UserReview (
                rating
            ),
            University:university_id!inner (
                name,
                school_hex_color,
                city
            ),
            study_location_hours(
                day_of_week,
                start_time,
                end_time
            ),
            State:state_id(abr)
        `)
        .eq('name', studyName)
        .eq('University.name', universityName)
        .eq('University.city', uniCity)
        .single()

    if (error) {
        if (error.code === 'PGRST116') {
            // No rows returned
            throw new Error(`${studyName} is not associated with ${universityName} ${uniCity}`);
        }
        throw error;
    }

    if (!data) {
        throw new Error(`${studyName} is not associated with ${universityName} ${uniCity}`);
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

// This returns most popular study locations for a given university
export const fetchPopularLocations = async (universityID) => {
    const MIN_REVIEWS = 5;
    const MIN_RATING = 3.5;

    const { data, error } = await supabase
        .from('StudyLocation')
        .select(`
            id,
            name,
            image_url,
            UserReview (
                rating
            ),
            University:university_id!inner (
                name
            )   
        `)
        .eq('university_id', universityID);

    if (error) {
        throw error;
    }

    // Process the results to calculate averages and counts
    const processedLocations = data.map(location => {
        const reviews = location.UserReview || [];
        const review_count = reviews.length;
        const rating = review_count > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / review_count
            : 0;

        return {
            ...location,
            review_count,
            rating: rating ? Number(rating.toFixed(1)) : 0 // Round to 1 decimal place
        };
    });

    // Filter locations based on criteria
    const popularLocations = processedLocations.filter(location =>
        location.review_count >= MIN_REVIEWS && location.rating >= MIN_RATING
    );

    // Sort by number of reviews and rating
    popularLocations.sort((a, b) => {
        if (b.review_count === a.review_count) {
            return b.rating - a.rating;
        }
        return b.rating - a.rating;
    });
    return popularLocations;
};

// Let's Users Request for a study location to be added to the database
export const requestStudyLocation = async (studyLocationData) => {
    const { data, error } = await supabase
        .from('StudyLocation')
        .insert([
            {
                name: studyLocationData.name,
                address: studyLocationData.address,
                city: studyLocationData.city,
                state_id: studyLocationData.state_id,
                university_id: studyLocationData.university_id || null,
                category: studyLocationData.category,
            }
        ])
        .select('id')
        .single();

    if (error) {
        console.error('Error inserting study location:', error);
        throw error;
    }

    // Insert all tags for the study location
    const tags = studyLocationData.tags.map(tag => ({
        study_location_id: data.id,
        tag_id: tag
    }));


    // Will insert all tags in a single request
    const { error: tagError } = await supabase
        .from('LocationTagList')
        .insert(tags);
    if (tagError) {
        console.error('Error inserting tags:', tagError);
        throw tagError;
    }

    const studyLocationId = data.id;
    const sanitizedFileName = `${studyLocationId}/location_image`;

    try {
        const { error: imageError } = await supabase.storage
            .from('study_location_image')
            .upload(sanitizedFileName, studyLocationData.image);

        if (imageError) {
            console.error('Error uploading image:', imageError);
            throw imageError;
        }


        const { data: publicURL, error: publicURLError } = supabase.storage
            .from('study_location_image')
            .getPublicUrl(sanitizedFileName);
        if (publicURLError) {
            console.error('Error getting public URL:', publicURLError);
            throw publicURLError;
        }

        console.log('Public URL:', publicURL);

        if (!publicURL) {
            // Delete the inserted study location if the image URL is not available
            await supabase
                .from('StudyLocation')
                .delete()
                .eq('id', studyLocationId);
            console.error('Failed to get public URL for image');
            throw new Error('Failed to get public URL for image');
        }

        const image_url = publicURL.publicUrl;


        const { error: updateError } = await supabase
            .from('StudyLocation')
            .update({ image_url })
            .eq('id', studyLocationId);

        if (updateError) {
            console.error('Error updating study location with image URL:', updateError);
            throw updateError;
        }

        return data;
    } catch (error) {
        console.error('Error during requestStudyLocation:', error);
        // Ensure the original insert is deleted if any error occurs
        // try {
        //     await supabase
        //         .from('StudyLocation')
        //         .delete()
        //         .eq('id', studyLocationId);
        //     console.log('Deleted study location due to error:', studyLocationId);
        // } catch (deleteError) {
        //     console.error('Error deleting study location after failure:', deleteError);
        // }
        throw error;
    }
};