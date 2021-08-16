import { getDatabase, ref, set } from "firebase/database";
const RTDB = getDatabase();

import { getFunctions, httpsCallable } from "firebase/functions";
const FUNCTIONS = getFunctions();

var store = firebase.storage();

let docDat, docId, docRef, calConfig;
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

window.loaded = function loaded() {
    db.collection('config').doc('calTypes').get().then(doc => {
        calConfig = doc.data();
        docRef = calendarsFSRef.doc(urlSrch.get('id'));
        calendarsFSRef.doc(urlSrch.get('id')).onSnapshot(doc => {
            if (!doc.exists) {
                window.location.href = '../404';
                return;
            }
            docDat = doc.data();
            docId = doc.id;
            document.getElementById('title').innerHTML = docDat.title;
            document.getElementById('prevMed').src = docDat.picUrl;
            document.getElementById('inPicCapt').value = docDat.picCapt;
            document.getElementById('inPicAlt').value = docDat.picAlt;
            document.getElementById('inDesc').value = docDat.description;
            document.getElementById('inDescShort').value = docDat.descriptionShort;
            render();
            if (docDat.public) {
                hideEl(document.getElementById('btnAprove'));
                hideEl(document.getElementById('btnPub'));
            } else {
                showEl(document.getElementById('btnAprove'));
                if (docDat.pastDue) showEl(document.getElementById('btnPub'));
            }
            if (docDat.revised[lang] && docDat.revised[lang].includes(uid)) {
                document.getElementById('btnAprove').innerHTML = '<i class="fas fa-check-square"></i>';
            } else {
                document.getElementById('btnAprove').innerHTML = '<i class="far fa-check-square"></i>';
            }
            document.getElementById('btnPrevCal').href = docDat.url;
            document.getElementById('btnPrevMail').href = '/vista-email-calendario/' + docId;
            document.getElementById('btnSrcCal').href = `https://in-the-sky.org/newscal.php?month=${urlSrch.get('id').substr(5, 6)}&year=${urlSrch.get('id').substr(0, 4)}&maxdiff=7&country=1484&reg1=3527646&reg2=8379372&town=3530597`;
            document.getElementById('btnSrcCal2').href = `https://in-the-sky.org/newscal.php?month=${urlSrch.get('id').substr(5, 6)}&year=${urlSrch.get('id').substr(0, 4)}&maxdiff=7&country=1170&reg1=3688685&reg2=9609540&town=3688689`;
            document.getElementById('btnSrcCal3').href = `https://in-the-sky.org/newscal.php?month=${urlSrch.get('id').substr(5, 6)}&year=${urlSrch.get('id').substr(0, 4)}&maxdiff=7&country=1724&reg1=3117732&reg2=6355233&town=3117735`;
        }, err => console.log(err))
    }).catch(err => console.log(err));

    function descFrm() {
        docDat.description = document.getElementById('inDesc').value.trim();
        docDat.descriptionShort = document.getElementById('inDescShort').value.trim();
        normSave();
    }
    document.getElementById("frmText").addEventListener("submit", function (event) {
        event.preventDefault();
        descFrm();
    });
    document.getElementById('btnFileTrans').onclick = function () {
        let ori = document.getElementById('selFileTrans').value
        db.collection('calendars/langs/' + ori).doc(docId).get().then(async function (doc) {
            docDat.picCapt = document.getElementById('inPicCapt').value = await translateSimple(doc.data().picCapt, ori, lang);
            docDat.picAlt = document.getElementById('inPicAlt').value = await translateSimple(doc.data().picAlt, ori, lang);
            docDat.description = document.getElementById('inDesc').value = await translateSimple(doc.data().description, ori, lang);
            docDat.descriptionShort = document.getElementById('inDescShort').value = await translateSimple(doc.data().descriptionShort, ori, lang);
            descFrm();
        }).catch(err => console.log(err));
    }

    function translateFrm() {
        const translate = httpsCallable(FUNCTIONS, 'translations-translateFullCalendar');
        return translate({
            docId: docId,
            from: document.getElementById('inTransFrom').value,
            target: lang
        });
    }
    document.getElementById("frmTranslate").addEventListener("submit", function (event) {
        event.preventDefault();
        classes(document.getElementById('btnCnfTranslate'), "disabled")
        classes(document.getElementById('btnCanTranslate0'), "disabled")
        classes(document.getElementById('btnCanTranslate1'), "disabled")
        setprog('barTranslate', 0);
        showEl(document.getElementById('barTranslateCont'));
        runprog('barTranslate', 0, 73);
        translateFrm().then(res => {
            runprog('barTranslate', 73, 90);
            if (res) {
                setprog('barTranslate', 100);
                $('#mdlTranslate').modal('hide');
                document.getElementById('btnCnfTranslate').classList.remove("disabled");
                document.getElementById('btnCanTranslate0').classList.remove("disabled");
                document.getElementById('btnCanTranslate1').classList.remove("disabled");
                hideEl(document.getElementById('barTranslateCont'))
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
        let ref = store.ref('calendarMedia/' + docId + '/pic');
        ref.put(newMedia).on('state_changed',
            function progress(snap) {
                setprog('barChgImg', (snap.bytesTransferred / snap.totalBytes) * 100);
            },
            function error(err) {
                if (lang == "es") {
                    alertTop("<strong>¡Ha ocurrido un error!</strong> " + err.code, 0);
                } else if (lang == "en") {
                    alertTop("<strong>¡There has been an error!</strong> " + err.code, 0);
                }
                console.log(err);
                $('#mdlAddMed').modal('hide');
            },
            function complete() {
                ref.getDownloadURL().then(medUrl => {
                    docDat.picUrl = medUrl;
                    normSave();
                    resetChgImg(true);
                    hideEl(document.getElementById("frmChgImg"));
                }).catch(err => { console.log(err) });
            }
        );
    }
    function addExtMed() {
        docDat.picUrl = document.getElementById('inChgImgUrl').value;
        normSave();
        resetChgImg(true);
        hideEl(document.getElementById("frmChgImg"));
    }
    document.getElementById("frmChgImg").addEventListener("submit", function (event) {
        event.preventDefault();
        setprog('barChgImg', 0);
        showEl(document.getElementById("barChgImgCont"));
        hideEl(document.getElementById("frmChgImg"));
        document.getElementById("btnCnfChgImg").setAttribute('disabled', 'true');
        document.getElementById("btnCanChgImg").setAttribute('disabled', 'true');
        if (newMedSrc == "home") addMed();
        else addExtMed();
    });
}

document.getElementById('inPicCapt').onchange = () => {
    docDat.picCapt = document.getElementById('inPicCapt').value.trim();
}
document.getElementById('inPicAlt').onchange = () => {
    docDat.picAlt = document.getElementById('inPicAlt').value.trim();
}
document.getElementById('inDesc').onchange = () => {
    docDat.picDesc = document.getElementById('inDesc').value.trim();
}
document.getElementById('inDescShort').onchange = () => {
    docDat.picDescShort = document.getElementById('inDescShort').value.trim();
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
            promises.push(db.collection('calendars/langs/' + l).doc(docId).update(syncUpt));
        }
    })
    return Promise.all(promises).then(() => {
        return docRef.update(docDat);
    });
}
function normSave() {
    saveDoc().then(() => {
        if (eventToShow) showEvent();//IMPORTANT
        if (saved) clearInterval(savedInterval);
        saved = true;
        savedInterval = setInterval(() => {
            let minutes = Math.floor((Date.now() - lastSave) / 60000);
            if (minutes < 60) document.getElementById('tagLstSave').innerText = "Guardado hace " + minutes + " minutos";
            else document.getElementById('tagLstSave').innerText = "Guardado hace " + Math.floor(minutes / 60) + " horas";
        }, 300010);
        document.getElementById('tagLstSave').innerText = "Se han guardado los cambios";
        lastSave = Date.now();
        console.log('Saved!');
    }).catch(err => {
        document.getElementById('tagLstSave').innerText = "Error, no se han guardado todos los cambios: " + err.code;
        console.log(err);
    });
}

function setprog(bar, n) {
    bar = document.getElementById(bar);
    n = Math.floor(n);
    bar.setAttribute('aria-valuenow', n);
    bar.style.width = n + '%';
    bar.innerText = n + '%';
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
        hideEl(document.getElementById(key));
    });
    document.getElementById('mdlEventInfoL').innerHTML = docDat.events[eventToShow].date[lang];
    showEl(document.getElementById(eventToShow));
    enable(document.getElementById('btnPriorEve'));
    enable(document.getElementById('btnNextEve'));
}
document.getElementById('btnPriorEve').onclick = () => {
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
        disable(document.getElementById('btnPriorEve'));
    }
};
document.getElementById('btnNextEve').onclick = () => {
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
        disable(document.getElementById('btnNextEve'));
    }
};

function render() {
    document.getElementById('weeksCont').innerHTML = "";
    docDat.weeks.forEach((week, wIdx) => {
        let weekRow = document.createElement('tr');
        weekRow.style.height = '10rem';
        document.getElementById('weeksCont').appendChild(weekRow);
        for (let i = 0; i < 7; i++) {
            let day = week[daysOfWeek[i]]
            let dayCell = document.createElement('td');
            classes(dayCell, "p-0");
            weekRow.appendChild(dayCell);
            if (day) {
                let num = document.createElement('p');
                classes(num, "m-0 p-1");
                num.style.fontSize = 'x-large';
                num.innerHTML = '<b>' + day.date + '</b>';
                dayCell.appendChild(num);

                let events = document.createElement('div');
                classes(events, "autoOverflow");
                events.style.maxHeight = '7rem';
                day.events.forEach((event, idx) => {
                    let btnEvent = document.createElement('button');
                    btnEvent.setAttribute("data-toggle", "modal");
                    btnEvent.setAttribute("data-target", "#mdlEventInfo");
                    classes(btnEvent, "btn text-left p-1 mb-1 w-100");
                    btnEvent.style.backgroundColor = "#c3e6cb";
                    btnEvent.style.borderColor = "#8fd19e";
                    btnEvent.innerHTML = '<small>' + event.name + '</small>';
                    btnEvent.onclick = () => {
                        eventToShow = wIdx + daysOfWeek[i] + idx;
                        showEvent();
                    }
                    events.appendChild(btnEvent);
                });
                let btnPlusEvent = document.createElement('button');
                classes(btnPlusEvent, "btn btn-scckie btn-block btn-sm");
                btnPlusEvent.innerHTML = '<i class="fas fa-plus"></i>';
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
    document.getElementById('eventInfoCont').innerHTML = "";
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

        let form = document.createElement('div');
        form.id = key;
        classes(form, "d-none overflow-auto");
        let bod = document.createElement('div');
        classes(bod, "modal-body");
        form.appendChild(bod);

        let fsec = document.createElement('div');
        classes(fsec, "d-none");
        bod.appendChild(fsec);
        let fgType = document.createElement('div');
        classes(fgType, "form-group");
        fsec.appendChild(fgType);

        let selTypeMainL = document.createElement('label');
        if (lang == "es") {
            selTypeMainL.innerText = "Tipo de evento";
        } else if (lang == "en") {
            selTypeMainL.innerText = "Event type";
        }
        fgType.appendChild(selTypeMainL);
        let selTypeMain = document.createElement('select');
        classes(selTypeMain, "form-control");
        selTypeMain.setAttribute('multiple', 'true');
        calConfig[lang].forEach((itm, idx) => {
            let opt = document.createElement('option');
            opt.value = idx;
            opt.innerText = itm.label;
            if ((!event.typeIdx && idx == 0) || idx == event.typeIdx) opt.setAttribute('selected', 'true');
            selTypeMain.appendChild(opt);
        });
        selTypeMain.oninput = () => {
            changed = true;
            event.typeIdx = parseInt(selTypeMain.value);
            if (!event.typeIdx) event.typeIdx = 0;
            event.vals = {};
            reloadForm();
        }
        fgType.appendChild(selTypeMain);

        let inTitleHid = document.createElement('input');
        inTitleHid.setAttribute("type", "text");
        inTitleHid.id = "inEveTitle" + key;
        let inDescHid = document.createElement('textarea');
        inDescHid.id = "inEveDesc" + key;

        let fRow = document.createElement('div');
        classes(fRow, "form-row");
        fsec.insertBefore(fRow, fgType.nextSibling);

        //Must be declared here
        let sfRow = document.createElement('div');
        classes(sfRow, "form-row d-none");
        fsec.insertBefore(sfRow, fRow.nextSibling);

        function reloadForm() {
            fRow.innerHTML = "";
            calConfig[lang][event.typeIdx].options.forEach((option, idx) => {
                let fCol = document.createElement('div');
                classes(fCol, "col-auto form-group");
                let label = document.createElement('label');
                label.innerText = option.label;
                fCol.appendChild(label);
                let inp;
                switch (option.type) {
                    case "select":
                        inp = document.createElement('select');
                        option.options.forEach((itm, i) => {
                            let opt = document.createElement('option');
                            opt.value = itm.val;
                            opt.innerHTML = itm.label;
                            if ((i == 0 && (!event.vals || !event.vals[idx])) || (event.vals && event.vals[idx] && event.vals[idx].val == itm.val)) {
                                opt.selected = true;
                                event.vals[idx] = {
                                    label: itm.label,
                                    val: itm.val,
                                }
                                if (option.valForSub == itm.val) showEl(sfRow);
                                else hideEl(sfRow);
                            }
                            inp.appendChild(opt);
                        });
                        break;
                    case "textarea":
                        inp = document.createElement('textarea');
                        inp.setAttribute("rows", "3");
                        if (event.vals[idx] && event.vals[idx].val) inp.value = event.vals[idx].val;
                        break;
                    default:
                        inp = document.createElement('input');
                        inp.setAttribute("type", option.type);
                        if (event.vals[idx] && event.vals[idx].val) inp.value = event.vals[idx].val;
                }
                if (option.placeholder) inp.placeholder = option.placeholder;
                classes(inp, "form-control form-control-sm");
                fCol.appendChild(inp);
                fRow.appendChild(fCol);

                //sfRow declared before
                if (option.valForSub) {
                    option.sub.forEach((soption, sidx) => {
                        let sfCol = document.createElement('div');
                        classes(sfCol, "col-auto form-group");
                        let slabel = document.createElement('label');
                        slabel.innerText = soption.label;
                        sfCol.appendChild(slabel);
                        let sinp;
                        switch (soption.type) {
                            case "select":
                                sinp = document.createElement('select');
                                soption.options.forEach((itm, i) => {
                                    let opt = document.createElement('option');
                                    opt.value = itm.val;
                                    opt.innerHTML = itm.label;
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
                                sinp = document.createElement('textarea');
                                sinp.setAttribute("rows", "3");
                                if (event.vals[idx + '-' + sidx] && event.vals[idx + '-' + sidx].val) sinp.value = event.vals[idx + '-' + sidx].val;
                                break;
                            default:
                                sinp = document.createElement('input');
                                sinp.setAttribute("type", soption.type);
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
                            if (option.type == "select") event.vals[idx + '-' + sidx].label = sinp.innerText;
                            else event.vals[idx + '-' + sidx].label = soption.label;
                            regenTxt();
                        }
                    });
                }

                inp.onchange = function () {
                    changed = true;
                    event.vals[idx] = {};
                    event.vals[idx].val = inp.value;
                    if (option.type == "select") event.vals[idx].label = inp.innerText;
                    else event.vals[idx].label = option.label;
                    if (option.valForSub) {
                        if (option.valForSub == inp.value) showEl(sfRow);
                        else hideEl(sfRow);
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

        let fgVis = document.createElement('div');
        classes(fgVis, "form-group");
        fsec.appendChild(fgVis);
        fgVis.innerHTML = '<label>Visiblidad</label>';
        let inVis = document.createElement('select');
        inVis.id = "inVis" + key;
        classes(inVis, "form-control");
        calConfig.visOpts[lang].forEach((itm, idx) => {
            let opt = document.createElement('option');
            opt.value = idx;
            opt.innerHTML = itm;
            if (itm == event.visibilidad) opt.setAttribute('selected', "true");
            inVis.appendChild(opt);
        });
        fgVis.appendChild(inVis);

        let fgTime = document.createElement('div');
        classes(fgTime, "form-group");
        fsec.appendChild(fgTime);
        fgTime.innerHTML = '<label>Horario</label>';
        let inTime = document.createElement('textarea');
        classes(inTime, "form-control");
        inTime.id = "inTime" + key;
        inTime.setAttribute("rows", "4");
        fgTime.appendChild(inTime);
        if (inVis.value == 5) hideEl(fgTime);
        else showEl(fgTime);

        inVis.oninput = () => {
            changed = true;
            if (inVis.value == 5) hideEl(fgTime);
            else showEl(fgTime);
        };
        inTime.onchange = () => {
            changed = true;
        };

        //Must be declared here
        let saveBtn = document.createElement('button');

        let selLangCC = document.createElement('div');
        classes(selLangCC, "row");
        let selLangC = document.createElement('div');
        classes(selLangC, "col-auto");
        selLangCC.appendChild(selLangC);
        let selLang = document.createElement('select');
        classes(selLang, "form-control ml-auto h-100");
        selLang.setAttribute("name", "selTransLang");
        selLangC.appendChild(selLang);
        let btnTrans = document.createElement('button');
        classes(btnTrans, 'btn btn-scckie mx-2');
        btnTrans.innerHTML = '<i class="fas fa-language"></i>';
        btnTrans.onclick = function () {
            db.collection('calendars/langs/' + selLang.value).doc(docId).get().then(async function (doc) {
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
                inTime.innerHTML = "";
                event.horario.forEach(time => {
                    inTime.innerHTML += time + "\n";
                });
                changed = true;
                saveBtn.click();
            }).catch(err => console.log(err));
        }
        selLangCC.appendChild(btnTrans);
        fsec.appendChild(selLangCC);

        let tsec = document.createElement('div');
        bod.appendChild(tsec);
        let eveTit = document.createElement('h3');
        eveTit.innerHTML = event.name;
        tsec.appendChild(eveTit);
        let eveDesc = document.createElement('p');
        eveDesc.innerHTML = event.description;
        tsec.appendChild(eveDesc);
        let eveVis = document.createElement('p');
        eveVis.innerHTML = "Visibilidad: " + event.visibilidad;
        tsec.appendChild(eveVis);
        let eveTime = document.createElement('p');
        classes(eveTime, "mb-0");
        eveTime.innerHTML = "Horario: ";
        tsec.appendChild(eveTime);
        let eveTimeLst = document.createElement('ul');
        tsec.appendChild(eveTimeLst);
        event.horario.forEach(time => {
            let li = document.createElement('li');
            li.innerHTML = time;
            eveTimeLst.appendChild(li);
        });
        if (event.visibilidad == calConfig.visOpts[lang][5]) {
            hideEl(eveTime);
            hideEl(eveTimeLst);
        }
        else {
            showEl(eveTime);
            showEl(eveTimeLst);
        }


        let foot = document.createElement('div');
        classes(foot, "modal-footer");
        form.appendChild(foot);

        let delBtn = document.createElement('button');
        classes(delBtn, "btn btn-danger mr-auto")
        delBtn.setAttribute("type", "button");
        delBtn.innerText = "Borrar";
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
        let editBtn = document.createElement('button');
        classes(editBtn, "btn btn-info");
        editBtn.setAttribute("type", "button");
        editBtn.innerText = "Editar";
        editBtn.onclick = () => {
            inVis.value = calConfig.visOpts[lang].indexOf(event.visibilidad);
            if (inVis.value == 5) hideEl(fgTime);
            else showEl(fgTime);
            inTime.innerHTML = "";
            event.horario.forEach(time => {
                inTime.innerHTML += time + "\n";
            });
            hideEl(tsec);
            showEl(fsec);
            showEl(saveBtn);
            enable(saveBtn);
            hideEl(editBtn);
        };
        foot.appendChild(editBtn);
        //Declared before
        classes(saveBtn, "btn btn-scckie d-none");
        saveBtn.setAttribute("type", "button");
        disable(saveBtn);
        saveBtn.innerText = "Guardar";
        saveBtn.onclick = () => {
            disable(saveBtn);
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
            hideEl(fsec);
            showEl(tsec);
            hideEl(saveBtn);
            showEl(editBtn);
        };
        foot.appendChild(saveBtn);

        document.getElementById('eventInfoCont').appendChild(form);
    }

    document.getElementsByName('selTransLang').forEach(itm => {
        itm.innerHTML = '';
    });
    langs.forEach((l, i) => {
        if (l != lang) {
            let opt = document.createElement('option');
            if (i == 0) {
                opt.setAttribute('selected', 'true');
            }
            opt.value = opt.innerText = l;
            document.getElementsByName('selTransLang').forEach(itm => {
                itm.appendChild(opt.cloneNode(true));
            });
        }
    });
}


function resetChgImg(uncheck) {
    document.getElementById('prevMed').src = docDat.picUrl;
    if (uncheck) {
        document.getElementById('inMedSrc0').checked = false;
        document.getElementById('inMedSrc1').checked = false;
    }
    document.getElementById('inChgImg').value = "";
    document.getElementById('inChgImgUrl').value = "";
    document.getElementById('inChgImg').removeAttribute('required');
    document.getElementById('inChgImgUrl').removeAttribute('required');
    hideEl(document.getElementById("barChgImgCont"));
    hideEl(document.getElementById("inChgImgFileCont"));
    hideEl(document.getElementById("inChgImgUrlCont"));
    document.getElementById("btnCnfChgImg").removeAttribute('disabled');
    document.getElementById("btnCanChgImg").removeAttribute('disabled');
}
document.getElementById('btnChgImg').onclick = () => {
    resetChgImg(true);
    toggleEl(document.getElementById("frmChgImg"));
};
document.getElementById('inChgImg').addEventListener('change', e => {
    newMedia = e.target.files[0];
    function prevMed() {
        var read = new FileReader();
        read.readAsDataURL(newMedia);
        read.onload = function (e2) {
            document.getElementById("prevMed").src = e2.target.result;
        };
    };
    newMedia.name = ultraClean(newMedia.name, '');
    document.getElementById('inChgImgL').innerHTML = newMedia.name;
    prevMed(newMedia);
});
document.getElementById('inChgImgUrl').onchange = function () {
    document.getElementById("prevMed").src = document.getElementById('inChgImgUrl').value;
};
document.getElementById('inMedSrc0').onclick = function () {
    newMedSrc = "home";
    resetChgImg(false);
    document.getElementById('inChgImg').setAttribute('required', 'true');
    showEl(document.getElementById("inChgImgFileCont"));
}
document.getElementById('inMedSrc1').onclick = function () {
    newMedSrc = "out";
    resetChgImg(false);
    document.getElementById('inChgImgUrl').setAttribute('required', 'true');
    showEl(document.getElementById("inChgImgUrlCont"));
}

document.getElementById('btnPrevCal').onclick = function () {
    docDat.timePrev = new firebase.firestore.Timestamp.fromMillis((new Date(Date.now())).getTime() + 10 * 60000);
    normSave();
};
document.getElementById('btnPrevMail').onclick = function () {
    docDat.timePrev = new firebase.firestore.Timestamp.fromMillis((new Date(Date.now())).getTime() + 10 * 60000);
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

document.getElementById('btnAprove').onclick = function () {
    if (docDat.revised[lang] && docDat.revised[lang].includes(uid)) {
        docDat.revised[lang].splice(docDat.revised[lang].indexOf(uid), 1);
        document.getElementById('btnAprove').innerHTML = '<i class="far fa-check-square"></i>';
    } else {
        if (!docDat.revised[lang]) docDat.revised[lang] = [];
        docDat.revised[lang].push(uid);
        document.getElementById('btnAprove').innerHTML = '<i class="fas fa-check-square"></i>';
    }
    if (validateRevision()) {
        docDat.finished = true;
        newCal();
    } else {
        docDat.finished = false;
    }
    normSave();
};

function newCal() {
    return;
    //@#Move to CF
    let nextCalID;
    rtDb.ref('nextCal').transaction(nCal => {
        if (nCal) {
            nextCalID = nCal;
            nCal++;
            if (nCal % 100 == 13) {
                nCal -= 12;
                nCal += 100;
            }
        }
        return nCal;
    }, (error) => {
        if (error) {
            console.log(error);
        } else {
            let date = new Date((nextCalID - nextCalID % 100) / 100 + ' ' + nextCalID % 100 + ' ' + '00:00');
            let weeks = [];
            let days;
            if (date.getMonth() == 1) {
                if (date.getFullYear() % 4 == 0) {
                    days = 29;
                } else {
                    days = 28;
                }
            } else if (date.getMonth() % 2 == 0) {
                if (date.getMonth() <= 6) days = 31;
                else days = 30;
            } else {
                if (date.getMonth() <= 6) days = 30;
                else days = 31;
            }
            let bDay = date.getDay();
            for (let i = 1; i <= days; i = i) {
                let week = {};
                for (let j = bDay; j < daysOfWeek.length; j++) {
                    if (i > days) break;
                    week[daysOfWeek[j]] = {
                        date: i,
                        events: []
                    }
                    i++;
                }
                weeks.push(week);
                bDay = 0;
            }
            const promises = [];
            langs.forEach(l => {
                let newC = {
                    events: {},
                    published: firebase.firestore.Timestamp.fromDate(date),
                    description: "",
                    descriptionShort: "",
                    finished: false,
                    pastDue: false,
                    picUrl: "",
                    picAlt: "",
                    picCapt: "",
                    public: false,
                    sentMail: false,
                    revised: {},
                    title: "",
                    url: "",
                    nextCal: "",
                    priorCal: "",
                    weeks: weeks,
                    translations: {}
                }

                let intId = parseInt(nextCalID);
                let year = (intId - intId % 100) / 100;
                let nYear = (intId - intId % 100) / 100;
                let pYear = (intId - intId % 100) / 100;
                if (intId % 100 == 12) nYear++;
                if (intId % 100 == 1) pYear--;
                let month = fullMonth(intId % 100, l);
                let nMonth = fullMonth(intId % 100 + 1, l).toLowerCase();
                let pMonth = fullMonth(intId % 100 - 1, l).toLowerCase();
                let calsText = "";
                switch (l) {
                    case "es":
                        calsText = "calendario-astronomico";
                        newC.title = "Calendario Astronómico de " + month + " " + year;
                        break;
                    case "en":
                        calsText = "astronomic-calendar";
                        newC.title = "Astronomic Calendar of " + month + " " + year;
                        break;
                }
                newC.url = "https://sciencecookies.net/" + calsText + "/" + year + "/" + month.toLowerCase() + "/";
                newC.nextCal = "https://sciencecookies.net/" + calsText + "/" + nYear + "/" + nMonth + "/";
                newC.priorCal = "https://sciencecookies.net/" + calsText + "/" + pYear + "/" + pMonth + "/";

                promises.push(db.collection('calendars/langs/' + l).doc(Math.abs(nextCalID).toString()).set(newC));

            })
            return Promise.all(promises).then(() => {
                console.log('exito');
            }).catch(err => console.log(err));
        }
    });
}

$('#mdlPublish').on('show.bs.modal', e => {
    if (validateRevision()) {
        showEl(document.getElementById('btnCnfPublish'));
        document.getElementById('mdlPublishTxt').innerText = "El calendario está listo para publicar";
    } else {
        hideEl(document.getElementById('btnCnfPublish'));
        document.getElementById('mdlPublishTxt').innerText = "Para publicar es necesario que lo hayan aprovado al menos dos personas.";
    }
});

document.getElementById('btnCnfPublish').onclick = function () {
    if (docDat.public) return;
    setprog('barPublish', 0);
    showEl(document.getElementById('barPublishCont'));

    docDat.public = true;
    setprog('barPublish', 25);

    saveDoc().then(() => {
        setprog('barPublish', 58);
        return set(ref(RTDB, 'calendarios/' + docId), {
            pop: 0
        });
    }).then(() => {
        setprog('barPublish', 100);
        classes(document.getElementById('barPublish'), 'bg-success');
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