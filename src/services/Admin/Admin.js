// Used to store fetching for Request Forms for Study Locations & Universities
// Also stores all approval functions

import { supabase } from '../supabase/supabase'

export const fetchStudyRequest = async () => {
    // Fetch data from studylocationrequest
    const { data, error } = await supabase
        .from('StudyLocation')
        .select('*, University(name),  States(abr)')
    if (error) {
        throw error
    }

    return data

}

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


// Command for updating a campus request
export const uniRequestCommand = async (id, status, data, oldCampusDetails, adminId) => {
    // Track changes
    const changes = {};
    if (status !== oldCampusDetails.status) {
        changes.status = { old: oldCampusDetails.status, new: status };
    }
    if (data.latitude !== oldCampusDetails.latitude) {
        changes.latitude = { old: oldCampusDetails.latitude, new: data.latitude };
    }
    if (data.longitude !== oldCampusDetails.longitude) {
        changes.longitude = { old: oldCampusDetails.longitude, new: data.longitude };
    }
    if (data.school_hex_color !== oldCampusDetails.school_hex_color) {
        changes.school_hex_color = { old: oldCampusDetails.school_hex_color, new: data.school_hex_color };
    }

    // Insert the edit log only if there are changes
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
            .insert(logEntry);

        if (logError) {
            throw logError;
        }
    }

    // Update the University table
    const { error: updateError } = await supabase
        .from('University')
        .update({
            status: status,
            latitude: data.latitude,
            longitude: data.longitude,
            school_hex_color: data.school_hex_color,
        })
        .eq('id', id);

    if (updateError) {
        throw updateError;
    }

    return "Success";
};



// Command for updating a study location request
export const studyLocationRequestCommand = async (id, data, oldStudyLocationDetails, adminId) => {
}
