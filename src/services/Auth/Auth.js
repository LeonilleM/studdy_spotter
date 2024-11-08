import { supabase } from '../supabase/supabase'
import { jwtDecode } from 'jwt-decode' // Use named import

// Checking for user persistence within the session
export const getCurrentUser = () => {
    const token = sessionStorage.getItem('supabase.auth.token');
    if (!token) return null;

    try {
        const decodedToken = jwtDecode(token); // Use named import
        
        return decodedToken;
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
}

// Sign in with magic link
export const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    })
    if (error) {
        throw error
    }

    if (!data || !data.session || !data.session.access_token || !data.user) {
        throw new Error('Incomplete data returned from Supabase');
    }

    // Store the JWT in sessionStorage
    sessionStorage.setItem('supabase.auth.token', data.session.access_token);

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
        .single() // Returns only one record
    if (error) {
        throw error
    }

    return data
}