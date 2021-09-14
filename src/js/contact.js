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

import { getFirestore, addDoc, collection } from "firebase/firestore/lite";
const FSDB = getFirestore();

var urlSrch;
window.loaded = function loaded() {
    urlSrch = new URLSearchParams(location.search);
    if (urlSrch.get('sub') == 'suger' || urlSrch.get('sub') == 'fallo' || urlSrch.get('sub') == 'tos' || urlSrch.get('sub') == 'priv' || urlSrch.get('sub') == 'otro') $('#inO' + urlSrch.get('sub')).selected = true;

    $('#inEmail').value = email;

    function send() {
        addDoc(collection(FSDB, 'messages'), {
            from: email,
            subject: $('#inSubj').value,
            mess: $('#inText').value,
        }).then(res => {
            if (lang == "es") {
                alertTop("Gracias por tu mensaje, se ha enviado correctamente.", 1);
            } else if (lang == "en") {
                alertTop("Thank you for your message, it was sent successfully.", 1);
            }
        }).catch(function (err) {
            if (lang == "es") {
                alertTop("Ha ocurrido un error, por favor intenta nuevamente.", 0);
            } else if (lang == "en") {
                alertTop("There has been an error, please try again.", 0);
            }
        })
    }
    $("#frmCont").addEventListener("submit", function (event) {
        event.preventDefault();
        send();
    });
}