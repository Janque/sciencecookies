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
    $('#crdContainer').html("");
    getDocs(srchQuery).then(snap => {
        let docs = snap.docs;
        nxtp = false;
        docs.forEach((doc, idx) => {
            let dat = doc.data();

            let col = $('<div></div>');
            classes(col, 'col mb-4');

            let card = $('<div></div>');
            classes(card, "card text-dark bg-light h-100 cardBorder");
            if (dat.public) {
                classes(card, 'border-success');
            } else {
                classes(card, 'border-secondary');
            }

            let h = $('<div></div>');
            classes(h, "card-header bg-light m-0 py-0 text-right")
            let row = $('<div></div>');
            classes(row, 'row justify-content-between');
            if (!dat.public) {
                let col0 = $('<div></div>');
                classes(col0, 'col-auto p-0');
                let badge = $('<span></span>');
                classes(badge, 'badge badge-warning');
                if (lang == "es") {
                    badge.text('Pendiente');
                } else if (lang == "en") {
                    badge.text('Pending');
                }
                col0.appendChild(badge);
                row.appendChild(col0);
            }
            let col1 = $('<div></div>');
            classes(col1, 'col-auto p-0 ml-auto');
            let drp = $('<div></div>');
            classes(drp, 'dropdown');
            let btndrp = $('<button></button>');
            classes(btndrp, 'btn btn-light');
            btndrp.attr('type', 'button');
            btndrp.attr('data-toogle', 'dropdown');
            btndrp.attr('aria-haspopup', "true");
            btndrp.attr('aria-expanded', "false");
            btndrp.html('<i class="fas fa-ellipsis-h"></i>');
            btndrp.onclick = function () {
                if ($("#drpMenu" + doc.id).classList.contains('show')) {
                    $("#drpMenu" + doc.id).dropdown('hide');
                } else {
                    $("#drpMenu" + doc.id).dropdown('show');
                    setTimeout(function () {
                        $("#drpMenu" + doc.id).dropdown('hide');
                    }, 5000);
                }
            };
            drp.appendChild(btndrp);
            let drpmenu = $('<div></div>');
            classes(drpmenu, 'dropdown-menu dropdown-menu-right');
            drpmenu.attr('id', "drpMenu" + doc.id);
            let drpitm0 = $('<button></button>');
            classes(drpitm0, 'dropdown-item');
            drpitm0.onclick = function () {
                if (lang == "es") {
                    window.location.href = '../editar-calendario?id=' + doc.id;
                } else if (lang == "en") {
                    window.location.href = '../edit-calendar?id=' + doc.id;
                }
            };
            if (lang == "es") {
                drpitm0.html('Editar <i class="fas fa-edit"></i>');
            } else if (lang == "en") {
                drpitm0.html('Edit <i class="fas fa-edit"></i>');
            }
            drpmenu.appendChild(drpitm0);
            let drpitm1 = $('<button></button>');
            classes(drpitm1, 'dropdown-item');
            drpitm1.onclick = function () {
                window.open('../vista-email-calendario/' + doc.id, '_blank').focus();
            };
            if (lang == "es") {
                drpitm1.html('Vista correo <i class="fas fa-envelope"></i>');
            } else if (lang == "en") {
                drpitm1.html('Mail preview <i class="fas fa-envelope"></i>');
            }
            drpmenu.appendChild(drpitm1);
            let drpitm2 = $('<button></button>');
            if (dat.public) {
                classes(drpitm2, 'dropdown-item');
                drpitm2.onclick = function () {
                    window.open(dat.url, '_blank').focus();
                };
                if (lang == "es") {
                    drpitm2.html('Ver Galleta <i class="fas fa-eye"></i>');
                } else if (lang == "en") {
                    drpitm2.html('View Cookie <i class="fas fa-eye"></i>');
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

            let a = $('<a></a>');
            if (lang == "es") {
                a.href = '../editar-calendario?id=' + doc.id;
            } else if (lang == "en") {
                a.href = '../edit-calendar?id=' + doc.id;
            }
            classes(a, 'text-decoration-none text-dark');
            let img = $('<img/>');
            img.src = dat.picUrl;
            classes(img, 'card-img-top');
            img.alt = noImgTxt;
            a.appendChild(img);
            let cbody = $('<div></div>');
            classes(cbody, 'card-body');
            cbody.html('<h3 class="card-title">' + dat.title + '</h3>\n<p class="card-text">' + dat.description + '</p>\n');
            a.appendChild(cbody);
            card.appendChild(a);

            col.appendChild(card);
            $('#crdContainer').appendChild(col);
            if (idx == previewLim - 1) {
                if (paglast[page] == undefined || paglast[page] == null) {
                    paglast.push(docs[docs.length - 1]);
                } else if (paglast[page] != docs[docs.length - 1]) {
                    paglast.splice(page, 1, docs[docs.length - 1]);
                }
                nxtp = true;
                $("#pgNavT").show();
                $("#pgNavB").show();
            }
        });
        if (!nxtp) {
            disableBtn($("#pgTNxt"));
            disableBtn($("#pgBNxt"));
        } else {
            enableBtn($("#pgTNxt"));
            enableBtn($("#pgBNxt"));
        }
        if (page == 1) {
            disableBtn($("#pgTNxt"));
            disableBtn($("#pgBNxt"));
        } else {
            enableBtn($("#pgTNxt"));
            enableBtn($("#pgBNxt"));
        }
    }).catch(err => { console.log(err) });
}

$("#pgTPrv").onclick = function () { reSrch(-1); };
$("#pgBPrv").onclick = function () { reSrch(-1); };
$("#pgTNxt").onclick = function () { reSrch(1); };
$("#pgBNxt").onclick = function () { reSrch(1); };
function reSrch(np) {
    if (page < 1 && np == -1) return;
    if (!nxtp && np == 1) return;
    page += np;
    $('#disPgT').text(page);
    $('#disPgB').text(page);
    initSrch(true);
    $("#cookCnt").scrollIntoView();
}