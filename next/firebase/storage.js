import { deleteObject, ref } from 'firebase/storage';
import { storage } from './firebase';

export async function deleteCookieMedia(cookieId, file) {
    await deleteObject(ref(storage, 'cookieMedia/' + cookieId + '/' + file));
}