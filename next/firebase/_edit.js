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

import { getDatabase, ref as databaseRef, set } from "firebase/database";
const RTDB = getDatabase();

import { getFunctions, httpsCallable } from "firebase/functions";
const FUNCTIONS = getFunctions(firebaseApp, 'us-east1');

import { getFirestore, getDoc, doc as docRef, getDocs, onSnapshot, updateDoc, query, Timestamp } from "firebase/firestore";
const FSDB = getFirestore();

import { getStorage, ref as storageRef, deleteObject, uploadBytes, getDownloadURL } from "firebase/storage";
const STORAGE = getStorage();

window.docDat;
let docId, cookDocRef;
let toDel = -1;
window.toAdd = -1;

window.addFrom = -1;
let toDelMed = -1, toAddMed = -1;
let newMedia = null;
let newMedSrc = null;

async function translateSimple(text, from, target) {
    var translate = httpsCallable(FUNCTIONS, 'translations-translateSimple');
    let res = await translate({
        text: text,
        from: from,
        target: target
    });
    return res.data;
}
//Done/

let lastSave = Date.now(), saved = false;

let keywords = [];

var urlSrch;
window.loaded = function loaded() {
    urlSrch = new URLSearchParams(location.search);

    //Done
    allCats.forEach((cat, i) => {
        let fat = $('<div></div>');
        classes(fat, "form-group col-auto");
        let div = $('<div></div>');
        classes(div, "form-check");
        let inp = $('<input></input>');
        inp.id = "cat" + i;
        classes(inp, "form-check-input");
        inp.value = cat;
        inp.attr('type', 'checkbox');
        inp.onclick = function () {
            if (inp.checked == true) {
                docDat.fixedCats.push(this.value);
            } else {
                docDat.fixedCats.splice(docDat.fixedCats.indexOf(this.value), 1);
            }
        }
        div.appendChild(inp);
        let lab = $('<label></label>');
        lab.attr('for', 'cat' + i);
        classes(lab, "form-check-label")
        lab.text(textCats[i]);
        div.appendChild(lab);
        fat.appendChild(div);
        $('#catFrmCont').appendChild(fat);
    });


    cookDocRef = docRef(cookiesFSColl, urlSrch.get('id'));
    onSnapshot(cookDocRef, doc => {
        docDat = doc.data();
        docId = doc.id;
        $('#inFile').value = docDat.file;
        $('#inDesc').value = docDat.description;
        allCats.forEach((cat, i) => {
            $('#cat' + i).checked = docDat.fixedCats.includes($('#cat' + i).value);
        });
        render();
        fillMed();
        if (docDat.public) {
            $('#btnPrivate').show();
            $('#btnAprove').hide();
            $('#btnPub').hide();
        } else {
            $('#btnPrivate').hide();
            $('#btnAprove').show();
            $('#btnPub').show();
        }
        //Done/
        if (docDat.revised[lang] && docDat.revised[lang].includes(uid)) {
            $('#btnAprove').html('<i class="fas fa-check-square"></i>');
        } else {
            $('#btnAprove').html('<i class="far fa-check-square"></i>');
        }
        //Done
        $('#btnPrevCook').href = docDat.url;
        $('#btnPrevMail').href = '../vista-email/' + docDat.file;
    }, err => { console.log(err) });

    fillTrans();
    function translateFrm() {
        const translate = httpsCallable(FUNCTIONS, 'translations-translateFullCookie');
        return translate({
            docId: docId,
            from: $('#inTransFrom').value,
            target: lang
        });
    }
    $("#frmTranslate").addEventListener("submit", function (event) {
        event.preventDefault();
        disableBtn($('#btnCnfTranslate'));
        disableBtn($('#btnCanTranslate0'));
        disableBtn($('#btnCanTranslate1'));
        setprog('barTranslate', 0);
        $('#barTranslateCont').show();
        runprog('barTranslate', 0, 73);
        translateFrm().then(res => {
            runprog('barTranslate', 73, 90);
            if (res) {
                $('#inFile').value = ultraClean($('#inFile').value, '-');
                docDat.file = file;
                setprog('barTranslate', 96);
                normSave();
                setprog('barTranslate', 100);
                $('#mdlTranslate').modal('hide');
                enableBtn($('#btnCnfTranslate'));
                enableBtn($('#btnCanTranslate0'));
                enableBtn($('#btnCanTranslate1'));
                $('#barTranslateCont').hide();
            } else {
                if (lang == "es") {
                    alertTop("<strong>¡Ha ocurrido un error!</strong>", 0);
                } else if (lang == "en") {
                    alertTop("<strong>¡There has been an error!</strong>", 0);
                }
                console.log('err');
            }
        });
    });

    function fileFrm() {
        let file = $('#inFile').value;
        getDocs(query(cookiesFSColl, where("file", "==", file))).then(snap => {
            if (!snap.empty && file != docDat.file) {
                if (lang == "es") {
                    alertTop("Ese nombre de archivo ya esta en uso.", 0);
                } else if (lang == "en") {
                    alertTop("That file name is already in use.", 0);
                }
            } else {
                docDat.description = $('#inDesc').value.trim();
                docDat.file = file;
                normSave();
            }
        }).then(() => { console.log('exito') }).catch(err => console.log(err));
    }
    $("#frmFile").addEventListener("submit", function (event) {
        event.preventDefault();
        fileFrm();
    });
    langs.forEach((l, i) => {
        if (l != lang) {
            let opt = $('<option></option>');
            if (i == 0) {
                opt.attr('selected', 'true');
            }
            opt.value = l;
            opt.text(l);
            $('#selFileTrans').appendChild(opt);
        }
    })
    $('#btnFileTrans').onclick = function () {
        let ori = $('#selFileTrans').value
        getDoc(docRef(FSDB, 'cookies/langs/' + ori, docId)).then(async function (doc) {
            let file = doc.data().file;
            let desc = doc.data().description;
            $('#inFile').value = await translateSimple(file, ori, lang);
            $('#inFile').value = ultraClean($('#inFile').value, '-');
            $('#inDesc').value = await translateSimple(desc, ori, lang);
            fileFrm();
        }).catch(err => console.log(err));
    }

    function addMed(atempt) {
        let ref = storageRef(STORAGE, 'cookieMedia/' + docId + '/i' + atempt + newMedia.name)
        getDownloadURL(ref).then(res => {
            addMed(atempt + 1);
        }).catch(err => {
            if (err.code == 'storage/object-not-found') {
                uploadBytes(ref, newMedia).on('state_changed',
                    (snap) => {
                        setprog('barNewMed', (snap.bytesTransferred / snap.totalBytes) * 100);
                    },
                    (err) => {
                        if (lang == "es") {
                            alertTop("<strong>¡Ha ocurrido un error!</strong> " + err.code, 0);
                        } else if (lang == "en") {
                            alertTop("<strong>¡There has been an error!</strong> " + err.code, 0);
                        }
                        console.log(err);
                        $('#mdlAddMed').modal('hide');
                    },
                    () => {
                        getDownloadURL(ref).then(medUrl => {
                            docDat.media.push({
                                medFile: 'i' + atempt + newMedia.name,
                                medUrl: medUrl
                            });
                            normSave();
                            fillMed();
                            $('#mdlAddMed').modal('hide');
                            if (addFrom == 0) $('#mdlMedMan').modal('show');
                            else $('#mdlMedCho').modal('show');
                        }).catch(err => { console.log(err) });
                    }
                );
            } else {
                console.log(err);
            }
        });
    }
    function addExtMed() {
        docDat.media.push({
            medFile: 'externo',
            medUrl: $('#inNewMedUrl').value
        });
        normSave();
        $('#mdlAddMed').modal('hide');
        if (addFrom == 0) $('#mdlMedMan').modal('show');
        else $('#mdlMedCho').modal('show');
    }
    $("#frmAddMed").addEventListener("submit", function (event) {
        event.preventDefault();
        setprog('barNewMed', 0);
        $("#barNewMedCont").show();
        $("#frmAddMed").hide();
        disableBtn($("#btnCnfNewMed"));
        disableBtn($("#btnCanNewMed0"));
        disableBtn($("#btnCanNewMed1"));
        if (newMedSrc == "home") addMed(0);
        else addExtMed();
    });
    //Done/
}

let savedInterval;
function saveDoc() {
    console.log('Saving...');
    let d = docDat.published.toDate();
    let month = d.getFullYear().toString();
    if (d.getMonth() < 9) {
        month += '0';
    }
    month += (d.getMonth() + 1);
    let galletasText = "";
    switch (lang) {
        case "es":
            galletasText = "galletas";
            break;
        case "en":
            galletasText = "cookies";
            break;
    }
    docDat.url = 'https://sciencecookies.net/' + galletasText + '/' + month + '/' + docDat.file + '/';
    docDat.ledit = Timestamp.now();
    fillKW();
    const promises = [];
    langs.forEach(l => {
        if (l != lang) {
            let syncUpt = {
                authors: docDat.authors.slice(),
                media: docDat.media.slice(),
                java: docDat.java,
                notify: docDat.notify,
                public: docDat.public,
                dledit: docDat.dledit,
                created: docDat.created,
                ledit: docDat.ledit,
                published: docDat.published,
                pop: docDat.pop,
                likes: docDat.likes,
                favs: docDat.favs,
                revised: docDat.revised,
                translations: docDat.translations,
                fixedCats: docDat.fixedCats.slice(),
                timePrev: docDat.timePrev | null,
            }
            syncUpt.fixedCats.forEach(function (cat, idx) {
                syncUpt.fixedCats.splice(idx, 1, catTranslations[cat][l]);
            });
            syncUpt.translations[lang] = docDat.url;
            promises.push(updateDoc(docRef(FSDB, 'cookies/langs/' + l, docId), syncUpt));
        }
    })
    return Promise.all(promises).then(() => {
        return updateDoc(cookDocRef, docDat);
    });
}
function normSave() {
    saveDoc().then(() => {
        if (saved) clearInterval(savedInterval);
        saved = true;
        savedInterval = setInterval(() => {
            setSavedTime();
        }, 300010);
        if (lang == "es") {
            $('#tagLstSave').text("Se han guardado todos los cambios");
        } else if (lang == "en") {
            $('#tagLstSave').text("All changes have been saved");
        }
        lastSave = Date.now();
    }).catch(err => {
        if (lang == "es") {
            $('#tagLstSave').text("Error, no se han guardado todos los cambios: " + err.code);
        } else if (lang == "en") {
            $('#tagLstSave').text("Error, changes not saved: " + err.code);
        }
        console.log(err);
    });
}

//Done
window.plusSect = function plusSect(type) {
    //Add unique key (timestamp, Date.now()/1000)
    let newSect = null;
    if (type == 'html') {
        newSect = {
            type: type,
            html: ""
        };
    } else if (type == 'parra') {
        newSect = {
            type: type,
            text: "",
            title: "0"
        };
    } else if (type == 'youtube') {
        newSect = {
            type: type,
            vidUrl: "",
            ratio: "16by9"
        };
    } else if (type == 'medSimple') {
        newSect = {
            type: type,
            medUrl: "https://via.placeholder.com/150.webp",
            alt: "",
            caption: "",
            hasCapt: "true",
            width: "75%"
        };
    }
    //Add more@#
    if (newSect != null) docDat.cont.splice(toAdd, 0, newSect);
    render();
}

function setprog(bar, n) {
    bar = document.getElementById(bar);
    n = Math.floor(n);
    bar.attr('aria-valuenow', n);
    bar.style.width = n + '%';
    bar.text(n + '%');
}
function runprog(bar, b, e) {
    b = Math.floor(b);
    e = Math.floor(e);
    for (let i = b; i <= e; i++) {
        setTimeout(() => {
            setprog(bar, i);
        }, 5);
    }
}

function removeMedia(medFileName) {
    return deleteObject(storageRef(STORAGE, 'cookieMedia/' + docId + '/' + medFileName));
}

function fillMed() {
    $('#contMedMan').html(`<div class="col mb-4">
        <div class="card text-dark bg-light h-100 cardBorder" style="border-color: #343a40;">
            <a type="button" data-toggle="modal" data-target="#mdlAddMed" data-dismiss="modal" aria-label="Close" class="text-decoration-none text-dark h-100 d-flex align-items-center justify-content-center" onclick="addFrom=0;">
                <h1 style="font-size: 6rem;" class="mb-0"><i class="far fa-plus-square"></i></h1>
            </a>
        </div>
    </div>`);
    $('#contMedCho').html(`<div class="col mb-4">
        <div class="card text-dark bg-light h-100 cardBorder" style="border-color: #343a40;">
            <a type="button" data-toggle="modal" data-target="#mdlAddMed" data-dismiss="modal" aria-label="Close" class="text-decoration-none text-dark h-100 d-flex align-items-center justify-content-center" onclick="addFrom=1;">
                <h1 style="font-size: 6rem;" class="mb-0"><i class="far fa-plus-square"></i></h1>
            </a>
        </div>
    </div>`);

    docDat.media.forEach((itm, idx) => {
        let col0 = $('<div></div>');
        classes(col0, "col mb-4");
        let card0 = $('<div></div>');
        classes(card0, "card text-light bg-dark");
        col0.appendChild(card0);
        let img0 = $('<img/>');
        classes(img0, "card-img");
        img0.src = itm.medUrl;
        card0.appendChild(img0);
        let over0 = $('<div></div>');
        classes(over0, "card-img-overlay pt-0");
        over0.style.paddingLeft = ".9rem";
        over0.style.paddingRight = ".9rem";
        card0.appendChild(over0);
        let btns0 = $('<div></div>');
        classes(btns0, "row mb-2 p-0");
        over0.appendChild(btns0);
        let medBtnDel = $('<button></button>');
        classes(medBtnDel, "btn btn-light btn-science btn-sm");
        medBtnDel.html('<i class="fas fa-trash-alt"></i>');
        medBtnDel.onclick = function () {
            if (toDelMed == idx) {
                toDelMed = -1;
                if ($("#btnAlrtClsSsn")) $("#btnAlrtClsSsn").click();
                if (itm.medFile != 'externo') {
                    removeMedia(itm.medFile).then(() => {
                        if (itm.medUrl == docDat.picUrl) {
                            docDat.picUrl = "";
                        }
                        docDat.media.splice(idx, 1);
                        normSave();
                    }).catch(err => console.log(err));
                } else {
                    if (itm.medUrl == docDat.picUrl) {
                        docDat.picUrl = "";
                    }
                    docDat.media.splice(idx, 1);
                    normSave();
                }
            } else {
                if (lang == "es") {
                    alertTop("<strong>¿Quieres eliminar esta imagen?</strong> Presiona de nuevo el botón para confirmar.", 2);
                } else if (lang == "en") {
                    alertTop("<strong>Do you want to delete this image? </strong> Press the button again to confirm.", 2);
                }
                toDelMed = idx;
                setTimeout(() => {
                    toDelMed = -1;
                }, 3000);
            }
        };
        btns0.appendChild(medBtnDel);
        let tooltip = $('<div></div>');
        classes(tooltip, "tooltipn ml-auto");
        let medBtnCopy = $('<button></button>');
        classes(medBtnCopy, "btn btn-light btn-science btn-sm");
        let tltipTxt = $('<span></span>');
        classes(tltipTxt, "tooltipTextn");
        if (lang == "es") {
            tltipTxt.html("Copiar");
        } else if (lang == "en") {
            tltipTxt.html("Copy");
        }
        medBtnCopy.appendChild(tltipTxt);
        medBtnCopy.html(medBtnCopy.html() + '<i class="fas fa-link"></i>');
        medBtnCopy.onclick = function () {
            /*var copyText = $("#toCopy");
            //copyText.show();
            copyText.select();
            copyText.setSelectionRange(0, 99999);
            document.execCommand("copy");
            //classes(copyText, "d-none");*/
            window.open(itm.medUrl).focus();
            if (lang == "es") {
                tltipTxt.html("URL copiado");
            } else if (lang == "en") {
                tltipTxt.html("Copied URL");
            }
        };
        medBtnCopy.onmouseout = function () {
            if (lang == "es") {
                tltipTxt.html("Copiar");
            } else if (lang == "en") {
                tltipTxt.html("Copy");
            }
        }
        tooltip.appendChild(medBtnCopy);
        btns0.appendChild(tooltip);
        let medBtnUnstar = $('<button></button>');
        let medBtnStar = $('<button></button>');
        if (itm.medUrl == docDat.picUrl) {
            classes(medBtnUnstar, "btn btn-light btn-science btn-sm ml-1");
            medBtnUnstar.html('<i class="fas fa-star"></i>');
            medBtnUnstar.onclick = function () {
                docDat.picUrl = "";
                normSave();
            };
            btns0.appendChild(medBtnUnstar);
        } else {
            classes(medBtnStar, "btn btn-light btn-science btn-sm ml-1");
            medBtnStar.html('<i class="far fa-star"></i>');
            medBtnStar.onclick = function () {
                docDat.picUrl = itm.medUrl;
                normSave();
            };
            btns0.appendChild(medBtnStar);
        }

        $('#contMedMan').appendChild(col0);


        let col1 = $('<div></div>');
        classes(col1, "col mb-4");
        let btnA1 = $('<a></a>');
        classes(btnA1, 'text-decoration-none');
        btnA1.attr('type', 'button');
        btnA1.onclick = function () {
            if (toAddMed == -1) return;
            docDat.cont[toAddMed].medUrl = itm.medUrl;
            normSave();
        };
        btnA1.attr("data-dismiss", "modal");
        col1.appendChild(btnA1);
        let card1 = $('<div></div>');
        classes(card1, "card text-light bg-dark");
        btnA1.appendChild(card1);
        let img1 = $('<img/>');
        classes(img1, "card-img");
        img1.src = itm.medUrl;
        card1.appendChild(img1);

        $('#contMedCho').appendChild(col1);
    });
}
//Done/

function setSavedTime() {
    let minutes = Math.floor((Date.now() - lastSave) / 60000);
    if (minutes > 0) {
        if (minutes > 59) {
            if (lang == "es") {
                $('#tagLstSave').text("Guardado hace " + Math.floor(minutes / 60) + " horas");
            } else if (lang == "en") {
                $('#tagLstSave').text("Saved " + Math.floor(minutes / 60) + " hours ago");
            }
        }
        else {
            if (lang == "es") {
                $('#tagLstSave').text("Guardado hace " + minutes + " minutos");
            } else if (lang == "en") {
                $('#tagLstSave').text("Saved " + minutes + " minutes ago");
            }
        }
    } else {
        if (lang == "es") {
            $('#tagLstSave').text("Guardado hace " + Math.floor((Date.now() - lastSave) / 1000) + " segundos");
        } else if (lang == "en") {
            $('#tagLstSave').text("Saved " + Math.floor((Date.now() - lastSave) / 1000) + " seconds ago");
        }
    }
}

function render() {
    $('#cont').html("");
    let publishDate;
    if (docDat.beenPublic) {
        publishDate = docDat.published;
    } else {
        docDat.published = publishDate = Timestamp.now();
    }
    //Done
    docDat.cont.forEach((item, idx) => {
        let sect = $('<div></div>');
        sect.id = 'sect' + idx;
        let div = $('<div></div>');
        classes(div, 'dropdown-divider mx-2')
        if (item.type != 'head') sect.appendChild(div);

        let subt = $('<div></div>');
        subt.id = "sect" + idx + "t";
        let subf = $('<div></div>');
        classes(subf, "d-none");
        subf.id = "sect" + idx + "f";

        let act = $('<div></div>');
        classes(act, 'row mb-2 px-2');
        let btnDel, btnEdit, btnCheck, btnAdd, btnTrans, selLang;

        if (item.type != 'head' && item.type != 'ref') {
            btnDel = $('<button></button>');
            classes(btnDel, 'btn btn-light btn-link-science ml-2');
            btnDel.html('<i class="fas fa-trash-alt"></i>');
            btnDel.onclick = function () {
                if (toDel == idx) {
                    toDel = -1;
                    if ($("#btnAlrtClsSsn")) $("#btnAlrtClsSsn").click();
                    docDat.cont.splice(idx, 1);
                    render();//Important
                    normSave();
                } else {
                    if (lang == "es") {
                        alertTop("<strong>¿Quieres eliminar esta sección?</strong> Presiona de nuevo el botón para confirmar.", 2);
                    } else if (lang == "en") {
                        alertTop("<strong>Do you want to delete this section? </strong> Press the button again to confirm.", 2);
                    }
                    toDel = idx;
                    setTimeout(() => {
                        toDel = -1;
                    }, 3000);
                }
            }
            act.appendChild(btnDel);
        }

        let selLangC = $('<div></div>');
        classes(selLangC, "col-auto");
        selLang = $('<select></select>');
        classes(selLang, "form-control mr-0 ml-2 h-100");
        langs.forEach((l, i) => {
            if (l != lang) {
                let opt = $('<option></option>');
                if (i == 0) {
                    opt.attr('selected', 'true');
                }
                opt.value = l;
                opt.text(l);
                selLang.appendChild(opt);
            }
        })

        if (item.type != 'ref') {
            selLangC.appendChild(selLang);
            act.appendChild(selLangC);
            btnTrans = $('<button></button>');
            classes(btnTrans, 'btn btn-light btn-link-science');
            btnTrans.html('<i class="fas fa-language"></i>');
            btnTrans.onclick = function () {
                getDoc(docRef(FSDB, 'cookies/langs/' + selLang.value, docId)).then(async function (doc) {
                    let sect = doc.data().cont[idx];
                    if (item.type != sect.type) return;
                    if (sect.type == 'head') {
                        docDat.cont[idx].title = await translateSimple(sect.title, selLang.value, lang);
                    } else if (sect.type == 'html') {
                        docDat.cont[idx].html = await translateSimple(sect.html, selLang.value, lang);
                    } else if (sect.type == 'parra') {
                        docDat.cont[idx].text = await translateSimple(sect.text, selLang.value, lang);
                        if (sect.title != "0") {
                            docDat.cont[idx].titleTxt = await translateSimple(sect.titleTxt, selLang.value, lang);
                        }
                    } else if (sect.type == 'medSimple') {
                        docDat.cont[idx].alt = await translateSimple(sect.alt, selLang.value, lang);
                        docDat.cont[idx].caption = await translateSimple(sect.caption, selLang.value, lang);
                    }
                    console.log(docDat.cont[idx]);
                    normSave();
                }).catch(err => console.log(err));
            }
            act.appendChild(btnTrans);

            btnEdit = $('<button></button>');
            classes(btnEdit, 'btn btn-light btn-link-science ml-auto');
            btnEdit.html('<i class="fas fa-edit"></i>');
            btnEdit.onclick = function () {
                btnEdit.toggle();
                btnCheck.toggle();
                subf.toggle();
                if ($('#tagLstSave').text() == "Se han guardado todos los cambios" || $('#tagLstSave').text() == "All changes have been saved") {
                    setSavedTime();
                }
            }
            act.appendChild(btnEdit);
            btnCheck = $('<button></button>');
            classes(btnCheck, 'btn btn-light btn-link-science ml-auto d-none');
            btnCheck.html('<i class="fas fa-check"></i>');
            btnCheck.onclick = function () {
                btnEdit.toggle();
                btnCheck.toggle();
                subf.toggle();
                normSave();
            }
            act.appendChild(btnCheck);
            btnAdd = $('<button></button>');
            classes(btnAdd, 'btn btn-light btn-link-science mx-2');
            btnAdd.html('<i class="fas fa-plus"></i>');
            btnAdd.attr('data-toggle', "modal");
            btnAdd.attr('data-target', "#mdlPlusSect");
            btnAdd.onclick = function () {
                toAdd = idx + 1;
            }
            act.appendChild(btnAdd);
        }
        sect.appendChild(act);

        if (item.type == 'head') {
            let d = publishDate.toDate();
            d = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
            let ld = docDat.ledit.toDate();
            ld = ld.getDate() + '/' + (ld.getMonth() + 1) + '/' + ld.getFullYear();

            let h = $('<h1></h1>');
            classes(h, "text-center");
            h.html(docDat.cont[0].title);
            subt.appendChild(h);
            let pPub = $('<p></p>');
            let publishTxt, lstUptTxt, authrsTxt;
            if (lang == "es") {
                publishTxt = "Publicado: ";
                lstUptTxt = "Ultima actualización: ";
                authrsTxt = "Autor(es): "
            } else if (lang == "en") {
                publishTxt = "Published: ";
                lstUptTxt = "Last updated: ";
                authrsTxt = "Author(s):"
            }
            pPub.text(d);
            publishTxt + d;
            subt.appendChild(pPub);
            if (docDat.dledit) {
                let pLEdit = $('<p></p>');
                pLEdit.text(lstUptTxt + ld);
                subt.appendChild(pLEdit);
            }
            let pAuth = $('<p></p>');
            pAuth.text(authrsTxt + docDat.cont[0].author);
            subt.appendChild(pAuth);

            let fd0 = $('<div></div>');
            classes(fd0, "row justify-content-center mb-2");
            let fc0 = $('<div></div>');
            classes(fc0, "col col-lg-6");
            let in0 = $('<input></input>');
            classes(in0, "form-control form-control-lg text-center");
            in0.attr('type', 'text');
            in0.attr('placeholder', docDat.cont[0].title);
            in0.value = docDat.cont[0].title;
            fc0.appendChild(in0);
            fd0.appendChild(fc0);
            subf.appendChild(fd0);
            in0.oninput = function () {
                docDat.title = docDat.cont[0].title = in0.value.trim();
                h.html(docDat.cont[0].title);
            };

            let fd1 = $('<div></div>');
            classes(fd1, "row mb-2");
            let fl1 = $('<label></label>');
            classes(fl1, "col-sm-2 col-form-label");
            fl1.text(publishTxt);
            let fc1 = $('<div></div>');
            classes(fc1, "col");
            let in1 = $('<input></input>');
            classes(in1, "form-control");
            in1.attr('type', 'text');
            in1.attr('readonly', 'true');
            in1.value = d;
            fc1.appendChild(in1);
            fd1.appendChild(fl1);
            fd1.appendChild(fc1);
            subf.appendChild(fd1);

            let fd2 = $('<div></div>');
            let fl2 = $('<label></label>');
            let fc2 = $('<div></div>');
            let in2 = $('<input></input>');
            if (docDat.dledit) {
                classes(fd2, "row mb-2");
                classes(fl2, "col-sm-2 col-form-label");
                fl2.text(lstUptTxt);
                classes(fc2, "col");
                classes(in2, "form-control");
                in2.attr('type', 'text');
                in2.attr('readonly', 'true');
                in2.value = ld;
                fc2.appendChild(in2);
                fd2.appendChild(fl2);
                fd2.appendChild(fc2);
                subf.appendChild(fd2);
            }

            let fd3 = $('<div></div>');
            classes(fd3, "row mb-2");
            let fl3 = $('<label></label>');
            classes(fl3, "col-sm-2 col-form-label");
            fl3.text(authrsTxt);
            let fr3 = $('<div></div>');
            classes(fr3, "form-row justify-content-around pt-2");
            let f3c0 = $('<div></div>');
            classes(f3c0, "form-group col-auto mr-2");
            let f3f0 = $('<div></div>');
            classes(f3f0, "form-check");
            f3c0.appendChild(f3f0);
            let inAu0 = $('<input></input>');
            classes(inAu0, "form-check-input");
            inAu0.attr('type', 'checkbox');
            if (docDat.cont[0].author.includes(' Andrea Garma')) inAu0.attr('checked', 'true');
            inAu0.value = ' Andrea Garma';
            let inAuL0 = $('<label></label>');
            classes(inAuL0, "form-check-label");
            inAu0.attr('for', 'authr0');
            inAuL0.text("Andrea Garma");
            f3f0.appendChild(inAu0);
            f3f0.appendChild(inAuL0);
            fr3.appendChild(f3c0);
            let f3c1 = $('<div></div>');
            classes(f3c1, "form-group col-auto mr-2");
            let f3f1 = $('<div></div>');
            classes(f3f1, "form-check");
            f3c1.appendChild(f3f1);
            let inAu1 = $('<input></input>');
            classes(inAu1, "form-check-input");
            inAu1.attr('type', 'checkbox');
            if (docDat.cont[0].author.includes(' Javier Pantoja')) inAu1.attr('checked', 'true');
            inAu1.value = ' Javier Pantoja';
            let inAuL1 = $('<label></label>');
            classes(inAuL1, "form-check-label");
            inAu1.attr('for', 'authr1');
            inAuL1.text("Javier Pantoja");
            f3f1.appendChild(inAu1);
            f3f1.appendChild(inAuL1);
            fr3.appendChild(f3c1);
            let f3c2 = $('<div></div>');
            classes(f3c2, "form-group col-auto mr-2");
            let f3f2 = $('<div></div>');
            classes(f3f2, "form-check");
            f3c2.appendChild(f3f2);
            let inAu2 = $('<input></input>');
            classes(inAu2, "form-check-input");
            inAu2.attr('type', 'checkbox');
            if (docDat.cont[0].author.includes(' Paulina Vargas')) inAu2.attr('checked', 'true');
            inAu2.value = ' Paulina Vargas';
            let inAuL2 = $('<label></label>');
            classes(inAuL2, "form-check-label");
            inAu2.attr('for', 'authr2');
            inAuL2.text("Paulina Vargas");
            f3f2.appendChild(inAu2);
            f3f2.appendChild(inAuL2);
            fr3.appendChild(f3c2);
            function uptAuthors(a0, a1, a2) {
                let arr = [];
                if (a0) arr.push(" Andrea Garma");
                if (a1) arr.push(" Javier Pantoja");
                if (a2) arr.push(" Paulina Vargas");
                if (arr.empty) arr.push(' Anónimo');
                docDat.cont[0].author = arr.slice();
                docDat.authors = arr.slice();
                if (lang == "es") {
                    pAuth.text("Autor(es):" + docDat.cont[0].author);
                } else if (lang == "en") {
                    pAuth.text("Author(s):" + docDat.cont[0].author);
                }
            }
            inAu0.onclick = function () {
                uptAuthors(inAu0.checked, inAu1.checked, inAu2.checked);
            };
            inAu1.onclick = function () {
                uptAuthors(inAu0.checked, inAu1.checked, inAu2.checked);
            };
            inAu2.onclick = function () {
                uptAuthors(inAu0.checked, inAu1.checked, inAu2.checked);
            };

            fd3.appendChild(fl3);
            fd3.appendChild(fr3);
            subf.appendChild(fd3);
        } else if (item.type == 'ref') {
            let h = $('<h3></h3>');
            if (lang == "es") {
                h.html('<br>Referencias');
            } else if (lang == "en") {
                h.html('<br>References');
            }
            subt.appendChild(h);
            item.ref.forEach((ref, refIdx) => {
                let refR = $('<div></div>');
                classes(refR, "row mb-2");
                let cLink = $('<div></div>');
                classes(cLink, "col");
                refR.appendChild(cLink);
                let cLinkFrm = $('<div></div>');
                classes(cLinkFrm, "col d-none");
                refR.appendChild(cLinkFrm);
                let cBtn = $('<div></div>');
                classes(cBtn, "col-auto");
                refR.appendChild(cBtn);
                let pRef = $('<p></p>');
                cLink.appendChild(pRef);
                let aRef;

                function makeRefCite(text) {
                    pRef.html(text);
                }
                function makeRefWeb(text) {
                    pRef.html("");
                    aRef = $('<a></a>');
                    classes(aRef, "text-warning text-break")
                    aRef.href = text;
                    aRef.attr('target', '_blank');
                    aRef.attr('rel', 'nofollow');
                    aRef.html(text + ' <i class="fas fa-external-link-alt"></i>');
                    pRef.appendChild(aRef);
                }
                if (ref.type == 'web') {
                    makeRefWeb(ref.link);
                } else if (ref.type == 'cite') {
                    makeRefCite(ref.link);
                }

                function changeRef() {
                    in1.value = in1.value.trim();
                    docDat.cont[idx].ref[refIdx].link = in0.value;
                    docDat.cont[idx].ref[refIdx].type = in1.value;
                    if (ref.type == 'web') {
                        makeRefWeb(ref.link);
                        in0.attr('placeholder', 'https://google.com');
                    } else if (ref.type == 'cite') {
                        makeRefCite(ref.link);
                        in0.attr('placeholder', 'Ref');
                    }
                }
                let fr0 = $('<div></div>');
                classes(fr0, "row");
                let fc0 = $('<div></div>');
                classes(fc0, "col");
                let fc1 = $('<div></div>');
                classes(fc1, "col-auto");
                let in0 = $('<input></input>');
                let in1 = $('<select></select>');
                classes(in0, "form-control");
                in0.attr('type', 'text');
                in0.value = ref.link;
                if (ref.type == 'web') in0.attr('placeholder', 'https://google.com');
                if (ref.type == 'cite') in0.attr('placeholder', 'Ref');
                in0.onchange = function () { changeRef(); }
                classes(in1, "form-control form-control-sm");
                let inOpt0 = $('<option></option>');
                inOpt0.value = "web";
                if (ref.type == 'web') inOpt0.attr('selected', 'true');
                inOpt0.text('Web');
                in1.appendChild(inOpt0);
                let inOpt1 = $('<option></option>');
                if (ref.type == 'cite') inOpt1.attr('selected', 'true');
                inOpt1.value = "cite";
                if (lang == "es") {
                    inOpt1.text('Otro');
                } else if (lang == "en") {
                    inOpt1.text('Other');
                }
                in1.appendChild(inOpt1);
                in1.onchange = function () { changeRef(); }
                fc0.appendChild(in0);
                fc1.appendChild(in1);
                fr0.appendChild(fc0);
                fr0.appendChild(fc1);
                cLinkFrm.appendChild(fr0);

                function toggleRef() {
                    cLink.toggle();
                    cLinkFrm.toggle();
                    rBtnEdit.toggle();
                    rBtnCheck.toggle();
                }
                let rBtnEdit, rBtnCheck;
                rBtnEdit = $('<button></button>');
                classes(rBtnEdit, 'btn btn-light btn-link-science ml-auto');
                rBtnEdit.html('<i class="fas fa-edit"></i>');
                rBtnEdit.onclick = function () {
                    toggleRef();
                    if ($('#tagLstSave').text() == "Se han guardado todos los cambios" || $('#tagLstSave').text() == "All changes have been saved") {
                        setSavedTime();
                    }
                };
                rBtnCheck = $('<button></button>');
                classes(rBtnCheck, 'btn btn-light btn-link-science ml-auto d-none');
                rBtnCheck.html('<i class="fas fa-check"></i>');
                rBtnCheck.onclick = function () {
                    toggleRef();
                    docDat.cont[idx].ref.sort((a, b) => {
                        let linkA = a.link.toUpperCase();
                        let linkB = b.link.toUpperCase();
                        if (linkA < linkB) return -1;
                        if (linkA > linkB) return 1;
                        return 0;
                    });
                    normSave();
                };
                cBtn.appendChild(rBtnEdit);
                cBtn.appendChild(rBtnCheck);
                let rBtnDel = $('<button></button>');
                classes(rBtnDel, 'btn btn-light btn-link-science ml-2');
                rBtnDel.html('<i class="fas fa-trash-alt"></i>');
                rBtnDel.onclick = function () {
                    docDat.cont[idx].ref.splice(refIdx, 1);
                    normSave();
                    render();//@#Important, why?
                };
                cBtn.appendChild(rBtnDel);

                subt.appendChild(refR);

                if (ref.link == "") {
                    rBtnEdit.click();
                }
            });
            let btnPlusRef0 = $('<a></a>');
            classes(btnPlusRef0, "btn btn-light btn-science");
            btnPlusRef0.onclick = function () { plusRef(); };
            btnPlusRef0.html('<i class="fas fa-plus"></i>')
            h.appendChild(btnPlusRef0);
            let btnPlusRef1 = $('<a></a>');
            classes(btnPlusRef1, "btn btn-light btn-science btn-lg btn-block border border-light");
            btnPlusRef1.onclick = function () { plusRef(); };
            btnPlusRef1.html('<i class="fas fa-plus"></i>')
            subt.appendChild(btnPlusRef1);
            function plusRef() {
                docDat.cont[idx].ref.push({
                    type: "web",
                    link: ""
                });
                render();
            }
        } else if (item.type == 'parra') {
            let h;
            if (Number(item.title) > 0) {
                if (Number(item.title) == 2) subt.html('<br>');
                h = $('<h' + item.title + '></h' + item.title + '>');
                h.html(item.titleTxt);
                subt.appendChild(h);
            }
            let p = $('<p></p>');
            p.html(item.text);
            subt.appendChild(p);

            let fr0 = $('<div></div>');
            classes(fr0, "row");
            let fc0 = $('<div></div>');
            classes(fc0, "col");
            let fc1 = $('<div></div>');
            classes(fc1, "col-auto");
            let in0 = $('<input></input>');
            let in1 = $('<select></select>');
            classes(in0, "form-control");
            in0.attr('type', 'text');
            if (Number(item.title) > 0) {
                in0.value = item.titleTxt;
                if (lang == "es") {
                    in0.attr('placeholder', 'Subtítulo');
                } else if (lang == "en") {
                    in0.attr('placeholder', 'Subtitle');
                }
                in0.removeAttribute('readonly');
            } else {
                in0.value = "";
                in0.attr('placeholder', '');
                in0.attr('readonly', 'true');
            }
            in0.oninput = function () {
                h.html(in0.value);
                docDat.cont[idx].titleTxt = in0.value;
            }
            classes(in1, "form-control form-control-sm");
            for (let i = 0; i < 7; i++) {
                let inOpt = $('<option></option>');
                inOpt.value = i;
                if (item.title == i) inOpt.attr('selected', 'true');
                inOpt.text(i);
                in1.appendChild(inOpt);
            }
            in1.oninput = function () {
                docDat.cont[idx].title = in1.value;
                if (Number(in1.value) > 0) {
                    if (lang == "es") {
                        in0.attr('placeholder', 'Subtítulo');
                    } else if (lang == "en") {
                        in0.attr('placeholder', 'Subtitle');
                    }
                    in0.removeAttribute('readonly');
                    if (Number(item.title) == 2) subt.html('<br>');
                    else subt.html("");
                    h = $('<h' + item.title + '></h' + item.title + '>');
                    h.html(in0.value);
                    docDat.cont[idx].titleTxt = in0.value;
                    subt.appendChild(h);
                    subt.appendChild(p);
                } else {
                    in0.value = "";
                    in0.attr('placeholder', '');
                    in0.attr('readonly', 'true');
                    docDat.cont[idx].titleTxt = in0.value;
                    subt.html("");
                    subt.appendChild(p);
                }
            }
            fc0.appendChild(in0);
            fc1.appendChild(in1);
            fr0.appendChild(fc0);
            fr0.appendChild(fc1);
            subf.appendChild(fr0);

            let fr1 = $('<div></div>');
            classes(fr1, "row mb-2");
            let f1c0 = $('<div></div>');
            classes(fc0, "col");
            let in2 = $('<textarea></textarea>');
            classes(in2, "form-control");
            in2.attr('rows', '8');
            in2.value = item.text;
            in2.oninput = function () {
                p.html(in2.value.trim());
                docDat.cont[idx].text = in2.value.trim();
            };
            f1c0.appendChild(in2);
            fr1.appendChild(f1c0);
            subf.appendChild(fr1);

            if (Number(item.title) > 0 && item.titleTxt == "") {
                btnEdit.click();
            }
        } else if (item.type == 'html') {
            let html = $('<div></div>');
            html.html(item.html);
            subt.appendChild(html);

            let fr0 = $('<div></div>');
            classes(fr0, "row mb-2");
            let fc0 = $('<div></div>');
            classes(fc0, "col");
            let in0 = $('<textarea></textarea>');
            classes(in0, "form-control");
            in0.attr('rows', '8');
            in0.value = item.html;
            in0.onchange = function () {
                html.html(in0.value.trim());
                docDat.cont[idx].html = in0.value.trim();
            };
            fc0.appendChild(in0);
            fr0.appendChild(fc0);
            subf.appendChild(fr0);

            if (item.html == "") {
                btnEdit.click();
            }
        } else if (item.type == 'youtube') {
            let yt = $('<div></div>');
            classes(yt, "embed-responsive embed-responsive-" + item.ratio);
            let iframe = $('<iframe></iframe>');
            iframe.src = item.vidUrl;
            iframe.attr('frameborder', "0");
            iframe.attr('allow', "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
            iframe.attr('allowfullscreen', "true");
            yt.appendChild(iframe);
            subt.appendChild(yt);

            let fr0 = $('<div></div>');
            classes(fr0, "row");
            let fc0 = $('<div></div>');
            classes(fc0, "col");
            let fc1 = $('<div></div>');
            classes(fc1, "col-auto");
            let in0L = $('<label></label>');
            in0L.text("URL");
            let in0 = $('<input></input>');
            classes(in0, "form-control");
            in0.attr('type', 'text');
            in0.value = item.vidUrl;
            in0.onchange = function () {
                let convUrl = in0.value.trim();
                if (convUrl.length == 11) convUrl = "https://www.youtube.com/embed/" + convUrl;
                else {
                    let part, i = 1;
                    do {
                        part = convUrl[i - 1] + convUrl[i];
                        i++;
                    } while (part != "e/" && part != "v=");
                    convUrl = "https://www.youtube.com/embed/" + convUrl.substr(i, 11);
                }
                docDat.cont[idx].vidUrl = iframe.src = convUrl;
            }
            let help0 = $('<small></small>');
            classes(help0, "text-muted");
            if (lang == "es") {
                help0.text("aaaaaaaaaaa o https://youtu.be/aaaaaaaaaaa o https://www.youtube.com/watch?v=aaaaaaaaaaa");
            } else if (lang == "en") {
                help0.text("aaaaaaaaaaa or https://youtu.be/aaaaaaaaaaa or https://www.youtube.com/watch?v=aaaaaaaaaaa");
            }
            let in1L = $('<label></label>');
            in1L.text("Ratio");
            let in1 = $('<select></select>');
            classes(in1, "form-control form-control-sm");
            let ratios = ['21by9', '16by9', '4by3', '1by1'];
            for (let i = 0; i < 4; i++) {
                let inOpt = $('<option></option>');
                inOpt.value = ratios[i];
                if (item.ratio == ratios[i]) inOpt.attr('selected', 'true');
                inOpt.text(ratios[i].replaceAll('by', ':'));
                in1.appendChild(inOpt);
            }
            in1.oninput = function () {
                docDat.cont[idx].ratio = in1.value;
                ratios.forEach(rat => {
                    yt.removeClass('embed-responsive-' + rat);
                })
                classes(yt, "embed-responsive-" + item.ratio);
            }
            fc0.appendChild(in0L);
            fc0.appendChild(in0);
            fc0.appendChild(help0);
            fc1.appendChild(in1L);
            fc1.appendChild(in1);
            fr0.appendChild(fc0);
            fr0.appendChild(fc1);
            subf.appendChild(fr0);

            if (item.vidUrl == "") {
                btnEdit.click();
            }
        } else if (item.type == 'medSimple') {
            let fig = $('<figure></figure>');
            classes(fig, "mx-auto");
            fig.style.width = item.width;
            fig.style.position = "relative";
            fig.style.borderRadius = ".25rem";
            let img0 = $('<img/>');
            img0.attr('alt', item.alt);
            img0.src = item.medUrl;
            classes(img0, "w-100");
            fig.appendChild(img0);
            let over0 = $('<div></div>');
            classes(over0, "card-img-overlay pt-0");
            over0.style.paddingLeft = ".9rem";
            over0.style.paddingRight = ".9rem";
            let btns0 = $('<div></div>');
            classes(btns0, "row mb-2 p-0");
            over0.appendChild(btns0);
            let btnChange = $('<button></button>');
            classes(btnChange, "btn btn-light btn-science btn-sm ml-auto");
            btnChange.html('<i class="fas fa-exchange-alt"></i>');
            btnChange.attr('data-toggle', "modal")
            btnChange.attr('data-target', "#mdlMedCho")
            btnChange.onclick = function () {
                toAddMed = idx;
            };
            btns0.appendChild(btnChange);
            fig.appendChild(over0);
            let capt = $('<figcaption></figcaption>');
            capt.style.fontSize = "70%";
            capt.style.fontWeight = "lighter";
            capt.html(item.caption);
            if (item.hasCapt) {
                fig.appendChild(capt);
            }
            subt.appendChild(fig);

            let rcont = $('<div></div>');
            classes(rcont, "form-group mb-2");
            let rnL = $('<label></label>');
            if (lang == "es") {
                rnL.text("Tamaño");
            } else if (lang == "en") {
                rnL.text("Size");
            }
            let ranR = $('<div></div>');
            classes(ranR, "row");
            let ranRC0 = $('<div></div>');
            classes(ranRC0, "col align-center d-flex pr-0");
            let in3 = $('<input></input>');
            in3.attr('type', 'range');
            in3.attr('max', '100');
            in3.attr('min', '0');
            in3.attr('step', '1');
            in3.value = '75';
            classes(in3, "form-control-range");
            in3.oninput = function () {
                valL.html(in3.value + '%');
                fig.style.width = docDat.cont[idx].width = in3.value + '%';
            }
            ranRC0.appendChild(in3);
            let valL = $('<span></span>');
            classes(valL, "badge badge-primary range-value-L");
            valL.text('75%');
            let ranRC1 = $('<div></div>');
            classes(ranRC1, "col-auto");
            ranRC1.appendChild(valL);
            ranR.appendChild(ranRC0);
            ranR.appendChild(ranRC1);
            rcont.appendChild(rnL);
            rcont.appendChild(ranR);
            subf.appendChild(rcont);
            let fr0 = $('<div></div>');
            classes(fr0, "row");
            let fc0 = $('<div></div>');
            classes(fc0, "col");
            let fc1 = $('<div></div>');
            classes(fc1, "col-auto");
            let in0L = $('<label></label>');
            if (lang == "es") {
                in0L.text("Pie de foto");
            } else if (lang == "en") {
                in0L.text("Caption");
            }
            let in0 = $('<input></input>');
            classes(in0, "form-control");
            in0.attr('type', 'text');
            in0.value = item.caption;
            in0.oninput = function () {
                capt.html(in0.value.trim());
                docDat.cont[idx].caption = in0.value.trim();
            }
            let in1 = $('<select></select>');
            classes(in1, "form-control form-control-sm");
            let inOpt0 = $('<option></option>');
            inOpt0.value = "true";
            if (item.hasCapt == "true") inOpt0.attr('selected', 'true');
            if (lang == "es") {
                inOpt0.text("Sí");
            } else if (lang == "en") {
                inOpt0.text("Yes");
            }
            in1.appendChild(inOpt0);
            let inOpt1 = $('<option></option>');
            inOpt1.value = "false";
            if (item.hasCapt == "false") inOpt1.attr('selected', 'true');
            inOpt1.text("No");
            in1.appendChild(inOpt1);
            in1.oninput = function () {
                docDat.cont[idx].hasCapt = in1.value;
                if (in1.value == "true") {
                    capt.html(in0.value);
                    in0.value = docDat.cont[idx].caption;
                    in0.removeAttribute('readonly');
                    fig.appendChild(capt);
                } else {
                    in0.value = docDat.cont[idx].caption = "";
                    in0.attr('readonly', 'true');
                    capt.html("");
                    fig.html("");
                    fig.appendChild(img0);
                    fig.appendChild(over0);
                }
            }
            fc0.appendChild(in0L);
            fc0.appendChild(in0);
            fc1.appendChild(in1);
            fr0.appendChild(fc0);
            fr0.appendChild(fc1);
            subf.appendChild(fr0);

            let fr1 = $('<div></div>');
            classes(fr1, "row");
            let f1c0 = $('<div></div>');
            classes(f1c0, "col");
            let in2L = $('<label></label>');
            in2L.text("Alt");
            let in2 = $('<input></input>');
            classes(in2, "form-control");
            in2.attr('type', 'text');
            in2.value = item.alt;
            in2.oninput = function () {
                docDat.cont[idx].alt = in2.value.trim();
                img0.attr('alt', in2.value.trim());
            }
            f1c0.appendChild(in2L);
            f1c0.appendChild(in2);
            fr1.appendChild(f1c0);
            subf.appendChild(fr1);

            if (item.hasCapt == "true" && item.caption == "") {
                btnEdit.click();
            }
        }//Add more@#*/
        sect.appendChild(subt);
        sect.appendChild(subf);
        $('#cont').appendChild(sect);
    });
    $('#inJava').text(docDat.java);
    $('#javaIns').html(docDat.java);
}

$('#inFile').oninput = function () {
    $('#inFile').value = ultraClean($('#inFile').value, '-');
}

$('#inJava').onchange = function () {
    docDat.java = $('#inJava').value;
    $('#javaIns').html($('#inJava').value);
}
$('#btnEditJs').onclick = function () {
    $('#btnEditJs').toggle();
    $('#btnCheckJs').toggle();
    $('#inJava').removeAttribute('readonly');
};
$('#btnCheckJs').onclick = function () {
    $('#btnEditJs').toggle();
    $('#btnCheckJs').toggle();
    $('#inJava').attr('readonly', 'true');
    normSave();
};

function fillTrans() {
    langs.forEach(l => {
        if (l != lang) {
            let opt = $('<option></option>');
            opt.value = l;
            opt.text(l);
            $('#inTransFrom').appendChild(opt);
        }
    })
}

$('#mdlAddMed').on('hidden.bs.modal', e => {
    $("#prevNewMed").src = '';
    if (lang == "es") {
        $('#inNewMedL').html('Elige una imagen');
    } else if (lang == "en") {
        $('#inNewMedL').html('Choose an image');
    }
    $('#inNewMedUrl').value = "";
    $('#inNewMed').removeAttribute('required');
    $('#inNewMedUrl').removeAttribute('required');
    $("#barNewMedCont").hide();
    $("#inNewMedFileCont").hide();
    $("#inNewMedUrlCont").hide();
    $("#frmAddMed").show();
    enableBtn($("#btnCnfNewMed"));
    enableBtn($("#btnCanNewMed0"));
    enableBtn($("#btnCanNewMed1"));
})
$('#inNewMed').addEventListener('change', e => {
    newMedia = e.target.files[0];
    function prevMed() {
        var read = new FileReader();
        read.readAsDataURL(newMedia);
        read.onload = function (e2) {
            $("#prevNewMed").src = e2.target.result;
        };
    };
    newMedia.name = ultraClean(newMedia.name, '');
    $('#inNewMedL').html(newMedia.name);
    prevMed(newMedia);
});
$('#inNewMedUrl').onchange = function () {
    $("#prevNewMed").src = $('#inNewMedUrl').value;
};
$('#inMedSrc0').onclick = function () {
    newMedSrc = "home";
    $('#inNewMed').attr('required', 'true');
    $('#inNewMedUrl').removeAttribute('required');
    $("#inNewMedFileCont").show();
    $("#inNewMedUrlCont").hide();
}
$('#inMedSrc1').onclick = function () {
    newMedSrc = "out";
    $('#inNewMed').removeAttribute('required');
    $('#inNewMedUrl').attr('required', 'true');
    $("#inNewMedFileCont").hide();
    $("#inNewMedUrlCont").show();
}
//Done/

$('#inSendUpt').onclick = function () {
    if ($('#inSendUpt').checked) {
        $('#uptDescCont').show();
        $('#inUptDesc').attr('required', 'true');
    } else {
        $('#uptDescCont').hide();
        $('#inUptDesc').removeAttribute('required');
    }
}

$('#btnPrevCook').onclick = function () {
    docDat.timePrev = Timestamp.fromMillis((new Date(Date.now())).getTime() + 10 * 60000);
    normSave();
};
$('#btnPrevMail').onclick = function () {
    docDat.timePrev = Timestamp.fromMillis((new Date(Date.now())).getTime() + 10 * 60000);
    normSave();
};

$('#btnPrivate').onclick = function () {
    docDat.public = false;
    normSave();
};

$('#btnAprove').onclick = function () {
    if (docDat.revised[lang] && docDat.revised[lang].includes(uid)) {
        docDat.revised[lang].splice(docDat.revised[lang].indexOf(uid), 1);
        $('#btnAprove').html('<i class="far fa-check-square"></i>');
    } else {
        if (!docDat.revised[lang]) docDat.revised[lang] = [];
        docDat.revised[lang].push(uid);
        $('#btnAprove').html('<i class="fas fa-check-square"></i>');
    }
    normSave();
};

//Done
$('#mdlAddMed').on('hiden.bs.modal', e => {
    $('#inMedSrc0').attr('checked', 'false');
    $('#inMedSrc1').attr('checked', 'false');
    $('#inNewMed').removeAttribute('required');
    $('#inNewMedUrl').removeAttribute('required');
    $("#inNewMedFileCont").hide();
    $("#inNewMedUrlCont").hide();
});
//Done/

$('#mdlPublish').on('show.bs.modal', e => {
    let revLangs = 0;
    langs.forEach(l => {
        let rev = docDat.revised[l] ? docDat.revised[l].length : 0;
        if (docDat.revised[l] && !docDat.revised[l].includes(uid)) rev++;
        if (rev >= 2) revLangs++;
    });
    if (revLangs < langs.length) {
        classes($('#btnCnfPublish'), "d-none");
        if (lang == "es") {
            $('#mdlPublishTxt').text("Para publicar es necesario que lo hayan aprovado al menos dos personas.");
        } else if (lang == "en") {
            $('#mdlPublishTxt').text("At least two people must aprove before publishing.");
        }
        $('#frmPublish').hide();
    } else {
        $('#btnCnfPublish').removeClass("d-none");
        if (lang == "es") {
            $('#mdlPublishTxt').text("La Galleta está lista para publicar");
        } else if (lang == "en") {
            $('#mdlPublishTxt').text("The Cookie is ready to publish");
        }
        $('#frmPublish').show();
        if (docDat.beenPublic) $('#sendUptCont').show();
    }
});

function finishPub() {
    setprog('barPublish', 100);
    classes($('#barPublish'), 'bg-success');
    if (lang == "es") {
        alertTop("Publicado correctamente", 1);
    } else if (lang == "en") {
        alertTop("Published successfully", 1);
    }
    setTimeout(function () {
        window.open(docDat.url, '_blank').focus();
    }, 2500);
    console.log("Data saved successfully.");
    $('#mdlPublish').modal('hide');
}
function fillKW() {
    let n = 0
    function prog() {
        setprog('barPublish', n);
    }
    keywords = [];
    keywords.push(docDat.published.toDate().getFullYear().toString());
    if (docDat.published.toDate().getFullYear().toString() != docDat.ledit.toDate().getFullYear().toString()) keywords.push(docDat.ledit.toDate().getFullYear().toString());
    n++;
    prog();
    docDat.authors.forEach(itm => {
        itm.substring(1).split(' ').forEach(c => {
            keywords.push(ultraClean(c, ''));
        });
        n += (3 / docDat.authors.length);
        prog();
    });

    let toKW = [];

    docDat.title.split(' ').forEach(itm => {
        toKW.push(itm.replaceAll(/(<([^>]*)>)/gi, " ").trim());
    });
    n++;
    prog();

    docDat.description.split(' ').forEach(itm => {
        toKW.push(itm.replaceAll(/(<([^>]*)>)/gi, " ").trim());
        n += (3 / docDat.description.split(' ').length);
        prog();
    });

    docDat.cont.forEach(sect => {
        if (sect.type == 'parra') {
            if (Number(sect.title) > 0) {
                sect.titleTxt.split(' ').forEach(itm => {
                    toKW.push(itm.replaceAll(/(<([^>]*)>)/gi, " ").trim());
                });
            }
            sect.text.split(' ').forEach(itm => {
                toKW.push(itm.replaceAll(/(<([^>]*)>)/gi, " ").trim());
                n += (14 / docDat.cont.length / sect.text.split(' ').length);
                prog();
            });
        } else if (sect.type == 'medSimple') {
            if (sect.alt != "") {
                sect.alt.split(' ').forEach(itm => {
                    toKW.push(itm.replaceAll(/(<([^>]*)>)/gi, " ").trim());
                });
            }
            if (sect.caption != "") {
                sect.caption.split(' ').forEach(itm => {
                    toKW.push(itm.replaceAll(/(<([^>]*)>)/gi, " ").trim());
                });
            }
            n += (14 / docDat.cont.length);
            prog();
        }
        //@#
    });

    let rToKW = [];
    let l = toKW.length;
    for (let i = 0; i < l; i++) {
        let wrd = toKW[i];
        let r = wrd.indexOf(' ');
        if (r != -1) {
            wrd.split(' ').forEach(itm => {
                rToKW.push(itm);
            });
            toKW.splice(i, 1);
            i--;
            l--;
        }
    };

    rToKW.forEach(itm => {
        toKW.push(itm);
    });
    n++
    prog();

    l = toKW.length;
    for (let i = 0; i < l; i++) {
        toKW.splice(i, 1, ultraClean(toKW[i], ''));
        n += (3 / toKW.length);
        prog();
    };

    let kWObj = {}, sum = 0, wCount = 0;
    let banWrds = ["1", "2", "3", "4", "6", "7", "8", "9", "0", "tan", "ser", "los", "serian", "pero", "podemos", "su", "o", "y", "e", "la", "del", "es", "si", "en", "otro", "de", "tendrian", "no", "se", "una", "mas", "el", "a", "embargo", "las", "sin", "con", "un", "para", "por", "les", "", "vez", "gran", "este", "esta", "estos", "estas", "nos", "al", "dio", "has", "preguntado", "el", "lo", "tu", "tus", "hacen", "otros", "para", "ellos", "ellas", "ese", "esa", "esos", "esas", "detras", "delante", "nos", "le", "muy", "casi", "son", "pues", "a", "ha", "han", "fue"];//@#
    toKW.forEach(itm => {
        if (!banWrds.includes(itm)) {
            let num = kWObj[itm];
            if (!num) {
                kWObj[itm] = 1;
                wCount++;
            }
            else kWObj[itm]++;
            sum++;
        }
        n += (3 / toKW.length);
        prog();
    });

    for (const [key, value] of Object.entries(kWObj)) {
        if (value > sum / wCount) {
            keywords.push(key);
        }
        n += (3 / Object.entries(kWObj).length);
        prog();
    }
    docDat.fixedCats.forEach(itm => {
        keywords.push(itm);
    });
    docDat.cats = keywords;
    console.log(keywords);
}

$('#btnCnfPublish').onclick = function () {
    if (docDat.public) return;
    setprog('barPublish', 0);
    $("#barPublishCont").show();

    docDat.public = true;
    docDat.revised = {};
    setprog('barPublish', 31);

    if (!docDat.beenPublic) {
        docDat.notify = true;
        docDat.published = Timestamp.now();
        setprog('barPublish', 62);
    } else {
        docDat.dledit = docDat.notify = $('#inSendUpt').checked;
        setprog('barPublish', 45);
        if ($('#inSendUpt').checked) {
            docDat.uptMsg = true;
            docDat.uptDescrip = $('#inUptDesc').value.trim();
        } else {
            docDat.uptMsg = false;
            docDat.uptDescrip = "";
        }
        setprog('barPublish', 62);
    }

    saveDoc().then(() => {
        return set(databaseRef(RTDB, 'galletas/' + docId), {
            pop: docDat.pop,
            likes: docDat.likes,
            favs: docDat.favs
        });
    }).then(() => {
        setprog('barPublish', 84);
        finishPub();
    }).catch(err => {
        if (lang == "es") {
            alertTop("<strong>¡Ha ocurrido un error!</strong> " + err.code, 0);
        } else if (lang == "en") {
            alertTop("<strong>¡There has been an error!</strong> " + err.code, 0);
        }
        console.log(err);
    });
};