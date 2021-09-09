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

import { getDatabase, ref as databaseRef, set, increment } from "firebase/database";
const RTDB = getDatabase();

import { hideEl, showEl, enable, disable } from "./global.js";


window.eventToShow = null;
window.showEvent = function showEvent() {
    eventKeys.forEach(key => {
        hideEl(document.getElementById(key));
    });
    document.getElementById('mdlEventInfoL').innerHTML = eventTitles[eventToShow];
    showEl(document.getElementById(eventToShow));
    enable(document.getElementById('btnPriorEve'));
    enable(document.getElementById('btnNextEve'));
}
document.getElementById('btnPriorEve').onclick = () => {
    let n = eventKeys.indexOf(eventToShow) - 1;
    if (n >= 0) {
        eventToShow = eventKeys[n];
        showEvent();
    } else {
        disable(document.getElementById('btnPriorEve'));
    }
};
document.getElementById('btnNextEve').onclick = () => {
    let n = eventKeys.indexOf(eventToShow) + 1;
    if (n < eventKeys.length) {
        eventToShow = eventKeys[n];
        showEvent();
    } else {
        disable(document.getElementById('btnNextEve'));
    }
};

window.loaded = function loaded() {
    set(databaseRef(RTDB, 'calendarios/' + globID + '/pop'), increment(1));
}