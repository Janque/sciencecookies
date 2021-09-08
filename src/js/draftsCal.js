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

import { query, orderBy, limit, startAfter, getDocs } from "firebase/firestore/lite";

window.loaded = function loaded() {
    initSrch(false);
}

const previewLim = 21;
//Get search params
var nxtp = false, paglast = [null], page = 1;
function initSrch(stAf) {
    if (page > 1 && stAf && paglast[page - 1] != null && paglast[page - 1] != undefined) {
        srchQuery = query(calendarsFSColl, orderBy('published', 'desc'), startAfter(paglast[page - 1]), limit(previewLim));
    } else {
        srchQuery = query(calendarsFSColl, orderBy('published', 'desc'), limit(previewLim));
    }
    shwSrch();
}
function shwSrch() {
    document.getElementById('crdContainer').innerHTML = "";
    getDocs(srchQuery).then(snap => {
        let docs = snap.docs;
        nxtp = false;
        docs.forEach((doc, idx) => {
            let dat = doc.data();

            let col = document.createElement('col');
            classes(col, 'col');
            classes(col, 'mb-4');

            let card = document.createElement('div');
            classes(card, "card text-dark bg-light h-100 cardBorder");
            if (dat.public) {
                classes(card, 'border-success');
            } else {
                classes(card, 'border-secondary');
            }

            let h = document.createElement('div');
            classes(h, "card-header bg-light m-0 py-0 text-right")
            let row = document.createElement('div');
            classes(row, 'row');
            classes(row, 'justify-content-between');
            if (!dat.public) {
                let col0 = document.createElement('div');
                classes(col0, 'col-auto');
                classes(col0, 'p-0');
                let badge = document.createElement('span');
                classes(badge, 'badge');
                classes(badge, 'badge-warning');
                if (lang == "es") {
                    badge.innerText = 'Pendiente';
                } else if (lang == "en") {
                    badge.innerText = 'Pending';
                }
                col0.appendChild(badge);
                row.appendChild(col0);
            }
            let col1 = document.createElement('div');
            classes(col1, 'col-auto');
            classes(col1, 'p-0');
            classes(col1, 'ml-auto');
            let drp = document.createElement('div');
            classes(drp, 'dropdown');
            let btndrp = document.createElement('button');
            classes(btndrp, 'btn');
            classes(btndrp, 'btn-light');
            btndrp.setAttribute('type', 'button');
            btndrp.setAttribute('data-toogle', 'dropdown');
            btndrp.setAttribute('aria-haspopup', "true");
            btndrp.setAttribute('aria-expanded', "false");
            btndrp.innerHTML = '<i class="fas fa-ellipsis-h"></i>';
            btndrp.onclick = function () {
                if (document.getElementById("drpMenu" + doc.id).classList.contains('show')) {
                    $("#drpMenu" + doc.id).dropdown('hide');
                } else {
                    $("#drpMenu" + doc.id).dropdown('show');
                    setTimeout(function () {
                        $("#drpMenu" + doc.id).dropdown('hide');
                    }, 5000);
                }
            };
            drp.appendChild(btndrp);
            let drpmenu = document.createElement('div');
            classes(drpmenu, 'dropdown-menu');
            classes(drpmenu, 'dropdown-menu-right');
            drpmenu.setAttribute('id', "drpMenu" + doc.id);
            let drpitm0 = document.createElement('button');
            classes(drpitm0, 'dropdown-item');
            drpitm0.onclick = function () {
                if (lang == "es") {
                    window.location.href = '../editar-calendario?id=' + doc.id;
                } else if (lang == "en") {
                    window.location.href = '../edit-calendar?id=' + doc.id;
                }
            };
            if (lang == "es") {
                drpitm0.innerHTML = 'Editar <i class="fas fa-edit"></i>';
            } else if (lang == "en") {
                drpitm0.innerHTML = 'Edit <i class="fas fa-edit"></i>';
            }
            drpmenu.appendChild(drpitm0);
            let drpitm1 = document.createElement('button');
            classes(drpitm1, 'dropdown-item');
            drpitm1.onclick = function () {
                window.open('../vista-email-calendario/' + doc.id, '_blank').focus();
            };
            if (lang == "es") {
                drpitm1.innerHTML = 'Vista correo <i class="fas fa-envelope"></i>';
            } else if (lang == "en") {
                drpitm1.innerHTML = 'Mail preview <i class="fas fa-envelope"></i>';
            }
            drpmenu.appendChild(drpitm1);
            let drpitm2 = document.createElement('button');
            if (dat.public) {
                classes(drpitm2, 'dropdown-item');
                drpitm2.onclick = function () {
                    window.open(dat.url, '_blank').focus();
                };
                if (lang == "es") {
                    drpitm2.innerHTML = 'Ver Galleta <i class="fas fa-eye"></i>';
                } else if (lang == "en") {
                    drpitm2.innerHTML = 'View Cookie <i class="fas fa-eye"></i>';
                }
                drpmenu.appendChild(drpitm2);
            }
            drp.appendChild(drpmenu);
            col1.appendChild(drp);
            row.appendChild(col1);
            h.appendChild(row);
            card.appendChild(h);

            let noImgTxt;
            if (lang == "es") {
                noImgTxt = "No hay imagen";
            } else if (lang == "en") {
                noImgTxt = "No image";
            }

            let a = document.createElement('a');
            if (lang == "es") {
                a.href = '../editar-calendario?id=' + doc.id;
            } else if (lang == "en") {
                a.href = '../edit-calendar?id=' + doc.id;
            }
            classes(a, 'text-decoration-none');
            classes(a, 'text-dark');
            let img = document.createElement('img');
            img.src = dat.picUrl;
            classes(img, 'card-img-top');
            img.alt = noImgTxt;
            a.appendChild(img);
            let cbody = document.createElement('div');
            classes(cbody, 'card-body');
            cbody.innerHTML = '<h3 class="card-title">' + dat.title + '</h3>\n<p class="card-text">' + dat.description + '</p>\n'
            a.appendChild(cbody);
            card.appendChild(a);

            col.appendChild(card);
            document.getElementById('crdContainer').appendChild(col);
            if (idx == previewLim - 1) {
                if (paglast[page] == undefined || paglast[page] == null) {
                    paglast.push(docs[docs.length - 1]);
                } else if (paglast[page] != docs[docs.length - 1]) {
                    paglast.splice(page, 1, docs[docs.length - 1]);
                }
                nxtp = true;
                document.getElementById("pgNavT").classList.remove('d-none');
                document.getElementById("pgNavB").classList.remove('d-none');
            }
        });
        if (!nxtp) {
            document.getElementById("pgTNxt").setAttribute('disabled', 'true');
            document.getElementById("pgBNxt").setAttribute('disabled', 'true');
        } else {
            document.getElementById("pgTNxt").removeAttribute('disabled');
            document.getElementById("pgBNxt").removeAttribute('disabled');
        }
        if (page == 1) {
            document.getElementById("pgTPrv").setAttribute('disabled', 'true');
            document.getElementById("pgBPrv").setAttribute('disabled', 'true');
        } else {
            document.getElementById("pgTPrv").removeAttribute('disabled');
            document.getElementById("pgBPrv").removeAttribute('disabled');
        }
    }).catch(err => { console.log(err) });
}

document.getElementById("pgTPrv").onclick = function () { reSrch(-1); };
document.getElementById("pgBPrv").onclick = function () { reSrch(-1); };
document.getElementById("pgTNxt").onclick = function () { reSrch(1); };
document.getElementById("pgBNxt").onclick = function () { reSrch(1); };
function reSrch(np) {
    if (page < 1 && np == -1) return;
    if (!nxtp && np == 1) return;
    page += np;
    document.getElementById('disPgT').innerText = page;
    document.getElementById('disPgB').innerText = page;
    initSrch(true);
    document.getElementById("cookCnt").scrollIntoView();
}