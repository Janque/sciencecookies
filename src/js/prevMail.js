import { getAuth, onAuthStateChanged } from "firebase/auth";
const AUTH = getAuth();

import { getFunctions, httpsCallable } from "firebase/functions";
const FUNCTIONS = getFunctions();

var uid;
onAuthStateChanged(AUTH, (user) => {
    const modAuth = httpsCallable(FUNCTIONS, 'publish-modAuth');
    if (user) {
        uid = user.uid;
        modAuth(uid).then(res => {
            if (!res.data.mod) window.location.href = 'https://sciencecookies.net';
        }).catch(err => console.log(err));
    } else {
        window.location.href = 'https://sciencecookies.net';
    }
});