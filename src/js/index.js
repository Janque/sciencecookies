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

import { getDatabase, ref as databaseRef, set, increment } from "firebase/database";
const RTDB = getDatabase();

import { query, where, orderBy, limit, getDocs, startAfter } from "firebase/firestore/lite";

var catnmb;
const previewLim = 20;

//Get search params
var cats = [], kywords, srtOrd, desc, srchQuery;
var nxtp = false, paglast = [null], page = 1;
var allChk = false;
function initSrch(stAf) {
    cats = allCats.slice();
    kywords = [''];
    if (urlSrch.get('c') != null) {
        cats = urlSrch.get('c').split('+');
        cats = cats[0].split(' ');
    }
    if (urlSrch.get('k') != null) {
        kywords = urlSrch.get('k').split('+');
        document.getElementById('srcBox').value = urlSrch.get('k').replace('+', ' ');
    };
    kywords = cats.concat(kywords);
    kywords.forEach(function (itm, idx) {
        let str = itm.toLowerCase();
        str = rmDiacs(str);
        kywords.splice(idx, 1, str);
    });
    let all = true;
    for (let i = 0; i < catnmb; i++) {
        if (kywords.indexOf(document.getElementById('cat' + i).value) != -1) {
            document.getElementById('cat' + i).checked = true;
        } else all = false;
    }
    if (all) {
        allChk = true;
        document.getElementById('catA').checked = true;
    }
    document.getElementById("inSrchOrd1").selected = false;
    document.getElementById("inSrchOrd2").selected = false;
    document.getElementById("inSrchOrd3").selected = false;
    srtOrd = urlSrch.get('o');
    if (srtOrd != null) {
        if (srtOrd == 'new') {
            srtOrd = 'ledit';
            desc = true;
            document.getElementById("inSrchOrd1").selected = true;
        }
        if (srtOrd == 'old') {
            srtOrd = 'ledit';
            desc = false;
            document.getElementById("inSrchOrd2").selected = true;
        }
        if (srtOrd == 'pop') {
            desc = true;
            document.getElementById("inSrchOrd3").selected = true;
        }
    } else {
        srtOrd = 'ledit';
        desc = true;
    }
    if (page > 1 && stAf && paglast[page - 1] != null && paglast[page - 1] != undefined) {
        if (!desc) {
            srchQuery = query(cookiesFSColl, where('public', '==', true), where('cats', 'array-contains-any', kywords), orderBy(srtOrd), startAfter(paglast[page - 1]), limit(previewLim));
        } else {
            srchQuery = query(cookiesFSColl, where('public', '==', true), where('cats', 'array-contains-any', kywords), orderBy(srtOrd, 'desc'), startAfter(paglast[page - 1]), limit(previewLim));
        }
    } else {
        if (!desc) {
            srchQuery = query(cookiesFSColl, where('public', '==', true), where('cats', 'array-contains-any', kywords), orderBy(srtOrd), limit(previewLim));
        } else {
            srchQuery = query(cookiesFSColl, where('public', '==', true), where('cats', 'array-contains-any', kywords), orderBy(srtOrd, 'desc'), limit(previewLim));
        }
    }
    shwSrch();
    for (let i = 0; i < kywords.length; i++) {
        let itm = kywords[i];
        if (itm == '' || itm == ' ') continue;
        set(databaseRef(RTDB, 'searchQs/' + itm + '/count'), increment(1));
    }
}
function shwSrch() {
    document.getElementById('cookiesCont').innerHTML = "";
    getDocs(srchQuery).then(snap => {
        let docs = snap.docs;
        nxtp = false;
        if (docs.length == 0) {
            let a = document.createElement('a');
            classes(a, "text-decoration-none text-light");
            let med = document.createElement('div');
            classes(med, "media mb-3");
            let bod = document.createElement('div');
            classes(bod, "media-body");
            if (lang == "es") {
                bod.innerHTML = '<h5 class="mt-0 text-center">No se han encontrado resultados</h5>';
            } else if (lang == "en") {
                bod.innerHTML = '<h5 class="mt-0 text-center">No results found</h5>';
            }
            a.appendChild(med);
            med.appendChild(bod);
            document.getElementById('cookiesCont').appendChild(a);
        }
        docs.forEach((doc, idx) => {
            if (idx != 0) {
                let divi = document.createElement('div');
                classes(divi, "dropdown-divider d-md-none");
                document.getElementById('cookiesCont').appendChild(divi);
            }
            let a = document.createElement('a');
            classes(a, "text-decoration-none text-light");
            a.href = doc.data().url;
            let med = document.createElement('div');
            classes(med, "media mb-3");
            let img = document.createElement('img');
            classes(img, "align-self-center mr-3");
            img.style.width = "64px";
            img.style.height = "64px";
            img.src = doc.data().picUrl;
            let bod = document.createElement('div');
            classes(bod, "media-body");
            let tit = document.createElement('h5');
            classes(tit, "mt-0");
            tit.innerHTML = doc.data().title;
            bod.appendChild(tit);
            let descr = document.createElement('p');
            descr.innerHTML = doc.data().description;
            bod.appendChild(descr);
            let dates = document.createElement('p');
            classes(dates, "my-0");
            if (doc.data().dledit) {
                let dl = doc.data().ledit.toDate();
                if (lang == "es") {
                    dates.innerText = 'Actualizado: ' + dl.getDate() + '/' + (dl.getMonth() + 1) + '/' + dl.getFullYear();
                } else if (lang == "en") {
                    dates.innerText = 'Updated: ' + dl.getDate() + '/' + (dl.getMonth() + 1) + '/' + dl.getFullYear();
                }
            } else {
                let d = doc.data().published.toDate();
                if (lang == "es") {
                    dates.innerText = 'Publicado: ' + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
                } else if (lang == "en") {
                    dates.innerText = 'Published: ' + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
                }
            }
            bod.appendChild(dates);
            let auhtTxt = document.createElement('p');
            classes(auhtTxt, "mt-0");
            if (lang == "es") {
                auhtTxt.innerText = ' Autor(es):' + doc.data().authors;
            } else if (lang == "en") {
                auhtTxt.innerText = ' Author(s):' + doc.data().authors;
            }
            bod.appendChild(auhtTxt);
            a.appendChild(med);
            med.appendChild(img);
            med.appendChild(bod);
            document.getElementById('cookiesCont').appendChild(a);
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

function prepCatBtns() {
    //Submit search
    document.getElementById('catA').onclick = function () {
        if (!allChk) {
            for (let i = 0; i < catnmb; i++) {
                document.getElementById('cat' + i).checked = true;
            }
        } else {
            for (let i = 0; i < catnmb; i++) {
                document.getElementById('cat' + i).checked = false;
            }
        }
        allChk = !allChk;
    };
    for (let i = 0; i < catnmb; i++) {
        document.getElementById('cat' + i).onclick = function () {
            if (allChk) {
                document.getElementById('catA').checked = false;
                allChk = false;
            }
            else {
                let all = true;
                for (let i = 0; i < catnmb; i++) {
                    if (document.getElementById('cat' + i).checked == false) {
                        all = false;
                        break;
                    }
                }
                if (all) {
                    allChk = true;
                    document.getElementById('catA').checked = true;
                }
            }
        };
    }
}
function shwCalMain() {
    getDocs(query(calendarsFSColl, where("public", "==", true), orderBy('published', 'desc'), limit(1))).then(snap => {
        let docs = snap.docs;
        docs.forEach(doc => {
            let a = document.createElement('a');
            classes(a, "text-decoration-none text-light");
            a.href = doc.data().url;
            let med = document.createElement('div');
            classes(med, "media mb-3");
            let img = document.createElement('img');
            classes(img, "align-self-center mr-3");
            img.style.width = "64px";
            img.style.height = "64px";
            img.src = doc.data().picUrl;
            let bod = document.createElement('div');
            classes(bod, "media-body");
            let tit = document.createElement('h5');
            classes(tit, "mt-0");
            tit.innerHTML = doc.data().title;
            bod.appendChild(tit);
            let descr = document.createElement('p');
            descr.innerHTML = doc.data().descriptionShort;
            bod.appendChild(descr);
            let dates = document.createElement('p');
            classes(dates, "my-0");
            a.appendChild(med);
            med.appendChild(img);
            med.appendChild(bod);
            document.getElementById('calMain').appendChild(a);
            showEl(document.getElementById('calMain'));
        });
    }).catch(err => { console.log(err) });
}

var urlSrch;
window.loaded = function loaded() {
    urlSrch = new URLSearchParams(location.search);

    catnmb = allCats.length;
    prepCatBtns();
    initSrch(false);
    shwCalMain();
    function send() {
        let srchStr = '?c=';
        if (document.getElementById('cat0').checked) srchStr = srchStr + document.getElementById('cat0').value;
        for (let i = 1; i < catnmb; i++) {
            if (document.getElementById('cat' + i).checked) {
                srchStr = srchStr + '+' + document.getElementById('cat' + i).value;
            }
        }
        srchStr = srchStr + '&k=';
        let wordArr = document.getElementById('srcBox').value.split(' ');
        srchStr = srchStr + wordArr[0];
        for (let i = 1; i < wordArr.length; i++) {
            srchStr = srchStr + '+' + wordArr[i];
        }
        srchStr = srchStr + '&o=' + document.getElementById('inOrd').value;
        window.location.href = srchStr;
    }
    document.getElementById("frmSrch").addEventListener("submit", function (event) {
        event.preventDefault();
        send();
    });
}