import { supabase } from '../supabase/supabase'

export const createCollection = async (newCollection) => {
    const { data, error } = await supabase
        .from('Collections')
        .insert({
            name: newCollection.name,
            created_by: newCollection.created_by
        })
        .select('*')
        .single()

    if (error) {
        throw error
    }

    return data
}

// Mass Delete all UserFavorites in a given Collection, then delete the Collection
export const deleteAllUserFavoritesInCollection = async (userFavorites) => {
    if (!userFavorites.isArray) {
        throw new Error("deleteAllUserFavoritesInCollection expects an array of UserFavorites")
    }

    const { data, error } = await supabase
    
    
}

export const deleteCollection = async (collectionID, userID) => {
    console.log("Deleting collection:", "CollectionID", collectionID, userID)
    const { data, error } = await supabase
        .from('Collections')
        .delete()
        .eq('id', collectionID)
        .eq('created_by', userID)
        .select()

    if (error) {
        throw error
    }

    return data
}



export const returnUserCollections = async (userID) => {
    const { data, error } = await supabase
        .from('Collections')
        .select('*')
        .eq('created_by', userID)
    if (error) {
        throw error
    }

    return data
}

export const moveStudyLocationToCollection = async (studyLocationID, collectionID) => {
    const { data, error } = await supabase
        .from('Collectionlist')
        .update({
            collection_id: collectionID
        })
        .eq('user_favorite_id', studyLocationID)
        .select()

    if (error) {
        throw error
    }

    return data
}

