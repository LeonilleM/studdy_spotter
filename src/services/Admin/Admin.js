// Used to store fetching for Request Forms for Study Locations & Universities
// Also stores all approval functions

import { supabase } from '../supabase/supabase'

export const fetchStudyRequest = async () => {
    const { data: studyRequests, error: studyRequestError } = await supabase
        .from('studylocationrequest')
        .select(`
            *,
            Users:submitted_by (
                first_name,
                last_name,
                University:university_id (
                    name
                )
            ),
            University:university_id (
                name,
                city
            )
        `);

    if (studyRequestError) {
        throw studyRequestError;
    }

    // Extract all tag IDs from the study requests
    const allTagIds = studyRequests.flatMap(request => request.locationtag);

    // Fetch the TagTypes based on the extracted tag IDs
    const { data: tagTypes, error: tagTypesError } = await supabase
        .from('TagTypes')
        .select('*')
        .in('id', allTagIds);

    if (tagTypesError) {
        throw tagTypesError;
    }

    // Create a map of tag IDs to tag names
    const tagMap = tagTypes.reduce((acc, tag) => {
        acc[tag.id] = tag.name;
        return acc;
    }, {});

    // Add the tag names to the study requests
    const studyRequestsWithTags = studyRequests.map(request => ({
        ...request,
        tagNames: request.locationtag.map(tagId => tagMap[tagId])
    }));

    return studyRequestsWithTags;
}


export const fetchUniversityRequest = async () => {
    const { data, error } = await supabase
        .from('University')
        .select('*, States(name, abr)')
        .eq('status', 'Pending')
    if (error) {
        throw error
    }
    console.log(data)
    return data

}