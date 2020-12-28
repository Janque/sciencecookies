let docDat, docId;

function loaded() {
    db.collection('galletasCont').where('file', '==', urlSrch.get('file')).limit(1).get().then(snap => {
        if (snap.empty) {
            window.location.href = '../404';
            return;
        }
        snap.forEach(doc => {
            docDat = doc.data();
            docId = doc.id;
            render();
            return;
        });
    }).catch(err => console.log(err));

    function mainFrm() {
        saveDoc();
    }
    document.getElementById("frm").addEventListener("submit", function (event) {
        event.preventDefault();
        mainFrm();
    });

    function fileFrm() {

    }
    document.getElementById("frmFile").addEventListener("submit", function (event) {
        event.preventDefault();
        fileFrm();
    });
}

function saveDoc() {
    //@#
    console.log('Doc saved (not really)');
}

function classes(elm, cls) {
    cls = cls.split(' ');
    cls.forEach(itm => {
        elm.classList.add(itm);
    });
}

function hideEl(elm) {
    elm.classList.add('d-none');
}
function showEl(elm) {
    elm.classList.remove('d-none');
}
function toggleEl(elm) {
    elm.classList.toggle('d-none');
}

function render() {
    document.getElementById('frm').innerHTML = "";
    let publishDate;
    if (docDat.beenPublic) {
        publishDate = docDat.published;
    } else {
        publishDate = new firebase.firestore.Timestamp.now();
    }
    docDat.cont.forEach((item, idx) => {
        let sect = document.createElement('div');
        sect.id = 'sect' + idx;
        let div = document.createElement('div');
        classes(div, 'dropdown-divider mx-2')
        sect.appendChild(div);

        let subt = document.createElement('div');
        subt.id = "sect" + idx + "t";
        let subf = document.createElement('div');
        subf.id = "sect" + idx + "f";

        let act = document.createElement('div');
        classes(act, 'row mb-2 px-2');
        let btnDel, btnEdit, btnAdd;

        if (item.type != 'head' && item.type != 'ref') {
            btnDel = document.createElement('button');
            classes(btnDel, 'btn btn-light btn-link-scckie ml-2');
            btnDel.innerHTML = '<i class="fas fa-trash-alt"></i>';
            //@#Function
            act.appendChild(btnDel);
        }
        if (item.type != 'ref') {
            btnEdit = document.createElement('button');
            classes(btnEdit, 'btn btn-light btn-link-scckie ml-auto edit');
            btnEdit.innerHTML = '<i class="fas fa-edit"></i>';
            btnEdit.setAttribute('type', 'button');
            //@#Function
            act.appendChild(btnEdit);
            btnAdd = document.createElement('button');
            classes(btnAdd, 'btn btn-light btn-link-scckie mx-2');
            btnAdd.innerHTML = '<i class="fas fa-plus"></i>';
            //@#Function
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
            pPub.innerText = "Publicado: " + d;
            subt.appendChild(pPub);
            if (docDat.dledit) {
                let pLEdit = document.createElement('p');
                pLEdit.innerText = "Ultima actualización: " + ld;
                subt.appendChild(pLEdit);
            }
            let pAuth = document.createElement('p');
            pAuth.innerText = "Autor(es):" + docDat.cont[0].author;
            subt.appendChild(pAuth);

            let fd0 = document.createElement('div');
            classes(fd0, "row justify-content-center mb-2");
            let fc0 = document.createElement('div');
            classes(fc0, "col col-lg-6");
            let in0 = document.createElement('input');
            classes(in0, "form-control form-control-lg text-center");
            in0.setAttribute('type', 'text');
            in0.setAttribute('required', 'true');
            in0.setAttribute('placeholder', docDat.cont[0].title);
            in0.value=docDat.cont[0].title;
            fc0.appendChild(in0);
            fd0.appendChild(fc0);
            subf.appendChild(fd0);
            in0.onchange = function () {
                docDat.cont[0].title = in0.value.trim();
                h.innerHTML = docDat.cont[0].title;
            };

            let fd1 = document.createElement('div');
            classes(fd1, "row mb-2");
            let fl1 = document.createElement('label');
            classes(fl1, "col-sm-2 col-form-label");
            fl1.innerText = "Publicado: ";
            let fc1 = document.createElement('div');
            classes(fc1, "col");
            let in1 = document.createElement('input');
            classes(in1, "form-control");
            in1.setAttribute('type', 'text');
            in1.setAttribute('readonly', 'true');
            in1.value=d;
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
                fl2.innerText = "Ultima actualización: ";
                classes(fc2, "col");
                classes(in2, "form-control");
                in2.setAttribute('type', 'text');
                in2.setAttribute('readonly', 'true');
                in2.value=ld;
                fc2.appendChild(in2);
                fd2.appendChild(fl2);
                fd2.appendChild(fc2);
                subf.appendChild(fd2);
            }

            let fd3 = document.createElement('div');
            classes(fd3, "row mb-2");
            let fl3 = document.createElement('label');
            classes(fl3, "col-sm-2 col-form-label");
            fl3.innerText = "Autor(es): ";
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
            inAu0.value=' Andrea Garma';
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
            inAu1.value=' Javier Pantoja';
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
            inAu2.value=' Paulina Vargas';
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
            h.innerHTML = 'Referencias';
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
                    docDat.cont[idx].ref.sort((a, b) => {
                        let linkA = a.link.toUpperCase();
                        let linkB = b.link.toUpperCase();
                        if (linkA < linkB) return -1;
                        if (linkA > linkB) return 1;
                        return 0;
                    });
                    if (in1.value == 'web') {
                        makeRefWeb(in0.value);
                        in0.setAttribute('placeholder', 'https://google.com');
                    } else if (in1.value == 'cite') {
                        makeRefCite(in0.value);
                        in0.setAttribute('placeholder', 'Referencia');
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
                in0.setAttribute('required', 'true');
                in0.setAttribute('type', 'text');
                in0.value=ref.link;
                if (ref.type == 'web') in0.setAttribute('placeholder', 'https://google.com');
                if (ref.type == 'cite') in0.setAttribute('placeholder', 'Referencia');
                in0.onchange = function () { changeRef(); }
                classes(in1, "form-control form-control-sm");
                in1.setAttribute('required', 'true');
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
                rBtnEdit.onclick = function () { toggleRef(); };
                rBtnCheck = document.createElement('button');
                classes(rBtnCheck, 'btn btn-light btn-link-scckie ml-auto d-none');
                rBtnCheck.innerHTML = '<i class="fas fa-check"></i>';
                rBtnCheck.setAttribute('type', 'submit');
                rBtnCheck.onclick = function () { toggleRef(); };
                cBtn.appendChild(rBtnEdit);
                cBtn.appendChild(rBtnCheck);
                let rBtnDel = document.createElement('button');
                classes(rBtnDel, 'btn btn-light btn-link-scckie ml-2');
                rBtnDel.innerHTML = '<i class="fas fa-trash-alt"></i>';
                rBtnDel.onclick = function () {
                    docDat.cont[idx].ref.splice(refIdx, 1);
                    render();
                };
                cBtn.appendChild(rBtnDel);

                subt.appendChild(refR);

                if(ref.link==''){
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
                    type:"web",
                    link:""
                });
                render();
            }
        } else if (item.type == 'parras') {
            //@#AQUI
            if (item.title > 0) {
                sect = '<h' + item.title + '>' + item.titleTxt + '</h' + item.title + '>\n';
            }
            sect += '<p>' + item.text + '</p>\n';
            if (item.br) {
                sect += '<br>\n';
            }
        } else if (item.type == 'html') {
            sect = item.html;
        }//Add more@#*/
        sect.appendChild(subt);
        sect.appendChild(subf);
        document.getElementById('frm').appendChild(sect);
    });
}