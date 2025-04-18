import { format, parse } from 'date-fns';

export const dayOrder = {
    'Monday': { order: 1, abr: 'Mon' },
    'Tuesday': { order: 2, abr: 'Tue' },
    'Wednesday': { order: 3, abr: 'Wed' },
    'Thursday': { order: 4, abr: 'Thu' },
    'Friday': { order: 5, abr: 'Fri' },
    'Saturday': { order: 6, abr: 'Sat' },
    'Sunday': { order: 7, abr: 'Sun' }
};


export function extractHours(studyHours) {
    if (!studyHours || studyHours.length === 0) return { today: null, sortedHours: [] };

    const currDayTime = format(new Date(), 'HH:mm:ss');
    const currentDay = format(new Date(), 'EEEE');

    const todayHours = studyHours.filter(data => data.day_of_week === currentDay) || [];
    const sortedHours = [...studyHours].sort((a, b) => dayOrder[a.day_of_week].order - dayOrder[b.day_of_week].order);

    const formattedTodayHours = todayHours.map(data => ({
        day: data.day_of_week,
        open: format(parse(data.start_time, 'HH:mm:ss', new Date()), 'hh:mm a'),
        close: format(parse(data.end_time, 'HH:mm:ss', new Date()), 'hh:mm a'),
        isClosed: currDayTime < data.start_time || currDayTime > data.end_time
    }));

    const formattedSortedHours = sortedHours.map(data => ({
        day: data.day_of_week,
        abbreviation: dayOrder[data.day_of_week].abr,
        open: format(parse(data.start_time, 'HH:mm:ss', new Date()), 'hh:mm a'),
        close: format(parse(data.end_time, 'HH:mm:ss', new Date()), 'hh:mm a'),
    }));

    return { today: formattedTodayHours, sortedHours: formattedSortedHours, nextOpen: getNextOpenDay(sortedHours, currentDay) };
}


function getNextOpenDay(sortedHours, currentDay) {
    const todayIndex = dayOrder[currentDay].order;

    // Start at the current index, and loop through the week to find the day
    for (let i = todayIndex; i <= 7; i++) {
        const nextIndex = (i % 7) + 1;
        const nextDay = sortedHours.find(data => dayOrder[data.day_of_week].order === nextIndex);
        if (nextDay) return { day: nextDay.day_of_week, open: format(parse(nextDay.start_time, 'HH:mm:ss', new Date()), 'hh:mm a') };
    }

    return null; // No future opening found
}

export function getAvailableDays(studyHours) {
    const allDays = Object.keys(dayOrder);
    const selectedDays = studyHours.map(data => data.day_of_week);
    return allDays.filter(day => !selectedDays.includes(day));
}




