// Used to store fetching for Request Forms for Study Locations & Universities
// Also stores all approval functions
import { supabase } from '../supabase/supabase'


export const fetchStudyRequest = async () => {
    // Fetch data from studylocationrequest
    const { data, error } = await supabase
        .from('StudyLocation')
        .select('*, University(name, city),  States(abr),LocationTagList(TagTypes:tag_id (name))')
    if (error) {
        throw error
    }
    return data
}

export const deleteOtherReview = async (reviewId, userId) => {
    const { data: userRole, error: roleError } = await supabase
        .from('Users')
        .select('Roles:role_id(name)')
        .eq('id', userId)
        .single();

    if (roleError) {
        throw roleError;
    }

    if (userRole.Roles.name !== 'Admin') {
        throw new Error('Unauthorized: Only admins can delete reviews.');
    }

    // Proceed with the delete request
    const { error } = await supabase
        .from('UserReview')
        .delete()
        .eq('id', reviewId);

    if (error) {
        throw error;
    }

    return 'Review deleted successfully.';
};

export const fetchUniversityRequest = async () => {
    const { data, error } = await supabase
        .from('University')
        .select('*, States(name, abr)')
    if (error) {
        throw error
    }
    return data
}

// Command for showing the history changes for a given campus
export const fetchCampusLogHistory = async (campusId) => {
    const { data, error } = await supabase
        .from('university_edit_logs')
        .select(`
            action,
            edit_time,
            message,
            Users (
                first_name,
                last_name
            )
        `)
        .eq('university_id', campusId)
        .order('edit_time', { ascending: false });

    if (error) {
        throw error;
    }
    return data;
}

// Command to fetch the history changes for a given study location
export const fetchStudyLocationLogHistory = async (studyLocationId) => {
    const { data, error } = await supabase
        .from('study_location_edit_logs')
        .select(`
        action,
        edit_time,
        message,
        Users (
            first_name,
            last_name
        )
    `).eq('study_location_id', studyLocationId)
        .order('edit_time', { ascending: false });
    if (error)
        throw error
    return data
}

const studyLocationImageUpdate = async (studyLocationID, studyLocationData) => {
    const filePath = `${studyLocationID}/location_image`;

    if (studyLocationData.image) {
        const { error: uploadError } = await supabase.storage
            .from('study_location_image')
            .upload(filePath, studyLocationData.image, {
                upsert: true
            })
        if (uploadError) {
            throw uploadError;
        }
    }

    const { data: publicURLData, error: publicURLError } = supabase.storage
        .from('study_location_image')
        .getPublicUrl(filePath);
    if (publicURLError) {
        throw publicURLError
    }

    const newPublicURL = publicURLData.publicUrl + `?t=${new Date().getTime()}`;

    return newPublicURL; // Return the url
}

// Used for updating the image of a university, and then return the new URL created to be inserted into the database
const universityImageUpdate = async (uniID, uniData) => {
    const filePath = `${uniID}/university_image`; // Use a consistent file name

    if (uniData.image) {
        // Upload the new image file with the consistent name
        const { error: uploadError } = await supabase.storage
            .from('university_images')
            .upload(filePath, uniData.image, {
                upsert: true
            });
        if (uploadError) {
            throw uploadError;
        }
    }

    // Get the public URL with the consistent file path
    const { data: publicURLData, error: publicURLError } = supabase.storage
        .from('university_images')
        .getPublicUrl(filePath);

    if (publicURLError) {
        throw publicURLError;
    }

    const newPublicURL = publicURLData.publicUrl + `?t=${new Date().getTime()}`; // Add timestamp to URL

    return newPublicURL;
};


// Command for updating a study location request
export const studyRequestCommand = async (id, status, data, oldStudyLocationDetails, adminId) => {
    const changes = {}
    if (status !== oldStudyLocationDetails.status) {
        changes.status = { old: oldStudyLocationDetails.status, new: status }
    }
    if (data.latitude !== oldStudyLocationDetails.latitude) {
        changes.latitude = { old: oldStudyLocationDetails.latitude === null ? "Null" : oldStudyLocationDetails.latitude, new: data.latitude }
    }
    if (data.longitude !== oldStudyLocationDetails.longitude) {
        changes.longitude = { old: oldStudyLocationDetails.longitude === null ? "Null" : oldStudyLocationDetails.longitude, new: data.longitude }
    }
    if (data.address !== oldStudyLocationDetails.address) {
        changes.address = { old: oldStudyLocationDetails.address === null ? "Null" : oldStudyLocationDetails.address, new: data.address }
    }
    if (data.city !== oldStudyLocationDetails.city) {
        changes.city = { old: oldStudyLocationDetails.city, new: data.city }
    }
    if (data.state_id !== oldStudyLocationDetails.state_id) {
        changes.state_id = { old: oldStudyLocationDetails.state_id, new: data.state_id }
    }
    if (data.zipcode !== oldStudyLocationDetails.zipcode) {
        changes.zipcode = { old: oldStudyLocationDetails.zipcode === null ? "Null" : oldStudyLocationDetails.zipcode, new: data.zipcode }
    }
    if (data.name !== oldStudyLocationDetails.name) {
        changes.name = { old: oldStudyLocationDetails.name, new: data.name }
    }
    if (data.university_id !== oldStudyLocationDetails.university_id) {
        changes.university_id = { old: oldStudyLocationDetails.university_id, new: data.university_id }
    }
    if (data.image) {
        changes.image = { old: "Deleted", new: "Uploaded new image" }
    }

    let image_url = oldStudyLocationDetails.image_url
    if (data.image) {
        image_url = await studyLocationImageUpdate(id, data)
    }

    if (Object.keys(changes).length > 0) {
        const logEntry = {
            study_location_id: id,
            edited_by: adminId,
            action: changes,
            message: data.message,
            edit_time: new Date().toISOString(),
        };

        const { error: logError } = await supabase
            .from('study_location_edit_logs')
            .insert(logEntry)
        if (logError) {
            throw logError;
        }
    }

    const { error: updateError } = await supabase
        .from('StudyLocation')
        .update({
            status: status,
            latitude: data.latitude,
            longitude: data.longitude,
            address: data.address,
            zipcode: data.zipcode,
            city: data.city,
            state_id: data.state_id,
            name: data.name,
            university_id: data.university_id,
            image_url: image_url,
        })
        .eq('id', id);

    if (updateError) {
        throw updateError;
    }

    return "Success";
}

// Command for updating a campus request
export const uniRequestCommand = async (id, status, data, oldCampusDetails, adminId) => {
    // Track changes
    const changes = {};
    if (data.name !== oldCampusDetails.name) {
        changes.status = { old: oldCampusDetails.name, new: data.name };
    }
    if (status !== oldCampusDetails.status) {
        changes.status = { old: oldCampusDetails.status, new: status };
    }
    if (data.latitude !== oldCampusDetails.latitude) {
        changes.latitude = { old: oldCampusDetails.latitude === null ? "Null" : oldCampusDetails.latitude, new: data.latitude };
    }
    if (data.longitude !== oldCampusDetails.longitude) {
        changes.longitude = { old: oldCampusDetails.longitude === null ? "Null" : oldCampusDetails.longitude, new: data.longitude };
    }
    if (data.school_hex_color !== oldCampusDetails.school_hex_color) {
        changes.school_hex_color = { old: oldCampusDetails.school_hex_color === null ? "Null" : oldCampusDetails.school_hex_color, new: data.school_hex_color };
    }
    if (data.address !== oldCampusDetails.address) {
        changes.address = { old: oldCampusDetails.address === null ? "Null" : oldCampusDetails.address, new: data.address };
    }
    if (data.city !== oldCampusDetails.city) {
        changes.city = { old: oldCampusDetails.city, new: data.city, note: "The hyphen is used for a delimiter" };
    }
    if (data.states_id !== oldCampusDetails.states_id) {
        changes.states_id = { old: oldCampusDetails.states_id, new: data.states_id };
    }
    if (data.zipcode !== oldCampusDetails.zipcode) {
        changes.zipcode = { old: oldCampusDetails.zipcode === null ? "Null" : oldCampusDetails.zipcode, new: data.zipcode };
    }
    if (data.image) {
        changes.image = { old: "Deleted", new: "Uploaded new image" };
    }

    let imageUrl = oldCampusDetails.image_url;
    if (data.image) {
        imageUrl = await universityImageUpdate(id, data);
    }


    if (Object.keys(changes).length > 0) {
        const logEntry = {
            university_id: id,
            edited_by: adminId,
            action: changes,
            message: data.message,
            edit_time: new Date().toISOString(),
        };

        const { error: logError } = await supabase
            .from('university_edit_logs')
            .insert(logEntry)
        if (logError) {
            throw logError;
        }
    }


    // Update the University table
    const { error: updateError } = await supabase
        .from('University')
        .update({
            name: data.name,
            status: status,
            latitude: data.latitude,
            longitude: data.longitude,
            school_hex_color: data.school_hex_color,
            address: data.address,
            zipcode: data.zipcode,
            city: data.city,
            states_id: data.states_id,
            image_url: imageUrl,
        })
        .eq('id', id);

    if (updateError) {
        throw updateError;
    }

    return "Success";
};



