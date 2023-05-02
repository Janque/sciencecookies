import { functions } from './firebase';
import { httpsCallable, connectFunctionsEmulator } from 'firebase/functions';

//Dev
connectFunctionsEmulator(functions, "localhost", 5001);//*/

export async function translateSimple(text, from, target) {
    var translate = httpsCallable(functions, 'translations-translateSimple');
    let res = await translate({
        text: text,
        from: from,
        target: target
    });
    return res.data;
}

export async function translateCookie(from, target, id) {
    const translate = httpsCallable(functions, 'translations-translateFullCookie');
    return translate({
        docId: id,
        from: from,
        target: target
    });
}