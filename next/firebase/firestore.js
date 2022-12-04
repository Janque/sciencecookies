import { firestore } from './firebase';
import { getDocs, query, collection, where, orderBy, limit, getDoc, doc as docRef, getCountFromServer } from 'firebase/firestore';
import { addKeywordsToStats } from './database';


export const cookiesFSColl = {
    es: collection(firestore, 'cookies/langs/es'),
    en: collection(firestore, 'cookies/langs/en')
};

export const calendarsFSColl = {
    es: collection(firestore, 'calendars/langs/es'),
    en: collection(firestore, 'calendars/langs/en')
};

export const indexPreviewLim = 20;

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

export async function getConfigCatsList() {
    const doc = await getDoc(docRef(firestore, 'config', 'cats'));
    const data = doc.data();
    return {
        es: data.es,
        en: data.en
    }
}

export async function getConfigCatTranslations() {
    const doc = await getDoc(docRef(firestore, 'config', 'cats'));
    const data = doc.data();
    return {
        configCatsTranslations: data.catTranslations
    }
}

export async function getIndexSearch(locale, keywords, order, desc, paged = false, paglast = null) {
    let srchQuery;
    if (paged && paglast) {
        if (!desc) {
            srchQuery = query(cookiesFSColl[locale], where('public', '==', true), where('cats', 'array-contains-any', keywords), orderBy(order), startAfter(paglast), limit(indexPreviewLim));
        } else {
            srchQuery = query(cookiesFSColl, where('public', '==', true), where('cats', 'array-contains-any', keywords), orderBy(order, 'desc'), startAfter(paglast), limit(indexPreviewLim));
        }
    } else {
        if (!desc) {
            srchQuery = query(cookiesFSColl[locale], where('public', '==', true), where('cats', 'array-contains-any', keywords), orderBy(order), limit(indexPreviewLim));
        } else {
            srchQuery = query(cookiesFSColl[locale], where('public', '==', true), where('cats', 'array-contains-any', keywords), orderBy(order, 'desc'), limit(indexPreviewLim));
        }
    }
    const snap = await getDocs(srchQuery);
    const countSnap = paged || await getCountFromServer(query(cookiesFSColl[locale], where('public', '==', true), where('cats', 'array-contains-any', keywords)));
    const resultCount = countSnap !== true ? countSnap.data().count : 0;
    if (!paged) await addKeywordsToStats(keywords);
    return {
        docs: JSON.parse(JSON.stringify(snap.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            };
        }))),
        resultCount: resultCount
    }
}