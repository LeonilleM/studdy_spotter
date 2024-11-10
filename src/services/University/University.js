import { supabase } from '../supabase/supabase'


// Returns a list of universities
export const fetchUniversities = async () => {
    const { data, error } = await supabase
        .from('University')
        .select(`
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

// Fetches University Data by the name
export const fetchUniversityData = async (uniName) => {
    const university = decodeURIComponent(uniName);

    const { data, error } = await supabase
        .from('University')
        .select(
            ` id, name, city, states_id, image_url,school_hex_color,
            States:states_id (
                name
            )
           `)
        .eq('name', university)
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
    // First insert the new location
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
        throw insertError;
    }

    const universityId = insertedData.id;

    // Then upload the image to the follow university
    const { error: imageError } = await supabase.storage
        .from('university_images')
        .upload(`${universityId}/${data.name}`, image);
    if (imageError) {
        throw imageError;
    }

    // Return the following public url of the image
    const { data: publicURLData, error: publicURLError } = supabase.storage
        .from('university_images')
        .getPublicUrl(`${universityId}/${data.name}`);
    if (publicURLError) {
        throw publicURLError;
    }

    const imageUrl = publicURLData.publicUrl;
    if (!imageUrl) {
        throw new Error('Failed to get public URL for image');
    }


    console.log('Image URL:', imageUrl);
    console.log('University ID:', universityId);

    // Finally update the university record with the image URL
    const { error: updateError } = await supabase
        .from('University')
        .update({ image_url: imageUrl })
        .eq('id', universityId);

    if (updateError) {
        console.error('Update Error:', updateError);
    } else {
        console.log('University record updated successfully with image URL');
    }

    console.log('University record updated successfully with image URL');
    return "Campus request sent successfully";
}
