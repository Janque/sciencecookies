import { getDocs, query, collection, where, orderBy, limit } from 'firebase/firestore';
import { firestore } from './firebase';

export const cookiesFSColl = {
    es: collection(firestore, 'cookies/langs/es'),
    en: collection(firestore, 'cookies/langs/en')
};

export const calendarsFSColl = {
    es: collection(firestore, 'calendars/langs/es'),
    en: collection(firestore, 'calendars/langs/en')
};

//Get Sidebar Cookies and Calendar
export async function getRecommended(locale) {
    let latestCookie, mostPopularCookies = [], latestCalendar;

    const latestSnapshot = await getDocs(query(cookiesFSColl[locale], where('public', '==', true), orderBy('published', 'desc'), limit(1)));

    latestSnapshot.forEach(doc => {
        latestCookie = doc.data();
    });

    const mostPopularSnapshot = await getDocs(query(cookiesFSColl[locale], where('public', '==', true), orderBy('pop', 'desc'), limit(3)));

    mostPopularSnapshot.forEach(doc => {
        mostPopularCookies.push(JSON.parse(JSON.stringify(doc.data())));
    });

    const calendarSnapshot = await getDocs(query(calendarsFSColl[locale], where('public', '==', true), orderBy('published', 'desc'), limit(1)));

    calendarSnapshot.forEach(doc => {
        latestCalendar = doc.data();
    });

    return {
        latestCookie: JSON.parse(JSON.stringify(latestCookie)),
        mostPopularCookies: mostPopularCookies,
        latestCalendar: JSON.parse(JSON.stringify(latestCalendar))
    }
}