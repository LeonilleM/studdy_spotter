import { supabase } from '../supabase/supabase'


// Returns study locations for a given university id
export const fetchUniversityStudyLocations = async (uniID) => {
    const { data, error } = await supabase
        .from('StudyLocation')
        .select(
            ` id, 
            name, 
            address,
            university_id
           `)
        .eq('university_id', uniID)
    if (error) {
        throw error
    }
    return data
}