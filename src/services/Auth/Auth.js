import { supabase } from '../supabase/supabase'
import { jwtDecode } from 'jwt-decode' // Use named import

// Checking for user persistence within the session
export const getCurrentUser = async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) return null;

    const token = data.session.access_token;
    try {
        const decodedToken = jwtDecode(token);
        return decodedToken;
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
};


// Sign in with magic link
export const signIn = async (email, password) => {
    console.log("Signing in with email and password")
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    })

    if (error) {
        throw new Error(`Error signing in: ${error.message}`);
    }

    if (!data || !data.session || !data.session.access_token || !data.user) {
        throw new Error('Incomplete data returned from Supabase');
    }

    return data
}

// Returns the user data for the current user
export const fetchUserData = async (userID) => {
    const { data, error } = await supabase
        .from('Users')
        .select(`
            id,
            first_name,
            last_name,
            university_id,
            University:university_id (name),
            image_url
        `)
        .eq('id', userID)
        .single()
    if (error) {
        throw error
    }
    return data
}


export const uploadImage = async (userId, image) => {
    const { data, error } = await supabase.storage
        .from('profile_images')
        .upload(`${userId}/profile_img`, image, {
            upsert: true
        })
    if (error)
        throw new Error("Error uploading image: ", error.message)


    // Get the public URL of users image
    const { data: publicURLData, error: publicURLError } = supabase.storage
        .from('profile_images')
        .getPublicUrl(`${userId}/profile_img`)
    if (publicURLError) throw new Error(`Error getting public URL: ${publicURLError.message}`);

    await updateUserImage_URL(userId, publicURLData.publicUrl);

}


export const updateUserImage_URL = async (userId, imageUrl) => {
    const { error } = await supabase
        .from('Users')
        .update({ image_url: imageUrl })
        .eq('id', userId)
    if (error)
        throw ("Error updating user image URL: ", error.message)

    return "Image uploaded successfully"
}