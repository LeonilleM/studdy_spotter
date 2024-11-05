import { supabase } from '../supabase/supabase'

// Returns a list of universities
export const fetchUniversities = async () => {
    const { data, error } = await supabase
        .from('University')
        .select('name')
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
            ` id, name, city, states_id, image_url,
            
            States:states_id (
                name
            )
           `)
        .eq('name', university)
    if (error) {
        throw error
    }
    return data
}
