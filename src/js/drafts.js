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
        let wordArr = document.getElementById('srcBox').value.split(' ');
        srchStr = srchStr + wordArr[0];
        for (let i = 1; i < wordArr.length; i++) {
            srchStr = srchStr + '+' + wordArr[i];
        }
        srchStr = srchStr + '&o=' + document.getElementById('inOrd').value;
        srchStr = srchStr + '&d=' + document.getElementById('inDir').value;
        window.location.href = srchStr;
    }
    document.getElementById("frmSrch").addEventListener("submit", e => {
        e.preventDefault();
        newSrch();
    });

    function plusCookie() {
        let title = document.getElementById('inTitle').value.trim();
        let file = document.getElementById('inFile').value;
        getDocs(query(cookiesFSColl, where('file', '==', file), limit(1))).then(snap => {
            if (!snap.empty) {
                if (lang == "es") {
                    alertTop("Ese nombre de archivo ya esta en uso.", 0, 'alrtPlusContainer');
                } else if (lang == "en") {
                    alertTop("That file name is already in use.", 0, 'alrtPlusContainer');
                }
            } else {
                document.getElementById('btnPlusConf').classList.add('d-none');
                document.getElementById('btnCanPlus0').setAttribute('disabled', 'true');
                document.getElementById('btnCanPlus1').setAttribute('disabled', 'true');
                document.getElementById('barCont').classList.remove('d-none');
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
                            document.getElementById('bar').classList.add('bg-success');
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
    document.getElementById("frmPlus").addEventListener("submit", e => {
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
        document.getElementById('srcBox').value = kywords;
    };
    document.getElementById("inSrchOrd0").selected = false;
    document.getElementById("inSrchOrd1").selected = false;
    document.getElementById("inSrchOrd2").selected = false;
    document.getElementById("inSrchOrd3").selected = false;
    srtOrd = urlSrch.get('o');
    switch (srtOrd) {
        case 'created':
            document.getElementById("inSrchOrd0").selected = true;
            break;
        case 'published':
            document.getElementById("inSrchOrd1").selected = true;
            break;
        case 'ledit':
            document.getElementById("inSrchOrd2").selected = true;
            break;
        case 'pop':
            document.getElementById("inSrchOrd3").selected = true;
            break;
        default:
            srtOrd = 'created';
            break;
    }
    document.getElementById("inSrchDir0").selected = false;
    document.getElementById("inSrchDir1").selected = false;
    desc = urlSrch.get('d');
    if (desc == 'asc') {
        desc = false;
        document.getElementById("inSrchDir1").selected = true;
    } else {
        desc = true;
        document.getElementById("inSrchDir0").selected = true;
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
        document.getElementById('crdContainer').innerHTML = `<div class="col mb-4">
            <div class="card text-dark bg-light h-100 cardBorder" style="border-color: #343a40;">
                <a type="button" data-toggle="modal" data-target="#mdlPlus" class="text-decoration-none text-dark h-100 d-flex align-items-center justify-content-center">
                    <h1 style="font-size: 6rem;" class="mb-0"><i class="far fa-plus-square"></i></h1>
                </a>
            </div>
        </div>`;
    } else {
        document.getElementById('crdContainer').innerHTML = "";
    }
    getDocs(srchQuery).then(snap => {
        let docs = snap.docs;
        nxtp = false;
        let idx = 0;
        if (docs.length < 1) {
            document.getElementById('crdContainer').innerHTML = `<h5 class="mt-0 text-center">No se han encontrado resultados</h5><div class="col mb-4">
            <div class="card text-dark bg-light h-100 cardBorder" style="border-color: #343a40;">
                <a type="button" data-toggle="modal" data-target="#mdlPlus" class="text-decoration-none text-dark h-100 d-flex align-items-center justify-content-center">
                    <h1 style="font-size: 6rem;" class="mb-0"><i class="far fa-plus-square"></i></h1>
                </a>
            </div>
        </div>`;
        }
        docs.forEach(function (doc) {
            let col = document.createElement('col');
            col.classList.add('col');
            col.classList.add('mb-4');

            let card = document.createElement('div');
            let helpStr = "card text-dark bg-light h-100 cardBorder";
            helpStr = helpStr.split(' ');
            helpStr.forEach(clas => {
                card.classList.add(clas);
            });
            if (doc.data().owner == uid) {
                card.classList.add('border-success');
            } else {
                card.classList.add('border-secondary');
            }

            let h = document.createElement('div');
            helpStr = "card-header bg-light m-0 py-0 text-right";
            helpStr = helpStr.split(' ');
            helpStr.forEach(clas => {
                h.classList.add(clas);
            });
            let row = document.createElement('div');
            row.classList.add('row');
            row.classList.add('justify-content-between');
            if (!doc.data().public) {
                let col0 = document.createElement('div');
                col0.classList.add('col-auto');
                col0.classList.add('p-0');
                let badge = document.createElement('span');
                badge.classList.add('badge');
                badge.classList.add('badge-warning');
                if (lang == "es") {
                    badge.innerText = 'Borrador';
                } else if (lang == "en") {
                    badge.innerText = 'Draft';
                }
                col0.appendChild(badge);
                row.appendChild(col0);
            }
            let col1 = document.createElement('div');
            col1.classList.add('col-auto');
            col1.classList.add('p-0');
            col1.classList.add('ml-auto');
            let drp = document.createElement('div');
            drp.classList.add('dropdown');
            let btndrp = document.createElement('button');
            btndrp.classList.add('btn');
            btndrp.classList.add('btn-light');
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
            drpmenu.classList.add('dropdown-menu');
            drpmenu.classList.add('dropdown-menu-right');
            drpmenu.setAttribute('id', "drpMenu" + doc.id);
            let drpitm0 = document.createElement('button');
            drpitm0.classList.add('dropdown-item');
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
            let drpitm1 = document.createElement('button');
            drpitm1.classList.add('dropdown-item');
            drpitm1.onclick = function () {
                window.open('../vista-email/' + doc.data().file, '_blank').focus();
            };
            if (lang == "es") {
                drpitm1.innerHTML = 'Vista correo <i class="fas fa-envelope"></i>';
            } else if (lang == "en") {
                drpitm1.innerHTML = 'Mail preview <i class="fas fa-envelope"></i>';
            }
            drpmenu.appendChild(drpitm1);
            let drpitm2 = document.createElement('button');
            let d = doc.data().created.toDate();
            if (doc.data().public) {
                drpitm2.classList.add('dropdown-item');
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

            let a = document.createElement('a');
            if (lang == "es") {
                a.href = '../editar?id=' + doc.id;
            } else if (lang == "en") {
                a.href = '../edit?id=' + doc.id;
            }
            a.classList.add('text-decoration-none');
            a.classList.add('text-dark');
            let img = document.createElement('img');
            img.src = doc.data().picUrl;
            img.classList.add('card-img-top');
            img.alt = noImgTxt;
            a.appendChild(img);
            let cbody = document.createElement('div');
            cbody.classList.add('card-body');
            cbody.innerHTML = '<h3 class="card-title">' + doc.data().title + '</h3>\n<p>' + authTxt + ':' + doc.data().authors + '</p>\n<p class="card-text">' + doc.data().description + '</p>\n'
            a.appendChild(cbody);
            let f = document.createElement('div');
            f.classList.add('card-footer');
            f.classList.add('text-muted');
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
            idx++;
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

document.getElementById('btnPlus').onclick = function () {
    $('#mdlPlus').modal('show');
};

var inFileChanged = false;

function cancelPlus() {
    document.getElementById('inTitle').value = "";
    document.getElementById('inFile').value = "";
    document.getElementById('alrtPlusContainer').innerHTML = '';
    inFileChanged = false;
}
document.getElementById('btnCanPlus0').onclick = function () {
    cancelPlus();
};
document.getElementById('btnCanPlus1').onclick = function () {
    cancelPlus();
};

document.getElementById('inTitle').onfocus = function () {
    document.getElementById('alrtPlusContainer').innerHTML = '';
};
document.getElementById('inTitle').oninput = function () {
    document.getElementById('inTitle').value = document.getElementById('inTitle').value.trim();
    if (inFileChanged) return;
    document.getElementById('inFile').value = document.getElementById('inTitle').value
    document.getElementById('inFile').value = ultraClean(document.getElementById('inFile').value, '-');
};
document.getElementById('inFile').onfocus = function () {
    inFileChanged = true;
};
document.getElementById('inFile').onchange = function () {
    document.getElementById('alrtPlusContainer').innerHTML = '';
};

function setprog(n) {
    document.getElementById('bar').setAttribute('aria-valuenow', n);
    document.getElementById('bar').style.width = n + '%';
    document.getElementById('bar').innerText = n + '%';
}

document.getElementById('inFile').oninput = function () {
    document.getElementById('inFile').value = rmDiacs(document.getElementById('inFile').value.trim().replaceAll(' ', '-'));
}