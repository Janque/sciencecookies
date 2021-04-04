//Global
var fav, liked, points, rank, gotFL = false;
var favn, favl, likedn, likedl;
var publicID;
var visible, vmail, vfl, rNews;
var lvisible, lvemail, lvfl, lrNews, prefChanges = false;
var fileForUp = null;

window.loaded = function loaded() {
    //Check auth
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            document.getElementById('picUsr').setAttribute('onerror', "this.src='img/nopp.png'");
            document.getElementById('picUsr').src = photoURL;
            shwCrds(urlSrch.get('tab'));
        } else {
            $('#mdlRgstr').modal('show');
        }
    });
    function send() {
        displayName = document.getElementById('inNewNck').value;
        firebase.auth().currentUser.updateProfile({
            displayName: displayName,
        }).then(function () {
            db.collection('usersPublic').doc(publicID).update({
                name: displayName,
                pic: photoURL,
                email: email,
                favn: favn,
                favl: favl,
                likedn: likedn,
                likedl: likedl,
                points: points,
                rank: rank,
                visible: document.getElementById('inPubPrfl').checked,
                vemail: document.getElementById('inPubEmail').checked,
                vfl: document.getElementById('inPubFL').checked,
            }).then(() => {
                resetFrm();
                document.getElementById('disName').innerHTML = newNk;
            }).catch(err => { console.log(err) });
        }).catch(function (err) { console.log(err) });
    }
    document.getElementById("frmChngNk").addEventListener("submit", function (event) {
        event.preventDefault();
        send();
        $('#mdlCngNck').modal('hide');
    });
    function uptPref() {
        db.collection('users').doc(uid).update({
            visible: document.getElementById('inPubPrfl').checked,
            vemail: document.getElementById('inPubEmail').checked,
            vfl: document.getElementById('inPubFL').checked,
            rNews: document.getElementById('inNews').checked,
        }).then(() => {
            if (rNews != lrNews) {
                let newsRef = db.collection("newsletters").doc("base");
                if (lrNews) {
                    newsRef.update({
                        emails: firebase.firestore.FieldValue.arrayUnion(email)
                    });
                } else {
                    newsRef.update({
                        emails: firebase.firestore.FieldValue.arrayRemove(email)
                    });
                }
            }
            visible = lvisible;
            vemail = lvemail;
            vfl = lvfl;
            rNews = lrNews;
            db.collection('usersPublic').doc(publicID).update({
                name: displayName,
                pic: photoURL,
                email: email,
                favn: favn,
                favl: favl,
                likedn: likedn,
                likedl: likedl,
                points: points,
                rank: rank,
                visible: document.getElementById('inPubPrfl').checked,
                vemail: document.getElementById('inPubEmail').checked,
                vfl: document.getElementById('inPubFL').checked,
            }).then(() => { }).catch(err => { console.log(err) });
        }).catch(err => { console.log(err) });
    }
    document.getElementById("frmPref").addEventListener("submit", function (event) {
        event.preventDefault();
        document.getElementById('btnCanPref').setAttribute('disabled', 'true');
        document.getElementById('btnCnfPref').setAttribute('disabled', 'true');
        uptPref();
        document.getElementById("alrtClsSsn").innerHTML = '<div id="alrtClsSsnAlrt" class="alert alert-success alert-dismissible fade show fixed-bottom" role="alert">    Se han guardado los cambios                                                      <button id="btnAlrtClsSsn" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
        setTimeout(function () {
            document.getElementById("btnAlrtClsSsn").click();
        }, 3000);
        $('#alrtClsSsnAlrt').on('closed.bs.alert', function () {
            document.getElementById("alrtClsSsn").innerHTML = '';
        });
    });
    function uptPP(file) {
        let ref = storage.ref('ppics/' + publicID + '/pp');
        let task = ref.put(file);
        task.on('state_changed',
            function progress(snap) {
                let progPer = (snap.bytesTransferred / snap.totalBytes) * 100;
                document.getElementById('prBarDis').style['width'] = progPer + '%';
            },
            function error(err) {
                resetFrm();
                $('#mdlCngPP').modal('hide');
                document.getElementById("alrtClsSsn").innerHTML = '<div id="alrtClsSsnAlrt" class="alert alert-warning alert-dismissible fade show fixed-bottom" role="alert"><strong>¡Ocurrió un error!</strong> Revisa que tu archivo cumpla los límites y sea una imagen e intenta de nuevo.<button id="btnAlrtClsSsn" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                setTimeout(function () {
                    document.getElementById("btnAlrtClsSsn").click();
                }, 3000);
                $('#alrtClsSsnAlrt').on('closed.bs.alert', function () {
                    document.getElementById("alrtClsSsn").innerHTML = '';
                });
            },
            function complete() {
                document.getElementById('picUsr').src = document.getElementById("preVIn").src;
                document.getElementById('disPP').src = document.getElementById("preVIn").src;
                resetFrm();
                $('#mdlCngPP').modal('hide');
                ref.getDownloadURL().then(url => {
                    url = url.replace('pp?', 'pp_200x200?');
                    firebase.auth().currentUser.updateProfile({
                        photoURL: url,
                    }).then(() => {
                        db.collection('usersPublic').doc(publicID).update({
                            pic: url,
                            email: email,
                            favn: favn,
                            favl: favl,
                            likedn: likedn,
                            likedl: likedl,
                            points: points,
                            rank: rank,
                        }).then(() => { }).catch(err => { console.log(err) });
                    }).catch(err => { console.log(err) });
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

function setPrefBtns() {
    if (prefChanges) {
        document.getElementById('btnCanPref').disabled = false;
        document.getElementById('btnCnfPref').disabled = false;
    } else {
        document.getElementById('btnCanPref').setAttribute('disabled', 'true');
        document.getElementById('btnCnfPref').setAttribute('disabled', 'true');
    }
}
document.getElementById('inPubPrfl').onclick = function () {
    if (lvisible) {
        document.getElementById('inPubEmail').setAttribute('disabled', 'true');
        document.getElementById('inPubFL').setAttribute('disabled', 'true');
        document.getElementById('inPubEmail').checked = false;
        document.getElementById('inPubFL').checked = false;
    } else {
        document.getElementById('inPubEmail').disabled = false;
        document.getElementById('inPubFL').disabled = false;
        document.getElementById('inPubEmail').checked = lvemail;
        document.getElementById('inPubFL').checked = lvfl;
    }
    lvisible = !lvisible;
    prefChanges = !(document.getElementById('inPubPrfl').checked == visible && document.getElementById('inPubEmail').checked == vemail && document.getElementById('inPubFL').checked == vfl && document.getElementById('inNews').checked == rNews);
    setPrefBtns();
};
document.getElementById('inPubEmail').onclick = function () {
    lvemail = !lvemail;
    prefChanges = !(document.getElementById('inPubPrfl').checked == visible && document.getElementById('inPubEmail').checked == vemail && document.getElementById('inPubFL').checked == vfl && document.getElementById('inNews').checked == rNews);
    setPrefBtns();
};
document.getElementById('inPubFL').onclick = function () {
    lvfl = !lvfl;
    prefChanges = !(document.getElementById('inPubPrfl').checked == visible && document.getElementById('inPubEmail').checked == vemail && document.getElementById('inPubFL').checked == vfl && document.getElementById('inNews').checked == rNews);
    setPrefBtns();
};
document.getElementById('inNews').onclick = function () {
    lrNews = !lrNews;
    prefChanges = !(document.getElementById('inPubPrfl').checked == visible && document.getElementById('inPubEmail').checked == vemail && document.getElementById('inPubFL').checked == vfl && document.getElementById('inNews').checked == rNews);
    setPrefBtns();
};

function shwPrfl() {
    document.getElementById('navBtnPrfl').classList.add('active');
    document.getElementById('disPP').setAttribute('onerror', "this.src='img/nopp.png'");
    document.getElementById('disPP').src = photoURL;
    document.getElementById('disMail').innerHTML = email;
    document.getElementById('disName').innerHTML = displayName;
    document.getElementById('crdPrfl').classList.remove('d-none');
}
function shwFav() {
    document.getElementById('navBtnFav').classList.add('active');
    let favStr = '';
    favn.forEach(function (itm, idx) {
        favStr = favStr + '<li class="list-group-item text-light border-light bg-transparent"><a class="text-decoration-none text-light" href="galletas/' + favl[idx] + '">' + itm + ' <i class="fas fa-link"></i></a></li>';
    });
    document.getElementById('cntFav').innerHTML = favStr;
    document.getElementById('crdFav').classList.remove('d-none');
}
function shwLike() {
    document.getElementById('navBtnLike').classList.add('active');
    let likedStr = '';
    likedn.forEach(function (itm, idx) {
        likedStr = likedStr + '<li class="list-group-item text-light border-light bg-transparent"><a class="text-decoration-none text-light" href="galletas/' + likedl[idx] + '">' + itm + ' <i class="fas fa-link"></i></a></li>';
    });
    document.getElementById('cntLike').innerHTML = likedStr;
    document.getElementById('crdLike').classList.remove('d-none');
}
function shwPref() {
    document.getElementById('navBtnPref').classList.add('active');
    document.getElementById('inPubPrfl').checked = visible;
    if (visible) {
        document.getElementById('inPubEmail').disabled = false;
        document.getElementById('inPubFL').disabled = false;
        document.getElementById('inPubEmail').checked = vemail;
        document.getElementById('inPubFL').checked = vfl;
    } else {
        document.getElementById('inPubEmail').setAttribute('disabled', 'true');
        document.getElementById('inPubFL').setAttribute('disabled', 'true');
        document.getElementById('inPubEmail').checked = false;
        document.getElementById('inPubFL').checked = false;
    }
    document.getElementById('inNews').checked = rNews;
    lvisible = visible;
    lvemail = vemail;
    lvfl = vfl;
    lrNews = rNews;
    prefChanges = false;
    setPrefBtns();
    document.getElementById('crdPref').classList.remove('d-none');
}
function shwCrds(t) {
    if (gotFL == false) {
        db.collection('users').doc(uid).get().then(function (doc) {
            fav = doc.data().fav;
            liked = doc.data().liked;
            favn = doc.data().favn;
            favl = doc.data().favl;
            likedn = doc.data().likedn;
            likedl = doc.data().likedl;
            points = doc.data().points;
            rank = doc.data().rank;
            publicID = doc.data().publicID;
            visible = doc.data().visible;
            vemail = doc.data().vemail;
            vfl = doc.data().vfl;
            lvisible = doc.data().visible;
            lvemail = doc.data().vmail;
            lvfl = doc.data().vfl;
            rNews = doc.data().rNews;
            lrNews = doc.data().rNews;
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