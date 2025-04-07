import { supabase } from '../supabase/supabase'

// Fetches total count
export const fetchTotalReviews = async () => {
    const { count, error } = await supabase
        .from('UserReview')
        .select('id', { count: 'exact' }); // Use 'exact' to get the total count

    if (error) {
        throw error;
    }

    return count; // Return the total count of reviews
};

// Fetches most recent reviews
export const fetchRecentReviews = async (limit = 9, offset = 0) => {
    const { data, error } = await supabase
        .from('UserReview')
        .select(`
            id,
            description,
            rating,
            created_at,
            StudyLocation (
                name,
                University(
                name,
                city
                )
            ),
            Users:user_id(
            first_name,
            last_name,
            image_url
            )
        `)
        .order('created_at', { ascending: false }) // Sort by most recent
        .range(offset, offset + limit - 1); // Fetch a specific range of rows

    if (error) {
        throw error;
    }

    return data;
};


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
            ),
            post_images (
            image_url,
            description
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

// Helper function to upload an image to the storage bucket
const uploadImage = async (file, reviewData) => {
    console.log(reviewData, file)
    const { error } = await supabase.storage
        .from('post_images')
        .upload(`${reviewData.user_id}/${reviewData.review_id}/${file.name}`, file);

    if (error) {
        throw error;
    }

    // Get the public URL of the uploaded file
    const { data: publicUrlData, error: publicUrlError } = supabase.storage
        .from('post_images')
        .getPublicUrl(`${reviewData.user_id}/${reviewData.review_id}/${file.name}`);

    if (publicUrlError || !publicUrlData) {
        throw new Error('Failed to retrieve public URL for the uploaded image.');
    }

    return publicUrlData.publicUrl;
};

// Exported function to handle image upload and database insertion
export const insertUploadedImages = async (file, reviewData, captions) => {
    try {
        // Upload the image and get its public URL
        const imageUrl = await uploadImage(file, reviewData);


        // Insert the image details into the database
        const { data: insertData, error: insertError } = await supabase
            .from('post_images') // Assuming you have a table named 'ReviewImages'
            .insert({
                review_id: reviewData.review_id,
                user_id: reviewData.user_id,
                study_location_id: reviewData.study_location_id,
                image_url: imageUrl,
                description: captions
            });

        if (insertError) {
            throw insertError;
        }

        console.log('Image uploaded and inserted successfully:', insertData);
        return { imageUrl, insertData };
    } catch (error) {
        console.error('Error uploading and inserting image:', error);
        throw error;
    }
};

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