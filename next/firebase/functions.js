import { functions } from './firebase';
import { httpsCallable } from 'firebase/functions';

export async function translateSimple(text, from, target) {
    var translate = httpsCallable(functions, 'translations-translateSimple');
    let res = await translate({
        text: text,
        from: from,
        target: target
    });
    return res.data;
}