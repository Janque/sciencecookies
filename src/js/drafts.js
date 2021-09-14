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

import { getDatabase, ref as databaseRef, set, get, increment } from "firebase/database";
const RTDB = getDatabase();

import { getFirestore, doc as docRef, query, where, orderBy, limit, startAfter, getDocs, setDoc, Timestamp } from "firebase/firestore/lite";
const FSDB = getFirestore();

var urlSrch;
window.loaded = function loaded() {
    urlSrch = new URLSearchParams(location.search);

    initSrch(false);
    function newSrch() {
        let srchStr = '?k=';
        let wordArr = $('#srcBox').value.split(' ');
        srchStr = srchStr + wordArr[0];
        for (let i = 1; i < wordArr.length; i++) {
            srchStr = srchStr + '+' + wordArr[i];
        }
        srchStr = srchStr + '&o=' + $('#inOrd').value;
        srchStr = srchStr + '&d=' + $('#inDir').value;
        window.location.href = srchStr;
    }
    $("#frmSrch").addEventListener("submit", e => {
        e.preventDefault();
        newSrch();
    });

    function plusCookie() {
        let title = $('#inTitle').value.trim();
        let file = $('#inFile').value;
        getDocs(query(cookiesFSColl, where('file', '==', file), limit(1))).then(snap => {
            if (!snap.empty) {
                if (lang == "es") {
                    alertTop("Ese nombre de archivo ya esta en uso.", 0, 'alrtPlusContainer');
                } else if (lang == "en") {
                    alertTop("That file name is already in use.", 0, 'alrtPlusContainer');
                }
            } else {
                $('#btnPlusConf').hide();
                $('#btnCanPlus0').setAttribute('disabled', 'true');
                $('#btnCanPlus1').setAttribute('disabled', 'true');
                $('#barCont').show();
                setprog('3');

                let id;
                get(databaseRef(RTDB, 'tdaysID')).then((snap) => {
                    var today = snap.val();
                    today.last++;
                    id = today.today;
                    if (today.last < 10) id += '0';
                    id += today.last;

                    set(databaseRef(RTDB, 'tdaysID/last'), increment(1));
                    setprog('52');

                    const promises = [];
                    langs.forEach((l, i) => {
                        setprog(30 / langs.length * i);
                        promises.push(setDoc(docRef(FSDB, 'cookies/langs/' + l, id), {
                            authors: [author],
                            cont: [
                                {
                                    type: "head",
                                    title: title,
                                    author: [author]
                                },
                                {
                                    type: "ref",
                                    ref: []
                                }
                            ],
                            media: [],
                            picUrl: "",
                            title: title,
                            description: "",
                            file: file,
                            owner: uid,
                            java: "",
                            revised: {},
                            notify: false,
                            public: false,
                            beenPublic: false,
                            dledit: false,
                            created: Timestamp.now(),
                            ledit: Timestamp.now(),
                            published: Timestamp.now(),
                            pop: 0,
                            likes: 0,
                            favs: 0,
                            url: "",
                            fixedCats: [],
                            cats: [],
                            translations: {
                                es: file
                            }
                        }));
                    });
                    Promise.all(promises).then(() => {
                        setprog('90');
                        setTimeout(function () {
                            setprog('100');
                            $('#bar').addClass('bg-success');
                            if (lang == "es") {
                                alertTop(`Creado con exito. Redirigiendo...<br>Si no te redirige automáticamente, haz <a class="btn-link-science" href="../editar?id=${id}">click aqui</a>.`, 1, 'alrtPlusContainer');
                            } else if (lang == "en") {
                                alertTop(`Successfully created. Redirigiendo...<br>If you aren't automatically redirected, <a class="btn-link-science" href="../edit?id=${id}">click here</a>.`, 1, 'alrtPlusContainer');
                            }
                        }, 1000);
                        setTimeout(function () {
                            if (lang == "es") {
                                window.location.href = '../editar?id=' + id;
                            } else if (lang == "en") {
                                window.location.href = '../edit?id=' + id;
                            }
                        }, 3000);
                    }).catch(err => console.log(err));
                }).catch((err) => {
                    setprog('0');
                    if (lang == "es") {
                        alertTop("<strong>Ocurrió un error: " + err + ".</strong><br>LLamar a Javier.", 0, 'alrtPlusContainer');
                    } else if (lang == "en") {
                        alertTop("<strong>There has been an error: " + err + ".</strong><br>Call Javier.", 0, 'alrtPlusContainer');
                    }
                    console.log(err);
                });
            }
        }).catch(err => console.log(err));
    }
    $("#frmPlus").addEventListener("submit", e => {
        e.preventDefault();
        plusCookie();
    });
}

const previewLim = 21;
//Get search params
var kywords, srtOrd, desc, srchQuery;
var nxtp = false, paglast = [null], page = 1;
function initSrch(stAf) {
    kywords = "";
    if (urlSrch.get('k') != null) {
        kywords = urlSrch.get('k').replace('+', ' ');
        $('#srcBox').value = kywords;
    };
    $("#inSrchOrd0").selected = false;
    $("#inSrchOrd1").selected = false;
    $("#inSrchOrd2").selected = false;
    $("#inSrchOrd3").selected = false;
    srtOrd = urlSrch.get('o');
    switch (srtOrd) {
        case 'created':
            $("#inSrchOrd0").selected = true;
            break;
        case 'published':
            $("#inSrchOrd1").selected = true;
            break;
        case 'ledit':
            $("#inSrchOrd2").selected = true;
            break;
        case 'pop':
            $("#inSrchOrd3").selected = true;
            break;
        default:
            srtOrd = 'created';
            break;
    }
    $("#inSrchDir0").selected = false;
    $("#inSrchDir1").selected = false;
    desc = urlSrch.get('d');
    if (desc == 'asc') {
        desc = false;
        $("#inSrchDir1").selected = true;
    } else {
        desc = true;
        $("#inSrchDir0").selected = true;
    }
    if (page > 1 && stAf && paglast[page - 1] != null && paglast[page - 1] != undefined) {
        if (kywords == undefined || kywords == null || kywords == "") {
            if (!desc) {
                srchQuery = query(cookiesFSColl, orderBy(srtOrd), startAfter(paglast[page - 1]), limit(previewLim));
            } else {
                srchQuery = query(cookiesFSColl, orderBy(srtOrd, 'desc'), startAfter(paglast[page - 1]), limit(previewLim));
            }
        } else {
            if (!desc) {
                srchQuery = query(cookiesFSColl, where('title', '==', kywords), orderBy(srtOrd), startAfter(paglast[page - 1]), limit(previewLim));
            } else {
                srchQuery = query(dcookiesFSColl, where('title', '==', kywords), orderBy(srtOrd, 'desc'), startAfter(paglast[page - 1]), limit(previewLim));
            }
        }
    } else {
        if (kywords == undefined || kywords == null || kywords == "") {
            if (!desc) {
                srchQuery = query(cookiesFSColl, orderBy(srtOrd), limit(previewLim));
            } else {
                srchQuery = query(cookiesFSColl, orderBy(srtOrd, 'desc'), limit(previewLim));
            }
        } else {
            if (!desc) {
                srchQuery = query(cookiesFSColl, where('title', '==', kywords), orderBy(srtOrd), limit(previewLim));
            } else {
                srchQuery = query(cookiesFSColl, where('title', '==', kywords), orderBy(srtOrd, 'desc'), limit(previewLim));
            }
        }
    }
    shwSrch();
}
function shwSrch() {
    if ((kywords == undefined || kywords == null || kywords == "") && page == 1) {
        $('#crdContainer').innerHTML = `<div class="col mb-4">
            <div class="card text-dark bg-light h-100 cardBorder" style="border-color: #343a40;">
                <a type="button" data-toggle="modal" data-target="#mdlPlus" class="text-decoration-none text-dark h-100 d-flex align-items-center justify-content-center">
                    <h1 style="font-size: 6rem;" class="mb-0"><i class="far fa-plus-square"></i></h1>
                </a>
            </div>
        </div>`;
    } else {
        $('#crdContainer').innerHTML = "";
    }
    getDocs(srchQuery).then(snap => {
        let docs = snap.docs;
        nxtp = false;
        let idx = 0;
        if (docs.length < 1) {
            $('#crdContainer').innerHTML = `<h5 class="mt-0 text-center">No se han encontrado resultados</h5><div class="col mb-4">
            <div class="card text-dark bg-light h-100 cardBorder" style="border-color: #343a40;">
                <a type="button" data-toggle="modal" data-target="#mdlPlus" class="text-decoration-none text-dark h-100 d-flex align-items-center justify-content-center">
                    <h1 style="font-size: 6rem;" class="mb-0"><i class="far fa-plus-square"></i></h1>
                </a>
            </div>
        </div>`;
        }
        docs.forEach(function (doc) {
            let col = $('<div></div>');
            col.addClass('col');
            col.addClass('mb-4');

            let card = $('<div></div>');
            let helpStr = "card text-dark bg-light h-100 cardBorder";
            helpStr = helpStr.split(' ');
            helpStr.forEach(clas => {
                card.addClass(clas);
            });
            if (doc.data().owner == uid) {
                card.addClass('border-success');
            } else {
                card.addClass('border-secondary');
            }

            let h = $('<div></div>');
            helpStr = "card-header bg-light m-0 py-0 text-right";
            helpStr = helpStr.split(' ');
            helpStr.forEach(clas => {
                h.addClass(clas);
            });
            let row = $('<div></div>');
            row.addClass('row');
            row.addClass('justify-content-between');
            if (!doc.data().public) {
                let col0 = $('<div></div>');
                col0.addClass('col-auto');
                col0.addClass('p-0');
                let badge = $('<span></span>');
                badge.addClass('badge');
                badge.addClass('badge-warning');
                if (lang == "es") {
                    badge.innerText = 'Borrador';
                } else if (lang == "en") {
                    badge.innerText = 'Draft';
                }
                col0.appendChild(badge);
                row.appendChild(col0);
            }
            let col1 = $('<div></div>');
            col1.addClass('col-auto');
            col1.addClass('p-0');
            col1.addClass('ml-auto');
            let drp = $('<div></div>');
            drp.addClass('dropdown');
            let btndrp = $('<button></button>');
            btndrp.addClass('btn');
            btndrp.addClass('btn-light');
            btndrp.setAttribute('type', 'button');
            btndrp.setAttribute('data-toogle', 'dropdown');
            btndrp.setAttribute('aria-haspopup', "true");
            btndrp.setAttribute('aria-expanded', "false");
            btndrp.innerHTML = '<i class="fas fa-ellipsis-h"></i>';
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
            drpmenu.addClass('dropdown-menu');
            drpmenu.addClass('dropdown-menu-right');
            drpmenu.setAttribute('id', "drpMenu" + doc.id);
            let drpitm0 = $('<button></button>');
            drpitm0.addClass('dropdown-item');
            drpitm0.onclick = function () {
                if (lang == "es") {
                    window.location.href = '../editar?id=' + doc.id;
                } else if (lang == "en") {
                    window.location.href = '../edit?id=' + doc.id;
                }
            };
            if (lang == "es") {
                drpitm0.innerHTML = 'Editar <i class="fas fa-edit"></i>';
            } else if (lang == "en") {
                drpitm0.innerHTML = 'Edit <i class="fas fa-edit"></i>';
            }
            drpmenu.appendChild(drpitm0);
            let drpitm1 = $('<button></button>');
            drpitm1.addClass('dropdown-item');
            drpitm1.onclick = function () {
                window.open('../vista-email/' + doc.data().file, '_blank').focus();
            };
            if (lang == "es") {
                drpitm1.innerHTML = 'Vista correo <i class="fas fa-envelope"></i>';
            } else if (lang == "en") {
                drpitm1.innerHTML = 'Mail preview <i class="fas fa-envelope"></i>';
            }
            drpmenu.appendChild(drpitm1);
            let drpitm2 = $('<button></button>');
            let d = doc.data().created.toDate();
            if (doc.data().public) {
                drpitm2.addClass('dropdown-item');
                drpitm2.onclick = function () {
                    window.open(doc.data().url, '_blank').focus();
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


            let authTxt, noImgTxt, creatTxt, uptTxt, pubTxt, noPubTxt;
            if (lang == "es") {
                authTxt = "Autor(es)";
                noImgTxt = "No hay imagen";
                noPubTxt = "Sin publicar";
                creatTxt = "Creado: ";
                uptTxt = "Actualizado: ";
                pubTxt = "Publicado: ";
            } else if (lang == "en") {
                authTxt = "Author(s)";
                noImgTxt = "No image";
                noPubTxt = "Not public";
                creatTxt = "Created: ";
                uptTxt = "Updated: ";
                pubTxt = "Published: ";
            }

            let a = $('<a></a>');
            if (lang == "es") {
                a.href = '../editar?id=' + doc.id;
            } else if (lang == "en") {
                a.href = '../edit?id=' + doc.id;
            }
            a.addClass('text-decoration-none');
            a.addClass('text-dark');
            let img = $('<img/>');
            img.src = doc.data().picUrl;
            img.addClass('card-img-top');
            img.alt = noImgTxt;
            a.appendChild(img);
            let cbody = $('<div></div>');
            cbody.addClass('card-body');
            cbody.innerHTML = '<h3 class="card-title">' + doc.data().title + '</h3>\n<p>' + authTxt + ':' + doc.data().authors + '</p>\n<p class="card-text">' + doc.data().description + '</p>\n'
            a.appendChild(cbody);
            let f = $('<div></div>');
            f.addClass('card-footer');
            f.addClass('text-muted');
            f.innerHTML = '<p>' + creatTxt + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + '</p>\n';
            d = doc.data().ledit.toDate();
            f.innerHTML += '<p>' + uptTxt + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + '</p>\n';
            if (doc.data().public) {
                d = doc.data().published.toDate();
                f.innerHTML += '<p>' + pubTxt + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + '</p>\n';
            } else {
                f.innerHTML += '<p>' + noPubTxt + '</p>\n';
            }
            a.appendChild(f)
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
            idx++;
        });
        if (!nxtp) {
            $("#pgTNxt").setAttribute('disabled', 'true');
            $("#pgBNxt").setAttribute('disabled', 'true');
        } else {
            $("#pgTNxt").removeAttribute('disabled');
            $("#pgBNxt").removeAttribute('disabled');
        }
        if (page == 1) {
            $("#pgTPrv").setAttribute('disabled', 'true');
            $("#pgBPrv").setAttribute('disabled', 'true');
        } else {
            $("#pgTPrv").removeAttribute('disabled');
            $("#pgBPrv").removeAttribute('disabled');
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
    $('#disPgT').innerText = page;
    $('#disPgB').innerText = page;
    initSrch(true);
    $("#cookCnt").scrollIntoView();
}

$('#btnPlus').onclick = function () {
    $('#mdlPlus').modal('show');
};

var inFileChanged = false;

function cancelPlus() {
    $('#inTitle').value = "";
    $('#inFile').value = "";
    $('#alrtPlusContainer').innerHTML = '';
    inFileChanged = false;
}
$('#btnCanPlus0').onclick = function () {
    cancelPlus();
};
$('#btnCanPlus1').onclick = function () {
    cancelPlus();
};

$('#inTitle').onfocus = function () {
    $('#alrtPlusContainer').innerHTML = '';
};
$('#inTitle').oninput = function () {
    $('#inTitle').value = $('#inTitle').value.trim();
    if (inFileChanged) return;
    $('#inFile').value = $('#inTitle').value
    $('#inFile').value = ultraClean($('#inFile').value, '-');
};
$('#inFile').onfocus = function () {
    inFileChanged = true;
};
$('#inFile').onchange = function () {
    $('#alrtPlusContainer').innerHTML = '';
};

function setprog(n) {
    $('#bar').setAttribute('aria-valuenow', n);
    $('#bar').style.width = n + '%';
    $('#bar').innerText = n + '%';
}

$('#inFile').oninput = function () {
    $('#inFile').value = rmDiacs($('#inFile').value.trim().replaceAll(' ', '-'));
}