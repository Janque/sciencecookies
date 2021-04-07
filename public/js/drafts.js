var rtDB = firebase.database();

function loaded() {
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
        db.collection('galletasCont').where('file', '==', file).limit(1).get().then(snap => {
            if (!snap.empty) {
                document.getElementById('alrtPlusContainer').innerHTML = `<div class="alert alert-danger alert-dismissible fade show fixed-top" role="alert">
                    Ese nombre de archivo ya esta en uso.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>`;
            } else {
                document.getElementById('btnPlusConf').classList.add('d-none');
                document.getElementById('btnCanPlus0').setAttribute('disabled', 'true');
                document.getElementById('btnCanPlus1').setAttribute('disabled', 'true');
                document.getElementById('barCont').classList.remove('d-none');
                setprog('3');
                let id;
                rtDB.ref('tdaysID').transaction(today => {
                    if (today) {
                        today.last++;
                        id = today.today;
                        if (today.last < 10) id += '0';
                        id += today.last;
                    }
                    return today;
                }, err => {
                    if (err) {
                        setprog('0');
                        document.getElementById('alrtPlusContainer').innerHTML = `<div class="alert alert-danger alert-dismissible fade show fixed-top" role="alert">
                            <strong>Ocurrió un error: `+ err + `.</strong><br>LLamar a Javier.
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        </div>`;
                        console.log(err);
                    } else {
                        setprog('52');
                        db.collection('galletasCont').doc(id).set({
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
                            description: "Sin descripción",
                            picUrl: "",
                            title: title,
                            file: file,
                            owner: uid,
                            java: "",
                            revised: [],
                            public: false,
                            beenPublic: false,
                            dledit: false,
                            created: new firebase.firestore.Timestamp.now(),
                            ledit: new firebase.firestore.Timestamp.now(),
                            published: new firebase.firestore.Timestamp.now(),
                            pop: 0
                        }).then(() => {
                            setprog('80');
                            setTimeout(function () {
                                setprog('100');
                                document.getElementById('bar').classList.add('bg-success');
                                document.getElementById('alrtPlusContainer').innerHTML = `<div class="alert alert-success alert-dismissible fade show fixed-top" role="alert">
                                    Creado con exito. Redirigiendo...<br>
                                    Si no te redirige automáticamente, haz <a class="btn-link-scckie" href="../editar?file=`+ file + `">click aqui</a>.
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                </div>`;
                            }, 1000);
                            setTimeout(function () {
                                window.location.href = '../editar?file=' + file;
                            }, 3000);
                        }).catch(err => console.log(err));
                    }
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
var urlSrch, kywords, srtOrd, desc, srchRef;
var nxtp = false, paglast = [null], page = 1;
var allChk = false;
function initSrch(stAf) {
    kywrds = "";
    if (urlSrch.get('k') != null) {
        kywrds = urlSrch.get('k').replace('+', ' ');
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
                srchRef = db.collection('galletasCont').orderBy(srtOrd).startAfter(paglast[page - 1]).limit(previewLim);
            } else {
                srchRef = db.collection('galletasCont').orderBy(srtOrd, 'desc').startAfter(paglast[page - 1]).limit(previewLim);
            }
        } else {
            if (!desc) {
                srchRef = db.collection('galletasCont').where('title', '==', kywords).orderBy(srtOrd).startAfter(paglast[page - 1]).limit(previewLim);
            } else {
                srchRef = db.collection('galletasCont').where('title', '==', kywords).orderBy(srtOrd, 'desc').startAfter(paglast[page - 1]).limit(previewLim);
            }
        }
    } else {
        if (kywords == undefined || kywords == null || kywords == "") {
            if (!desc) {
                srchRef = db.collection('galletasCont').orderBy(srtOrd).limit(previewLim);
            } else {
                srchRef = db.collection('galletasCont').orderBy(srtOrd, 'desc').limit(previewLim);
            }
        } else {
            if (!desc) {
                srchRef = db.collection('galletasCont').where('title', '==', kywords).orderBy(srtOrd).limit(previewLim);
            } else {
                srchRef = db.collection('galletasCont').where('title', '==', kywords).orderBy(srtOrd, 'desc').limit(previewLim);
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
    srchRef.get().then(snap => {
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
                badge.innerText = 'Draft';
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
                window.location.href = '../editar?file=' + doc.data().file;
            };
            drpitm0.innerHTML = 'Editar <i class="fas fa-edit"></i>';
            drpmenu.appendChild(drpitm0);
            let drpitm1 = document.createElement('button');
            drpitm1.classList.add('dropdown-item');
            drpitm1.onclick = function () {
                window.open('../vista-email/' + doc.data().file, '_blank').focus();
            };
            drpitm1.innerHTML = 'Vista correo <i class="fas fa-envelope"></i>';
            drpmenu.appendChild(drpitm1);
            let drpitm2 = document.createElement('button');
            let drpitm3 = document.createElement('button');
            let d = doc.data().created.toDate();
            if (doc.data().public) {
                drpitm2.classList.add('dropdown-item');
                drpitm2.onclick = function () {
                    let month = d.getFullYear().toString();
                    if (d.getMonth() < 9) {
                        month += '0';
                    }
                    month += (d.getMonth() + 1);
                    window.open('../galletas/' + month + '/' + doc.data().file, '_blank').focus();
                };
                drpitm2.innerHTML = 'Ver artículo <i class="fas fa-eye"></i>';
                drpmenu.appendChild(drpitm2);
                drpitm3.classList.add('dropdown-item');
                drpitm3.onclick = function () {
                    db.collection('galletasCont').doc(doc.id).update({
                        public: false
                    });
                };
                drpitm3.innerHTML = 'Volver privado <i class="fas fa-lock"></i>';
                drpmenu.appendChild(drpitm3);
            }
            drp.appendChild(drpmenu);
            col1.appendChild(drp);
            row.appendChild(col1);
            h.appendChild(row);
            card.appendChild(h);

            let a = document.createElement('a');
            a.href = '../editar?file=' + doc.data().file;
            a.classList.add('text-decoration-none');
            a.classList.add('text-dark');
            let img = document.createElement('img');
            img.src = doc.data().picUrl;
            img.classList.add('card-img-top');
            img.alt = 'No hay imagen'
            a.appendChild(img);
            let cbody = document.createElement('div');
            cbody.classList.add('card-body');
            cbody.innerHTML = '<h3 class="card-title">' + doc.data().title + '</h3>\n<p>Autor(es):' + doc.data().authors + '</p>\n<p class="card-text">' + doc.data().description + '</p>\n'
            a.appendChild(cbody);
            let f = document.createElement('div');
            f.classList.add('card-footer');
            f.classList.add('text-muted');
            f.innerHTML = '<p>Creado: ' + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + '</p>\n';
            d = doc.data().ledit.toDate();
            f.innerHTML += '<p>Acutalizado: ' + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + '</p>\n';
            if (doc.data().public) {
                d = doc.data().published.toDate();
                f.innerHTML += '<p>Publicado: ' + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + '</p>\n';
            } else {
                f.innerHTML += '<p>Sin publicar</p>\n';
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
document.getElementById('inTitle').onchange = function () {
    document.getElementById('inTitle').value = document.getElementById('inTitle').value.trim();
    if (inFileChanged) return;
    let title = document.getElementById('inTitle').value;
    title = rmDiacs(title);
    title = title.toLowerCase();
    document.getElementById('inFile').value = title.replaceAll(' ', '-');
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