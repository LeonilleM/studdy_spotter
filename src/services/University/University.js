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
        throw insertError;
    }

    const universityId = insertedData.id;
    const sanitizedFileName = `${universityId}/${encodeURIComponent(data.name.replace(/ /g, "_"))}`;

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
