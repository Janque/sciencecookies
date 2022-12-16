import { database } from './firebase';
import { get, ref, set, increment } from "firebase/database";

export async function addKeywordsToStats(keywords) {
    for (let i = 0; i < keywords.length; i++) {
        let itm = keywords[i];
        if (itm == '' || itm == ' ') continue;
        await set(ref(database, 'searchQs/' + itm + '/count'), increment(1));
    }
    return;
}

export async function getTodaysID() {
    const snap = await get(ref(database, 'tdaysID'));
    let today = snap.val(), id;
    today.last++;
    id = today.today;
    if (today.last < 10) id += '0';
    id += today.last;
    set(ref(database, 'tdaysID/last'), increment(1));
    return id;
}