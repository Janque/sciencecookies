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

import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
const AUTH = getAuth();

import { getFirestore, getDoc, doc as docRef, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore/lite";
const FSDB = getFirestore();

import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
const STORAGE = getStorage();

//Global
var userData, localUserData;

var gotFL = false;
var shortID;
var fileForUp = null;

var urlSrch;
window.loaded = function loaded() {
    urlSrch = new URLSearchParams(location.search);

    //Check auth
    onAuthStateChanged(AUTH, (user) => {
        if (user) {
            $('#picUsr').attr('onerror', "this.src='https://via.placeholder.com/20.webp'");
            $('#picUsr').src = photoURL;
            shwCrds(urlSrch.get('tab'));
        } else {
            $('#mdlRgstr').modal('show');
        }
    });

    function send() {
        localUserData.name = displayName = $('#inNewNck').value;
        updateProfile(AUTH.currentUser, {
            displayName: displayName
        }).then(function () {
            return updateDoc(docRef(FSDB, 'users', uid), localUserData)
        }).then(() => {
            userData = localUserData;
            resetFrm();
            $('#disName').innerHTML = displayName;
        }).catch(function (err) { console.log(err) });
    }
    $("#frmChngNk").addEventListener("submit", function (event) {
        event.preventDefault();
        send();
        $('#mdlCngNck').modal('hide');
    });

    function uptPref() {
        updateDoc(docRef(FSDB, 'users', uid), localUserData).then(() => {
            if (userData.rNews != localUserData.rNews) {
                let newsRef = docRef(FSDB, "newsletters", "base");
                if (userData.rNews) {
                    updateDoc(newsRef, {
                        emails: arrayUnion(email)
                    });
                } else {
                    updateDoc(newsRef, {
                        emails: arrayRemove(email)
                    });
                }
            }
            userData = localUserData;
            setPrefBtns(false);
            console.log('Profile updated');
            if (lang == "es") {
                alertTop("Se han guardado los cambios", 1);
            } else if (lang == "en") {
                alertTop("Changes have been saved", 1);
            }
        }).catch(err => { console.log(err) });
    }
    $("#frmPref").addEventListener("submit", function (event) {
        event.preventDefault();
        setPrefBtns(false);
        uptPref();
    });

    function uptPP(file) {
        let ref = storageRef(STORAGE, 'ppics/' + shortID + '/pp');
        let task = uploadBytes(ref, file);
        task.on('state_changed',
            (snap) => {
                let progPer = (snap.bytesTransferred / snap.totalBytes) * 100;
                $('#prBarDis').style['width'] = progPer + '%';
            },
            (err) => {
                resetFrm();
                $('#mdlCngPP').modal('hide');
                if (lang == "es") {
                    alertTop("<strong>¡Ha ocurrido un error!</strong> Revisa que tu archivo cumpla los límites y sea una imagen e intenta de nuevo.", 2);
                } else if (lang == "en") {
                    alertTop("<strong>¡There has been an error!</strong> Check that your file meets the limits and is an image and try again.", 2);
                }
            },
            () => {
                $('#picUsr').src = $("#preVIn").src;
                $('#disPP').src = $("#preVIn").src;
                resetFrm();
                $('#mdlCngPP').modal('hide');
                getDownloadURL(ref).then(url => {
                    localUserData.pic = photoURL = url.replace('pp?', 'pp_200x200?');
                    return updateProfile(AUTH.currentUser, {
                        photoURL: photoURL
                    });
                }).then(() => {
                    return updateDoc(docRef(FSDB, "users", uid), localUserData);
                }).then(() => {
                    userData = localUserData;
                    console.log("Pp updated");
                }).catch(err => { console.log(err) });
            }
        );
    }
    $("#frmChngPP").addEventListener("submit", function (event) {
        event.preventDefault();
        $("#prBar").show();
        $("#frmChngPP").hide();
        disableBtn($("#btnCnfNwPP"));
        disableBtn($("#btnCanNwPP"));
        uptPP(fileForUp);
    });
    $('#inNwPP').addEventListener('change', function (e) {
        fileForUp = e.target.files[0];
        function prevImg() {
            var read = new FileReader();
            read.readAsDataURL(fileForUp);
            read.onload = function (e2) {
                $("#preVIn").src = e2.target.result;
            };
        };
        $('#inNwPPL').innerHTML = fileForUp.name;
        prevImg(fileForUp);
    });
}
window.resetFrm = function resetFrm() {
    $('#inNewNck').value = '';
    $('#inNwPP').value = '';
    $("#preVIn").src = '';
    if (lang == "es") {
        $('#inNwPPL').innerHTML = 'Elige una imagen';
    } else if (lang == "en") {
        $('#inNwPPL').innerHTML = 'Choose an image';
    }
    $("#prBar").hide();
    $("#frmChngPP").show();
    enableBtn($("#btnCnfNwPP"));
    enableBtn($("#btnCanNwPP"));
}

//Preferences form toggle btns
function setPrefBtns(disabled) {
    if (!disabled) {
        enableBtn($('#btnCanPref'));
        enableBtn($('#btnCnfPref'));
    } else {
        disableBtn($('#btnCanPref'));
        disableBtn($('#btnCnfPref'));
    }
}
//Preferences inputs
$('#inPubPrfl').onclick = function () {
    if (localUserData.visible) {
        disableBtn($('#inPubEmail'));
        disableBtn($('#inPubFL'));
        $('#inPubEmail').checked = false;
        $('#inPubFL').checked = false;
    } else {
        enableBtn($('#inPubEmail'));
        enableBtn($('#inPubFL'));
        $('#inPubEmail').checked = localUserData.vemail;
        $('#inPubFL').checked = localUserData.vfl;
    }
    localUserData.visible = !localUserData.visible;
    setPrefBtns(!(localUserData == userData));
};
$('#inPubEmail').onclick = function () {
    localUserData.vemail = !localUserData.vemail;
    setPrefBtns(!(localUserData == userData));
};
$('#inPubFL').onclick = function () {
    localUserData.vfl = !localUserData.vfl;
    setPrefBtns(!(localUserData == userData));
};
$('#inNews').onclick = function () {
    localUserData.rNews = !localUserData.rNews;
    setPrefBtns(!(localUserData == userData));
};

function shwPrfl() {
    $('#navBtnPrfl').addClass('active');
    $('#disPP').attr('onerror', "this.src='https://via.placeholder.com/20.webp'");
    $('#disPP').src = photoURL;
    $('#disMail').innerHTML = email;
    $('#disName').innerHTML = displayName;
    $('#crdPrfl').show();
}
function shwFav() {
    $('#navBtnFav').addClass('active');
    let favStr = '';
    userData.favn.forEach(function (itm, idx) {
        if (userData.favl[idx][0] == '2') {
            favStr += '<li class="list-group-item text-light border-light bg-transparent"><a class="text-decoration-none text-light" href="galletas/' + userData.favl[idx] + '">' + itm + ' <i class="fas fa-link"></i></a></li>';
        } else {
            favStr += '<li class="list-group-item text-light border-light bg-transparent"><a class="text-decoration-none text-light" href="' + userData.favl[idx] + '">' + itm + ' <i class="fas fa-link"></i></a></li>';
        }
    });
    $('#cntFav').innerHTML = favStr;
    $('#crdFav').show();
}
function shwLike() {
    $('#navBtnLike').addClass('active');
    let likedStr = '';
    userData.likedn.forEach(function (itm, idx) {
        if (userData.likedl[idx][0] == '2') {
            likedStr += '<li class="list-group-item text-light border-light bg-transparent"><a class="text-decoration-none text-light" href="galletas/' + userData.likedl[idx] + '">' + itm + ' <i class="fas fa-link"></i></a></li>';
        } else {
            likedStr += '<li class="list-group-item text-light border-light bg-transparent"><a class="text-decoration-none text-light" href="' + userData.likedl[idx] + '">' + itm + ' <i class="fas fa-link"></i></a></li>';
        }
    });
    $('#cntLike').innerHTML = likedStr;
    $('#crdLike').show();
}
window.shwPref = function shwPref() {
    $('#navBtnPref').addClass('active');
    $('#inPubPrfl').checked = userData.visible;
    if (userData.visible) {
        enableBtn($('#inPubEmail'));
        enableBtn($('#inPubFL'));
        $('#inPubEmail').checked = userData.vemail;
        $('#inPubFL').checked = userData.vfl;
    } else {
        disableBtn($('#inPubEmail'));
        disableBtn($('#inPubFL'));
        $('#inPubEmail').checked = false;
        $('#inPubFL').checked = false;
    }
    $('#inNews').checked = userData.rNews;
    localUserData = userData;
    setPrefBtns(false);
    $('#crdPref').show();
}
window.shwCrds = function shwCrds(t) {
    if (gotFL == false) {
        getDoc(docRef(FSDB, 'users', uid)).then(function (doc) {
            localUserData = userData = doc.data();
            shwCrds2(t);
        }).catch(function (err) { console.log(err) });
        gotFL = true;
    } else {
        shwCrds2(t);
    }
}

function shwCrds2(t) {
    if (t == 'pref') {
        $('#crdFav').hide();
        $('#navBtnFav').removeClass('active');
        $('#crdLike').hide();
        $('#navBtnLike').removeClass('active');
        $('#crdPrfl').hide();
        $('#navBtnPrfl').removeClass('active');
        shwPref();
    } else {
        if (t == 'favs') {
            $('#crdPrfl').hide();
            $('#navBtnPrfl').removeClass('active');
            $('#crdLike').hide();
            $('#navBtnLike').removeClass('active');
            $('#crdPref').hide();
            $('#navBtnPref').removeClass('active');
            shwFav();
        } else {
            if (t == 'likes') {
                $('#crdFav').hide();
                $('#navBtnFav').removeClass('active');
                $('#crdPrfl').hide();
                $('#navBtnPrfl').removeClass('active');
                $('#crdPref').hide();
                $('#navBtnPref').removeClass('active');
                shwLike();
            } else {
                /*if(t=='notif'){
                    @#NOTIFICACIONES
                }*/
                $('#crdFav').hide();
                $('#navBtnFav').removeClass('active');
                $('#crdLike').hide();
                $('#navBtnLike').removeClass('active');
                $('#crdPref').hide();
                $('#navBtnPref').removeClass('active');
                shwPrfl();
                //}
            }
        }
    }
}