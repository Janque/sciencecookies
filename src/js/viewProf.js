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
    $('#navBtnPrfl').addClass('active');
    getDownloadURL(storageRef(STORAGE, 'ppics/' + urlSrch.get('u') + '/pp_200x200')).then(url => {
        if (userPublic.ppic != null) $('#disPP').attr('onerror', "this.src='" + userPublic.ppic + "'");
        else $('#disPP').attr('onerror', "this.src='https://via.placeholder.com/20.webp'");
        $('#disPP').src = url;
        if (userPublic.pemail != null) $('#contEmail').show();
        $('#disMail').html(userPublic.pemail);
        $('#disName').html(userPublic.pname);
        $('#crdPrfl').show();
    }).catch(err => {
        if (userPublic.ppic != null) $('#disPP').attr('onerror', "this.src='" + userPublic.ppic + "'");
        else $('#disPP').attr('onerror', "https://via.placeholder.com/20.webp'");
        $('#disPP').src = '';
        if (userPublic.pemail != null) $('#contEmail').show();
        $('#disMail').html(userPublic.pemail);
        $('#disName').html(userPublic.pname);
        $('#crdPrfl').show();
    });
}
function shwFav() {
    if (userPublic.favn == null) return;
    $('#navBtnFav').addClass('active');
    let favStr = '';
    userPublic.favn.forEach(function (itm, idx) {
        if (userData.favl[idx][0] == '2') {
            favStr += '<li class="list-group-item text-light border-light bg-transparent"><a class="text-decoration-none text-light" href="galletas/' + useruserPublic.favl[idx] + '">' + itm + ' <i class="fas fa-link"></i></a></li>';
        } else {
            favStr += '<li class="list-group-item text-light border-light bg-transparent"><a class="text-decoration-none text-light" href="' + useruserPublic.favl[idx] + '">' + itm + ' <i class="fas fa-link"></i></a></li>';
        }
    });
    $('#cntFav').html(favStr);
    $('#crdFav').show();
}
function shwLike() {
    if (userPublic.likedn == null) return;
    $('#navBtnLike').addClass('active');
    let likedStr = '';
    userPublic.likedn.forEach(function (itm, idx) {
        if (userData.likedl[idx][0] == '2') {
            likedStr += '<li class="list-group-item text-light border-light bg-transparent"><a class="text-decoration-none text-light" href="galletas/' + userPublic.likedl[idx] + '">' + itm + ' <i class="fas fa-link"></i></a></li>';
        } else {
            likedStr += '<li class="list-group-item text-light border-light bg-transparent"><a class="text-decoration-none text-light" href="' + userPublic.likedl[idx] + '">' + itm + ' <i class="fas fa-link"></i></a></li>';
        }
    });
    $('#cntLike').html(likedStr);
    $('#crdLike').show();
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
                disableBtn($('#navBtnFav'));
                disableBtn($('#navBtnLike'));
                disableBtn($('#navBtnPrfl'));
                $('#contEmail').hide();
                $('#contPic').hide();
                if (lang == "es") {
                    $('#contNull').html('<div class="col"><strong>Este perfíl no existe o es privado</strong></div>');
                } else if (lang == "en") {
                    $('#contNull').html('<div class="col"><strong>This profile does not exist or it is private.</strong></div>');
                }
                $('#crdPrfl').show();
            } else {
                if (userPublic.favn == null) {
                    disableBtn($('#navBtnFav'));
                    disableBtn($('#navBtnLike'));
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
        $('#crdPrfl').hide();
        $('#navBtnPrfl').removeClass('active');
        $('#crdLike').hide();
        $('#navBtnLike').removeClass('active');
        shwFav();
    } else {
        if (t == 'likes') {
            if (userPublic.likedn == null) return;
            $('#crdFav').hide();
            $('#navBtnFav').removeClass('active');
            $('#crdPrfl').hide();
            $('#navBtnPrfl').removeClass('active');
            shwLike();
        } else {
            $('#crdFav').hide();
            $('#navBtnFav').removeClass('active');
            $('#crdLike').hide();
            $('#navBtnLike').removeClass('active');
            shwPrfl();
        }
    }
}