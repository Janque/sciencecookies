import { getAuth, onAuthStateChanged } from "firebase/auth";
const AUTH = getAuth();

var uid;
onAuthStateChanged(AUTH, (user) => {
    let modAuth = firebase.app().functions('us-east1').httpsCallable('publish-modAuth');
    if (user) {
        uid = user.uid;
        modAuth(uid).then(res => {
            if (!res.data.mod) window.location.href = 'https://sciencecookies.net';
        }).catch(err => console.log(err));
    } else {
        window.location.href = 'https://sciencecookies.net';
    }
});