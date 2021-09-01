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

import { getFirestore, getDoc, doc as docRef, updateDoc } from "firebase/firestore";
const FSDB = getFirestore();

import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
const STORAGE = getStorage();

//Global
var userData, localUserData;

var gotFL = false;
var publicID;
var fileForUp = null;

var urlSrch;
window.loaded = function loaded() {
    urlSrch = new URLSearchParams(location.search);

    //Check auth
    onAuthStateChanged(AUTH, (user) => {
        if (user) {
            document.getElementById('picUsr').setAttribute('onerror', "this.src='https://via.placeholder.com/20.webp'");
            document.getElementById('picUsr').src = photoURL;
            shwCrds(urlSrch.get('tab'));
        } else {
            $('#mdlRgstr').modal('show');
        }
    });

    function send() {
        localUserData.name = displayName = document.getElementById('inNewNck').value;
        updateProfile(AUTH.currentUser, {
            displayName: displayName
        }).then(function () {
            return updateDoc(docRef(FSDB, 'users', uid), localUserData)
        }).then(() => {
            userData = localUserData;
            resetFrm();
            document.getElementById('disName').innerHTML = displayName;
        }).catch(function (err) { console.log(err) });
    }
    document.getElementById("frmChngNk").addEventListener("submit", function (event) {
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
                        emails: firebase.firestore.FieldValue.arrayUnion(email)
                    });
                } else {
                    updateDoc(newsRef, {
                        emails: firebase.firestore.FieldValue.arrayRemove(email)
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
    document.getElementById("frmPref").addEventListener("submit", function (event) {
        event.preventDefault();
        setPrefBtns(false);
        uptPref();
    });
    
    function uptPP(file) {
        let ref = storageRef(STORAGE, 'ppics/' + publicID + '/pp');
        let task = uploadBytes(ref, file);
        task.on('state_changed',
            (snap) => {
                let progPer = (snap.bytesTransferred / snap.totalBytes) * 100;
                document.getElementById('prBarDis').style['width'] = progPer + '%';
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
                document.getElementById('picUsr').src = document.getElementById("preVIn").src;
                document.getElementById('disPP').src = document.getElementById("preVIn").src;
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
    document.getElementById("frmChngPP").addEventListener("submit", function (event) {
        event.preventDefault();
        document.getElementById("prBar").classList.remove('d-none');
        document.getElementById("frmChngPP").classList.add('d-none');
        document.getElementById("btnCnfNwPP").classList.add('disabled');
        document.getElementById("btnCanNwPP").classList.add('disabled');
        uptPP(fileForUp);
    });
    document.getElementById('inNwPP').addEventListener('change', function (e) {
        fileForUp = e.target.files[0];
        function prevImg() {
            var read = new FileReader();
            read.readAsDataURL(fileForUp);
            read.onload = function (e2) {
                document.getElementById("preVIn").src = e2.target.result;
            };
        };
        document.getElementById('inNwPPL').innerHTML = fileForUp.name;
        prevImg(fileForUp);
    });
}
function resetFrm() {
    document.getElementById('inNewNck').value = '';
    document.getElementById('inNwPP').value = '';
    document.getElementById("preVIn").src = '';
    document.getElementById('inNwPPL').innerHTML = 'Elige una imagen';
    document.getElementById("prBar").classList.add('d-none');
    document.getElementById("frmChngPP").classList.remove('d-none');
    document.getElementById("btnCnfNwPP").classList.remove('disabled');
    document.getElementById("btnCanNwPP").classList.remove('disabled');
}

//Preferences form toggle btns
function setPrefBtns(disabled) {
    if (!disabled) {
        document.getElementById('btnCanPref').disabled = false;
        document.getElementById('btnCnfPref').disabled = false;
    } else {
        document.getElementById('btnCanPref').setAttribute('disabled', 'true');
        document.getElementById('btnCnfPref').setAttribute('disabled', 'true');
    }
}
//Preferences inputs
document.getElementById('inPubPrfl').onclick = function () {
    if (localUserData.visible) {
        document.getElementById('inPubEmail').setAttribute('disabled', 'true');
        document.getElementById('inPubFL').setAttribute('disabled', 'true');
        document.getElementById('inPubEmail').checked = false;
        document.getElementById('inPubFL').checked = false;
    } else {
        document.getElementById('inPubEmail').disabled = false;
        document.getElementById('inPubFL').disabled = false;
        document.getElementById('inPubEmail').checked = localUserData.vemail;
        document.getElementById('inPubFL').checked = localUserData.vfl;
    }
    localUserData.visible = !localUserData.visible;
    setPrefBtns(!(localUserData == userData));
};
document.getElementById('inPubEmail').onclick = function () {
    localUserData.vemail = !localUserData.vemail;
    setPrefBtns(!(localUserData == userData));
};
document.getElementById('inPubFL').onclick = function () {
    localUserData.vfl = !localUserData.vfl;
    setPrefBtns(!(localUserData == userData));
};
document.getElementById('inNews').onclick = function () {
    localUserData.rNews = !localUserData.rNews;
    setPrefBtns(!(localUserData == userData));
};

function shwPrfl() {
    document.getElementById('navBtnPrfl').classList.add('active');
    document.getElementById('disPP').setAttribute('onerror', "this.src='https://via.placeholder.com/20.webp'");
    document.getElementById('disPP').src = photoURL;
    document.getElementById('disMail').innerHTML = email;
    document.getElementById('disName').innerHTML = displayName;
    document.getElementById('crdPrfl').classList.remove('d-none');
}
function shwFav() {
    document.getElementById('navBtnFav').classList.add('active');
    let favStr = '';
    userData.favn.forEach(function (itm, idx) {
        if (userData.favl[idx][0] == '2') {
            favStr += '<li class="list-group-item text-light border-light bg-transparent"><a class="text-decoration-none text-light" href="galletas/' + userData.favl[idx] + '">' + itm + ' <i class="fas fa-link"></i></a></li>';
        } else {
            favStr += '<li class="list-group-item text-light border-light bg-transparent"><a class="text-decoration-none text-light" href="' + userData.favl[idx] + '">' + itm + ' <i class="fas fa-link"></i></a></li>';
        }
    });
    document.getElementById('cntFav').innerHTML = favStr;
    document.getElementById('crdFav').classList.remove('d-none');
}
function shwLike() {
    document.getElementById('navBtnLike').classList.add('active');
    let likedStr = '';
    userData.likedn.forEach(function (itm, idx) {
        if (userData.likedl[idx][0] == '2') {
            likedStr += '<li class="list-group-item text-light border-light bg-transparent"><a class="text-decoration-none text-light" href="galletas/' + userData.likedl[idx] + '">' + itm + ' <i class="fas fa-link"></i></a></li>';
        } else {
            likedStr += '<li class="list-group-item text-light border-light bg-transparent"><a class="text-decoration-none text-light" href="' + userData.likedl[idx] + '">' + itm + ' <i class="fas fa-link"></i></a></li>';
        }
    });
    document.getElementById('cntLike').innerHTML = likedStr;
    document.getElementById('crdLike').classList.remove('d-none');
}
function shwPref() {
    document.getElementById('navBtnPref').classList.add('active');
    document.getElementById('inPubPrfl').checked = userData.visible;
    if (userData.visible) {
        document.getElementById('inPubEmail').disabled = false;
        document.getElementById('inPubFL').disabled = false;
        document.getElementById('inPubEmail').checked = userData.vemail;
        document.getElementById('inPubFL').checked = userData.vfl;
    } else {
        document.getElementById('inPubEmail').setAttribute('disabled', 'true');
        document.getElementById('inPubFL').setAttribute('disabled', 'true');
        document.getElementById('inPubEmail').checked = false;
        document.getElementById('inPubFL').checked = false;
    }
    document.getElementById('inNews').checked = userData.rNews;
    localUserData = userData;
    setPrefBtns(false);
    document.getElementById('crdPref').classList.remove('d-none');
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
        document.getElementById('crdFav').classList.add('d-none');
        document.getElementById('navBtnFav').classList.remove('active');
        document.getElementById('crdLike').classList.add('d-none');
        document.getElementById('navBtnLike').classList.remove('active');
        document.getElementById('crdPrfl').classList.add('d-none');
        document.getElementById('navBtnPrfl').classList.remove('active');
        shwPref();
    } else {
        if (t == 'favs') {
            document.getElementById('crdPrfl').classList.add('d-none');
            document.getElementById('navBtnPrfl').classList.remove('active');
            document.getElementById('crdLike').classList.add('d-none');
            document.getElementById('navBtnLike').classList.remove('active');
            document.getElementById('crdPref').classList.add('d-none');
            document.getElementById('navBtnPref').classList.remove('active');
            shwFav();
        } else {
            if (t == 'likes') {
                document.getElementById('crdFav').classList.add('d-none');
                document.getElementById('navBtnFav').classList.remove('active');
                document.getElementById('crdPrfl').classList.add('d-none');
                document.getElementById('navBtnPrfl').classList.remove('active');
                document.getElementById('crdPref').classList.add('d-none');
                document.getElementById('navBtnPref').classList.remove('active');
                shwLike();
            } else {
                /*if(t=='notif'){
                    @#NOTIFICACIONES
                }*/
                document.getElementById('crdFav').classList.add('d-none');
                document.getElementById('navBtnFav').classList.remove('active');
                document.getElementById('crdLike').classList.add('d-none');
                document.getElementById('navBtnLike').classList.remove('active');
                document.getElementById('crdPref').classList.add('d-none');
                document.getElementById('navBtnPref').classList.remove('active');
                shwPrfl();
                //}
            }
        }
    }
}