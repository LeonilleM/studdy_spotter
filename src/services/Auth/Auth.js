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

export const signUp = async (email, password, firstName, lastName) => {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                first_name: firstName,
                last_name: lastName
            }
        }
    })

    if (error) {
        throw new Error(`Error signing up: ${error.message}`);
    }

    return data
}

export const fetchUserData = async (userID) => {
    const { data, error } = await supabase
        .from('Users')
        .select(`
            id,
            first_name,
            last_name,
            university_id,
            role:Roles (name),
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

export const deleteImage = async (userId) => {
    const fileName = 'profile_img';
    const filePath = `${userId}/${fileName}`;
    const { data: deleted, error: deleteError } = await supabase.storage
        .from('profile_images')
        .remove(filePath);

    if (deleteError) {
        throw new Error(`Error deleting image from storage: ${deleteError.message}`);
    }

    if (!deleted || deleted.length === 0) {
        throw new Error('Error deleting image from storage: No file was deleted.');
    }

    const { data, error } = await supabase
        .from('Users')
        .update({ image_url: null })
        .eq('id', userId);

    if (error) {
        throw new Error(`Error updating user record: ${error.message}`);
    }

    return data;
}

export const uploadImage = async (userId, image) => {
    const filePath = `${userId}/profile_img`;

    const { error } = await supabase.storage
        .from('profile_images')
        .upload(filePath, image, {
            upsert: true
        })
    if (error)
        throw new Error("Error uploading image: ", error.message)

    const { data: publicURLData, error: publicURLError } = supabase.storage
        .from('profile_images')
        .getPublicUrl(filePath);
    if (publicURLError) {
        throw new Error(`Error getting public URL: ${publicURLError.message}`);
    }
    const newImageUrl = `${publicURLData.publicUrl}?t=${new Date().getTime()}`;
    return updateUserImage_URL(userId, newImageUrl);
}

export const updateUserImage_URL = async (userId, imageUrl) => {
    const { data, error } = await supabase
        .from('Users')
        .update({ image_url: imageUrl })
        .eq('id', userId)
        .select('image_url')
        .single();
    if (error)
        throw ("Error updating user image URL: ", error.message)
    return data;
}


export const updateUniversity = async (userId, universityId) => {
    const { data, error } = await supabase
        .from('Users')
        .update({ university_id: universityId })
        .eq('id', userId)
        .select('university_id, University(name)')
        .single();
    if (error)
        throw new Error("Error setting university: ", error.message)
    return data;
}


export const updateNames = async (userId, firstName, lastName) => {
    const updateData = {};
    if (firstName !== undefined) {
        updateData.first_name = firstName;
    }
    if (lastName !== undefined) {
        updateData.last_name = lastName;
    }

    const { data, error } = await supabase
        .from('Users')
        .update(updateData)
        .eq('id', userId)
        .select('first_name, last_name')
        .single();

    if (error) {
        throw new Error("Error updating profile: " + error.message);
    }
    return data;
};


// Used for better type checking in updateUserProfile
/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} university_id
 * @property {string|null} image_url
 * @property {Object} [University]
 * @property {string} University.name
 * @property {Object} [role]
 * @property {string} role.name
 */
export const updateUserProfile = async (userInfo, isDeleteImage) => {
    try {

        /** @type {Partial<User>} */
        let updatedUser = {};

        if (userInfo.firstName || userInfo.lastName) {
            const namesUpdate = await updateNames(userInfo.userId, userInfo.firstName, userInfo.lastName);
            updatedUser = { ...updatedUser, ...namesUpdate };
        }

        if (userInfo.universityId) {
            const universityUpdate = await updateUniversity(userInfo.userId, userInfo.universityId);
            updatedUser = { ...updatedUser, ...universityUpdate };
        }

        if (userInfo.image) {
            const newURL = await uploadImage(userInfo.userId, userInfo.image);
            updatedUser.image_url = newURL;
        }

        if (isDeleteImage) {
            await deleteImage(userInfo.userId);
            updatedUser.image_url = null;
        }

        return updatedUser;
    } catch (error) {
        console.error("Error updating profile: ", error.message);
        throw new Error("Error updating profile: " + error.message);
    }
};