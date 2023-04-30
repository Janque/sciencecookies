import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from './firebase';

export async function deleteCookieMedia(cookieId, fileName) {
    await deleteObject(ref(storage, 'cookieMedia/' + cookieId + '/' + fileName));
}

export async function addCookieMedia(cookieId, file, progress, onError, localMedia, setLocalMedia) {
    let atempt = 0;
    while (atempt != -1) {
        const medRef = ref(storage, 'cookieMedia/' + cookieId + '/i' + atempt + file.name);
        try {
            await getDownloadURL(medRef);
            atempt++;
        } catch (err) {
            let medName = 'i' + atempt + file.name;
            atempt = -1;
            if (err.code == 'storage/object-not-found') {
                uploadBytesResumable(medRef, file).on('state_changed', progress, onError,
                    async () => {
                        let medUrl = await getDownloadURL(medRef);
                        let m = localMedia.slice();
                        m.push({
                            medFile: medName,
                            medUrl: medUrl
                        });
                        setLocalMedia(m);
                    });
            } else {
                onError(err);
            }
        }
    }
}