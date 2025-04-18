import { supabase } from '../supabase/supabase'

// Returns a list of universities
export const fetchUniversities = async () => {
    const { data, error } = await supabase
        .from('University')
        .select(`
            id,
            name,
            city,
            States:states_id (
                name
            )
        `)
        .eq('status', 'Approved')
    if (error) {
        throw error
    }
    return data
}

// Returns universities with the most total reviews
export const fetchUniversitiesWithMostReviews = async () => {
    const { data: universities, error: universityError } = await supabase
        .from('University')
        .select(`
            id,
            name,
            city,
            image_url
        `)
        .eq('status', 'Approved');

    if (universityError) {
        throw universityError;
    }

    // Calculate total reviews by aggregating reviews from StudyLocation
    const universitiesWithReviews = await Promise.all(
        universities.map(async (university) => {
            const { data: studyLocations, error: studyLocationError } = await supabase
                .from('StudyLocation')
                .select(`
                    id,
                    UserReview (
                        id
                    )
                `)
                .eq('university_id', university.id);

            if (studyLocationError) {
                throw studyLocationError;
            }

            // Calculate total reviews for the university
            const totalReviews = studyLocations.reduce((sum, location) => {
                return sum + (location.UserReview ? location.UserReview.length : 0);
            }, 0);

            return {
                ...university,
                total_reviews: totalReviews,
            };
        })
    );

    // Filter out universities with zero reviews
    const filteredUniversities = universitiesWithReviews.filter(
        (university) => university.total_reviews > 0
    );

    // Sort universities by total reviews in descending order
    filteredUniversities.sort((a, b) => b.total_reviews - a.total_reviews);

    return filteredUniversities;
};

// Fetches University Data by the name
export const fetchUniversityData = async (uniName) => {
    // Extract the last part of the URL
    const lastIndex = uniName.lastIndexOf(' ');
    const university = uniName.substring(0, lastIndex);
    const city = uniName.substring(lastIndex + 1);

    const { data, error } = await supabase
        .from('University')
        .select(
            ` id, name, city, states_id, image_url,school_hex_color,
            States:states_id (
                name
            )
           `)
        .eq('name', university)
        .eq('city', city)
        .eq('status', 'Approved')
    if (error) {
        throw error
    }
    return data
}

// Helper for fetching states
export const fetchStates = async () => {
    const { data, error } = await supabase
        .from('States')
        .select(`
            *
        `)
    if (error) {
        throw error
    }
    return data
}

// Used for Requesting a campus
export const sendCampusRequest = async (data, image) => {
    const { data: insertedData, error: insertError } = await supabase
        .from('University')
        .insert([
            {
                name: data.name,
                city: data.city,
                states_id: data.states_id,
                status: 'Pending'
            }
        ])
        .select('id')
        .single();

    if (insertError) {
        // Check if the error is related to RLS
        if (insertError.message.includes('violates row-level security policy')) {
            throw new Error('You do not have permission to perform this action. Please contact support.');
        }

        // Throw the original error for other cases
        throw insertError;
    }

    const universityId = insertedData.id;
    const sanitizedFileName = `${universityId}/university_image`;

    const { error: imageError } = await supabase.storage
        .from('university_images')
        .upload(sanitizedFileName, image);

    if (imageError) {
        throw imageError;
    }

    const { data: publicURLData, error: publicURLError } = supabase.storage
        .from('university_images')
        .getPublicUrl(sanitizedFileName);

    if (publicURLError) {
        throw publicURLError;
    }

    const imageUrl = publicURLData.publicUrl;
    if (!imageUrl) {
        throw new Error('Failed to get public URL for image');
    }

    const { error: updateError } = await supabase
        .from('University')
        .update({ image_url: imageUrl })
        .eq('id', universityId);

    if (updateError) {
        return updateError;
    }

    return "Campus request sent successfully";
}
