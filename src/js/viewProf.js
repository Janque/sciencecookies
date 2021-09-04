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

import { getFunctions, httpsCallable } from "firebase/functions";
const FUNCTIONS = getFunctions(firebaseApp, 'us-east1');

import { getStorage, ref as storageRef, getDownloadURL } from "firebase/storage";
const STORAGE = getStorage();

//Global
var userPublic, gotFL = false;

var urlSrch;
window.loaded = function loaded() {
    urlSrch = new URLSearchParams(location.search);
    shwCrds(urlSrch.get('tab'), urlSrch.get('user'));
}

function shwPrfl() {
    document.getElementById('navBtnPrfl').classList.add('active');
    getDownloadURL(storageRef(STORAGE, 'ppics/' + urlSrch.get('u') + '/pp_200x200')).then(url => {
        if (userPublic.ppic != null) document.getElementById('disPP').setAttribute('onerror', "this.src='" + userPublic.ppic + "'");
        else document.getElementById('disPP').setAttribute('onerror', "this.src='https://via.placeholder.com/20.webp'");
        document.getElementById('disPP').src = url;
        if (userPublic.pemail != null) document.getElementById('contEmail').classList.remove('d-none');
        document.getElementById('disMail').innerHTML = userPublic.pemail;
        document.getElementById('disName').innerHTML = userPublic.pname;
        document.getElementById('crdPrfl').classList.remove('d-none');
    }).catch(err => {
        if (userPublic.ppic != null) document.getElementById('disPP').setAttribute('onerror', "this.src='" + userPublic.ppic + "'");
        else document.getElementById('disPP').setAttribute('onerror', "https://via.placeholder.com/20.webp'");
        document.getElementById('disPP').src = '';
        if (userPublic.pemail != null) document.getElementById('contEmail').classList.remove('d-none');
        document.getElementById('disMail').innerHTML = userPublic.pemail;
        document.getElementById('disName').innerHTML = userPublic.pname;
        document.getElementById('crdPrfl').classList.remove('d-none');
    });
}
function shwFav() {
    if (userPublic.favn == null) return;
    document.getElementById('navBtnFav').classList.add('active');
    let favStr = '';
    userPublic.favn.forEach(function (itm, idx) {
        favStr = favStr + '<li class="list-group-item text-light border-light bg-transparent"><a class="text-decoration-none text-light" href="galletas/' + userPublic.favl[idx] + '">' + itm + ' <i class="fas fa-link"></i></a></li>';
    });
    document.getElementById('cntFav').innerHTML = favStr;
    document.getElementById('crdFav').classList.remove('d-none');
}
function shwLike() {
    if (userPublic.likedn == null) return;
    document.getElementById('navBtnLike').classList.add('active');
    let likedStr = '';
    userPublic.likedn.forEach(function (itm, idx) {
        likedStr = likedStr + '<li class="list-group-item text-light border-light bg-transparent"><a class="text-decoration-none text-light" href="galletas/' + userPublic.likedl[idx] + '">' + itm + ' <i class="fas fa-link"></i></a></li>';
    });
    document.getElementById('cntLike').innerHTML = likedStr;
    document.getElementById('crdLike').classList.remove('d-none');
}
window.shwCrds = function shwCrds(t, u) {
    if ((u == null || u == '') && !gotFL) {
        window.location.href = 'https://sciencecookies.net';
    }
    if (t == null || userPublic.favn == null) t = 'prof';
    if (gotFL == false) {
        const getUserPublic = httpsCallable(FUNCTIONS, 'users-getUserPublic');
        getUserPublic(u).then(res => {
            userPublic = res.data;
            if (userPublic == null) {
                document.getElementById('navBtnFav').classList.add('disabled');
                document.getElementById('navBtnLike').classList.add('disabled');
                document.getElementById('navBtnPrfl').classList.add('disabled');
                document.getElementById('contEmail').classList.add('d-none');
                document.getElementById('contPic').classList.add('d-none');
                if (lang == "es") {
                    document.getElementById('contNull').innerHTML = '<div class="col"><strong>Este perfíl no existe o es privado</strong></div>';
                } else if (lang == "en") {
                    document.getElementById('contNull').innerHTML = '<div class="col"><strong>This profile does not exist or it is private.</strong></div>';
                }
                document.getElementById('crdPrfl').classList.remove('d-none');
            } else {
                if (userPublic.favn == null) {
                    document.getElementById('navBtnFav').classList.add('disabled');
                    document.getElementById('navBtnLike').classList.add('disabled');
                }
                shwCrds2(t);
            }
        }).catch(err => { console.log('err') });
        gotFL = true;
    } else {
        shwCrds2(t);
    }
}
function shwCrds2(t) {
    if (t == 'favs') {
        if (userPublic.favn == null) return;
        document.getElementById('crdPrfl').classList.add('d-none');
        document.getElementById('navBtnPrfl').classList.remove('active');
        document.getElementById('crdLike').classList.add('d-none');
        document.getElementById('navBtnLike').classList.remove('active');
        shwFav();
    } else {
        if (t == 'likes') {
            if (userPublic.likedn == null) return;
            document.getElementById('crdFav').classList.add('d-none');
            document.getElementById('navBtnFav').classList.remove('active');
            document.getElementById('crdPrfl').classList.add('d-none');
            document.getElementById('navBtnPrfl').classList.remove('active');
            shwLike();
        } else {
            document.getElementById('crdFav').classList.add('d-none');
            document.getElementById('navBtnFav').classList.remove('active');
            document.getElementById('crdLike').classList.add('d-none');
            document.getElementById('navBtnLike').classList.remove('active');
            shwPrfl();
        }
    }
}