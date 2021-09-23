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

import { getFirestore, getDoc, doc as docRef, onSnapshot, updateDoc, Timestamp } from "firebase/firestore";
const FSDB = getFirestore();

import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
const STORAGE = getStorage();

let docDat, docId, calDocRef, calConfig;
let lastSave = Date.now(), saved = false;

let newMedia = null;
let newMedSrc = null;

let eventToShow = null;

async function translateSimple(text, from, target) {
    var translate = httpsCallable(FUNCTIONS, 'translations-translateSimple');
    let res = await translate({
        text: text,
        from: from,
        target: target
    });
    return res.data;
}

const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
const longDay = {
    es: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado'],
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
}
function fullMonth(n, l) {
    if (l == "es") {
        switch (n) {
            case 1:
                return "Enero";
            case 2:
                return "Febrero";
            case 3:
                return "Marzo";
            case 4:
                return "Abril";
            case 5:
                return "Mayo";
            case 6:
                return "Junio";
            case 7:
                return "Julio";
            case 8:
                return "Agosto";
            case 9:
                return "Septiembre";
            case 10:
                return "Octubre";
            case 11:
                return "Noviembre";
            case 12:
                return "Diciembre";
            case 0:
                return "Diciembre";
            case 13:
                return "Enero";
        }
    } else if (l == "en") {
        switch (n) {
            case 1:
                return "January";
            case 2:
                return "February";
            case 3:
                return "March";
            case 4:
                return "April";
            case 5:
                return "May";
            case 6:
                return "June";
            case 7:
                return "July";
            case 8:
                return "August";
            case 9:
                return "September";
            case 10:
                return "October";
            case 11:
                return "November";
            case 12:
                return "December";
            case 0:
                return "December";
            case 13:
                return "January";
        }
    }
}

var urlSrch;
window.loaded = function loaded() {
    urlSrch = new URLSearchParams(location.search);

    getDoc(docRef(FSDB, 'config', 'calTypes')).then(doc => {
        calConfig = doc.data();
        calDocRef = docRef(calendarsFSColl, urlSrch.get('id'));
        onSnapshot(calDocRef, doc => {
            if (!doc.exists) {
                window.location.href = '../404';
                return;
            }
            docDat = doc.data();
            docId = doc.id;
            $('#title').html(docDat.title);
            $('#prevMed').src = docDat.picUrl;
            $('#inPicCapt').value = docDat.picCapt;
            $('#inPicAlt').value = docDat.picAlt;
            $('#inDesc').value = docDat.description;
            $('#inDescShort').value = docDat.descriptionShort;
            render();
            if (docDat.public) {
                $('#btnAprove').hide();
                $('#btnPub').hide();
            } else {
                $('#btnAprove').show();
                if (docDat.pastDue) $('#btnPub').show();
            }
            if (docDat.revised[lang] && docDat.revised[lang].includes(uid)) {
                $('#btnAprove').html('<i class="fas fa-check-square"></i>');
            } else {
                $('#btnAprove').html('<i class="far fa-check-square"></i>');
            }
            $('#btnPrevCal').href = docDat.url;
            $('#btnPrevMail').href = '/vista-email-calendario/' + docId;
            $('#btnSrcCal').href = `https://in-the-sky.org/newscal.php?month=${urlSrch.get('id').substr(4, 2)}&year=${urlSrch.get('id').substr(0, 4)}&maxdiff=7&country=1484&reg1=3527646&reg2=8379372&town=3530597`;
            $('#btnSrcCal2').href = `https://in-the-sky.org/newscal.php?month=${urlSrch.get('id').substr(4, 2)}&year=${urlSrch.get('id').substr(0, 4)}&maxdiff=7&country=1170&reg1=3688685&reg2=9609540&town=3688689`;
            $('#btnSrcCal3').href = `https://in-the-sky.org/newscal.php?month=${urlSrch.get('id').substr(4, 2)}&year=${urlSrch.get('id').substr(0, 4)}&maxdiff=7&country=1724&reg1=3117732&reg2=6355233&town=3117735`;
        }, err => console.log(err))
    }).catch(err => console.log(err));

    function descFrm() {
        docDat.description = $('#inDesc').value.trim();
        docDat.descriptionShort = $('#inDescShort').value.trim();
        normSave();
    }
    $("#frmText").addEventListener("submit", function (event) {
        event.preventDefault();
        descFrm();
    });
    $('#btnFileTrans').onclick = function () {
        let ori = $('#selFileTrans').value
        getDoc(docRef(FSDB, 'calendars/langs/' + ori, docId)).then(async function (doc) {
            docDat.picCapt = $('#inPicCapt').value = await translateSimple(doc.data().picCapt, ori, lang);
            docDat.picAlt = $('#inPicAlt').value = await translateSimple(doc.data().picAlt, ori, lang);
            docDat.description = $('#inDesc').value = await translateSimple(doc.data().description, ori, lang);
            docDat.descriptionShort = $('#inDescShort').value = await translateSimple(doc.data().descriptionShort, ori, lang);
            descFrm();
        }).catch(err => console.log(err));
    }

    function translateFrm() {
        const translate = httpsCallable(FUNCTIONS, 'translations-translateFullCalendar');
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

    function addMed() {
        let ref = storageRef(STORAGE, 'calendarMedia/' + docId + '/pic');
        uploadBytes(ref, newMedia).on('state_changed',
            (snap) => {
                setprog('barChgImg', (snap.bytesTransferred / snap.totalBytes) * 100);
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
                    docDat.picUrl = medUrl;
                    normSave();
                    resetChgImg(true);
                    $("#frmChgImg").hide();
                }).catch(err => { console.log(err) });
            }
        );
    }
    function addExtMed() {
        docDat.picUrl = $('#inChgImgUrl').value;
        normSave();
        resetChgImg(true);
        $("#frmChgImg").hide();
    }
    $("#frmChgImg").addEventListener("submit", function (event) {
        event.preventDefault();
        setprog('barChgImg', 0);
        $("#barChgImgCont").show();
        $("#frmChgImg").hide();
        disableBtn($("#btnCnfChgImg"));
        disableBtn($("#btnCanChgImg"));
        if (newMedSrc == "home") addMed();
        else addExtMed();
    });
}

$('#inPicCapt').onchange = () => {
    docDat.picCapt = $('#inPicCapt').value.trim();
}
$('#inPicAlt').onchange = () => {
    docDat.picAlt = $('#inPicAlt').value.trim();
}
$('#inDesc').onchange = () => {
    docDat.picDesc = $('#inDesc').value.trim();
}
$('#inDescShort').onchange = () => {
    docDat.picDescShort = $('#inDescShort').value.trim();
}

let savedInterval;
function saveDoc() {
    console.log('Saving...');

    const promises = [];
    langs.forEach(l => {
        if (l != lang) {
            let syncUpt = {
                published: docDat.published,
                finished: docDat.finished,
                pastDue: docDat.pastDue,
                public: docDat.public,
                sentMail: docDat.sentMail,
                revised: docDat.revised,
                translations: docDat.translations,
                timePrev: docDat.timePrev | null,
            }
            syncUpt.translations[lang] = docDat.url;
            promises.push(updateDoc(docRef(FSDB, 'calendars/langs/' + l, docId), syncUpt));
        }
    })
    return Promise.all(promises).then(() => {
        return updateDoc(calDocRef, docDat);
    });
}

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
function normSave() {
    saveDoc().then(() => {
        if (eventToShow) showEvent();//IMPORTANT
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
        console.log('Saved!');
    }).catch(err => {
        if (lang == "es") {
            $('#tagLstSave').text("Error, no se han guardado todos los cambios: " + err.code);
        } else if (lang == "en") {
            $('#tagLstSave').text("Error, changes not saved: " + err.code);
        }
        console.log(err);
    });
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

function showEvent() {
    Object.keys(docDat.events).forEach(key => {
        $('#' + key).hide();
    });
    $('#mdlEventInfoL').html(docDat.events[eventToShow].date[lang]);
    $('#' + eventToShow).show();
    enableBtn($('#btnPriorEve'));
    enableBtn($('#btnNextEve'));
}
$('#btnPriorEve').onclick = () => {
    let orderedKeys = Object.keys(docDat.events).slice().sort((a, b) => {
        if (Number(a[0]) == Number(b[0])) {
            if (a.substring(1, 4) == b.substring(1, 4)) {
                return Number(a[4]) - Number(b[4]);
            }
            switch (a.substring(1, 4)) {
                case "sun":
                    return -1;
                case "mon":
                    if (b.substring(1, 4) == "sun") return 1;
                    return -1;
                case "tue":
                    if (b.substring(1, 4) == "sun" || b.substring(1, 4) == "mon") return 1
                    return -1;
                case "wed":
                    if (b.substring(1, 4) == "sun" || b.substring(1, 4) == "mon" || b.substring(1, 4) == "tue") return 1
                    return -1;
                case "thu":
                    if (b.substring(1, 4) == "sun" || b.substring(1, 4) == "mon" || b.substring(1, 4) == "tue" || b.substring(1, 4) == "wed") return 1
                    return -1;
                case "fri":
                    if (b.substring(1, 4) == "sun" || b.substring(1, 4) == "mon" || b.substring(1, 4) == "tue" || b.substring(1, 4) == "wed" || b.substring(1, 4) == "thu") return 1
                    return -1;
                case "sat":
                    return 1;
            }
        }
        return Number(a[0]) - Number(b[0]);
    });
    let n = orderedKeys.indexOf(eventToShow) - 1;
    if (n >= 0) {
        eventToShow = orderedKeys[n];
        showEvent();
    } else {
        disableBtn($('#btnPriorEve'));
    }
};
$('#btnNextEve').onclick = () => {
    let orderedKeys = Object.keys(docDat.events).slice().sort((a, b) => {
        if (Number(a[0]) == Number(b[0])) {
            if (a.substring(1, 4) == b.substring(1, 4)) {
                return Number(a[4]) - Number(b[4]);
            }
            switch (a.substring(1, 4)) {
                case "sun":
                    return -1;
                case "mon":
                    if (b.substring(1, 4) == "sun") return 1;
                    return -1;
                case "tue":
                    if (b.substring(1, 4) == "sun" || b.substring(1, 4) == "mon") return 1
                    return -1;
                case "wed":
                    if (b.substring(1, 4) == "sun" || b.substring(1, 4) == "mon" || b.substring(1, 4) == "tue") return 1
                    return -1;
                case "thu":
                    if (b.substring(1, 4) == "sun" || b.substring(1, 4) == "mon" || b.substring(1, 4) == "tue" || b.substring(1, 4) == "wed") return 1
                    return -1;
                case "fri":
                    if (b.substring(1, 4) == "sun" || b.substring(1, 4) == "mon" || b.substring(1, 4) == "tue" || b.substring(1, 4) == "wed" || b.substring(1, 4) == "thu") return 1
                    return -1;
                case "sat":
                    return 1;
            }
        }
        return Number(a[0]) - Number(b[0]);
    });
    let n = orderedKeys.indexOf(eventToShow) + 1;
    if (n < orderedKeys.length) {
        eventToShow = orderedKeys[n];
        showEvent();
    } else {
        disableBtn($('#btnNextEve'));
    }
};

function render() {
    $('#weeksCont').html("");
    docDat.weeks.forEach((week, wIdx) => {
        let weekRow = $('<tr></tr>');
        weekRow.style.height = '10rem';
        $('#weeksCont').appendChild(weekRow);
        for (let i = 0; i < 7; i++) {
            let day = week[daysOfWeek[i]]
            let dayCell = $('<td></td>');
            classes(dayCell, "p-0");
            weekRow.appendChild(dayCell);
            if (day) {
                let num = $('<p></p>');
                classes(num, "m-0 p-1");
                num.style.fontSize = 'x-large';
                num.html('<b>' + day.date + '</b>');
                dayCell.appendChild(num);

                let events = $('<div></div>');
                classes(events, "autoOverflow");
                events.style.maxHeight = '7rem';
                day.events.forEach((event, idx) => {
                    let btnEvent = $('<button></button>');
                    btnEvent.attr("data-toggle", "modal");
                    btnEvent.attr("data-target", "#mdlEventInfo");
                    classes(btnEvent, "btn text-left p-1 mb-1 w-100");
                    btnEvent.style.backgroundColor = "#c3e6cb";
                    btnEvent.style.borderColor = "#8fd19e";
                    btnEvent.html('<small>' + event.name + '</small>');
                    btnEvent.onclick = () => {
                        eventToShow = wIdx + daysOfWeek[i] + idx;
                        showEvent();
                    }
                    events.appendChild(btnEvent);
                });
                let btnPlusEvent = $('<button></button>');
                classes(btnPlusEvent, "btn btn-science btn-block btn-sm");
                btnPlusEvent.html('<i class="fas fa-plus"></i>');
                btnPlusEvent.onclick = () => {
                    docDat.events[wIdx + daysOfWeek[i] + day.events.length] = {
                        date: {
                            es: longDay["es"][i] + " " + day.date + " de " + fullMonth(docId % 100, lang),
                            en: longDay["en"][i] + ", " + fullMonth(docId % 100, "en") + " " + day.date
                        },
                        typeIdx: 0,
                        vals: {
                            0: { label: "Título", val: "Evento sin nombre" },
                            1: { label: "Description", val: "Sin descripción" },
                        },
                        name: "Evento sin nombre",
                        description: "Sin descripción",
                        visibilidad: calConfig.visOpts[lang][0],
                        horario: ["Ciudad de México:", "Bogotá:", "Madrid:"]
                    };
                    day.events.push({
                        name: "Evento sin nombre"
                    });
                    normSave();
                }
                events.appendChild(btnPlusEvent);
                dayCell.appendChild(events);
            }
        }
    });
    $('#eventInfoCont').html("");
    for (const [key, event] of Object.entries(docDat.events)) {
        let changed = false;

        //@#Migration
        if (event.typeIdx == undefined) {
            event.typeIdx = 0;
            event.vals = {
                0: { label: "Título", val: event.name },
                1: { label: "Description", val: event.description },
            }
            regenTxt();
            changed = true;
        }
        if (typeof event.date != "object") {
            event.date = {
                es: longDay["es"][daysOfWeek.indexOf(key.substring(1, 4))] + " " + docDat.weeks[parseInt(key.charAt(0))][key.substring(1, 4)].date + " de " + fullMonth(docId % 100, lang),
                en: longDay["en"][daysOfWeek.indexOf(key.substring(1, 4))] + ", " + fullMonth(docId % 100, "en") + " " + docDat.weeks[parseInt(key.charAt(0))][key.substring(1, 4)].date
            }
            changed = true;
        }
        //End migration

        let form = $('<div></div>');
        form.id = key;
        classes(form, "d-none overflow-auto");
        let bod = $('<div></div>');
        classes(bod, "modal-body");
        form.appendChild(bod);

        let fsec = $('<div></div>');
        classes(fsec, "d-none");
        bod.appendChild(fsec);
        let fgType = $('<div></div>');
        classes(fgType, "form-group");
        fsec.appendChild(fgType);

        let selTypeMainL = $('<label></label>');
        if (lang == "es") {
            selTypeMainL.text("Tipo de evento");
        } else if (lang == "en") {
            selTypeMainL.text("Event type");
        }
        fgType.appendChild(selTypeMainL);
        let selTypeMain = $('<select></select>');
        classes(selTypeMain, "form-control");
        selTypeMain.attr('multiple', 'true');
        calConfig[lang].forEach((itm, idx) => {
            let opt = $('<option></option>');
            opt.value = idx;
            opt.text(itm.label);
            if ((!event.typeIdx && idx == 0) || idx == event.typeIdx) opt.attr('selected', 'true');
            selTypeMain.appendChild(opt);
        });

        let inVis;//Must be declared here
        selTypeMain.oninput = () => {
            changed = true;
            event.typeIdx = parseInt(selTypeMain.value);
            if (!event.typeIdx) event.typeIdx = 0;
            event.vals = {};
            if (calConfig[lang][event.typeIdx].defaultVis != null && calConfig[lang][event.typeIdx].defaultVis != undefined) {
                let newVisVal = calConfig[lang][event.typeIdx].defaultVis;
                inVis.value = newVisVal;
                inVisTakeInput();
            }
            reloadForm();
        }
        fgType.appendChild(selTypeMain);

        let inTitleHid = $('<input></input>');
        inTitleHid.attr("type", "text");
        inTitleHid.id = "inEveTitle" + key;
        let inDescHid = $('<textarea></textarea>');
        inDescHid.id = "inEveDesc" + key;

        let fRow = $('<div></div>');
        classes(fRow, "form-row");
        fsec.insertBefore(fRow, fgType.nextSibling);

        //Must be declared here
        let sfRow = $('<div></div>');
        classes(sfRow, "form-row d-none");
        fsec.insertBefore(sfRow, fRow.nextSibling);

        function reloadForm() {
            fRow.html("");
            calConfig[lang][event.typeIdx].options.forEach((option, idx) => {
                let fCol = $('<div></div>');
                classes(fCol, "col-auto form-group");
                let label = $('<label></label>');
                label.text(option.label);
                fCol.appendChild(label);
                let inp;
                switch (option.type) {
                    case "select":
                        inp = $('<select></select>');
                        option.options.forEach((itm, i) => {
                            let opt = $('<option></option>');
                            opt.value = itm.val;
                            opt.html(itm.label);
                            if ((i == 0 && (!event.vals || !event.vals[idx])) || (event.vals && event.vals[idx] && event.vals[idx].val == itm.val)) {
                                opt.selected = true;
                                event.vals[idx] = {
                                    label: itm.label,
                                    val: itm.val,
                                }
                                if (option.valForSub == itm.val) sfRow.show();
                                else sfRow.hide();
                            }
                            inp.appendChild(opt);
                        });
                        break;
                    case "textarea":
                        inp = $('<textarea></textarea>');
                        inp.attr("rows", "3");
                        if (event.vals[idx] && event.vals[idx].val) inp.value = event.vals[idx].val;
                        break;
                    default:
                        inp = $('<input></input>');
                        inp.attr("type", option.type);
                        if (event.vals[idx] && event.vals[idx].val) inp.value = event.vals[idx].val;
                }
                if (option.placeholder) inp.placeholder = option.placeholder;
                classes(inp, "form-control form-control-sm");
                fCol.appendChild(inp);
                fRow.appendChild(fCol);

                //sfRow declared before
                if (option.valForSub) {
                    option.sub.forEach((soption, sidx) => {
                        let sfCol = $('<div></div>');
                        classes(sfCol, "col-auto form-group");
                        let slabel = $('<label></label>');
                        slabel.text(soption.label);
                        sfCol.appendChild(slabel);
                        let sinp;
                        switch (soption.type) {
                            case "select":
                                sinp = $('<select></select>');
                                soption.options.forEach((itm, i) => {
                                    let opt = $('<option></option>');
                                    opt.value = itm.val;
                                    opt.html(itm.label);
                                    if ((i == 0 && (!event.vals || !event.vals[idx + '-' + sidx])) || (event.vals && event.vals[idx + '-' + sidx] && event.vals[idx + '-' + sidx].val == itm.val)) {
                                        opt.selected = true;
                                        event.vals[idx + '-' + sidx] = {
                                            label: itm.label,
                                            val: itm.val,
                                        }
                                    }
                                    sinp.appendChild(opt);
                                });
                                break;
                            case "textarea":
                                sinp = $('<textarea></textarea>');
                                sinp.attr("rows", "3");
                                if (event.vals[idx + '-' + sidx] && event.vals[idx + '-' + sidx].val) sinp.value = event.vals[idx + '-' + sidx].val;
                                break;
                            default:
                                sinp = $('<input></input>');
                                sinp.attr("type", soption.type);
                                if (event.vals[idx + '-' + sidx] && event.vals[idx + '-' + sidx].val) sinp.value = event.vals[idx + '-' + sidx].val;
                        }
                        if (soption.placeholder) sinp.placeholder = soption.placeholder;
                        classes(sinp, "form-control form-control-sm");
                        sfCol.appendChild(sinp);
                        sfRow.appendChild(sfCol);

                        sinp.onchange = function () {
                            changed = true;
                            event.vals[idx + '-' + sidx] = {};
                            event.vals[idx + '-' + sidx].val = sinp.value;
                            if (option.type == "select") event.vals[idx + '-' + sidx].label = sinp.text();
                            else event.vals[idx + '-' + sidx].label = soption.label;
                            regenTxt();
                        }
                    });
                }

                inp.onchange = function () {
                    changed = true;
                    event.vals[idx] = {};
                    event.vals[idx].val = inp.value;
                    if (option.type == "select") event.vals[idx].label = inp.text();
                    else event.vals[idx].label = option.label;
                    if (option.valForSub) {
                        if (option.valForSub == inp.value) sfRow.show();
                        else sfRow.hide();
                    }
                    regenTxt();
                }
            });
        }
        reloadForm();

        function regenTxt() {
            if (calConfig[lang][event.typeIdx].multipleTxt) {
                event.description = parseInt(event.vals["0"].val.charAt(0));
                event.name = parseInt(event.vals["0"].val.charAt(1));
            } else {
                event.description = event.name = 0;
            }
            event.description = calConfig[lang][event.typeIdx].text[event.description];
            event.name = calConfig[lang][event.typeIdx].titleTxt[event.name];
            for (const [vKey, vVal] of Object.entries(event.vals)) {
                event.description = event.description.replaceAll("$" + vKey + "L$", vVal.label);
                event.description = event.description.replaceAll("$" + vKey + "$", vVal.val);
                event.description = event.description.replaceAll("$g-year$", Math.floor(docId / 100));
                event.name = event.name.replaceAll("$" + vKey + "L$", vVal.label);
                event.name = event.name.replaceAll("$" + vKey + "$", vVal.val);
                event.name = event.name.replaceAll("$g-year$", Math.floor(docId / 100));
            }
        }
        regenTxt();

        let fgVis = $('<div></div>');
        classes(fgVis, "form-group");
        fsec.appendChild(fgVis);
        if (lang == "es") {
            fgVis.html('<label>Visibilidad</label>');
        } else if (lang == "en") {
            fgVis.html('<label>Visibility</label>');
        }
        inVis = $('<select></select>');
        inVis.id = "inVis" + key;
        classes(inVis, "form-control");
        calConfig.visOpts[lang].forEach((itm, idx) => {
            let opt = $('<option></option>');
            opt.value = idx;
            opt.html(itm);
            if (itm == event.visibilidad) opt.attr('selected', "true");
            inVis.appendChild(opt);
        });
        fgVis.appendChild(inVis);

        let fgTime = $('<div></div>');
        classes(fgTime, "form-group");
        fsec.appendChild(fgTime);
        if (lang == "es") {
            fgTime.html('<label>Horario</label>');
        } else if (lang == "en") {
            fgTime.html('<label>Observing time</label>');
        }
        let inTime = $('<textarea></textarea>');
        classes(inTime, "form-control");
        inTime.id = "inTime" + key;
        inTime.attr("rows", "4");
        fgTime.appendChild(inTime);
        if (inVis.value == 5) fgTime.hide();
        else fgTime.show();

        function inVisTakeInput() {
            changed = true;
            if (inVis.value == 5) fgTime.hide();
            else fgTime.show();
        }
        inVis.oninput = () => {
            inVisTakeInput();
        };
        inTime.onchange = () => {
            changed = true;
        };

        //Must be declared here
        let saveBtn = $('<button></button>');

        let selLangCC = $('<div></div>');
        classes(selLangCC, "row");
        let selLangC = $('<div></div>');
        classes(selLangC, "col-auto");
        selLangCC.appendChild(selLangC);
        let selLang = $('<select></select>');
        classes(selLang, "form-control ml-auto h-100");
        selLang.attr("name", "selTransLang");
        selLangC.appendChild(selLang);
        let btnTrans = $('<button></button>');
        classes(btnTrans, 'btn btn-science mx-2');
        btnTrans.html('<i class="fas fa-language"></i>');
        btnTrans.onclick = function () {
            getDoc(docRef(FSDB, 'calendars/langs/' + selLang.value, docId)).then(async function (doc) {
                let newEve = doc.data().events[key];
                if (!newEve) return;
                event.typeIdx = newEve.typeIdx;
                event.vals = newEve.vals;
                for (let i = 0; i < calConfig[lang][event.typeIdx].options.length; i++) {
                    const option = calConfig[lang][event.typeIdx].options[i];
                    if (option.type == "select") {
                        event.vals[i] = option.options[
                            calConfig[selLang.value][event.typeIdx].options[i].options
                                .map(function (e) {
                                    return e.val;
                                })
                                .indexOf(event.vals[i].val)
                        ];
                    } else {
                        if (option.translatable) {
                            event.vals[i].val = await translateSimple(event.vals[i].val, selLang.value, lang)
                        }
                        event.vals[i].label = option.label;
                    }
                    if (event.vals[i].val == option.valForSub) {
                        for (let j = 0; j < calConfig[lang][event.typeIdx].options[i].sub.length; j++) {
                            const opt = calConfig[lang][event.typeIdx].options[i].sub[j];
                            if (opt.type == "select") {
                                event.vals[i + "-" + j] = opt.options[
                                    calConfig[selLang.value][event.typeIdx].options[i].sub[j].options
                                        .map(function (e) {
                                            return e.val;
                                        })
                                        .indexOf(event.vals[i + "-" + j].val)
                                ];
                            } else {
                                if (opt.translatable) {
                                    event.vals[i + "-" + j].val = await translateSimple(event.vals[i + "-" + j].val, selLang.value, lang)
                                }
                                event.vals[i + "-" + j].label = opt.label;
                            }
                        }
                    }
                }
                event.visibilidad = calConfig.visOpts[lang][calConfig.visOpts[selLang.value].indexOf(newEve.visibilidad)];
                event.horario = [];
                for (let i = 0; i < newEve.horario.length; i++) {
                    event.horario.push(await translateSimple(newEve.horario[i], selLang.value, lang));
                }
                inTime.html("");
                event.horario.forEach(time => {
                    inTime.html(inTime.html() + time + "\n");
                });
                changed = true;
                saveBtn.click();
            }).catch(err => console.log(err));
        }
        selLangCC.appendChild(btnTrans);
        fsec.appendChild(selLangCC);

        let tsec = $('<div></div>');
        bod.appendChild(tsec);
        let eveTit = $('<h3></h3>');
        eveTit.html(event.name);
        tsec.appendChild(eveTit);
        let eveDesc = $('<p></p>');
        eveDesc.html(event.description);
        tsec.appendChild(eveDesc);
        let eveVis = $('<p></p>');
        if (lang == "es") {
            eveVis.html("Visibilidad: " + event.visibilidad);
        } else if (lang == "en") {
            eveVis.html("Visibility: " + event.visibilidad);
        }
        tsec.appendChild(eveVis);
        let eveTime = $('<p></p>');
        classes(eveTime, "mb-0");
        if (lang == "es") {
            eveTime.html("Horario: ");
        } else if (lang == "en") {
            eveTime.html("Observing time: ");
        }
        tsec.appendChild(eveTime);
        let eveTimeLst = $('<ul></ul>');
        tsec.appendChild(eveTimeLst);
        event.horario.forEach(time => {
            let li = $('<li></li>');
            li.html(time);
            eveTimeLst.appendChild(li);
        });
        if (event.visibilidad == calConfig.visOpts[lang][5]) {
            eveTime.hide();
            eveTimeLst.hide();
        }
        else {
            eveTime.show();
            eveTimeLst.show();
        }


        let foot = $('<div></div>');
        classes(foot, "modal-footer");
        form.appendChild(foot);

        let delBtn = $('<button></button>');
        classes(delBtn, "btn btn-danger mr-auto")
        delBtn.attr("type", "button");
        if (lang == "es") {
            delBtn.text("Borrar");
        } else if (lang == "en") {
            delBtn.text("Delete");
        }
        delBtn.onclick = () => {
            for (let i = Number(key.substr(4)) + 1; i < docDat.weeks[Number(key[0])][key.substr(1, 3)].events.length; i++) {
                docDat.events[key.substr(0, 4) + (i - 1)] = docDat.events[key.substr(0, 4) + i]
            }
            delete docDat.events[key.substr(0, 4) + (docDat.weeks[Number(key[0])][key.substr(1, 3)].events.length - 1)];
            docDat.weeks[Number(key[0])][key.substr(1, 3)].events.splice(Number(key.substr(4)), 1);
            $('#mdlEventInfo').modal('hide');
            eventToShow = null;
            normSave();
        };
        foot.appendChild(delBtn);
        let editBtn = $('<button></button>');
        classes(editBtn, "btn btn-info");
        editBtn.attr("type", "button");
        if (lang == "es") {
            editBtn.text("Editar");
        } else if (lang == "en") {
            editBtn.text("Edit");
        }
        editBtn.onclick = () => {
            inVis.value = calConfig.visOpts[lang].indexOf(event.visibilidad);
            if (inVis.value == 5) fgTime.hide();
            else fgTime.show();
            inTime.html("");
            event.horario.forEach(time => {
                inTime.html(inTime.html() + time + "\n");
            });
            tsec.hide();
            fsec.show();
            saveBtn.show();
            enableBtn(saveBtn);
            editBtn.hide();
        };
        foot.appendChild(editBtn);
        //Declared before
        classes(saveBtn, "btn btn-science d-none");
        saveBtn.attr("type", "button");
        disableBtn(saveBtn);
        if (lang == "es") {
            saveBtn.text("Guardar");
        } else if (lang == "en") {
            saveBtn.text("Save");
        }
        saveBtn.onclick = () => {
            disableBtn(saveBtn);
            if (changed) {
                regenTxt();
                docDat.weeks[Number(key[0])][key.substr(1, 3)].events[key[4]].name = event.name;
                event.visibilidad = calConfig.visOpts[lang][inVis.value];
                event.horario = [];
                inTime.value.trim().split('\n').forEach(time => {
                    if (time != "" && time != " ") event.horario.push(time);
                });
                normSave();
            }
            fsec.hide();
            tsec.show();
            saveBtn.hide();
            editBtn.show();
        };
        foot.appendChild(saveBtn);

        $('#eventInfoCont').appendChild(form);
    }

    document.getElementsByName('selTransLang').forEach(itm => {
        itm.html('');
    });
    langs.forEach((l, i) => {
        if (l != lang) {
            let opt = $('<option></option>');
            if (i == 0) {
                opt.attr('selected', 'true');
            }
            opt.value = l;
            opt.text(l);
            document.getElementsByName('selTransLang').forEach(itm => {
                itm.appendChild(opt.cloneNode(true));
            });
        }
    });
}


function resetChgImg(uncheck) {
    $('#prevMed').src = docDat.picUrl;
    if (uncheck) {
        $('#inMedSrc0').checked = false;
        $('#inMedSrc1').checked = false;
    }
    $('#inChgImg').value = "";
    $('#inChgImgUrl').value = "";
    $('#inChgImg').removeAttribute('required');
    $('#inChgImgUrl').removeAttribute('required');
    $("#barChgImgCont").hide();
    $("#inChgImgFileCont").hide();
    $("#inChgImgUrlCont").hide();
    enableBtn($("#btnCnfChgImg"));
    enableBtn($("#btnCanChgImg"));
}
$('#btnChgImg').onclick = () => {
    resetChgImg(true);
    $("#frmChgImg").toggle();
};
$('#inChgImg').addEventListener('change', e => {
    newMedia = e.target.files[0];
    function prevMed() {
        var read = new FileReader();
        read.readAsDataURL(newMedia);
        read.onload = function (e2) {
            $("#prevMed").src = e2.target.result;
        };
    };
    newMedia.name = ultraClean(newMedia.name, '');
    $('#inChgImgL').html(newMedia.name);
    prevMed(newMedia);
});
$('#inChgImgUrl').onchange = function () {
    $("#prevMed").src = $('#inChgImgUrl').value;
};
$('#inMedSrc0').onclick = function () {
    newMedSrc = "home";
    resetChgImg(false);
    $('#inChgImg').attr('required', 'true');
    $("#inChgImgFileCont").show();
}
$('#inMedSrc1').onclick = function () {
    newMedSrc = "out";
    resetChgImg(false);
    $('#inChgImgUrl').attr('required', 'true');
    $("#inChgImgUrlCont").show();
}

$('#btnPrevCal').onclick = function () {
    docDat.timePrev = Timestamp.fromMillis((new Date(Date.now())).getTime() + 10 * 60000);
    normSave();
};
$('#btnPrevMail').onclick = function () {
    docDat.timePrev = Timestamp.fromMillis((new Date(Date.now())).getTime() + 10 * 60000);
    normSave();
};

function validateRevision() {
    let revLangs = 0;
    langs.forEach(l => {
        let rev = docDat.revised[l] ? docDat.revised[l].length : 0;
        if (docDat.revised[l] && !docDat.revised[l].includes(uid)) rev++;
        if (rev >= 2) revLangs++;
    });
    return revLangs == langs.length;
}

$('#btnAprove').onclick = function () {
    if (docDat.revised[lang] && docDat.revised[lang].includes(uid)) {
        docDat.revised[lang].splice(docDat.revised[lang].indexOf(uid), 1);
        $('#btnAprove').html('<i class="far fa-check-square"></i>');
    } else {
        if (!docDat.revised[lang]) docDat.revised[lang] = [];
        docDat.revised[lang].push(uid);
        $('#btnAprove').html('<i class="fas fa-check-square"></i>');
    }
    if (validateRevision()) {
        docDat.finished = true;
    } else {
        docDat.finished = false;
    }
    normSave();
};

$('#mdlPublish').on('show.bs.modal', e => {
    if (validateRevision()) {
        $('#btnCnfPublish').show();
        if (lang == "es") {
            $('#mdlPublishTxt').text("El calendario está listo para publicar");
        } else if (lang == "en") {
            $('#mdlPublishTxt').text("The calendar is ready to publish");
        }
    } else {
        $('#btnCnfPublish').hide();
        if (lang == "es") {
            $('#mdlPublishTxt').text("Para publicar es necesario que lo hayan aprovado al menos dos personas.");
        } else if (lang == "en") {
            $('#mdlPublishTxt').text("At least two people must aprove before publishing.");
        }
    }
});

$('#btnCnfPublish').onclick = function () {
    if (docDat.public) return;
    setprog('barPublish', 0);
    $('#barPublishCont').show();

    docDat.public = true;
    setprog('barPublish', 25);

    saveDoc().then(() => {
        setprog('barPublish', 58);
        return set(databaseRef(RTDB, 'calendarios/' + docId), {
            pop: 0
        });
    }).then(() => {
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
        $('#mdlPublish').modal('hide');
        console.log('Published ' + docId + ' calendar');
        return null;
    }).catch(err => {
        if (lang == "es") {
            alertTop("<strong>¡Ha ocurrido un error!</strong> " + err.code, 0);
        } else if (lang == "en") {
            alertTop("<strong>¡There has been an error!</strong> " + err.code, 0);
        }
        console.log(err);
    });
};