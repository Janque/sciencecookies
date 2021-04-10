import '../styles/editCal.scss';

var store = firebase.storage();
var rtDb = firebase.database();

let docDat, docId;
let lastSave = Date.now(), saved = false;

let newMedia = null;
let newMedSrc = null;

let eventToShow = null;

const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'], longDay = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado'];
function fullMonth(n) {
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
}

window.loaded = function loaded() {
    db.collection('calendarios').doc(urlSrch.get('file')).onSnapshot(doc => {
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
        if (docDat.revised.includes(uid)) {
            document.getElementById('btnAprove').innerHTML = '<i class="fas fa-check-square"></i>';
        } else {
            document.getElementById('btnAprove').innerHTML = '<i class="far fa-check-square"></i>';
        }
        document.getElementById('btnPrevCal').href = docDat.url;
        document.getElementById('btnPrevMail').href = '/vista-email-calendario/' + docId;
        document.getElementById('btnSrcCal').href = `https://in-the-sky.org/newscal.php?month=${urlSrch.get('file').substr(5, 6)}&year=${urlSrch.get('file').substr(0, 4)}&maxdiff=7&country=1484&reg1=3527646&reg2=8379372&town=3530597`;
        document.getElementById('btnSrcCal2').href = `https://in-the-sky.org/newscal.php?month=${urlSrch.get('file').substr(5, 6)}&year=${urlSrch.get('file').substr(0, 4)}&maxdiff=7&country=1170&reg1=3688685&reg2=9609540&town=3688689`;
        document.getElementById('btnSrcCal3').href = `https://in-the-sky.org/newscal.php?month=${urlSrch.get('file').substr(5, 6)}&year=${urlSrch.get('file').substr(0, 4)}&maxdiff=7&country=1724&reg1=3117732&reg2=6355233&town=3117735`;
    }, err => console.log(err))

    function descFrm() {
        docDat.description = document.getElementById('inDesc').value.trim();
        docDat.descriptionShort = document.getElementById('inDescShort').value.trim();
        normSave();
    }
    document.getElementById("frmText").addEventListener("submit", function (event) {
        event.preventDefault();
        descFrm();
    });

    function addMed() {
        let ref = store.ref('calendarMedia/' + docId + '/pic');
        ref.put(newMedia).on('state_changed',
            function progress(snap) {
                setprog(document.getElementById('barChgImg'), Math.floor((snap.bytesTransferred / snap.totalBytes) * 100));
            },
            function error(err) {
                document.getElementById("alrtClsSsn").innerHTML = '<div id="alrtClsSsnAlrt" class="alert alert-warning alert-dismissible fade show fixed-bottom" role="alert"><strong>¡Ocurrió un error!</strong> ' + err.code + '<button id="btnAlrtClsSsn" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                setTimeout(function () {
                    if (document.getElementById("btnAlrtClsSsn")) document.getElementById("btnAlrtClsSsn").click();
                }, 3000);
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
        setprog(document.getElementById('barChgImg'), "0");
        showEl(document.getElementById("barChgImgCont"));
        hideEl(document.getElementById("frmChgImg"));
        document.getElementById("btnCnfChgImg").setAttribute('disabled', 'true');
        document.getElementById("btnCanChgImg").setAttribute('disabled', 'true');
        if (newMedSrc == "home") addMed();
        else addExtMed();
    });
}

document.getElementById('inPicCapt').oninput = () => {
    docDat.picCapt = document.getElementById('inPicCapt').value.trim();
}
document.getElementById('inPicAlt').oninput = () => {
    docDat.picAlt = document.getElementById('inPicAlt').value.trim();
}
document.getElementById('inDesc').oninput = () => {
    docDat.picDesc = document.getElementById('inDesc').value.trim();
}
document.getElementById('inDescShort').oninput = () => {
    docDat.picDescShort = document.getElementById('inDescShort').value.trim();
}

let savedInterval;
function saveDoc() {
    console.log('Saving...');
    return db.collection('calendarios').doc(docId).update(docDat);
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
    }).catch(err => {
        document.getElementById('tagLstSave').innerText = "Error, no se han guardado todos los cambios: " + err.code;
        console.log(err);
    });
}

function setprog(bar, n) {
    bar.setAttribute('aria-valuenow', n);
    bar.style.width = n + '%';
    bar.innerText = n + '%';
}

function showEvent() {
    Object.keys(docDat.events).forEach(key => {
        hideEl(document.getElementById(key));
    });
    document.getElementById('mdlEventInfoL').innerHTML = docDat.events[eventToShow].date;
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
                        date: longDay[i] + " " + day.date + " de " + fullMonth(docId % 100),
                        name: "Evento sin nombre",
                        description: "Sin descripción",
                        visibilidad: "Visible a simple vista",
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
        let form = document.createElement('div');
        form.id = key;
        classes(form, "d-none overflow-auto");
        let bod = document.createElement('div');
        classes(bod, "modal-body");
        form.appendChild(bod);

        let fsec = document.createElement('div');
        classes(fsec, "d-none");
        bod.appendChild(fsec);
        let fg0 = document.createElement('div');
        classes(fg0, "form-group");
        fsec.appendChild(fg0);
        fg0.innerHTML = '<label>Nombre del evento</label>';
        let in0 = document.createElement('input');
        in0.id = "inEveTitle" + key;
        in0.setAttribute("type", "text");
        classes(in0, "form-control");
        fg0.appendChild(in0);
        let fg1 = document.createElement('div');
        classes(fg1, "form-group");
        fsec.appendChild(fg1);
        fg1.innerHTML = '<label>Descripción</label>';
        let in1 = document.createElement('textarea');
        classes(in1, "form-control");
        in1.id = "inEveDesc" + key;
        in1.setAttribute("rows", "3");
        fg1.appendChild(in1);
        let fg2 = document.createElement('div');
        classes(fg2, "form-group");
        fsec.appendChild(fg2);
        fg2.innerHTML = '<label>Visiblidad</label>';
        let in2 = document.createElement('select');
        in2.id = "inVis" + key;
        classes(in2, "form-control");
        let visOpts = ["Visible a simple vista", "Visible con binoculares", "Visible con un telescopio pequeño", "Visible con un telescopio de 4 pulgadas", "Visible con un telescopio grande", "No observable"]
        visOpts.forEach((itm, idx) => {
            let opt = document.createElement('option');
            opt.value = idx;
            opt.innerHTML = itm;
            if (itm == event.visibilidad) opt.setAttribute('selected', "true");
            in2.appendChild(opt);
        });
        fg2.appendChild(in2);
        let fg3 = document.createElement('div');
        classes(fg3, "form-group");
        fsec.appendChild(fg3);
        fg3.innerHTML = '<label>Horario</label>';
        let in3 = document.createElement('textarea');
        classes(in3, "form-control");
        in3.id = "inTime" + key;
        in3.setAttribute("rows", "4");
        fg3.appendChild(in3);
        if (in2.value == 5) hideEl(fg3);
        else showEl(fg3);
        in0.oninput = () => {
            enable(reverBtn);
            changed = true;
        };
        in1.oninput = () => {
            enable(reverBtn);
            changed = true;
        };
        in2.oninput = () => {
            enable(reverBtn);
            changed = true;
            if (in2.value == 5) hideEl(fg3);
            else showEl(fg3);
        };
        in3.oninput = () => {
            enable(reverBtn);
            changed = true;
        };

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
        if (event.visibilidad == "No observable") {
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
            in0.value = event.name;
            in1.innerHTML = event.description;
            in2.value = visOpts.indexOf(event.visibilidad);
            if (in2.value == 5) hideEl(fg3);
            else showEl(fg3);
            in3.innerHTML = "";
            event.horario.forEach(time => {
                in3.innerHTML += time + "\n";
            });
            hideEl(tsec);
            showEl(fsec);
            showEl(reverBtn);
            showEl(saveBtn);
            enable(saveBtn);
            hideEl(editBtn);
        };
        foot.appendChild(editBtn);
        let reverBtn = document.createElement('button');
        classes(reverBtn, "btn btn-secondary mr-1 d-none");
        reverBtn.setAttribute("type", "button");
        disable(reverBtn);
        reverBtn.innerText = "Revertir";
        reverBtn.onclick = () => {
            changed = false;
            disable(reverBtn);
            in0.value = event.name;
            in1.innerHTML = event.description;
            in2.value = visOpts.indexOf(event.visibilidad);
            if (in2.value == 5) hideEl(fg3);
            else showEl(fg3);
            in3.innerHTML = "";
            event.horario.forEach(time => {
                in3.innerHTML += time.trim() + "\n";
            });
        };
        foot.appendChild(reverBtn);
        let saveBtn = document.createElement('button');
        classes(saveBtn, "btn btn-scckie d-none");
        saveBtn.setAttribute("type", "button");
        disable(saveBtn);
        saveBtn.innerText = "Guardar";
        saveBtn.onclick = () => {
            disable(reverBtn);
            disable(saveBtn);
            if (changed) {
                docDat.weeks[Number(key[0])][key.substr(1, 3)].events[key[4]].name = event.name = in0.value;
                event.description = in1.value.trim();
                event.visibilidad = visOpts[in2.value];
                event.horario = [];
                in3.value.trim().split('\n').forEach(time => {
                    if (time != "" && time != " ") event.horario.push(time);
                });
                normSave();
            } else {
                hideEl(fsec);
                showEl(tsec);
                hideEl(reverBtn);
                hideEl(saveBtn);
                showEl(editBtn);
            }
        };
        foot.appendChild(saveBtn);

        document.getElementById('eventInfoCont').appendChild(form);
    }
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
    docDat.timePrev = new firebase.firestore.Timestamp.fromMillis((new Date(Date.now())).getTime() + 900000);
    normSave();
};
document.getElementById('btnPrevMail').onclick = function () {
    docDat.timePrev = new firebase.firestore.Timestamp.fromMillis((new Date(Date.now())).getTime() + 900000);
    normSave();
};

document.getElementById('btnAprove').onclick = function () {
    if (docDat.revised.includes(uid)) {
        docDat.revised.splice(docDat.revised.indexOf(uid), 1);
        docDat.finished = false;
        document.getElementById('btnAprove').innerHTML = '<i class="far fa-check-square"></i>';
    } else {
        docDat.revised.push(uid);
        document.getElementById('btnAprove').innerHTML = '<i class="fas fa-check-square"></i>';
        if (docDat.revised.length > 1) {
            docDat.finished = true;
            newCal();
        }
    }
    normSave();
};

function newCal() {
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
            let month = fullMonth(nextCalID % 100);
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
            let nYear = (nextCalID - nextCalID % 100) / 100;
            let pYear = (nextCalID - nextCalID % 100) / 100;
            if (nextCalID % 100 == 12) nYear++;
            if (nextCalID % 100 == 1) pYear--;
            let nMonth = fullMonth(nextCalID % 100 + 1).toLowerCase();
            let pMonth = fullMonth(nextCalID % 100 - 1).toLowerCase();
            db.collection('calendarios').doc(Math.abs(nextCalID).toString()).set({
                events: {},
                date: firebase.firestore.Timestamp.fromDate(date),
                description: "Sin descripción",
                descriptionShort: "Sin descripción",
                finished: false,
                pastDue: false,
                picUrl: "",
                picAlt: "",
                picCapt: "",
                public: false,
                sentMail: false,
                revised: [],
                title: "Calendario Astronómico de " + month + " " + (nextCalID - nextCalID % 100) / 100,
                url: "https://sciencecookies.net/calendario-astronomico/" + (nextCalID - nextCalID % 100) / 100 + "/" + month.toLowerCase(),
                nextCal: "https://sciencecookies.net/calendario-astronomico/" + nYear + "/" + nMonth,
                priorCal: "https://sciencecookies.net/calendario-astronomico/" + pYear + "/" + pMonth,
                weeks: weeks
            }).then(() => {
                console.log('nuevo calendario');
            }).catch(err => console.log(err));
        }
    });
}

$('#mdlPublish').on('show.bs.modal', e => {
    let rev = docDat.revised.length;
    if (!docDat.revised.includes(uid)) rev++;
    if (rev < 2) {
        hideEl(document.getElementById('btnCnfPublish'));
        document.getElementById('mdlPublishTxt').innerText = "Para publicar es necesario que lo hayan aprovado al menos dos personas.";
    } else {
        showEl(document.getElementById('btnCnfPublish'));
        document.getElementById('mdlPublishTxt').innerText = "El calendario está listo para publicar";
    }
});

document.getElementById('btnCnfPublish').onclick = function () {
    if (docDat.public) return;
    setprog(document.getElementById('barPublish'), '0');
    showEl(document.getElementById('barPublishCont'));
    setprog(document.getElementById('barPublish'), '25');
    db.collection('calendarios').doc(docId).update({
        public: true
    }).then(() => {
        setprog(document.getElementById('barPublish'), '63');
        admin.database().ref('calendarios/' + calID).set({
            pop: 0
        }, err => {
            if (err) {
                document.getElementById("alrtClsSsn").innerHTML = '<div id="alrtClsSsnAlrt" class="alert alert-danger alert-dismissible fade show fixed-bottom" role="alert"><strong>!Ha ocurrido un error! </strong>' + err + '<button id="btnAlrtClsSsn" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                console.log(err);
                setTimeout(function () {
                    document.getElementById("btnAlrtClsSsn").click();
                }, 3000);
                $('#alrtClsSsnAlrt').on('closed.bs.alert', function () {
                    document.getElementById("alrtClsSsn").innerHTML = '';
                });
            } else {
                setprog(document.getElementById('barPublish'), '100');
                classes(document.getElementById('barPublish'), 'bg-success');
                document.getElementById("alrtClsSsn").innerHTML = '<div id="alrtClsSsnAlrt" class="alert alert-success alert-dismissible fade show fixed-bottom" role="alert">Publicado correctamente<strong></strong>                                                                           <button id="btnAlrtClsSsn" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                setTimeout(function () {
                    window.open(docDat.url, '_blank').focus();
                }, 2500);
                console.log("Published successfully.");
                setTimeout(function () {
                    document.getElementById("btnAlrtClsSsn").click();
                }, 3000);
                $('#alrtClsSsnAlrt').on('closed.bs.alert', function () {
                    document.getElementById("alrtClsSsn").innerHTML = '';
                });
                $('#mdlPublish').modal('hide');
                console.log('Published ' + calID + ' calendar');
                return null;
            }
        });
    }).catch(error => {
        document.getElementById("alrtClsSsn").innerHTML = '<div id="alrtClsSsnAlrt" class="alert alert-danger alert-dismissible fade show fixed-bottom" role="alert"><strong>!Ha ocurrido un error! </strong>' + error + '<button id="btnAlrtClsSsn" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
        console.log(error);
        setTimeout(function () {
            document.getElementById("btnAlrtClsSsn").click();
        }, 3000);
        $('#alrtClsSsnAlrt').on('closed.bs.alert', function () {
            document.getElementById("alrtClsSsn").innerHTML = '';
        });
    });
};