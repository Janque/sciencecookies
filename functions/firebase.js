import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
const firebaseConfig = {
    databaseURL: "https://science-cookies.firebaseio.com",
    storageBucket: "science-cookies.appspot.com"
};
export const firebaseApp = initializeApp(firebaseConfig);

//export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
//export const database = getDatabase(firebaseApp);
//export const storage = getStorage(firebaseApp);