import { getFunctions, httpsCallable } from "firebase/functions";
const FUNCTIONS = getFunctions();

//Global
var points, rank, gotFL = false;
var favn, favl, likedn, likedl;
var ppic, pname, pemail;
var visible, vmail, vfl;

window.loaded = function loaded() {
    shwCrds(urlSrch.get('tab'), urlSrch.get('user'));
}

function shwPrfl() {
    document.getElementById('navBtnPrfl').classList.add('active');
    firebase.storage().ref('ppics/' + urlSrch.get('u') + '/pp_200x200').getDownloadURL().then(url => {
        if (ppic != null) document.getElementById('disPP').setAttribute('onerror', "this.src='" + ppic + "'");
        else document.getElementById('disPP').setAttribute('onerror', "this.src='https://via.placeholder.com/20.webp'");
        document.getElementById('disPP').src = url;
        if (pemail != null) document.getElementById('contEmail').classList.remove('d-none');
        document.getElementById('disMail').innerHTML = pemail;
        document.getElementById('disName').innerHTML = pname;
        document.getElementById('crdPrfl').classList.remove('d-none');
    }).catch(err => {
        if (ppic != null) document.getElementById('disPP').setAttribute('onerror', "this.src='" + ppic + "'");
        else document.getElementById('disPP').setAttribute('onerror', "https://via.placeholder.com/20.webp'");
        document.getElementById('disPP').src = '';
        if (pemail != null) document.getElementById('contEmail').classList.remove('d-none');
        document.getElementById('disMail').innerHTML = pemail;
        document.getElementById('disName').innerHTML = pname;
        document.getElementById('crdPrfl').classList.remove('d-none');
    });
}
function shwFav() {
    if (favn == null) return;
    document.getElementById('navBtnFav').classList.add('active');
    let favStr = '';
    favn.forEach(function (itm, idx) {
        favStr = favStr + '<li class="list-group-item text-light border-light bg-transparent"><a class="text-decoration-none text-light" href="galletas/' + favl[idx] + '">' + itm + ' <i class="fas fa-link"></i></a></li>';
    });
    document.getElementById('cntFav').innerHTML = favStr;
    document.getElementById('crdFav').classList.remove('d-none');
}
function shwLike() {
    if (likedn == null) return;
    document.getElementById('navBtnLike').classList.add('active');
    let likedStr = '';
    likedn.forEach(function (itm, idx) {
        likedStr = likedStr + '<li class="list-group-item text-light border-light bg-transparent"><a class="text-decoration-none text-light" href="galletas/' + likedl[idx] + '">' + itm + ' <i class="fas fa-link"></i></a></li>';
    });
    document.getElementById('cntLike').innerHTML = likedStr;
    document.getElementById('crdLike').classList.remove('d-none');
}
function shwCrds(t, u) {
    if ((u == null || u == '') && !gotFL) {
        window.location.href = 'https://sciencecookies.net';
    }
    if (t == null || favn == null) t = 'prof';
    if (gotFL == false) {
        const getUserPublic = httpsCallable(FUNCTIONS, 'users-getUserPublic');
        getUserPublic(u).then(userPublic => {
            userPublic = userPublic.data;
            if (userPublic == null) {
                document.getElementById('navBtnFav').classList.add('disabled');
                document.getElementById('navBtnLike').classList.add('disabled');
                document.getElementById('navBtnPrfl').classList.add('disabled');
                document.getElementById('contEmail').classList.add('d-none');
                document.getElementById('contPic').classList.add('d-none');
                document.getElementById('contNull').innerHTML = '<div class="col"><strong>Este perfíl no existe o es privado</strong></div>';
                document.getElementById('crdPrfl').classList.remove('d-none');
            } else {
                favn = userPublic.favn;
                favl = userPublic.favl;
                likedn = userPublic.likedn;
                likedl = userPublic.likedl;
                points = userPublic.points;
                rank = userPublic.rank;
                visible = userPublic.visible;
                vemail = userPublic.vemail;
                vfl = userPublic.vfl;
                ppic = userPublic.ppic;
                pemail = userPublic.pemail;
                pname = userPublic.pname;
                if (favn == null) {
                    document.getElementById('navBtnFav').classList.add('disabled');
                    document.getElementById('navBtnLike').classList.add('disabled');
                }
                shwCrds2(t);
            }
        }).catch(err => { });
        gotFL = true;
    } else {
        shwCrds2(t);
    }
}
function shwCrds2(t) {
    if (t == 'favs') {
        if (favn == null) return;
        document.getElementById('crdPrfl').classList.add('d-none');
        document.getElementById('navBtnPrfl').classList.remove('active');
        document.getElementById('crdLike').classList.add('d-none');
        document.getElementById('navBtnLike').classList.remove('active');
        shwFav();
    } else {
        if (t == 'likes') {
            if (likedn == null) return;
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