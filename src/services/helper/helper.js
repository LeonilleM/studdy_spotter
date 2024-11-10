// This file is a helper function from the database, returns States, Tag Selects
import { supabase } from '../supabase/supabase'

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


export const fetchTags = async () => {
    const { data, error } = await supabase
        .from('TagTypes')
        .select(` id, name`)
    if (error) {
        throw error
    }
    return data
}

export const fetchCategory = async () => {
    const { data, error } = await supabase
        .from('proximitycategory')
        .select(`id, name`)
    if (error) {
        throw error
    }
    return data

}