var cookRef = null;
var pubID;
var replying = -1;

window.loaded = function loaded() {
    cookRef = firebase.database().ref('galletas/' + id);
    console.log(cRef)
    cookRef.on('value', snap => {
        if (snap.val()) {
            document.getElementById('favCount').innerText = snap.val().favs;
            document.getElementById('likeCount').innerText = snap.val().likes;
        }
    });
    cookRef.transaction(cook => {
        if (cook) {
            cook.pop++;
        }
        return cook;
    });
    firebase.database().ref('uptCook/' + id).set("true").then(() => { }).catch(err => console.error('err'));

    function sendRep() {
        db.collection('reports').add({
            from: email,
            reason: document.getElementById('inReas').value,
            comm: reporting,
            mess: document.getElementById('inText').value,
        }).then(function () {
            if (lang = "es") {
                alertTop("Gracias por tu reporte, lo revisaremos lo antes posible.", 2);
            } else if (lang = "en") {
                alertTop("Thank you for your report, we will review it as soon as posible.", 2);
            }
            $('#mdlRprt').modal('hide');
        }).catch(function (err) {
            console.log('err');
            if (lang = "es") {
                alertTop("Ha ocurrido un error, por favor intenta nuevamente.", 0);
            } else if (lang = "en") {
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
        var addComment = firebase.app().functions('us-east1').httpsCallable('addComment');
        let comFrm = {
            id: id,
            from: displayName,
            pic: photoURL,
            authKey: pubID,
            to: replying,
            text: document.getElementById('inNwCom').value,
        };
        addComment(comFrm).then(comres => {
            if (comres.data.res == -1) {
                if (lang = "es") {
                    alertTop("Ha ocurrido un error, por favor intenta nuevamente.", 0);
                } else if (lang = "en") {
                    alertTop("There has been an error, please try again.", 0);
                }
                $('#mdlRprt').modal('hide');
            } else {
                if (comres.data.res == -2) {
                    drwComs(comNum);
                    let bdate = new Date(comres.data.blc._seconds * 1000);
                    let dstr = bdate.getDate() + '/' + (bdate.getMonth() + 1) + '/' + bdate.getFullYear();
                    if (lang = "es") {
                        alertTop("No puedes comentar. Un moderador te ha bloqueado hasta " + dstr, 0);
                    } else if (lang = "en") {
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
                    if (lang = "es") {
                        alertTop("Se ha publicado tu comentario", 1);
                    } else if (lang = "en") {
                        alertTop("Your comment has been published", 1);
                    }
                    $('#mdlRprt').modal('hide');
                }
            }
            replying = -1;
            document.getElementById('frmNwComBtns').classList.add('d-none');
            document.getElementById('inNwCom').setAttribute('placeholder', 'Nuevo comentario');
            document.getElementById('btnAddCom').innerHTML = 'Comentar';
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
        db.collection('users').doc(uid).get().then(function (doc) {
            let fav = doc.data().fav;
            let favn = doc.data().favn;
            let favl = doc.data().favn;
            let liked = doc.data().liked;
            let likedn = doc.data().likedn;
            let likedl = doc.data().likedl;
            let ifav = fav.indexOf(id);
            let iliked = liked.indexOf(id);
            let npop = 0, nlik = 0, nfav = 0;
            if (ifav != -1) {
                fav.splice(ifav, 1);
                favn.splice(favn.indexOf(cTitle), 1);
                favl.splice(favl.indexOf(cRef), 1);
                document.getElementById('btnFav').innerText = 'Añadir a favoritos';
                document.getElementById('btnFavTxt').classList.remove('fas');
                document.getElementById('btnFavTxt').classList.add('far');
                document.getElementById('btnFav').classList.remove('btn-light');
                document.getElementById('btnFav').classList.add('btn-outline-light');
                npop = -20;
                nfav = -1;
            }
            else {
                fav.push(id);
                favn.push(cTitle);
                favl.push(cRef);
                if (iliked == -1) {
                    liked.push(id);
                    likedn.push(cTitle);
                    likedl.push(cRef);
                    npop = 30;
                    nlik = 1;
                    document.getElementById('btnLike').innerText = 'Me gusta';
                    document.getElementById('btnLikeTxt').classList.add('fas');
                    document.getElementById('btnLikeTxt').classList.remove('far');
                    document.getElementById('btnLike').classList.remove('btn-outline-light');
                    document.getElementById('btnLike').classList.add('btn-light');
                }
                else npop = 20;
                nfav = 1;
                document.getElementById('btnFav').innerText = 'En mis favoritos';
                document.getElementById('btnFavTxt').classList.remove('far');
                document.getElementById('btnFavTxt').classList.add('fas');
                document.getElementById('btnFav').classList.remove('btn-outline-light');
                document.getElementById('btnFav').classList.add('btn-light');
            }
            return db.collection('users').doc(uid).update({
                fav: fav,
                liked: liked,
                favn: favn,
                favl: favl,
                likedn: likedn,
                likedl: likedl,
            });
        }).then(() => {
            return db.collection('usersPublic').doc(pubID).update({
                name: displayName,
                pic: photoURL,
                email: email,
                favn: favn,
                favl: favl,
                likedn: likedn,
                likedl: likedl,
            });
        }).then(() => {
            cookRef.transaction(cook => {
                if (cook) {
                    cook.pop += npop;
                    cook.likes += nlik;
                    cook.favs += nfav;
                }
                return cook;
            });
        }).catch(function (err) { console.log('err') });
    } else {
        document.getElementById('mdlRgsL').innerHTML = 'Debes iniciar sesión o registrarte para continuar';
        $('#mdlRgstr').modal('show');
    }
};
document.getElementById('btnLike').onclick = function () {
    if (actSsn) {
        db.collection('users').doc(uid).get().then(function (doc) {
            let fav = doc.data().fav;
            let favn = doc.data().favn;
            let favl = doc.data().favn;
            let liked = doc.data().liked;
            let likedn = doc.data().likedn;
            let likedl = doc.data().likedl;
            let ifav = fav.indexOf(id);
            let iliked = liked.indexOf(id);
            let npop = 0, nlik = 0, nfav = 0;
            if (iliked == -1) {
                liked.push(id);
                likedn.push(cTitle);
                likedl.push(cRef);
                npop = 10;
                nlik = 1;
                document.getElementById('btnLike').innerText = 'Me gusta';
                document.getElementById('btnLikeTxt').classList.add('fas');
                document.getElementById('btnLikeTxt').classList.remove('far');
                document.getElementById('btnLike').classList.remove('btn-outline-light');
                document.getElementById('btnLike').classList.add('btn-light');
            }
            else {
                liked.splice(iliked, 1);
                likedn.splice(likedn.indexOf(cTitle), 1);
                likedl.splice(likedl.indexOf(cRef), 1);
                if (ifav == -1) npop = -10;
                else {
                    fav.splice(ifav, 1);
                    favn.splice(favn.indexOf(cTitle), 1);
                    favl.splice(favl.indexOf(cRef), 1);
                    npop = -30;
                    nfav = -1;
                    document.getElementById('btnFav').innerText = 'Añadir a favoritos';
                    document.getElementById('btnFavTxt').classList.remove('fas');
                    document.getElementById('btnFavTxt').classList.add('far');
                    document.getElementById('btnFav').classList.remove('btn-light');
                    document.getElementById('btnFav').classList.add('btn-outline-light');
                }
                nlik = -1;
                document.getElementById('btnLike').innerText = 'Dar me gusta';
                document.getElementById('btnLikeTxt').classList.add('far');
                document.getElementById('btnLikeTxt').classList.remove('fas');
                document.getElementById('btnLike').classList.remove('btn-light');
                document.getElementById('btnLike').classList.add('btn-outline-light');
            }
        }).then(() => {
            return db.collection('users').doc(uid).update({
                fav: fav,
                liked: liked,
                favn: favn,
                favl: favl,
                likedn: likedn,
                likedl: likedl,
            });
        }).then(() => {
            return db.collection('usersPublic').doc(pubID).update({
                name: displayName,
                pic: photoURL,
                email: email,
                favn: favn,
                favl: favl,
                likedn: likedn,
                likedl: likedl,
            });
        }).then(() => {
            cookRef.transaction(cook => {
                if (cook) {
                    cook.pop += npop;
                    cook.likes += nlik;
                    cook.favs += nfav;
                }
                return cook;
            });
        }).catch(function (err) { console.log('err') });
    } else {
        document.getElementById('mdlRgsL').innerHTML = 'Debes iniciar sesión o registrarte para continuar';
        $('#mdlRgstr').modal('show');
    }
};
$('#mdlRgstr').on('hidden.bs.modal', function (e) {
    document.getElementById('mdlRgsL').innerHTML = 'Inicia sesión o regístrate';
});

document.getElementById('inNwCom').onfocus = function () {
    if (actSsn) {
        document.getElementById('frmNwComBtns').classList.remove('d-none');
    } else {
        document.getElementById('mdlRgsL').innerHTML = 'Inicia sesión o regístrate para continuar';
        $('#mdlRgstr').modal('show');
    }
};

var comList = [], comNum = 5, comCount = 0;
var reporting = null;
function report(r) {
    if (actSsn) {
        reporting = r;
        $('#mdlRprt').modal('show');
    } else {
        document.getElementById('mdlRgsL').innerHTML = 'Inicia sesión o regístrate para continuar';
        $('#mdlRgstr').modal('show');
    }
}
function reply(r) {
    replying = r;
    document.getElementById('btnsFL').scroll({ behavior: 'smooth' });
    document.getElementById('inNwCom').setAttribute('placeholder', 'Nueva respuesta');
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
    cookiesFSRef.doc(id).collection('coms').doc('1').get().then(doc => {
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
    document.getElementById('cntComs2').innerHTML = '';
    document.getElementById('comCount').innerHTML = comCount + ' comentario';
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
    a.href = '../../ver-perfil?user=' + comDat.authKey;
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
    drpRprt.innerHTML = '<button class="dropdown-item" onclick="report(' + aux + ');"><i class="fas fa-flag"></i> Reportar</button>';
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
    btn.classList.add('btn-scckie');
    btn.classList.add('mr-3');
    btn.setAttribute('onclick', 'reply(' + comDat.id + ')');
    btn.innerHTML = 'Responder';
    btns.appendChild(btn);
    if (comDat.reps.length > 0) {
        btn = document.createElement('button');
        btn.classList.add('btn');
        btn.classList.add('btn-link-scckie');
        btn.setAttribute('onclick', 'document.getElementById("' + comDat.id + 'Reps").classList.toggle("d-none")');
        btn.innerHTML = 'Respuestas <i class="fas fa-caret-down"></i>';
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
        ra.href = '../../ver-perfil?user=' + comDat.reps[i].authKey;
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
        rdrpRprt.innerHTML = '<button class="dropdown-item" onclick="report(' + raux + ');"><i class="fas fa-flag"></i> Reportar</button>';
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