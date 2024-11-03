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
