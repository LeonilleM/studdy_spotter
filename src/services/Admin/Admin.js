// Used to store fetching for Request Forms for Study Locations & Universities
// Also stores all approval functions

import { supabase } from '../supabase/supabase'

export const fetchStudyRequest = async () => {
    // Fetch data from studylocationrequest
    const { data: studyLocationRequests, error: studyLocationRequestError } = await supabase
        .from('studylocationrequest')
        .select(`
            *,
            States (
                abr
            )
        `);

    if (studyLocationRequestError) {
        throw studyLocationRequestError;
    }

    // Fetch data from StudyLocation with tags
    const { data: studyLocations, error: studyLocationError } = await supabase
        .from('StudyLocation')
        .select(`
            *,
            States (
            name,
                abr
            ),
            LocationTagList (
                TagTypes (
                    id
                )
            )
        `);

    if (studyLocationError) {
        throw studyLocationError;
    }

    // Add missing fields to studyLocations to match the structure of studyLocationRequests
    const formattedStudyLocations = studyLocations.map(location => ({
        ...location,
        status: 'Approved',
        reviewed_at: null,
        reviewed_by: null,
        description: null,
        locationtag: location.LocationTagList.map(tag => tag.TagTypes.id) // Extract tag id
    }));

    // Combine the results
    const combinedResults = [...studyLocationRequests, ...formattedStudyLocations];

    // Extract all tag IDs from the combined results
    const allTagIds = combinedResults.flatMap(request => request.locationtag).filter(tag => tag !== null);

    // Fetch tags from corresponding tag IDs
    const { data: tags, error: tagError } = await supabase
        .from('TagTypes')
        .select('id, name')
        .in('id', allTagIds);

    if (tagError) {
        throw tagError;
    }

    // Map tag IDs to tag names
    const tagMap = tags.reduce((acc, tag) => {
        acc[tag.id] = tag.name;
        return acc;
    }, {});

    // Map tag IDs to tag names in the combined results
    combinedResults.forEach(request => {
        request.locationtag = request.locationtag.map(tagId => tagMap[tagId]);
    });


    return combinedResults;
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