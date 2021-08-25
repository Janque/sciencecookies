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

import { getFirestore, addDoc, collection } from "firebase/firestore";
const FSDB = getFirestore();

var urlSrch;
window.loaded = function loaded() {
    urlSrch = new URLSearchParams(location.search);
    if (urlSrch.get('sub') == 'suger' || urlSrch.get('sub') == 'fallo' || urlSrch.get('sub') == 'tos' || urlSrch.get('sub') == 'priv' || urlSrch.get('sub') == 'otro') document.getElementById('inO' + urlSrch.get('sub')).selected = true;

    document.getElementById('inEmail').value = email;

    function send() {
        addDoc(collection(FSDB, 'messages'), {
            from: email,
            subject: document.getElementById('inSubj').value,
            mess: document.getElementById('inText').value,
        }).then(res => {
            alertTop("Gracias por tu mensaje, se ha enviado correctamente.", 1);
        }).catch(function (err) {
            alertTop("Ha ocurrido un error, por favor intenta nuevamente.", 0);
        })
    }
    document.getElementById("frmCont").addEventListener("submit", function (event) {
        event.preventDefault();
        send();
    });
}