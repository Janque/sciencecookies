import '../styles/edit.scss';

var store = firebase.storage();
var rtDb = firebase.database();

let docDat, docId, docRef;
let toDel = -1, toAdd = -1;
let lastSave = Date.now(), saved = false;

let addFrom = -1;
let toDelMed = -1, toAddMed = -1;
let newMedia = null;
let newMedSrc = null;

let keywords = [];

window.loaded = function loaded() {
    allCats.forEach((cat, i) => {
        let fat = document.createElement('div');
        classes(fat, "form-group col-auto");
        let div = document.createElement('div');
        classes(div, "form-check");
        let inp = document.createElement('input');
        inp.id = "cat" + i;
        classes(inp, "form-check-input");
        inp.value = cat;
        inp.setAttribute('type', 'checkbox');
        inp.onclick = function () {
            if(inp.checked==true){
                docDat.fixedCats.push(this.value);
            }else{
                docDat.fixedCats.splice(docDat.fixedCats.indexOf(this.value),1);
            }
        }
        div.appendChild(inp);
        let lab = document.createElement('label');
        lab.setAttribute('for', 'cat' + i);
        classes(lab, "form-check-label")
        lab.innerText = textCats[i];
        div.appendChild(lab);
        fat.appendChild(div);
        document.getElementById('catFrmCont').appendChild(fat);
    });
    docRef = cookiesFSRef.doc(urlSrch.get('id'));
    docRef.onSnapshot(doc => {
        docDat = doc.data();
        docId = doc.id;
        document.getElementById('inFile').value = docDat.file;
        document.getElementById('inDesc').value = docDat.description;
        allCats.forEach((cat, i) => {
            document.getElementById('cat' + i).checked = docDat.fixedCats.includes(document.getElementById('cat' + i).value);
        });
        render();
        fillMed();
        if (docDat.public) {
            document.getElementById('btnPrivate').classList.remove('d-none');
            document.getElementById('btnAprove').classList.add('d-none');
            document.getElementById('btnPub').classList.add('d-none');
        } else {
            document.getElementById('btnPrivate').classList.add('d-none');
            document.getElementById('btnAprove').classList.remove('d-none');
            document.getElementById('btnPub').classList.remove('d-none');
        }
        if (docDat.revised[lang] && docDat.revised[lang].includes(uid)) {
            document.getElementById('btnAprove').innerHTML = '<i class="fas fa-check-square"></i>';
        } else {
            document.getElementById('btnAprove').innerHTML = '<i class="far fa-check-square"></i>';
        }
        document.getElementById('btnPrevCook').href = docDat.url;
        document.getElementById('btnPrevMail').href = '../vista-email/' + docDat.file;
    }, err => { console.log(err) });

    fillTrans();
    function translateFrm() {
        let translate = firebase.app().functions('us-east1').httpsCallable('translations-translateFullCookie');
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
        runprog('barTranslate', 0, 90);
        let transRes = translateFrm();
        if (transRes) {
            setprog('barTranslate', 100);
            $('#mdlTranslate').modal('hide');
            document.getElementById('btnCnfTranslate').classList.remove("disabled");
            document.getElementById('btnCanTranslate0').classList.remove("disabled");
            document.getElementById('btnCanTranslate1').classList.remove("disabled");
            hideEl(document.getElementById('barTranslateCont'))
        } else {
            if (lang = "es") {
                alertTop("<strong>¡Ha ocurrido un error!</strong>", 0);
            } else if (lang = "en") {
                alertTop("<strong>¡There has been an error!</strong>", 0);
            }
            console.log('err');
        }
    });

    function fileFrm() {
        let file = document.getElementById('inFile').value;
        docRef.get().then(snap => {
            if (!snap.empty && file != docDat.file) {
                if (lang = "es") {
                    alertTop("Ese nombre de archivo ya esta en uso.", 0, 'alrtPlusContainer');
                } else if (lang = "en") {
                    alertTop("That file name is already in use.", 0, 'alrtPlusContainer');
                }
            } else {
                docDat.description = document.getElementById('inDesc').value.trim();
                docDat.file = file;
                normSave();
            }
        }).then(() => { console.log('exito') }).catch(err => console.log(err));
    }
    document.getElementById("frmFile").addEventListener("submit", function (event) {
        event.preventDefault();
        fileFrm();
    });

    function addMed(atempt) {
        let ref = store.ref('cookieMedia/' + docId + '/i' + atempt + newMedia.name);
        ref.getDownloadURL().then(res => {
            addMed(atempt + 1);
        }).catch(err => {
            if (err.code == 'storage/object-not-found') {
                ref.put(newMedia).on('state_changed',
                    function progress(snap) {
                        setprog('barNewMed', (snap.bytesTransferred / snap.totalBytes) * 100);
                    },
                    function error(err) {
                        if (lang = "es") {
                            alertTop("<strong>¡Ha ocurrido un error!</strong> " + err.code, 0);
                        } else if (lang = "en") {
                            alertTop("<strong>¡There has been an error!</strong> " + err.code, 0);
                        }
                        console.log(err);
                        $('#mdlAddMed').modal('hide');
                    },
                    function complete() {
                        ref.getDownloadURL().then(medUrl => {
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
            medUrl: document.getElementById('inNewMedUrl').value
        });
        normSave();
        $('#mdlAddMed').modal('hide');
        if (addFrom == 0) $('#mdlMedMan').modal('show');
        else $('#mdlMedCho').modal('show');
    }
    document.getElementById("frmAddMed").addEventListener("submit", function (event) {
        event.preventDefault();
        setprog('barNewMed', 0);
        showEl(document.getElementById("barNewMedCont"));
        hideEl(document.getElementById("frmAddMed"));
        document.getElementById("btnCnfNewMed").setAttribute('disabled', 'true');
        document.getElementById("btnCanNewMed0").setAttribute('disabled', 'true');
        document.getElementById("btnCanNewMed1").setAttribute('disabled', 'true');
        if (newMedSrc == "home") addMed(0);
        else addExtMed();
    });
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
                beenPublic: docDat.beenPublic,
                dledit: docDat.dledit,
                created: docDat.created,
                ledit: docDat.ledit,
                published: docDat.published,
                pop: docDat.pop,
                likes: docDat.likes,
                favs: docDat.favs,
                revised: docDat.revised,
                translations: docDat.translations,
                fixedCats: docDat.fixedCats.slice()
            }
            syncUpt.fixedCats.forEach(function (cat, idx) {
                syncUpt.fixedCats.splice(idx, 1, catTranslations[cat][l]);
            });
            syncUpt.translations[lang] = docDat.url;
            promises.push(db.collection('cookies/langs/' + l).doc(docId).update(syncUpt));
        }
    })
    return Promise.all(promises).then(() => {
        return docRef.update(docDat);
    });
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

function plusSect(type) {
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
    bar.setAttribute('aria-valuenow', n);
    bar.style.width = n + '%';
    bar.innerText = n + '%';
}
function runprog(bar, b, e) {
    b = Math.floor(b);
    e = Math.floor(e);
    for (let i = b; i <= e; i++) {
        setprog(bar, i);
    }
}

function removeMedia(medFileName) {
    return store.ref('cookieMedia/' + docId + '/' + medFileName).delete();
}

function fillMed() {
    document.getElementById('contMedMan').innerHTML = `<div class="col mb-4">
        <div class="card text-dark bg-light h-100 cardBorder" style="border-color: #343a40;">
            <a type="button" data-toggle="modal" data-target="#mdlAddMed" data-dismiss="modal" aria-label="Close" class="text-decoration-none text-dark h-100 d-flex align-items-center justify-content-center" onclick="addFrom=0;">
                <h1 style="font-size: 6rem;" class="mb-0"><i class="far fa-plus-square"></i></h1>
            </a>
        </div>
    </div>`;
    document.getElementById('contMedCho').innerHTML = `<div class="col mb-4">
        <div class="card text-dark bg-light h-100 cardBorder" style="border-color: #343a40;">
            <a type="button" data-toggle="modal" data-target="#mdlAddMed" data-dismiss="modal" aria-label="Close" class="text-decoration-none text-dark h-100 d-flex align-items-center justify-content-center" onclick="addFrom=1;">
                <h1 style="font-size: 6rem;" class="mb-0"><i class="far fa-plus-square"></i></h1>
            </a>
        </div>
    </div>`;

    docDat.media.forEach((itm, idx) => {
        let col0 = document.createElement('div');
        classes(col0, "col mb-4");
        let card0 = document.createElement('div');
        classes(card0, "card text-light bg-dark");
        col0.appendChild(card0);
        let img0 = document.createElement('img');
        classes(img0, "card-img");
        img0.src = itm.medUrl;
        card0.appendChild(img0);
        let over0 = document.createElement('div');
        classes(over0, "card-img-overlay pt-0");
        over0.style.paddingLeft = ".9rem";
        over0.style.paddingRight = ".9rem";
        card0.appendChild(over0);
        let btns0 = document.createElement('div');
        classes(btns0, "row mb-2 p-0");
        over0.appendChild(btns0);
        let medBtnDel = document.createElement('button');
        classes(medBtnDel, "btn btn-light btn-scckie btn-sm");
        medBtnDel.innerHTML = '<i class="fas fa-trash-alt"></i>';
        medBtnDel.onclick = function () {
            if (toDelMed == idx) {
                toDelMed = -1;
                if (document.getElementById("btnAlrtClsSsn")) document.getElementById("btnAlrtClsSsn").click();
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
                if (lang = "es") {
                    alertTop("<strong>¿Quieres eliminar esta imagen?</strong> Presiona de nuevo el botón para confirmar.", 2);
                } else if (lang = "en") {
                    alertTop("<strong>Do you want to delete this image? </strong> Press the button again to confirm.", 2);
                }
                toDelMed = idx;
                setTimeout(() => {
                    toDelMed = -1;
                }, 3000);
            }
        };
        btns0.appendChild(medBtnDel);
        let tooltip = document.createElement('div');
        classes(tooltip, "tooltipn ml-auto");
        let medBtnCopy = document.createElement('button');
        classes(medBtnCopy, "btn btn-light btn-scckie btn-sm");
        let tltipTxt = document.createElement('span');
        classes(tltipTxt, "tooltipTextn");
        tltipTxt.innerHTML = "Copiar";
        medBtnCopy.appendChild(tltipTxt);
        medBtnCopy.innerHTML += '<i class="fas fa-link"></i>';
        medBtnCopy.onclick = function () {
            /*var copyText = document.getElementById("toCopy");
            //copyText.classList.remove('d-none');
            copyText.select();
            copyText.setSelectionRange(0, 99999);
            document.execCommand("copy");
            //classes(copyText, "d-none");*/
            window.open(itm.medUrl).focus();

            tltipTxt.innerHTML = "URL copiado";
        };
        medBtnCopy.onmouseout = function () {
            tltipTxt.innerHTML = "Copiar";
        }
        tooltip.appendChild(medBtnCopy);
        btns0.appendChild(tooltip);
        let medBtnUnstar = document.createElement('button');
        let medBtnStar = document.createElement('button');
        if (itm.medUrl == docDat.picUrl) {
            classes(medBtnUnstar, "btn btn-light btn-scckie btn-sm ml-1");
            medBtnUnstar.innerHTML = '<i class="fas fa-star"></i>';
            medBtnUnstar.onclick = function () {
                docDat.picUrl = "";
                normSave();
            };
            btns0.appendChild(medBtnUnstar);
        } else {
            classes(medBtnStar, "btn btn-light btn-scckie btn-sm ml-1");
            medBtnStar.innerHTML = '<i class="far fa-star"></i>';
            medBtnStar.onclick = function () {
                docDat.picUrl = itm.medUrl;
                normSave();
            };
            btns0.appendChild(medBtnStar);
        }

        document.getElementById('contMedMan').appendChild(col0);


        let col1 = document.createElement('div');
        classes(col1, "col mb-4");
        let btnA1 = document.createElement('a');
        classes(btnA1, 'text-decoration-none');
        btnA1.setAttribute('type', 'button');
        btnA1.onclick = function () {
            if (toAddMed == -1) return;
            docDat.cont[toAddMed].medUrl = itm.medUrl;
            normSave();
        };
        btnA1.setAttribute("data-dismiss", "modal");
        col1.appendChild(btnA1);
        let card1 = document.createElement('div');
        classes(card1, "card text-light bg-dark");
        btnA1.appendChild(card1);
        let img1 = document.createElement('img');
        classes(img1, "card-img");
        img1.src = itm.medUrl;
        card1.appendChild(img1);

        document.getElementById('contMedCho').appendChild(col1);
    });
}

function render() {
    document.getElementById('cont').innerHTML = "";
    let publishDate;
    if (docDat.beenPublic) {
        publishDate = docDat.published;
    } else {
        docDat.published = publishDate = new firebase.firestore.Timestamp.now();
    }
    docDat.cont.forEach((item, idx) => {
        let sect = document.createElement('div');
        sect.id = 'sect' + idx;
        let div = document.createElement('div');
        classes(div, 'dropdown-divider mx-2')
        if (item.type != 'head') sect.appendChild(div);

        let subt = document.createElement('div');
        subt.id = "sect" + idx + "t";
        let subf = document.createElement('div');
        classes(subf, "d-none");
        subf.id = "sect" + idx + "f";

        let act = document.createElement('div');
        classes(act, 'row mb-2 px-2');
        let btnDel, btnEdit, btnCheck, btnAdd;

        if (item.type != 'head' && item.type != 'ref') {
            btnDel = document.createElement('button');
            classes(btnDel, 'btn btn-light btn-link-scckie ml-2');
            btnDel.innerHTML = '<i class="fas fa-trash-alt"></i>';
            btnDel.onclick = function () {
                if (toDel == idx) {
                    toDel = -1;
                    if (document.getElementById("btnAlrtClsSsn")) document.getElementById("btnAlrtClsSsn").click();
                    docDat.cont.splice(idx, 1);
                    render();//Important
                    normSave();
                } else {
                    if (lang = "es") {
                        alertTop("<strong>¿Quieres eliminar esta sección?</strong> Presiona de nuevo el botón para confirmar.", 2);
                    } else if (lang = "en") {
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
        if (item.type != 'ref') {
            btnEdit = document.createElement('button');
            classes(btnEdit, 'btn btn-light btn-link-scckie ml-auto');
            btnEdit.innerHTML = '<i class="fas fa-edit"></i>';
            btnEdit.onclick = function () {
                toggleEl(btnEdit);
                toggleEl(btnCheck);
                toggleEl(subf);
                if (document.getElementById('tagLstSave').innerText == "Se han guardado todos los cambios") {
                    let minutes = Math.floor((Date.now() - lastSave) / 60000);
                    if (minutes > 0) {
                        if (minutes > 59) document.getElementById('tagLstSave').innerText = "Guardado hace " + Math.floor(minutes / 60) + " horas";
                        else document.getElementById('tagLstSave').innerText = "Guardado hace " + minutes + " minutos";
                    } else document.getElementById('tagLstSave').innerText = "Guardado hace " + Math.floor((Date.now() - lastSave) / 1000) + " segundos";
                }
            }
            act.appendChild(btnEdit);
            btnCheck = document.createElement('button');
            classes(btnCheck, 'btn btn-light btn-link-scckie ml-auto d-none');
            btnCheck.innerHTML = '<i class="fas fa-check"></i>';
            btnCheck.onclick = function () {
                toggleEl(btnEdit);
                toggleEl(btnCheck);
                toggleEl(subf);
                normSave();
            }
            act.appendChild(btnCheck);
            btnAdd = document.createElement('button');
            classes(btnAdd, 'btn btn-light btn-link-scckie mx-2');
            btnAdd.innerHTML = '<i class="fas fa-plus"></i>';
            btnAdd.setAttribute('data-toggle', "modal");
            btnAdd.setAttribute('data-target', "#mdlPlusSect");
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

            let h = document.createElement('h1');
            classes(h, "text-center");
            h.innerHTML = docDat.cont[0].title;
            subt.appendChild(h);
            let pPub = document.createElement('p');
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
            pPub.innerText = publishTxt + d;
            subt.appendChild(pPub);
            if (docDat.dledit) {
                let pLEdit = document.createElement('p');
                pLEdit.innerText = lstUptTxt + ld;
                subt.appendChild(pLEdit);
            }
            let pAuth = document.createElement('p');
            pAuth.innerText = authrsTxt + docDat.cont[0].author;
            subt.appendChild(pAuth);

            let fd0 = document.createElement('div');
            classes(fd0, "row justify-content-center mb-2");
            let fc0 = document.createElement('div');
            classes(fc0, "col col-lg-6");
            let in0 = document.createElement('input');
            classes(in0, "form-control form-control-lg text-center");
            in0.setAttribute('type', 'text');
            in0.setAttribute('placeholder', docDat.cont[0].title);
            in0.value = docDat.cont[0].title;
            fc0.appendChild(in0);
            fd0.appendChild(fc0);
            subf.appendChild(fd0);
            in0.oninput = function () {
                docDat.title = docDat.cont[0].title = in0.value.trim();
                h.innerHTML = docDat.cont[0].title;
            };

            let fd1 = document.createElement('div');
            classes(fd1, "row mb-2");
            let fl1 = document.createElement('label');
            classes(fl1, "col-sm-2 col-form-label");
            fl1.innerText = publishTxt;
            let fc1 = document.createElement('div');
            classes(fc1, "col");
            let in1 = document.createElement('input');
            classes(in1, "form-control");
            in1.setAttribute('type', 'text');
            in1.setAttribute('readonly', 'true');
            in1.value = d;
            fc1.appendChild(in1);
            fd1.appendChild(fl1);
            fd1.appendChild(fc1);
            subf.appendChild(fd1);

            let fd2 = document.createElement('div');
            let fl2 = document.createElement('label');
            let fc2 = document.createElement('div');
            let in2 = document.createElement('input');
            if (docDat.dledit) {
                classes(fd2, "row mb-2");
                classes(fl2, "col-sm-2 col-form-label");
                fl2.innerText = lstUptTxt;
                classes(fc2, "col");
                classes(in2, "form-control");
                in2.setAttribute('type', 'text');
                in2.setAttribute('readonly', 'true');
                in2.value = ld;
                fc2.appendChild(in2);
                fd2.appendChild(fl2);
                fd2.appendChild(fc2);
                subf.appendChild(fd2);
            }

            let fd3 = document.createElement('div');
            classes(fd3, "row mb-2");
            let fl3 = document.createElement('label');
            classes(fl3, "col-sm-2 col-form-label");
            fl3.innerText = authrsTxt;
            let fr3 = document.createElement('div');
            classes(fr3, "form-row justify-content-around pt-2");
            let f3c0 = document.createElement('div');
            classes(f3c0, "form-group col-auto mr-2");
            let f3f0 = document.createElement('div');
            classes(f3f0, "form-check");
            f3c0.appendChild(f3f0);
            let inAu0 = document.createElement('input');
            classes(inAu0, "form-check-input");
            inAu0.setAttribute('type', 'checkbox');
            if (docDat.cont[0].author.includes(' Andrea Garma')) inAu0.setAttribute('checked', 'true');
            inAu0.value = ' Andrea Garma';
            let inAuL0 = document.createElement('label');
            classes(inAuL0, "form-check-label");
            inAu0.setAttribute('for', 'authr0');
            inAuL0.innerText = "Andrea Garma";
            f3f0.appendChild(inAu0);
            f3f0.appendChild(inAuL0);
            fr3.appendChild(f3c0);
            let f3c1 = document.createElement('div');
            classes(f3c1, "form-group col-auto mr-2");
            let f3f1 = document.createElement('div');
            classes(f3f1, "form-check");
            f3c1.appendChild(f3f1);
            let inAu1 = document.createElement('input');
            classes(inAu1, "form-check-input");
            inAu1.setAttribute('type', 'checkbox');
            if (docDat.cont[0].author.includes(' Javier Pantoja')) inAu1.setAttribute('checked', 'true');
            inAu1.value = ' Javier Pantoja';
            let inAuL1 = document.createElement('label');
            classes(inAuL1, "form-check-label");
            inAu1.setAttribute('for', 'authr1');
            inAuL1.innerText = "Javier Pantoja";
            f3f1.appendChild(inAu1);
            f3f1.appendChild(inAuL1);
            fr3.appendChild(f3c1);
            let f3c2 = document.createElement('div');
            classes(f3c2, "form-group col-auto mr-2");
            let f3f2 = document.createElement('div');
            classes(f3f2, "form-check");
            f3c2.appendChild(f3f2);
            let inAu2 = document.createElement('input');
            classes(inAu2, "form-check-input");
            inAu2.setAttribute('type', 'checkbox');
            if (docDat.cont[0].author.includes(' Paulina Vargas')) inAu2.setAttribute('checked', 'true');
            inAu2.value = ' Paulina Vargas';
            let inAuL2 = document.createElement('label');
            classes(inAuL2, "form-check-label");
            inAu2.setAttribute('for', 'authr2');
            inAuL2.innerText = "Paulina Vargas";
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
                pAuth.innerText = "Autor(es):" + docDat.cont[0].author;
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
            let h = document.createElement('h3');
            if (lang == "es") {
                h.innerHTML = '<br>Referencias';
            } else if (lang == "en") {
                h.innerHTML = '<br>References';
            }
            subt.appendChild(h);
            item.ref.forEach((ref, refIdx) => {
                let refR = document.createElement('div');
                classes(refR, "row mb-2");
                let cLink = document.createElement('div');
                classes(cLink, "col");
                refR.appendChild(cLink);
                let cLinkFrm = document.createElement('div');
                classes(cLinkFrm, "col d-none");
                refR.appendChild(cLinkFrm);
                let cBtn = document.createElement('div');
                classes(cBtn, "col-auto");
                refR.appendChild(cBtn);
                let pRef = document.createElement('p');
                cLink.appendChild(pRef);
                let aRef;

                function makeRefCite(text) {
                    pRef.innerHTML = text;
                }
                function makeRefWeb(text) {
                    pRef.innerHTML = "";
                    aRef = document.createElement('a');
                    classes(aRef, "text-warning text-break")
                    aRef.href = text;
                    aRef.setAttribute('target', '_blank');
                    aRef.setAttribute('rel', 'nofollow');
                    aRef.innerHTML = text + ' <i class="fas fa-external-link-alt"></i>'
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
                        in0.setAttribute('placeholder', 'https://google.com');
                    } else if (ref.type == 'cite') {
                        makeRefCite(ref.link);
                        in0.setAttribute('placeholder', 'Ref');
                    }
                }
                let fr0 = document.createElement('div');
                classes(fr0, "row");
                let fc0 = document.createElement('div');
                classes(fc0, "col");
                let fc1 = document.createElement('div');
                classes(fc1, "col-auto");
                let in0 = document.createElement('input');
                let in1 = document.createElement('select');
                classes(in0, "form-control");
                in0.setAttribute('type', 'text');
                in0.value = ref.link;
                if (ref.type == 'web') in0.setAttribute('placeholder', 'https://google.com');
                if (ref.type == 'cite') in0.setAttribute('placeholder', 'Ref');
                in0.onchange = function () { changeRef(); }
                classes(in1, "form-control form-control-sm");
                let inOpt0 = document.createElement('option');
                inOpt0.value = "web";
                if (ref.type == 'web') inOpt0.setAttribute('selected', 'true');
                inOpt0.innerText = 'Web';
                in1.appendChild(inOpt0);
                let inOpt1 = document.createElement('option');
                if (ref.type == 'cite') inOpt1.setAttribute('selected', 'true');
                inOpt1.value = "cite";
                inOpt1.innerText = 'Otro';
                in1.appendChild(inOpt1);
                in1.onchange = function () { changeRef(); }
                fc0.appendChild(in0);
                fc1.appendChild(in1);
                fr0.appendChild(fc0);
                fr0.appendChild(fc1);
                cLinkFrm.appendChild(fr0);

                function toggleRef() {
                    toggleEl(cLink);
                    toggleEl(cLinkFrm);
                    toggleEl(rBtnEdit);
                    toggleEl(rBtnCheck);
                }
                let rBtnEdit, rBtnCheck;
                rBtnEdit = document.createElement('button');
                classes(rBtnEdit, 'btn btn-light btn-link-scckie ml-auto');
                rBtnEdit.innerHTML = '<i class="fas fa-edit"></i>';
                rBtnEdit.onclick = function () {
                    toggleRef();
                    if (document.getElementById('tagLstSave').innerText == "Se han guardado todos los cambios") {
                        document.getElementById('tagLstSave').innerText = "Guardado hace " + Math.floor((Date.now() - lastSave) / 60000) + " minutos";
                    }
                };
                rBtnCheck = document.createElement('button');
                classes(rBtnCheck, 'btn btn-light btn-link-scckie ml-auto d-none');
                rBtnCheck.innerHTML = '<i class="fas fa-check"></i>';
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
                let rBtnDel = document.createElement('button');
                classes(rBtnDel, 'btn btn-light btn-link-scckie ml-2');
                rBtnDel.innerHTML = '<i class="fas fa-trash-alt"></i>';
                rBtnDel.onclick = function () {
                    docDat.cont[idx].ref.splice(refIdx, 1);
                    normSave();
                };
                cBtn.appendChild(rBtnDel);

                subt.appendChild(refR);

                if (ref.link == "") {
                    rBtnEdit.click();
                }
            });
            let btnPlusRef0 = document.createElement('a');
            classes(btnPlusRef0, "btn btn-light btn-scckie");
            btnPlusRef0.onclick = function () { plusRef(); };
            btnPlusRef0.innerHTML = '<i class="fas fa-plus"></i>'
            h.appendChild(btnPlusRef0);
            let btnPlusRef1 = document.createElement('a');
            classes(btnPlusRef1, "btn btn-light btn-scckie btn-lg btn-block border border-light");
            btnPlusRef1.onclick = function () { plusRef(); };
            btnPlusRef1.innerHTML = '<i class="fas fa-plus"></i>'
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
                if (Number(item.title) == 2) subt.innerHTML = '<br>';
                h = document.createElement('h' + item.title)
                h.innerHTML = item.titleTxt;
                subt.appendChild(h);
            }
            let p = document.createElement('p');
            p.innerHTML = item.text;
            subt.appendChild(p);

            let fr0 = document.createElement('div');
            classes(fr0, "row");
            let fc0 = document.createElement('div');
            classes(fc0, "col");
            let fc1 = document.createElement('div');
            classes(fc1, "col-auto");
            let in0 = document.createElement('input');
            let in1 = document.createElement('select');
            classes(in0, "form-control");
            in0.setAttribute('type', 'text');
            if (Number(item.title) > 0) {
                in0.value = item.titleTxt;
                in0.setAttribute('placeholder', 'Subtítulo');
                in0.removeAttribute('readonly');
            } else {
                in0.value = "";
                in0.setAttribute('placeholder', '');
                in0.setAttribute('readonly', 'true');
            }
            in0.oninput = function () {
                docDat.cont[idx].titleTxt = h.innerHTML = in0.value;
            }
            classes(in1, "form-control form-control-sm");
            for (let i = 0; i < 7; i++) {
                let inOpt = document.createElement('option');
                inOpt.value = i;
                if (item.title == i) inOpt.setAttribute('selected', 'true');
                inOpt.innerText = i;
                in1.appendChild(inOpt);
            }
            in1.oninput = function () {
                docDat.cont[idx].title = in1.value;
                if (Number(in1.value) > 0) {
                    in0.setAttribute('placeholder', 'Subtítulo');
                    in0.removeAttribute('readonly');
                    if (Number(item.title) == 2) subt.innerHTML = '<br>';
                    else subt.innerHTML = "";
                    h = document.createElement('h' + item.title)
                    h.innerHTML = docDat.cont[idx].titleTxt = in0.value;
                    subt.appendChild(h);
                    subt.appendChild(p);
                } else {
                    in0.value = "";
                    in0.setAttribute('placeholder', '');
                    in0.setAttribute('readonly', 'true');
                    docDat.cont[idx].titleTxt = in0.value;
                    subt.innerHTML = "";
                    subt.appendChild(p);
                }
            }
            fc0.appendChild(in0);
            fc1.appendChild(in1);
            fr0.appendChild(fc0);
            fr0.appendChild(fc1);
            subf.appendChild(fr0);

            let fr1 = document.createElement('div');
            classes(fr0, "row mb-2");
            let f1c0 = document.createElement('div');
            classes(fc0, "col");
            let in2 = document.createElement('textarea');
            classes(in2, "form-control");
            in2.setAttribute('rows', '8');
            in2.value = item.text;
            in2.oninput = function () {
                docDat.cont[idx].text = p.innerHTML = in2.value.trim();
            };
            f1c0.appendChild(in2);
            fr1.appendChild(f1c0);
            subf.appendChild(fr1);

            if (Number(item.title) > 0 && item.titleTxt == "") {
                btnEdit.click();
            }
        } else if (item.type == 'html') {
            let html = document.createElement('div');
            html.innerHTML = item.html;
            subt.appendChild(html);

            let fr0 = document.createElement('div');
            classes(fr0, "row mb-2");
            let fc0 = document.createElement('div');
            classes(fc0, "col");
            let in0 = document.createElement('textarea');
            classes(in0, "form-control");
            in0.setAttribute('rows', '8');
            in0.value = item.html;
            in0.onchange = function () {
                docDat.cont[idx].html = html.innerHTML = in0.value.trim();
            };
            fc0.appendChild(in0);
            fr0.appendChild(fc0);
            subf.appendChild(fr0);

            if (item.html == "") {
                btnEdit.click();
            }
        } else if (item.type == 'youtube') {
            let yt = document.createElement('div');
            classes(yt, "embed-responsive embed-responsive-" + item.ratio);
            let iframe = document.createElement('iframe');
            iframe.src = item.vidUrl;
            iframe.setAttribute('frameborder', "0");
            iframe.setAttribute('allow', "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
            iframe.setAttribute('allowfullscreen', "true");
            yt.appendChild(iframe);
            subt.appendChild(yt);

            let fr0 = document.createElement('div');
            classes(fr0, "row");
            let fc0 = document.createElement('div');
            classes(fc0, "col");
            let fc1 = document.createElement('div');
            classes(fc1, "col-auto");
            let in0L = document.createElement('label');
            in0L.innerText = "URL";
            let in0 = document.createElement('input');
            classes(in0, "form-control");
            in0.setAttribute('type', 'text');
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
            let help0 = document.createElement('small');
            classes(help0, "text-muted");
            help0.innerText = "aaaaaaaaaaa o https://youtu.be/aaaaaaaaaaa o https://www.youtube.com/watch?v=aaaaaaaaaaa";
            let in1L = document.createElement('label');
            in1L.innerText = "Ratio";
            let in1 = document.createElement('select');
            classes(in1, "form-control form-control-sm");
            let ratios = ['21by9', '16by9', '4by3', '1by1'];
            for (let i = 0; i < 4; i++) {
                let inOpt = document.createElement('option');
                inOpt.value = ratios[i];
                if (item.ratio == ratios[i]) inOpt.setAttribute('selected', 'true');
                inOpt.innerText = ratios[i].replaceAll('by', ':');
                in1.appendChild(inOpt);
            }
            in1.oninput = function () {
                docDat.cont[idx].ratio = in1.value;
                ratios.forEach(rat => {
                    yt.classList.remove('embed-responsive-' + rat);
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
            let fig = document.createElement('figure');
            classes(fig, "mx-auto");
            fig.style.width = item.width;
            fig.style.position = "relative";
            fig.style.borderRadius = ".25rem";
            let img0 = document.createElement('img');
            img0.setAttribute('alt', item.alt);
            img0.src = item.medUrl;
            classes(img0, "w-100");
            fig.appendChild(img0);
            let over0 = document.createElement('div');
            classes(over0, "card-img-overlay pt-0");
            over0.style.paddingLeft = ".9rem";
            over0.style.paddingRight = ".9rem";
            let btns0 = document.createElement('div');
            classes(btns0, "row mb-2 p-0");
            over0.appendChild(btns0);
            let btnChange = document.createElement('button');
            classes(btnChange, "btn btn-light btn-scckie btn-sm ml-auto");
            btnChange.innerHTML = '<i class="fas fa-exchange-alt"></i>';
            btnChange.setAttribute('data-toggle', "modal")
            btnChange.setAttribute('data-target', "#mdlMedCho")
            btnChange.onclick = function () {
                toAddMed = idx;
            };
            btns0.appendChild(btnChange);
            fig.appendChild(over0);
            let capt = document.createElement('figcaption');
            capt.style.fontSize = "70%";
            capt.style.fontWeight = "lighter";
            capt.innerHTML = item.caption;
            if (item.hasCapt) {
                fig.appendChild(capt);
            }
            subt.appendChild(fig);

            let rcont = document.createElement('div');
            classes(rcont, "form-group mb-2");
            let rnL = document.createElement('label');
            rnL.innerText = "Tamaño";
            let ranR = document.createElement('div');
            classes(ranR, "row");
            let ranRC0 = document.createElement('div');
            classes(ranRC0, "col align-center d-flex pr-0");
            let in3 = document.createElement('input');
            in3.setAttribute('type', 'range');
            in3.setAttribute('max', '100');
            in3.setAttribute('min', '0');
            in3.setAttribute('step', '1');
            in3.value = '75';
            classes(in3, "form-control-range");
            in3.oninput = function () {
                valL.innerHTML = in3.value + '%';
                fig.style.width = docDat.cont[idx].width = in3.value + '%';
            }
            ranRC0.appendChild(in3);
            let valL = document.createElement('span');
            classes(valL, "badge badge-primary range-value-L");
            valL.innerText = '75%';
            let ranRC1 = document.createElement('div');
            classes(ranRC1, "col-auto");
            ranRC1.appendChild(valL);
            ranR.appendChild(ranRC0);
            ranR.appendChild(ranRC1);
            rcont.appendChild(rnL);
            rcont.appendChild(ranR);
            subf.appendChild(rcont);
            let fr0 = document.createElement('div');
            classes(fr0, "row");
            let fc0 = document.createElement('div');
            classes(fc0, "col");
            let fc1 = document.createElement('div');
            classes(fc1, "col-auto");
            let in0L = document.createElement('label');
            in0L.innerText = "Pie de foto";
            let in0 = document.createElement('input');
            classes(in0, "form-control");
            in0.setAttribute('type', 'text');
            in0.value = item.caption;
            in0.oninput = function () {
                capt.innerHTML = docDat.cont[idx].caption = in0.value.trim();
            }
            let in1 = document.createElement('select');
            classes(in1, "form-control form-control-sm");
            let inOpt0 = document.createElement('option');
            inOpt0.value = "true";
            if (item.hasCapt == "true") inOpt0.setAttribute('selected', 'true');
            inOpt0.innerText = "Sí";
            in1.appendChild(inOpt0);
            let inOpt1 = document.createElement('option');
            inOpt1.value = "false";
            if (item.hasCapt == "false") inOpt1.setAttribute('selected', 'true');
            inOpt1.innerText = "No";
            in1.appendChild(inOpt1);
            in1.oninput = function () {
                docDat.cont[idx].hasCapt = in1.value;
                if (in1.value == "true") {
                    capt.innerHTML = in0.value = docDat.cont[idx].caption;
                    in0.removeAttribute('readonly');
                    fig.appendChild(capt);
                } else {
                    in0.value = docDat.cont[idx].caption = "";
                    in0.setAttribute('readonly', 'true');
                    capt.innerHTML = "";
                    fig.innerHTML = "";
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

            let fr1 = document.createElement('div');
            classes(fr1, "row");
            let f1c0 = document.createElement('div');
            classes(f1c0, "col");
            let in2L = document.createElement('label');
            in2L.innerText = "Alt";
            let in2 = document.createElement('input');
            classes(in2, "form-control");
            in2.setAttribute('type', 'text');
            in2.value = item.alt;
            in2.oninput = function () {
                docDat.cont[idx].alt = in2.value.trim();
                img0.setAttribute('alt', in2.value.trim());
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
        document.getElementById('cont').appendChild(sect);
    });
    document.getElementById('inJava').innerText = docDat.java;
    document.getElementById('javaIns').innerHTML = docDat.java;
}

document.getElementById('inFile').oninput = function () {
    document.getElementById('inFile').value = ultraClean(document.getElementById('inFile').value, '-');
}

document.getElementById('inJava').onchange = function () {
    docDat.java = document.getElementById('javaIns').innerHTML = document.getElementById('inJava').value;
}
document.getElementById('btnEditJs').onclick = function () {
    toggleEl(document.getElementById('btnEditJs'));
    toggleEl(document.getElementById('btnCheckJs'));
    document.getElementById('inJava').removeAttribute('readonly');
};
document.getElementById('btnCheckJs').onclick = function () {
    toggleEl(document.getElementById('btnEditJs'));
    toggleEl(document.getElementById('btnCheckJs'));
    document.getElementById('inJava').setAttribute('readonly', 'true');
    normSave();
};

function fillTrans() {
    langs.forEach(l => {
        if (l != lang) {
            let opt = document.createElement('option');
            opt.value = opt.innerText = l;
            document.getElementById('inTransFrom').appendChild(opt);
        }
    })
}

$('#mdlAddMed').on('hidden.bs.modal', e => {
    document.getElementById("prevNewMed").src = '';
    document.getElementById('inNewMedL').innerHTML = 'Elige una imagen';
    document.getElementById('inNewMedUrl').value = "";
    document.getElementById('inNewMed').removeAttribute('required');
    document.getElementById('inNewMedUrl').removeAttribute('required');
    hideEl(document.getElementById("barNewMedCont"));
    hideEl(document.getElementById("inNewMedFileCont"));
    hideEl(document.getElementById("inNewMedUrlCont"));
    showEl(document.getElementById("frmAddMed"));
    document.getElementById("btnCnfNewMed").removeAttribute('disabled');
    document.getElementById("btnCanNewMed0").removeAttribute('disabled');
    document.getElementById("btnCanNewMed1").removeAttribute('disabled');
})
document.getElementById('inNewMed').addEventListener('change', e => {
    newMedia = e.target.files[0];
    function prevMed() {
        var read = new FileReader();
        read.readAsDataURL(newMedia);
        read.onload = function (e2) {
            document.getElementById("prevNewMed").src = e2.target.result;
        };
    };
    newMedia.name = ultraClean(newMedia.name, '');
    document.getElementById('inNewMedL').innerHTML = newMedia.name;
    prevMed(newMedia);
});
document.getElementById('inNewMedUrl').onchange = function () {
    document.getElementById("prevNewMed").src = document.getElementById('inNewMedUrl').value;
};
document.getElementById('inMedSrc0').onclick = function () {
    newMedSrc = "home";
    document.getElementById('inNewMed').setAttribute('required', 'true');
    document.getElementById('inNewMedUrl').removeAttribute('required');
    showEl(document.getElementById("inNewMedFileCont"));
    hideEl(document.getElementById("inNewMedUrlCont"));
}
document.getElementById('inMedSrc1').onclick = function () {
    newMedSrc = "out";
    document.getElementById('inNewMed').removeAttribute('required');
    document.getElementById('inNewMedUrl').setAttribute('required', 'true');
    hideEl(document.getElementById("inNewMedFileCont"));
    showEl(document.getElementById("inNewMedUrlCont"));
}

document.getElementById('inSendUpt').onclick = function () {
    if (document.getElementById('inSendUpt').checked) {
        showEl(document.getElementById('uptDescCont'));
        document.getElementById('inUptDesc').setAttribute('required', 'true');
    } else {
        hideEl(document.getElementById('uptDescCont'));
        document.getElementById('inUptDesc').removeAttribute('required');
    }
}

document.getElementById('btnPrevCook').onclick = function () {
    docDat.timePrev = new firebase.firestore.Timestamp.fromMillis((new Date(Date.now())).getTime() + 900000);
    normSave();
};
document.getElementById('btnPrevMail').onclick = function () {
    docDat.timePrev = new firebase.firestore.Timestamp.fromMillis((new Date(Date.now())).getTime() + 900000);
    normSave();
};

document.getElementById('btnPrivate').onclick = function () {
    docDat.public = false;
    normSave();
};

document.getElementById('btnAprove').onclick = function () {
    if (docDat.revised[lang] && docDat.revised[lang].includes(uid)) {
        docDat.revised[lang].splice(docDat.revised[lang].indexOf(uid), 1);
        document.getElementById('btnAprove').innerHTML = '<i class="far fa-check-square"></i>';
    } else {
        if (!docDat.revised[lang]) docDat.revised[lang] = [];
        docDat.revised[lang].push(uid);
        document.getElementById('btnAprove').innerHTML = '<i class="fas fa-check-square"></i>';
    }
    normSave();
};

$('#mdlAddMed').on('hiden.bs.modal', e => {
    document.getElementById('inMedSrc0').setAttribute('checked', 'false');
    document.getElementById('inMedSrc1').setAttribute('checked', 'false');
    document.getElementById('inNewMed').removeAttribute('required');
    document.getElementById('inNewMedUrl').removeAttribute('required');
    hideEl(document.getElementById("inNewMedFileCont"));
    hideEl(document.getElementById("inNewMedUrlCont"));
});

$('#mdlPublish').on('show.bs.modal', e => {
    let revLangs = 0;
    langs.forEach(l => {
        let rev = docDat.revised[l] ? docDat.revised[l].length : 0;
        if (docDat.revised[l] && !docDat.revised[l].includes(uid)) rev++;
        if (rev >= 2) revLangs++;
    });
    if (revLangs == langs.length) {
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
    setprog('barPublish', 100);
    classes(document.getElementById('barPublish'), 'bg-success');
    if (lang = "es") {
        alertTop("Publicado correctamente", 1);
    } else if (lang = "en") {
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

document.getElementById('btnCnfPublish').onclick = function () {
    if (docDat.public) return;
    setprog('barPublish', 0);
    showEl(document.getElementById("barPublishCont"));

    docDat.public = true;
    docDat.ledit = new firebase.firestore.Timestamp.now();
    docDat.beenPublic = true;
    docDat.revised = {};
    setprog('barPublish', 31);

    if (!docDat.beenPublic) {
        docDat.notify = true;
        docDat.published = new firebase.firestore.Timestamp.now();
        setprog('barPublish', 62);
    } else {
        if (document.getElementById('inSendUpt').checked) {
            docDat.dledit = true;
            docDat.notify = true;
        } else {
            docDat.dledit = false;
            docDat.notify = false;
        }
        setprog('barPublish', 45);
        if (document.getElementById('inSendUpt').checked) {
            docDat.uptMsg = true;
            docDat.uptDescrip = document.getElementById('inUptDesc').value.trim();
        } else {
            docDat.uptMsg = false;
            docDat.uptDescrip = "";
        }
        setprog('barPublish', 62);
    }

    saveDoc().then(() => {
        rtDb.ref('galletas/' + docId).set({
            pop: docDat.pop,
            likes: docDat.likes,
            favs: docDat.favs
        }, err => {
            if (err) {
                console.log("Data could not be saved." + err);
            } else {
                setprog('barPublish', 84);
                finishPub();
            }
        });
    }).catch(err => {
        if (lang = "es") {
            alertTop("<strong>¡Ha ocurrido un error!</strong> " + err.code, 0);
        } else if (lang = "en") {
            alertTop("<strong>¡There has been an error!</strong> " + err.code, 0);
        }
        console.log(err);
    });
};