import { database } from './firebase';
import { ref, set, increment } from "firebase/database";

export async function addKeywordsToStats(keywords) {
    for (let i = 0; i < keywords.length; i++) {
        let itm = keywords[i];
        if (itm == '' || itm == ' ') continue;
        await set(ref(database, 'searchQs/' + itm + '/count'), increment(1));
    }
    return;
}