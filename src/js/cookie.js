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
            document.getElementById('favCount').innerText = data.favs;
            document.getElementById('likeCount').innerText = data.likes;
        }
    });
    set(child(cookRef, 'pop'), increment(1));
    set(databaseRef(RTDB, 'uptCook/' + id), "true");

    function sendRep() {
        addDoc(collection(FSDB, 'reports'), {
            from: email,
            reason: document.getElementById('inReas').value,
            comm: reporting,
            mess: document.getElementById('inText').value,
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
    document.getElementById("frmRprt").addEventListener("submit", function (event) {
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
            text: document.getElementById('inNwCom').value,
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
            document.getElementById('frmNwComBtns').classList.add('d-none');
            if (lang == "es") {
                document.getElementById('inNwCom').setAttribute('placeholder', 'Nuevo comentario');
                document.getElementById('btnAddCom').innerHTML = 'Comentar';
            } else if (lang == "en") {
                document.getElementById('inNwCom').setAttribute('placeholder', 'New comment');
                document.getElementById('btnAddCom').innerHTML = 'Comment';
            }
            document.getElementById('btnCanCom').classList.remove('disabled');
            document.getElementById('btnAddCom').classList.remove('disabled');
            document.getElementById('inNwCom').value = '';
        }).catch(err => { console.log('err') });
    }
    document.getElementById("frmNwCom").addEventListener("submit", function (event) {
        event.preventDefault();
        if (actSsn) {
            document.getElementById('btnAddCom').classList.add('disabled');
            document.getElementById('btnCanCom').classList.add('disabled');
            document.getElementById('btnAddCom').innerHTML = '<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>';
            sendNwCom();
        }
    });
}

document.getElementById('btnFav').onclick = function () {
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
                document.getElementById('btnFav').innerHTML = langTxt + '  <i class="far fa-heart"></i> <span class="badge badge-dark ml-2" id="favCount"></span>';
                document.getElementById('btnFav').classList.remove('btn-light');
                document.getElementById('btnFav').classList.add('btn-outline-light');
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
                    document.getElementById('btnLike').innerHTML = langTxt + ' <i class="fas fa-thumbs-up"></i> <span class="badge badge-dark ml-2" id="likeCount"></span>';
                    document.getElementById('btnLike').classList.remove('btn-outline-light');
                    document.getElementById('btnLike').classList.add('btn-light');
                }
                else npop = 20;
                nfav = 1;
                let langTxt = "En mis favoritos";
                if (lang == "en") {
                    langTxt = "In my favorites";
                }
                document.getElementById('btnFav').innerHTML = langTxt + '  <i class="fas fa-heart"></i> <span class="badge badge-dark ml-2" id="favCount"></span>';
                document.getElementById('btnFav').classList.remove('btn-outline-light');
                document.getElementById('btnFav').classList.add('btn-light');
            }
            return updateDoc(docRef(FSDB, 'users', uid), userData);
        }).then(() => {
            set(child(cookRef, 'pop'), increment(npop));
            set(child(cookRef, 'likes'), increment(nlik));
            set(child(cookRef, 'favs'), increment(nfav));
        }).catch(function (err) { console.log('err') });
    } else {
        if (lang == "es") {
            document.getElementById('mdlRgsL').innerHTML = 'Debes iniciar sesión o registrarte para continuar';
        } else if (lang == "en") {
            document.getElementById('mdlRgsL').innerHTML = 'You must log in or sign in before you continue';
        }
        $('#mdlRgstr').modal('show');
    }
};
document.getElementById('btnLike').onclick = function () {
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
                document.getElementById('btnLike').innerHTML = langTxt + ' <i class="fas fa-thumbs-up"></i> <span class="badge badge-dark ml-2" id="likeCount"></span>';
                document.getElementById('btnLike').classList.remove('btn-outline-light');
                document.getElementById('btnLike').classList.add('btn-light');
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
                    document.getElementById('btnFav').innerHTML = langTxt + '  <i class="far fa-heart"></i> <span class="badge badge-dark ml-2" id="favCount"></span>';
                    document.getElementById('btnFav').classList.remove('btn-light');
                    document.getElementById('btnFav').classList.add('btn-outline-light');
                }
                let langTxt = "Dar me gusta";
                if (lang == "en") {
                    langTxt = "Like";
                }
                nlik = -1;
                document.getElementById('btnLike').innerHTML = langTxt + ' <i class="far fa-thumbs-up"></i> <span class="badge badge-dark ml-2" id="likeCount"></span>';
                document.getElementById('btnLike').classList.remove('btn-light');
                document.getElementById('btnLike').classList.add('btn-outline-light');
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
            document.getElementById('mdlRgsL').innerHTML = 'Debes iniciar sesión o registrarte para continuar';
        } else if (lang == "en") {
            document.getElementById('mdlRgsL').innerHTML = 'You must log in or sign in before you continue';
        }
        $('#mdlRgstr').modal('show');
    }
};
$('#mdlRgstr').on('hidden.bs.modal', function (e) {
    if (lang == "es") {
        document.getElementById('mdlRgsL').innerHTML = 'Inicia sesión o regístrate';
    } else if (lang == "en") {
        document.getElementById('mdlRgsL').innerHTML = 'Log in or sign in';
    }
});

document.getElementById('inNwCom').onfocus = function () {
    if (actSsn) {
        document.getElementById('frmNwComBtns').classList.remove('d-none');
    } else {
        if (lang == "es") {
            document.getElementById('mdlRgsL').innerHTML = 'Debes iniciar sesión o registrarte para continuar';
        } else if (lang == "en") {
            document.getElementById('mdlRgsL').innerHTML = 'You must log in or sign in before you continue';
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
            document.getElementById('mdlRgsL').innerHTML = 'Debes iniciar sesión o registrarte para continuar';
        } else if (lang == "en") {
            document.getElementById('mdlRgsL').innerHTML = 'You must log in or sign in before you continue';
        }
        $('#mdlRgstr').modal('show');
    }
}
window.reply = function reply(r) {
    replying = r;
    document.getElementById('btnsFL').scroll({ behavior: 'smooth' });
    if (lang == "es") {
        document.getElementById('inNwCom').setAttribute('placeholder', 'Nueva respuesta');
    } else if (lang == "en") {
        document.getElementById('inNwCom').setAttribute('placeholder', 'New reply');
    }
    document.getElementById('inNwCom').focus();
}
/*function likeCom(p,s){
    if(s==null){
        @#NOT IMPLEMENTED
        @#EXPENSIVE?
    }
}*/

document.getElementById('btnLdComs').onclick = function () {
    document.getElementById('btnLdComs').classList.add('d-none');
    document.getElementById('spnCom').classList.remove('d-none');
    getDoc(collection(FSDB, 'cookies/comments/' + id), '1').then(doc => {
        if (doc.exists) {
            comList = doc.data().coms;
            comCount = doc.data().comCount;
            drwComs(comNum);
        } else {
            document.getElementById('spnCom').classList.add('d-none');
            document.getElementById('cntComs').classList.remove('d-none');
            document.getElementById('cntComs2').classList.remove('d-none');
        }
    }).catch(err => { console.log('err') });
};

function drwComs(num) {
    document.getElementById('btnLdMrComs').classList.add('d-none');
    let comTxt;
    if (lang == "es") {
        comTxt = 'comentario';
    } else if (lang == "en") {
        comTxt = 'comment';
    }
    document.getElementById('cntComs2').innerHTML = '';
    document.getElementById('comCount').innerHTML = comCount + ' ' + comTxt;
    if (comCount != 1) document.getElementById('comCount').innerHTML += 's';
    for (let i = 1; i <= num; i++) {
        if (i > comList.length) break;
        if (comList[comList.length - i] == null) continue;
        document.getElementById('cntComs2').appendChild(createCom(comList[comList.length - i]));
    }
    if (comList.length > num) document.getElementById('btnLdMrComs').classList.remove('d-none');
    document.getElementById('spnCom').classList.add('d-none');
    document.getElementById('cntComs').classList.remove('d-none');
    document.getElementById('cntComs2').classList.remove('d-none');
}

function createCom(comDat) {
    let cont = document.createElement('div');
    cont.classList.add('container-fluid');
    cont.classList.add('bg-light');
    cont.classList.add('rounded-lg');
    cont.classList.add('p-2');
    cont.classList.add('mb-1');
    let head = document.createElement('div');
    head.classList.add('row');
    head.classList.add('justify-content-between');
    let usr = document.createElement('div');
    usr.classList.add('col-auto');
    let a = document.createElement('a');
    a.classList.add('text-decoration-none');
    a.classList.add('text-dark');
    a.href = '../../ver-perfil?user=' + comDat.shortID;
    a.innerHTML = '<img src="' + comDat.pic + '" alt="" class="rounded-circle mr-2" height="35" width="35" onerror="this.src=`https://via.placeholder.com/20.webp`">' + comDat.from;
    usr.appendChild(a);
    head.appendChild(usr);
    let rprt = document.createElement('div');
    rprt.classList.add('col-auto');
    rprt.classList.add('dropleft');
    let btnRprt = document.createElement('button');
    btnRprt.classList.add('btn');
    btnRprt.classList.add('btn-light');
    btnRprt.setAttribute('data-toggle', 'dropdown');
    btnRprt.setAttribute('aria-haspopup', 'true');
    btnRprt.setAttribute('aria-expanded', 'false');
    btnRprt.innerHTML = '<i class="fas fa-ellipsis-h"></i>';
    rprt.appendChild(btnRprt);
    let drpRprt = document.createElement('div');
    drpRprt.classList.add('dropdown-menu');
    drpRprt.classList.add('border-0');
    let aux = id + 'c' + comDat.id;
    aux = ("'").concat(aux).concat("'");
    let reportTxt = "";
    if (lang == "es") {
        reportTxt = 'ar';
    }
    drpRprt.innerHTML = '<button class="dropdown-item" onclick="report(' + aux + ');"><i class="fas fa-flag"></i> Report' + reportTxt + '</button>';
    rprt.appendChild(drpRprt);
    head.appendChild(rprt);
    let bod = document.createElement('div');
    bod.classList.add('row');
    bod.classList.add('pl-3');
    bod.classList.add('pr-2');
    let p = document.createElement('p');
    p.innerText = comDat.text;
    bod.appendChild(p);
    let foot = document.createElement('div');
    foot.classList.add('row');
    let btns = document.createElement('div');
    btns.classList.add('col-auto');
    let btn = document.createElement('button');
    /*@#btn.classList.add('btn');
    btn.classList.add('btn-light');
    btn.classList.add('mr-3');
    btn.innerHTML='<i class="far fa-thumbs-up"></i> '+comDat.likes;
    btn.setAttribute('id',comDat.id);
    btn.setAttribute('onclick','likeCom('+comDat.id+')');
    btns.appendChild(btn);
    btn=document.createElement('button');*/
    btn.classList.add('btn');
    btn.classList.add('btn-science');
    btn.classList.add('mr-3');
    btn.setAttribute('onclick', 'reply(' + comDat.id + ')');
    if (lang == "es") {
        btn.innerHTML = 'Responder';
    } else if (lang == "en") {
        btn.innerHTML = 'Reply';
    }
    btns.appendChild(btn);
    if (comDat.reps.length > 0) {
        btn = document.createElement('button');
        btn.classList.add('btn');
        btn.classList.add('btn-link-science');
        btn.setAttribute('onclick', 'document.getElementById("' + comDat.id + 'Reps").classList.toggle("d-none")');
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
    let reps = document.createElement('div');
    reps.classList.add('row');
    reps.classList.add('pl-4');
    reps.classList.add('pt-2');
    reps.classList.add('d-none');
    reps.setAttribute('id', comDat.id + 'Reps');
    for (let i = 0; i < comDat.reps.length; i++) {
        let rep = document.createElement('div');
        rep.classList.add('col-11');
        rep.classList.add('p-2');
        rep.classList.add('rounded-lg');
        rep.classList.add('mb-1');
        rep.classList.add('ml-auto');
        rep.classList.add('mr-2');
        rep.classList.add('border');
        let rHd = document.createElement('div');
        rHd.classList.add('row');
        rHd.classList.add('justify-content-between');
        let rusr = document.createElement('div');
        rusr.classList.add('col-auto');
        let ra = document.createElement('a');
        ra.classList.add('text-decoration-none');
        ra.classList.add('text-dark');
        ra.href = '../../ver-perfil?user=' + comDat.reps[i].shortID;
        ra.innerHTML = '<img src="' + comDat.reps[i].pic + '" alt="" class="rounded-circle mr-2" height="35" width="35" onerror="this.src=`https://via.placeholder.com/20.webp`">' + comDat.reps[i].from;
        rusr.appendChild(ra);
        rHd.appendChild(rusr);
        let rrprt = document.createElement('div');
        rrprt.classList.add('col-auto');
        rrprt.classList.add('dropleft');
        let rbtnRprt = document.createElement('button');
        rbtnRprt.classList.add('btn');
        rbtnRprt.classList.add('btn-light');
        rbtnRprt.setAttribute('data-toggle', 'dropdown');
        rbtnRprt.setAttribute('aria-haspopup', 'true');
        rbtnRprt.setAttribute('aria-expanded', 'false');
        rbtnRprt.innerHTML = '<i class="fas fa-ellipsis-h"></i>';
        rrprt.appendChild(rbtnRprt);
        let rdrpRprt = document.createElement('div');
        rdrpRprt.classList.add('dropdown-menu');
        rdrpRprt.classList.add('border-0');
        let raux = id + 'c' + comDat.id + 'r' + comDat.reps[i].id;
        raux = ("'").concat(raux).concat("'");
        let reportTxt = "";
        if (lang == "es") {
            reportTxt = 'ar';
        }
        rdrpRprt.innerHTML = '<button class="dropdown-item" onclick="report(' + raux + ');"><i class="fas fa-flag"></i> Report' + reportTxt + '</button>';
        rrprt.appendChild(rdrpRprt);
        rHd.appendChild(rrprt);
        let rbod = document.createElement('div');
        rbod.classList.add('row');
        rbod.classList.add('pl-3');
        rbod.classList.add('pr-2');
        let rp = document.createElement('p');
        rp.innerText = comDat.reps[i].text;
        rbod.appendChild(rp);
        /*@#let rfoot=document.createElement('div');
        rfoot.classList.add('row');
        let rbtns=document.createElement('div');
        rbtns.classList.add('col-auto');
        let rbtn=document.createElement('button');
        rbtn.classList.add('btn');
        rbtn.classList.add('btn-light');
        rbtn.classList.add('mr-3');
        rbtn.innerHTML='<i class="far fa-thumbs-up"></i> '+comDat.reps[i].likes;
        rbtn.setAttribute('id',comDat.id+'r'+comDat.reps[i].id);
        rbtn.setAttribute('onclick','likeCom('+comDat.id+','+comDat.reps[i].id+')');
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