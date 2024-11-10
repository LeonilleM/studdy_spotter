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