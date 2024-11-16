import { supabase } from '../supabase/supabase'

export const createCollection = async (userID, collectionName) => {
    const { data, error } = await supabase
        .from('Collections')
        .insert({
            name: collectionName,
            created_by: userID
        })

    if (error) {
        throw error
    }

    return data
}

export const moveStudyLocationToCollection = async (studyLocationID, collectionID) => {
    const { data, error } = await supabase
        .from('StudyLocationCollection')
        .insert({
            study_location_id: studyLocationID,
            collection_id: collectionID
        })

    if (error) {
        throw error
    }

    return data
}