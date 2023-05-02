import { firestore } from './firebase';
import { getDocs, query, collection, where, orderBy, limit, getDoc, doc as docRef, getCountFromServer, startAfter, setDoc, Timestamp, onSnapshot, updateDoc } from 'firebase/firestore';
import { addKeywordsToStats } from './database';
import { translateSimple } from './functions';
import { ultraClean } from '../lib/utils';


export const cookiesFSColl = {
    es: collection(firestore, 'cookies/langs/es'),
    en: collection(firestore, 'cookies/langs/en')
};

export const calendarsFSColl = {
    es: collection(firestore, 'calendars/langs/es'),
    en: collection(firestore, 'calendars/langs/en')
};

export const indexPreviewLim = 20;

export const draftsPreviewLim = 21;

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

export async function getConfigLanguages() {
    const doc = await getDoc(docRef(firestore, 'config', 'langs'));
    const data = doc.data();
    return data.langs;
}

export async function getConfigAuthors() {
    const doc = await getDoc(docRef(firestore, 'config', 'authors'));
    const data = doc.data();
    return data.authors;
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
        let lastDoc = await getDoc(docRef(cookiesFSColl[locale], paglast));
        if (!desc) {
            srchQuery = query(cookiesFSColl[locale], where('public', '==', true), where('cats', 'array-contains-any', keywords), orderBy(order), startAfter(lastDoc), limit(indexPreviewLim));
        } else {
            srchQuery = query(cookiesFSColl[locale], where('public', '==', true), where('cats', 'array-contains-any', keywords), orderBy(order, 'desc'), startAfter(lastDoc), limit(indexPreviewLim));
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

export async function getDraftsSearch(locale, keywords, order, desc, spaced = 0, paged = false, paglast = null) {
    let srchQuery, countQuery;
    if (paged && paglast) {
        let lastDoc = await getDoc(docRef(cookiesFSColl[locale], paglast));
        if (keywords) {
            if (!desc) {
                srchQuery = query(cookiesFSColl[locale], where('title', '==', keywords), orderBy(order), startAfter(lastDoc), limit(draftsPreviewLim - spaced));
            } else {
                srchQuery = query(cookiesFSColl[locale], where('title', '==', keywords), orderBy(order, 'desc'), startAfter(lastDoc), limit(draftsPreviewLim - spaced));
            }
        } else {
            if (!desc) {
                srchQuery = query(cookiesFSColl[locale], orderBy(order), startAfter(lastDoc), limit(draftsPreviewLim - spaced));
            } else {
                srchQuery = query(cookiesFSColl[locale], orderBy(order, 'desc'), startAfter(lastDoc), limit(draftsPreviewLim - spaced));
            }
        }
    } else {
        if (keywords) {
            countQuery = query(cookiesFSColl[locale], where('title', '==', keywords));
            if (!desc) {
                srchQuery = query(cookiesFSColl[locale], where('title', '==', keywords), orderBy(order), limit(draftsPreviewLim - spaced));
            } else {
                srchQuery = query(cookiesFSColl[locale], where('title', '==', keywords), orderBy(order, 'desc'), limit(draftsPreviewLim - spaced));
            }
        } else {
            countQuery = query(cookiesFSColl[locale]);
            if (!desc) {
                srchQuery = query(cookiesFSColl[locale], orderBy(order), limit(draftsPreviewLim - spaced));
            } else {
                srchQuery = query(cookiesFSColl[locale], orderBy(order, 'desc'), limit(draftsPreviewLim - spaced));
            }
        }
    }
    const snap = await getDocs(srchQuery);
    const countSnap = paged || await getCountFromServer(countQuery);
    const resultCount = countSnap !== true ? countSnap.data().count : 0;
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

export async function getDraftsCalSearch(locale, paged = false, paglast = null) {
    let srchQuery;
    if (paged && paglast) {
        let lastDoc = await getDoc(docRef(calendarsFSColl[locale], paglast));
        srchQuery = query(calendarsFSColl[locale], orderBy('published', 'desc'), startAfter(lastDoc), limit(draftsPreviewLim));
    } else {
        srchQuery = query(calendarsFSColl[locale], orderBy('published', 'desc'), limit(draftsPreviewLim));
    }
    const snap = await getDocs(srchQuery);
    const countSnap = paged || await getCountFromServer(query(calendarsFSColl[locale]));
    const resultCount = countSnap !== true ? countSnap.data().count : 0;
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

export async function userIsMod(uid) {
    const doc = await getDoc(docRef(firestore, 'users/' + uid));
    const data = doc.data();
    return data.role == 'admin' || data.role == 'mod';
}

export async function cookieExists(locale, file) {
    const snap = await getDocs(query(cookiesFSColl[locale], where('fileTranslations.' + locale, '==', file), limit(1)));
    return !snap.empty;
}

export function createCookie(locale, id, author, title, file, uid) {
    return setDoc(docRef(cookiesFSColl[locale], id), {
        authors: [author],
        cont: [
            {
                type: "head",
                title: title,
                author: [author]
            },
            {
                type: "ref",
                ref: []
            }
        ],
        media: [],
        picUrl: "",
        title: title,
        description: "",
        owner: uid,
        java: "",
        revised: {},
        notify: false,
        public: false,
        beenPublic: false,
        dledit: false,
        created: Timestamp.now(),
        ledit: Timestamp.now(),
        published: Timestamp.now(),
        pop: 0,
        likes: 0,
        favs: 0,
        fixedCats: [],
        cats: [],
        fileTranslations: {
            es: file,
            en: file
        }
    });
}

export function getCookieEdit(locale, id, setCookie, setLoading) {
    const unsubscribe = onSnapshot(docRef(cookiesFSColl[locale], id), doc => {
        setCookie(doc.data());
        setLoading(false);
    });
    return unsubscribe;
}

export async function uploadCookie(locale, id, data) {
    data.ledit = Timestamp.now();
    await updateDoc(docRef(cookiesFSColl[locale], id), data);
}

export async function translateTopForm(from, to, id) {
    const doc = await getDoc(docRef(cookiesFSColl[from], id));
    const data = doc.data();
    let file = await translateSimple(data.fileTranslations[from], from, to);
    file = ultraClean(file, '-', true, true);
    let desc = await translateSimple(data.description, from, to);
    return {
        file: file,
        description: desc
    }
}

export async function translateSection(from, to, id, sectIdx, type) {
    const doc = await getDoc(docRef(cookiesFSColl[from], id));
    let section = doc.data().cont[sectIdx];
    if (type != section.type) return { error: 'type mismatch' };
    if (section.type == 'head') {
        section.title = await translateSimple(section.title, from, to);
    } else if (section.type == 'html') {
        section.html = await translateSimple(section.html, from, to);
    } else if (section.type == 'parra') {
        section.text = await translateSimple(section.text, from, to);
        if (section.title != "0") {
            section.titleTxt = await translateSimple(section.titleTxt, from, to);
        } else {
            section.titleTxt = '';
        }
    } else if (section.type == 'medSimple') {
        section.alt = await translateSimple(section.alt, from, to);
        section.caption = await translateSimple(section.caption, from, to);
    }
    return section;
}