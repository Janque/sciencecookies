var store = firebase.storage();
var rtDb = firebase.database();

let docDat, docId;
let lastSave = Date.now(), saved = false;

let newMedia = null;
let newMedSrc = null;

let eventToShow = "";

const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

function loaded() {
    db.collection('calendarios').doc(urlSrch.get('file')).onSnapshot(doc => {
        if (!doc.exists) {
            window.location.href = '../404';
            return;
        }
        docDat = doc.data();
        docId = doc.id;
        document.getElementById('title').innerHTML = docDat.title;
        document.getElementById('prevMed').src = docDat.picUrl;
        document.getElementById('inDesc').value = docDat.description;
        document.getElementById('inDescShort').value = docDat.descriptionShort;
        render();
        if (docDat.public) {
            document.getElementById('btnPrevCal').classList.remove('d-none');
            document.getElementById('btnAprove').classList.add('d-none');
            document.getElementById('btnPub').classList.add('d-none');
        } else {
            document.getElementById('btnPrevCal').classList.add('d-none');
            document.getElementById('btnAprove').classList.remove('d-none');
            if (docDat.pastDue) document.getElementById('btnPub').classList.remove('d-none');
        }
        if (docDat.revised.includes(uid)) {
            document.getElementById('btnAprove').innerHTML = '<i class="fas fa-check-square"></i>';
        } else {
            document.getElementById('btnAprove').innerHTML = '<i class="far fa-check-square"></i>';
        }
    }, err => console.log(err))

    function descFrm() {
        docDat.description = document.getElementById('inDesc').value.trim();
        docDat.descriptionShort = document.getElementById('inDescShort').value.trim();
        return normSave();
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

let savedInterval;
function saveDoc() {
    console.log('Saving...');
    return db.collection('calendarios').doc(docId).update(docDat);
}
function normSave() {
    saveDoc().then(() => {
        if (saved) clearInterval(savedInterval);
        saved = true;
        savedInterval = setInterval(() => {
            let minutes = Math.floor((Date.now() - lastSave) / 60000);
            if (minutes < 60) document.getElementById('tagLstSave').innerText = "Guardado hace " + minutes + " minutos";
            else document.getElementById('tagLstSave').innerText = "Guardado hace " + Math.floor(minutes / 60) + " horas";
        }, 300010);
        document.getElementById('tagLstSave').innerText = "Se han guardado todos los cambios";
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

}

function render() {
    document.getElementById('weeksCont').innerHTML = "";
    docDat.weeks.forEach(week => {
        let weekRow = document.createElement('tr');
        weekRow.style.height = '10rem';
        document.getElementById('weeksCont').appendChild(weekRow);
        for (let i = 0; i < 7; i++) {
            let day = week[daysOfWeek[i]]
            let dayCell = document.createElement('td');
            classes(dayCell, "py-0 pr-0");
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
                    classes(btnEvent, "btn text-left p-1 mb-1");
                    btnEvent.style.backgroundColor = "#c3e6cb";
                    btnEvent.style.borderColor = "#8fd19e";
                    btnEvent.innerHTML = '<small>' + event.name + '</small>';
                    btnEvent.onclick = () => {
                        eventToShow = "d" + day.date + "e" + idx;
                        showEvent();
                    }
                    events.appendChild(btnEvent);
                });
                let btnPlusEvent = document.createElement('button');
                classes(btnPlusEvent, "btn btn-scckie btn-block btn-sm");
                btnPlusEvent.innerHTML = '<i class="fas fa-plus"></i>';
                btnPlusEvent.onclick = () => {
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
    window.open(docDat.url, '_blank').focus();
};
document.getElementById('btnPrevMail').onclick = function () {
    window.open('../vista-email/' + docDat.file, '_blank').focus();
};

document.getElementById('btnAprove').onclick = function () {
    if (docDat.revised.includes(uid)) {
        docDat.revised.splice(docDat.revised.indexOf(uid), 1);
        document.getElementById('btnAprove').innerHTML = '<i class="far fa-check-square"></i>';
    } else {
        docDat.revised.push(uid);
        document.getElementById('btnAprove').innerHTML = '<i class="fas fa-check-square"></i>';
        if (docDat.revised.length > 1) newCal();
    }
    normSave();
};

function newCal() {
    let nextCalID;
    firebase.database().ref('nextCal').transaction(nCal => {
        if (nCal) {
            nextCalID = nCal;
            nCal++;
            if (nCal % 100 == 13) {
                nCal -= 13;
                nCal += 100;
            }
        }
        return nCal;
    }, (error) => {
        if (error) {
            console.log(error);
        } else {
            let month = "";
            switch (nextCalID % 100) {
                case 1:
                    month = "Enero";
                    break;
                case 2:
                    month = "Febrero";
                    break;
                case 3:
                    month = "Marzo";
                    break;
                case 4:
                    month = "Abril";
                    break;
                case 5:
                    month = "Mayo";
                    break;
                case 6:
                    month = "Junio";
                    break;
                case 7:
                    month = "Julio";
                    break;
                case 8:
                    month = "Agosto";
                    break;
                case 9:
                    month = "Septiembre";
                    break;
                case 10:
                    month = "Octubre";
                    break;
                case 11:
                    month = "Noviembre";
                    break;
                case 12:
                    month = "Diciembre";
                    break;
            }
            let date = new Date((nextCalID - nextCalID % 100)/100 + ' ' + nextCalID % 100 + ' ' + '00:00');
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
            db.collection('calendarios').doc(Math.abs(nextCalID).toString()).set({
                date: firebase.firestore.Timestamp.fromDate(date),
                description: "Sin descripción",
                descriptionShort: "Sin descripción",
                finished: false,
                pastDue: false,
                picUrl: "",
                public: false,
                revised: [],
                title: "Calendario Astronómico de " + month + " " + (nextCalID - nextCalID % 100)/100,
                url: "https://sciencecookies.net/calendario-astronomico/" + (nextCalID - nextCalID % 100)/100 + "/" + month.toLowerCase(),
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
        classes(document.getElementById('btnCnfPublish'), "d-none");
        document.getElementById('mdlPublishTxt').innerText = "Para publicar es necesario que lo hayan aprovado al menos dos personas.";
        document.getElementById('frmPublish').classList.add('d-none');
    } else {
        document.getElementById('btnCnfPublish').classList.remove("d-none");
        document.getElementById('mdlPublishTxt').innerText = "La galleta está lista para publicar";
        document.getElementById('frmPublish').classList.remove('d-none');
        if (docDat.beenPublic) document.getElementById('sendUptCont').classList.remove('d-none');
    }
});

function finishPub() {
    setprog(document.getElementById('barPublish'), '100');
    classes(document.getElementById('barPublish'), 'bg-success');
    document.getElementById("alrtClsSsn").innerHTML = '<div id="alrtClsSsnAlrt" class="alert alert-success alert-dismissible fade show fixed-bottom" role="alert">Publicado correctamente<strong></strong>                                                                           <button id="btnAlrtClsSsn" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    let d = docDat.published.toDate();
    let month = d.getFullYear().toString();
    if (d.getMonth() < 9) {
        month += '0';
    }
    month += (d.getMonth() + 1);
    setTimeout(function () {
        window.open('../galletas/' + month + '/' + docDat.file, '_blank').focus();
    }, 2500);
    console.log("Data saved successfully.");
    setTimeout(function () {
        document.getElementById("btnAlrtClsSsn").click();
    }, 3000);
    $('#alrtClsSsnAlrt').on('closed.bs.alert', function () {
        document.getElementById("alrtClsSsn").innerHTML = '';
    });
    $('#mdlPublish').modal('hide');
}

document.getElementById('btnCnfPublish').onclick = function () {
    if (docDat.public) return;
    setprog(document.getElementById('barPublish'), '0');
    document.getElementById('barPublishCont').classList.remove('d-none');
    if (!docDat.beenPublic) {
        setprog(document.getElementById('barPublish'), '30');
        db.collection('galletasCont').doc(docId).update({
            beenPublic: true,
            public: true,
            ledit: new firebase.firestore.Timestamp.now(),
            published: new firebase.firestore.Timestamp.now(),
            revised: []
        }).then(() => {
            setprog(document.getElementById('barPublish'), '49');
            let d = docDat.published.toDate();
            let month = d.getFullYear().toString();
            if (d.getMonth() < 9) {
                month += '0';
            }
            month += (d.getMonth() + 1);
            return db.collection('galletas').doc(docId).set({
                likes: 0,
                favs: 0,
                pop: 0,
                ledit: new firebase.firestore.Timestamp.now(),
                date: new firebase.firestore.Timestamp.now(),
                dledit: false,
                notify: false,
                public: true,
                title: docDat.title,
                descrip: docDat.description,
                url: 'https://sciencecookies.net/galletas/' + month + '/' + docDat.file,
                picUrl: docDat.picUrl,
                authrs: docDat.authors,
                cats: keywords
            })
        }).then(() => {
            setprog(document.getElementById('barPublish'), '78');
            rtDb.ref('galletas/' + docId).set({
                pop: 0,
                likes: 0,
                favs: 0
            }, err => {
                if (err) {
                    console.log("Data could not be saved." + err);
                } else {
                    setprog(document.getElementById('barPublish'), '84');
                    finishPub();
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
    } else {
        setprog(document.getElementById('barPublish'), '30');
        db.collection('galletasCont').doc(docId).update({
            public: true,
            ledit: new firebase.firestore.Timestamp.now(),
            revised: []
        }).then(() => {
            setprog(document.getElementById('barPublish'), '42');
            let d = docDat.published.toDate();
            let month = d.getFullYear().toString();
            if (d.getMonth() < 9) {
                month += '0';
            }
            month += (d.getMonth() + 1);
            let cook = {
                title: docDat.title,
                descrip: docDat.description,
                url: 'https://sciencecookies.net/galletas/' + month + '/' + docDat.file,
                picUrl: docDat.picUrl,
                authrs: docDat.authors,
                cats: keywords,
                public: true,
            };
            setprog(document.getElementById('barPublish'), '57');
            if (document.getElementById('inSendUpt').checked) {
                cook.ledit = new firebase.firestore.Timestamp.now();
                cook.dledit = true;
                cook.notify = true;
            } else {
                cook.dledit = false;
                cook.notify = false;
            }
            setprog(document.getElementById('barPublish'), '61');
            if (document.getElementById('inSendUpt').checked) {
                cook.uptMsg = true;
                cook.uptDescrip = document.getElementById('inDesc').value.trim();
            } else {
                cook.uptMsg = false;
                cook.uptDescrip = '';
            }
            setprog(document.getElementById('barPublish'), '66');
            return db.collection('galletas').doc(docId).update(cook);
        }).then(() => {
            setprog(document.getElementById('barPublish'), '78');
            finishPub();
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
    }
};