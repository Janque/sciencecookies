//Done
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
        $('#srcBox').value = urlSrch.get('k').replace('+', ' ');
    };
    kywords = cats.concat(kywords);
    kywords.forEach(function (itm, idx) {
        let str = itm.toLowerCase();
        str = rmDiacs(str);
        kywords.splice(idx, 1, str);
    });
    let all = true;
    for (let i = 0; i < catnmb; i++) {
        if (kywords.indexOf($('#cat' + i).value) != -1) {
            $('#cat' + i).checked = true;
        } else all = false;
    }
    if (all) {
        allChk = true;
        $('#catA').checked = true;
    }
    $("#inSrchOrd1").selected = false;
    $("#inSrchOrd2").selected = false;
    $("#inSrchOrd3").selected = false;
    srtOrd = urlSrch.get('o');
    if (srtOrd != null) {
        if (srtOrd == 'new') {
            srtOrd = 'ledit';
            desc = true;
            $("#inSrchOrd1").selected = true;
        }
        if (srtOrd == 'old') {
            srtOrd = 'ledit';
            desc = false;
            $("#inSrchOrd2").selected = true;
        }
        if (srtOrd == 'pop') {
            desc = true;
            $("#inSrchOrd3").selected = true;
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
    $('#cookiesCont').html("");
    getDocs(srchQuery).then(snap => {
        let docs = snap.docs;
        nxtp = false;
        if (docs.length == 0) {
            let a = $('<a></a>');
            classes(a, "text-decoration-none text-light");
            let med = $('<div></div>');
            classes(med, "media mb-3");
            let bod = $('<div></div>');
            classes(bod, "media-body");
            if (lang == "es") {
                bod.html('<h5 class="mt-0 text-center">No se han encontrado resultados</h5>');
            } else if (lang == "en") {
                bod.html('<h5 class="mt-0 text-center">No results found</h5>');
            }
            a.appendChild(med);
            med.appendChild(bod);
            $('#cookiesCont').appendChild(a);
        }
        //Done/
        docs.forEach((doc, idx) => {
            if (idx != 0) {
                let divi = $('<div></div>');
                classes(divi, "dropdown-divider d-md-none");
                $('#cookiesCont').appendChild(divi);
            }
            let a = $('<a></a>');
            classes(a, "text-decoration-none text-light");
            a.href = doc.data().url;
            let med = $('<div></div>');
            classes(med, "media mb-3");
            let img = $('<img/>');
            classes(img, "align-self-center mr-3");
            img.style.width = "64px";
            img.style.height = "64px";
            img.src = doc.data().picUrl;
            let bod = $('<div></div>');
            classes(bod, "media-body");
            let tit = $('<h5></h5>');
            classes(tit, "mt-0");
            tit.html(doc.data().title);
            bod.appendChild(tit);
            let descr = $('<p></p>');
            descr.html(doc.data().description);
            bod.appendChild(descr);
            let dates = $('<p></p>');
            classes(dates, "my-0");
            if (doc.data().dledit) {
                let dl = doc.data().ledit.toDate();
                if (lang == "es") {
                    dates.text('Actualizado: ' + dl.getDate() + '/' + (dl.getMonth() + 1) + '/' + dl.getFullYear());
                } else if (lang == "en") {
                    dates.text('Updated: ' + dl.getDate() + '/' + (dl.getMonth() + 1) + '/' + dl.getFullYear());
                }
            } else {
                let d = doc.data().published.toDate();
                if (lang == "es") {
                    dates.text('Publicado: ' + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear());
                } else if (lang == "en") {
                    dates.text('Published: ' + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear());
                }
            }
            bod.appendChild(dates);
            let auhtTxt = $('<p></p>');
            classes(auhtTxt, "mt-0");
            if (lang == "es") {
                auhtTxt.text(' Autor(es):' + doc.data().authors);
            } else if (lang == "en") {
                auhtTxt.text(' Author(s):' + doc.data().authors);
            }
            bod.appendChild(auhtTxt);
            a.appendChild(med);
            med.appendChild(img);
            med.appendChild(bod);
            $('#cookiesCont').appendChild(a);
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

//Done
function prepCatBtns() {
    //Submit search
    $('#catA').onclick = function () {
        if (!allChk) {
            for (let i = 0; i < catnmb; i++) {
                $('#cat' + i).checked = true;
            }
        } else {
            for (let i = 0; i < catnmb; i++) {
                $('#cat' + i).checked = false;
            }
        }
        allChk = !allChk;
    };
    for (let i = 0; i < catnmb; i++) {
        $('#cat' + i).onclick = function () {
            if (allChk) {
                $('#catA').checked = false;
                allChk = false;
            }
            else {
                let all = true;
                for (let i = 0; i < catnmb; i++) {
                    if ($('#cat' + i).checked == false) {
                        all = false;
                        break;
                    }
                }
                if (all) {
                    allChk = true;
                    $('#catA').checked = true;
                }
            }
        };
    }
}

function shwCalMain() {
    getDocs(query(calendarsFSColl, where("public", "==", true), orderBy('published', 'desc'), limit(1))).then(snap => {
        let docs = snap.docs;
        docs.forEach(doc => {
            let a = $('<a></a>');
            classes(a, "text-decoration-none text-light");
            a.href = doc.data().url;
            let med = $('<div></div>');
            classes(med, "media mb-3");
            let img = $('<img/>');
            classes(img, "align-self-center mr-3");
            img.style.width = "64px";
            img.style.height = "64px";
            img.src = doc.data().picUrl;
            let bod = $('<div></div>');
            classes(bod, "media-body");
            let tit = $('<h5></h5>');
            classes(tit, "mt-0");
            tit.html(doc.data().title);
            bod.appendChild(tit);
            let descr = $('<p></p>');
            descr.html(doc.data().descriptionShort);
            bod.appendChild(descr);
            let dates = $('<p></p>');
            classes(dates, "my-0");
            a.appendChild(med);
            med.appendChild(img);
            med.appendChild(bod);
            $('#calMain').appendChild(a);
            $('#calMain').show();
        });
    }).catch(err => { console.log(err) });
}
//Done/

var urlSrch;
window.loaded = function loaded() {
    urlSrch = new URLSearchParams(location.search);

    catnmb = allCats.length;
    prepCatBtns();
    initSrch(false);
    shwCalMain();
    function send() {
        let srchStr = '?c=';
        if ($('#cat0').checked) srchStr = srchStr + $('#cat0').value;
        for (let i = 1; i < catnmb; i++) {
            if ($('#cat' + i).checked) {
                srchStr = srchStr + '+' + $('#cat' + i).value;
            }
        }
        srchStr = srchStr + '&k=';
        let wordArr = $('#srcBox').value.split(' ');
        srchStr = srchStr + wordArr[0];
        for (let i = 1; i < wordArr.length; i++) {
            srchStr = srchStr + '+' + wordArr[i];
        }
        srchStr = srchStr + '&o=' + $('#inOrd').value;
        window.location.href = srchStr;
    }
    $("#frmSrch").addEventListener("submit", function (event) {
        event.preventDefault();
        send();
    });
}