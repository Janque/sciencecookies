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

import { getDatabase, ref as databaseRef, set, increment, onValue, child } from "firebase/database";
const RTDB = getDatabase();

import { getFunctions, httpsCallable } from "firebase/functions";
const FUNCTIONS = getFunctions(firebaseApp, 'us-east1');

import { getFirestore, collection, getDoc, doc as docRef, addDoc, updateDoc } from "firebase/firestore/lite";
const FSDB = getFirestore();

var cookRef;
var replying = -1;

window.loaded = function loaded() {
    cookRef = databaseRef(RTDB, 'galletas/' + id);

    onValue(cookRef, (snap) => {
        const data = snap.val();
        if (data) {
            $('#favCount').innerText = data.favs;
            $('#likeCount').innerText = data.likes;
        }
    });
    set(child(cookRef, 'pop'), increment(1));
    set(databaseRef(RTDB, 'uptCook/' + id), "true");

    function sendRep() {
        addDoc(collection(FSDB, 'reports'), {
            from: email,
            reason: $('#inReas').value,
            comm: reporting,
            mess: $('#inText').value,
        }).then(function () {
            if (lang == "es") {
                alertTop("Gracias por tu reporte, lo revisaremos lo antes posible.", 2);
            } else if (lang == "en") {
                alertTop("Thank you for your report, we will review it as soon as posible.", 2);
            }
            $('#mdlRprt').modal('hide');
        }).catch(function (err) {
            console.log('err');
            if (lang == "es") {
                alertTop("Ha ocurrido un error, por favor intenta nuevamente.", 0);
            } else if (lang == "en") {
                alertTop("There has been an error, please try again.", 0);
            }
            $('#mdlRprt').modal('hide');
        })
    }
    $("#frmRprt").addEventListener("submit", function (event) {
        event.preventDefault();
        if (actSsn) sendRep();
    });
    function sendNwCom() {
        const addComment = httpsCallable(FUNCTIONS, 'cookieFeatures-addComment');
        let comFrm = {
            id: id,
            from: displayName,
            pic: photoURL,
            shortID: pubID,
            to: replying,
            text: $('#inNwCom').value,
        };
        addComment(comFrm).then(comres => {
            if (comres.data.res == -1) {
                if (lang == "es") {
                    alertTop("Ha ocurrido un error, por favor intenta nuevamente.", 0);
                } else if (lang == "en") {
                    alertTop("There has been an error, please try again.", 0);
                }
                $('#mdlRprt').modal('hide');
            } else {
                if (comres.data.res == -2) {
                    drwComs(comNum);
                    let bdate = new Date(comres.data.blc._seconds * 1000);
                    let dstr = bdate.getDate() + '/' + (bdate.getMonth() + 1) + '/' + bdate.getFullYear();
                    if (lang == "es") {
                        alertTop("No puedes comentar. Un moderador te ha bloqueado hasta " + dstr, 0);
                    } else if (lang == "en") {
                        alertTop("You cannot comment. A moderator has blocked you until " + dstr, 0);
                    }
                    $('#mdlRprt').modal('hide');
                } else {
                    if (comres.data.res == 0) {
                        comList[comres.data.pos] = comres.data.com;
                        comNum++;
                    } else {
                        comList[comres.data.pos].reps.push(comres.data.com);
                    }
                    comCount++;
                    drwComs(comNum);
                    if (lang == "es") {
                        alertTop("Se ha publicado tu comentario", 1);
                    } else if (lang == "en") {
                        alertTop("Your comment has been published", 1);
                    }
                    $('#mdlRprt').modal('hide');
                }
            }
            replying = -1;
            $('#frmNwComBtns').hide();
            if (lang == "es") {
                $('#inNwCom').attr('placeholder', 'Nuevo comentario');
                $('#btnAddCom').innerHTML = 'Comentar';
            } else if (lang == "en") {
                $('#inNwCom').attr('placeholder', 'New comment');
                $('#btnAddCom').innerHTML = 'Comment';
            }
            enableBtn($('#btnCanCom'));
            enableBtn($('#btnAddCom'));
            $('#inNwCom').value = '';
        }).catch(err => { console.log('err') });
    }
    $("#frmNwCom").addEventListener("submit", function (event) {
        event.preventDefault();
        if (actSsn) {
            disableBtn($('#btnAddCom'));
            disableBtn($('#btnCanCom'));
            $('#btnAddCom').innerHTML = '<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>';
            sendNwCom();
        }
    });
}

$('#btnFav').onclick = function () {
    if (actSsn) {
        let userData, ifav, iliked, npop, nlik, nfav;
        getDoc(docRef(FSDB, 'users', uid)).then(function (doc) {
            userData = doc.data();
            ifav = userData.fav.indexOf(id);
            iliked = userData.liked.indexOf(id);
            npop = 0;
            nlik = 0;
            nfav = 0;
            if (ifav != -1) {
                userData.fav.splice(ifav, 1);
                userData.favn.splice(ifav, 1);
                userData.favl.splice(ifav, 1);
                let langTxt = "Añadir a favoritos";
                if (lang == "en") {
                    langTxt = "Add to favorites";
                }
                $('#btnFav').innerHTML = langTxt + '  <i class="far fa-heart"></i> <span class="badge badge-dark ml-2" id="favCount"></span>';
                $('#btnFav').removeClass('btn-light');
                $('#btnFav').addClass('btn-outline-light');
                npop = -20;
                nfav = -1;
            }
            else {
                userData.fav.push(id);
                userData.favn.push(cTitle);
                userData.favl.push(cRef);
                if (iliked == -1) {
                    userData.liked.push(id);
                    userData.likedn.push(cTitle);
                    userData.likedl.push(cRef);
                    npop = 30;
                    nlik = 1;
                    let langTxt = "Me gusta";
                    if (lang == "en") {
                        langTxt = "I like it";
                    }
                    $('#btnLike').innerHTML = langTxt + ' <i class="fas fa-thumbs-up"></i> <span class="badge badge-dark ml-2" id="likeCount"></span>';
                    $('#btnLike').removeClass('btn-outline-light');
                    $('#btnLike').addClass('btn-light');
                }
                else npop = 20;
                nfav = 1;
                let langTxt = "En mis favoritos";
                if (lang == "en") {
                    langTxt = "In my favorites";
                }
                $('#btnFav').innerHTML = langTxt + '  <i class="fas fa-heart"></i> <span class="badge badge-dark ml-2" id="favCount"></span>';
                $('#btnFav').removeClass('btn-outline-light');
                $('#btnFav').addClass('btn-light');
            }
            return updateDoc(docRef(FSDB, 'users', uid), userData);
        }).then(() => {
            set(child(cookRef, 'pop'), increment(npop));
            set(child(cookRef, 'likes'), increment(nlik));
            set(child(cookRef, 'favs'), increment(nfav));
        }).catch(function (err) { console.log('err') });
    } else {
        if (lang == "es") {
            $('#mdlRgsL').innerHTML = 'Debes iniciar sesión o registrarte para continuar';
        } else if (lang == "en") {
            $('#mdlRgsL').innerHTML = 'You must log in or sign in before you continue';
        }
        $('#mdlRgstr').modal('show');
    }
};
$('#btnLike').onclick = function () {
    if (actSsn) {
        let userData, ifav, iliked, npop, nlik, nfav;
        getDoc(docRef(FSDB, 'users', uid)).then(function (doc) {
            userData = doc.data();
            ifav = userData.fav.indexOf(id);
            iliked = userData.liked.indexOf(id);
            npop = 0;
            nlik = 0;
            nfav = 0;
            if (iliked == -1) {
                userData.liked.push(id);
                userData.likedn.push(cTitle);
                userData.likedl.push(cRef);
                npop = 10;
                nlik = 1;
                let langTxt = "Me gusta";
                if (lang == "en") {
                    langTxt = "I like it";
                }
                $('#btnLike').innerHTML = langTxt + ' <i class="fas fa-thumbs-up"></i> <span class="badge badge-dark ml-2" id="likeCount"></span>';
                $('#btnLike').removeClass('btn-outline-light');
                $('#btnLike').addClass('btn-light');
            }
            else {
                userData.liked.splice(iliked, 1);
                userData.likedn.splice(iliked, 1);
                userData.likedl.splice(iliked, 1);
                if (ifav == -1) npop = -10;
                else {
                    userData.fav.splice(ifav, 1);
                    userData.favn.splice(ifav, 1);
                    userData.favl.splice(ifav, 1);
                    npop = -30;
                    nfav = -1;
                    let langTxt = "Añadir a favoritos";
                    if (lang == "en") {
                        langTxt = "Add to favorites";
                    }
                    $('#btnFav').innerHTML = langTxt + '  <i class="far fa-heart"></i> <span class="badge badge-dark ml-2" id="favCount"></span>';
                    $('#btnFav').removeClass('btn-light');
                    $('#btnFav').addClass('btn-outline-light');
                }
                let langTxt = "Dar me gusta";
                if (lang == "en") {
                    langTxt = "Like";
                }
                nlik = -1;
                $('#btnLike').innerHTML = langTxt + ' <i class="far fa-thumbs-up"></i> <span class="badge badge-dark ml-2" id="likeCount"></span>';
                $('#btnLike').removeClass('btn-light');
                $('#btnLike').addClass('btn-outline-light');
            }
        }).then(() => {
            return updateDoc(docRef(FSDB, 'users', uid), userData);
        }).then(() => {
            set(child(cookRef, 'pop'), increment(npop));
            set(child(cookRef, 'likes'), increment(nlik));
            set(child(cookRef, 'favs'), increment(nfav));
        }).catch(function (err) { console.log(err) });
    } else {
        if (lang == "es") {
            $('#mdlRgsL').innerHTML = 'Debes iniciar sesión o registrarte para continuar';
        } else if (lang == "en") {
            $('#mdlRgsL').innerHTML = 'You must log in or sign in before you continue';
        }
        $('#mdlRgstr').modal('show');
    }
};
$('#mdlRgstr').on('hidden.bs.modal', function (e) {
    if (lang == "es") {
        $('#mdlRgsL').innerHTML = 'Inicia sesión o regístrate';
    } else if (lang == "en") {
        $('#mdlRgsL').innerHTML = 'Log in or sign in';
    }
});

$('#inNwCom').onfocus = function () {
    if (actSsn) {
        $('#frmNwComBtns').show();
    } else {
        if (lang == "es") {
            $('#mdlRgsL').innerHTML = 'Debes iniciar sesión o registrarte para continuar';
        } else if (lang == "en") {
            $('#mdlRgsL').innerHTML = 'You must log in or sign in before you continue';
        }
        $('#mdlRgstr').modal('show');
    }
};

var comList = [], comNum = 5, comCount = 0;
var reporting = null;
window.report = function report(r) {
    if (actSsn) {
        reporting = r;
        $('#mdlRprt').modal('show');
    } else {
        if (lang == "es") {
            $('#mdlRgsL').innerHTML = 'Debes iniciar sesión o registrarte para continuar';
        } else if (lang == "en") {
            $('#mdlRgsL').innerHTML = 'You must log in or sign in before you continue';
        }
        $('#mdlRgstr').modal('show');
    }
}
window.reply = function reply(r) {
    replying = r;
    $('#btnsFL').scroll({ behavior: 'smooth' });
    if (lang == "es") {
        $('#inNwCom').attr('placeholder', 'Nueva respuesta');
    } else if (lang == "en") {
        $('#inNwCom').attr('placeholder', 'New reply');
    }
    $('#inNwCom').focus();
}
/*function likeCom(p,s){
    if(s==null){
        @#NOT IMPLEMENTED
        @#EXPENSIVE?
    }
}*/

$('#btnLdComs').onclick = function () {
    $('#btnLdComs').hide();
    $('#spnCom').show();
    getDoc(collection(FSDB, 'cookies/comments/' + id), '1').then(doc => {
        if (doc.exists) {
            comList = doc.data().coms;
            comCount = doc.data().comCount;
            drwComs(comNum);
        } else {
            $('#spnCom').hide();
            $('#cntComs').show();
            $('#cntComs2').show();
        }
    }).catch(err => { console.log('err') });
};

function drwComs(num) {
    $('#btnLdMrComs').hide();
    let comTxt;
    if (lang == "es") {
        comTxt = 'comentario';
    } else if (lang == "en") {
        comTxt = 'comment';
    }
    $('#cntComs2').innerHTML = '';
    $('#comCount').innerHTML = comCount + ' ' + comTxt;
    if (comCount != 1) $('#comCount').innerHTML += 's';
    for (let i = 1; i <= num; i++) {
        if (i > comList.length) break;
        if (comList[comList.length - i] == null) continue;
        $('#cntComs2').appendChild(createCom(comList[comList.length - i]));
    }
    if (comList.length > num) $('#btnLdMrComs').show();
    $('#spnCom').hide();
    $('#cntComs').show();
    $('#cntComs2').show();
}

function createCom(comDat) {
    let cont = $('<div></div>');
    cont.addClass('container-fluid');
    cont.addClass('bg-light');
    cont.addClass('rounded-lg');
    cont.addClass('p-2');
    cont.addClass('mb-1');
    let head = $('<div></div>');
    head.addClass('row');
    head.addClass('justify-content-between');
    let usr = $('<div></div>');
    usr.addClass('col-auto');
    let a = $('<a></a>');
    a.addClass('text-decoration-none');
    a.addClass('text-dark');
    a.href = '../../ver-perfil?user=' + comDat.shortID;
    a.innerHTML = '<img src="' + comDat.pic + '" alt="" class="rounded-circle mr-2" height="35" width="35" onerror="this.src=`https://via.placeholder.com/20.webp`">' + comDat.from;
    usr.appendChild(a);
    head.appendChild(usr);
    let rprt = $('<div></div>');
    rprt.addClass('col-auto');
    rprt.addClass('dropleft');
    let btnRprt = $('<button></button>');
    btnRprt.addClass('btn');
    btnRprt.addClass('btn-light');
    btnRprt.attr('data-toggle', 'dropdown');
    btnRprt.attr('aria-haspopup', 'true');
    btnRprt.attr('aria-expanded', 'false');
    btnRprt.innerHTML = '<i class="fas fa-ellipsis-h"></i>';
    rprt.appendChild(btnRprt);
    let drpRprt = $('<div></div>');
    drpRprt.addClass('dropdown-menu');
    drpRprt.addClass('border-0');
    let aux = id + 'c' + comDat.id;
    aux = ("'").concat(aux).concat("'");
    let reportTxt = "";
    if (lang == "es") {
        reportTxt = 'ar';
    }
    drpRprt.innerHTML = '<button class="dropdown-item" onclick="report(' + aux + ');"><i class="fas fa-flag"></i> Report' + reportTxt + '</button>';
    rprt.appendChild(drpRprt);
    head.appendChild(rprt);
    let bod = $('<div></div>');
    bod.addClass('row');
    bod.addClass('pl-3');
    bod.addClass('pr-2');
    let p = $('<p></p>');
    p.innerText = comDat.text;
    bod.appendChild(p);
    let foot = $('<div></div>');
    foot.addClass('row');
    let btns = $('<div></div>');
    btns.addClass('col-auto');
    let btn = $('<button></button>');
    /*@#btn.addClass('btn');
    btn.addClass('btn-light');
    btn.addClass('mr-3');
    btn.innerHTML='<i class="far fa-thumbs-up"></i> '+comDat.likes;
    btn.attr('id',comDat.id);
    btn.attr('onclick','likeCom('+comDat.id+')');
    btns.appendChild(btn);
    btn=$('<button></button>');*/
    btn.addClass('btn');
    btn.addClass('btn-science');
    btn.addClass('mr-3');
    btn.attr('onclick', 'reply(' + comDat.id + ')');
    if (lang == "es") {
        btn.innerHTML = 'Responder';
    } else if (lang == "en") {
        btn.innerHTML = 'Reply';
    }
    btns.appendChild(btn);
    if (comDat.reps.length > 0) {
        btn = $('<button></button>');
        btn.addClass('btn');
        btn.addClass('btn-link-science');
        btn.attr('onclick', '$("#' + comDat.id + 'Reps").classList.toggle("d-none")');
        if (lang == "es") {
            btn.innerHTML = 'Respuestas <i class="fas fa-caret-down"></i>';
        } else if (lang == "en") {
            btn.innerHTML = 'Replies <i class="fas fa-caret-down"></i>';
        }
        btns.appendChild(btn);
    }
    foot.appendChild(btns);
    cont.appendChild(head);
    cont.appendChild(bod);
    cont.appendChild(foot);
    let reps = $('<div></div>');
    reps.addClass('row');
    reps.addClass('pl-4');
    reps.addClass('pt-2');
    reps.hide();
    reps.attr('id', comDat.id + 'Reps');
    for (let i = 0; i < comDat.reps.length; i++) {
        let rep = $('<div></div>');
        rep.addClass('col-11');
        rep.addClass('p-2');
        rep.addClass('rounded-lg');
        rep.addClass('mb-1');
        rep.addClass('ml-auto');
        rep.addClass('mr-2');
        rep.addClass('border');
        let rHd = $('<div></div>');
        rHd.addClass('row');
        rHd.addClass('justify-content-between');
        let rusr = $('<div></div>');
        rusr.addClass('col-auto');
        let ra = $('<a></a>');
        ra.addClass('text-decoration-none');
        ra.addClass('text-dark');
        ra.href = '../../ver-perfil?user=' + comDat.reps[i].shortID;
        ra.innerHTML = '<img src="' + comDat.reps[i].pic + '" alt="" class="rounded-circle mr-2" height="35" width="35" onerror="this.src=`https://via.placeholder.com/20.webp`">' + comDat.reps[i].from;
        rusr.appendChild(ra);
        rHd.appendChild(rusr);
        let rrprt = $('<div></div>');
        rrprt.addClass('col-auto');
        rrprt.addClass('dropleft');
        let rbtnRprt = $('<button></button>');
        rbtnRprt.addClass('btn');
        rbtnRprt.addClass('btn-light');
        rbtnRprt.attr('data-toggle', 'dropdown');
        rbtnRprt.attr('aria-haspopup', 'true');
        rbtnRprt.attr('aria-expanded', 'false');
        rbtnRprt.innerHTML = '<i class="fas fa-ellipsis-h"></i>';
        rrprt.appendChild(rbtnRprt);
        let rdrpRprt = $('<div></div>');
        rdrpRprt.addClass('dropdown-menu');
        rdrpRprt.addClass('border-0');
        let raux = id + 'c' + comDat.id + 'r' + comDat.reps[i].id;
        raux = ("'").concat(raux).concat("'");
        let reportTxt = "";
        if (lang == "es") {
            reportTxt = 'ar';
        }
        rdrpRprt.innerHTML = '<button class="dropdown-item" onclick="report(' + raux + ');"><i class="fas fa-flag"></i> Report' + reportTxt + '</button>';
        rrprt.appendChild(rdrpRprt);
        rHd.appendChild(rrprt);
        let rbod = $('<div></div>');
        rbod.addClass('row');
        rbod.addClass('pl-3');
        rbod.addClass('pr-2');
        let rp = $('<p></p>');
        rp.innerText = comDat.reps[i].text;
        rbod.appendChild(rp);
        /*@#let rfoot=$('<div></div>');
        rfoot.addClass('row');
        let rbtns=$('<div></div>');
        rbtns.addClass('col-auto');
        let rbtn=$('<button></button>');
        rbtn.addClass('btn');
        rbtn.addClass('btn-light');
        rbtn.addClass('mr-3');
        rbtn.innerHTML='<i class="far fa-thumbs-up"></i> '+comDat.reps[i].likes;
        rbtn.attr('id',comDat.id+'r'+comDat.reps[i].id);
        rbtn.attr('onclick','likeCom('+comDat.id+','+comDat.reps[i].id+')');
        rbtns.appendChild(rbtn);
        rfoot.appendChild(rbtns);*/
        rep.appendChild(rHd);
        rep.appendChild(rbod);
        //rep.appendChild(rfoot);
        reps.appendChild(rep);
    }
    cont.appendChild(reps);
    return cont;
}