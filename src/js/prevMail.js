import { initializeApp, getApps, getApp } from "firebase/app"

var firebaseConfig = {
    apiKey: "AIzaSyCc5LmjPpufLuHzR6RiXR7awOdGuWpztTk",
    authDomain: "sciencecookies.net",
    databaseURL: "https://science-cookies.firebaseio.com",
    projectId: "science-cookies",
    storageBucket: "science-cookies.appspot.com",
    messagingSenderId: "906770471712",
    appId: "1:906770471712:web:c7a2c16bac19b6c2d7d545",
    measurementId: "G-1MYVREMBFV"
};

var firebaseApp;
if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
}
else {
    firebaseApp = getApp();
}

import { getAuth, onAuthStateChanged } from "firebase/auth";
const AUTH = getAuth();

import { getFunctions, httpsCallable } from "firebase/functions";
const FUNCTIONS = getFunctions(firebaseApp, 'us-east1');

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