let docDat,docId;

function loaded() {
    db.collection('galletasCont').where('file', '==', urlSrch.get('file')).limit(1).get().then(snap => {
        if (snap.empty) {
            window.location.href = '../404';
            return;
        }
        snap.forEach(doc => {
            docDat=doc.data();
            docId=doc.id;
            render();
            return;
        });
    }).catch(err => console.log(err));
}

function classes(elm, cls) {
    cls = cls.split(' ');
    cls.forEach(itm => {
        elm.classList.add(itm);
    });
}

function render(){
    document.getElementById('frm').innerHTML = `<div class="row mb-2">
        <label class="col-sm-2 col-lg-4 col-form-label">Nombre del archivo</label>
        <div class="col">
            <input id="inFile" type="text" class="form-control" value="titulo-galleta" placeholder="titulo-galleta">
        </div>
    </div>
    <div class="row mb-2">
        <label class="col-sm-2 col-form-label">Descripción</label>
        <div class="col">
            <textarea required class="form-control" id="inDesc" rows="3"></textarea>
        </div>
    </div>
    <div class="row mb-2 justify-content-end">
        <button class="btn btn-secondary" id="btnCanFile">Revertir</button>
        <button class="btn btn-light btn-link-scckie mx-3" type="submit"><i class="fas fa-check"></i></button>
    </div>`;
    let publishDate;
    if(docDat.beenPublic){
        publishDate=docDat.published;
    }else{
        publishDate=new firebase.firestore.Timestamp.now();
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
        if (item.type != 'head' && item.type != 'ref') {
            let btnDel = document.createElement('button');
            classes(btnDel, 'btn btn-light btn-link-scckie ml-2');
            btnDel.innerHTML = '<i class="fas fa-trash-alt"></i>';
            //@#Function
            act.appendChild(btnDel);
        }
        let btnEdit = document.createElement('button');
        classes(btnEdit, 'btn btn-light btn-link-scckie ml-auto');
        btnEdit.innerHTML = '<i class="fas fa-edit"></i>';
        //@#Function
        act.appendChild(btnEdit);
        if (item.type != 'ref') {
            let btnAdd = document.createElement('button');
            classes(btnAdd, 'btn btn-light btn-link-scckie mx-2');
            btnAdd.innerHTML = '<i class="fas fa-plus"></i>';
            //@#Function
            act.appendChild(btnAdd);
        }
        sect.appendChild(act);

        switch (item.type) {
            case 'head':
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

                let fd0=document.createElement('div');
                classes(fd0,"row justify-content-center mb-2");
                let fc0=document.createElement('div');
                classes(fc0,"col col-lg-6");
                let in0=document.createElement('input');
                classes(in0,"form-control form-control-lg text-center");
                in0.setAttribute('type','text');
                in0.setAttribute('required','true');
                in0.setAttribute('placeholder',docDat.cont[0].title);
                in0.setAttribute('value','');
                fc0.appendChild(in0);
                fd0.appendChild(fc0);
                subf.appendChild(fd0);
                in0.onchange=function(){
                    docDat.cont[0].title=in0.value.trim();
                };

                let fd1=document.createElement('div');
                classes(fd1,"row mb-2");
                let fl1=document.createElement('label');
                classes(fl1,"col-sm-2 col-form-label");
                fl1.innerText="Publicado: ";
                let fc1=document.createElement('div');
                classes(fc1,"col");
                let in1=document.createElement('input');
                classes(in1,"form-control");
                in1.setAttribute('type','text');
                in1.setAttribute('readonly','true');
                in1.setAttribute('value',d);
                fc1.appendChild(in1);
                fd1.appendChild(fl1);
                fd1.appendChild(fc1);
                subf.appendChild(fd1);
                
                let fd2=document.createElement('div');
                let fl2=document.createElement('label');
                let fc2=document.createElement('div');
                let in2=document.createElement('input');
                if(docDat.dledit){
                    classes(fd2,"row mb-2");
                    classes(fl2,"col-sm-2 col-form-label");
                    fl2.innerText="Ultima actualización: ";
                    classes(fc2,"col");
                    classes(in2,"form-control");
                    in2.setAttribute('type','text');
                    in2.setAttribute('readonly','true');
                    in2.setAttribute('value',ld);
                    fc2.appendChild(in2);
                    fd2.appendChild(fl2);
                    fd2.appendChild(fc2);
                    subf.appendChild(fd2);
                }

                let fd3=document.createElement('div');
                classes(fd3,"row mb-2");
                let fl3=document.createElement('label');
                classes(fl3,"col-sm-2 col-form-label");
                fl3.innerText="Autor(es): ";
                let fr3=document.createElement('div');
                classes(fr3,"form-row justify-content-around pt-2");
                let f3c0=document.createElement('div');
                classes(f3c0,"form-group col-auto mr-2");
                let f3f0=document.createElement('div');
                classes(f3f0,"form-check");
                f3c0.appendChild(f3f0);
                let inAu0=document.createElement('input');
                classes(inAu0,"form-check-input");
                inAu0.setAttribute('type','checkbox');
                if (docDat.cont[0].author.includes(' Andrea Garma'))inAu0.setAttribute('checked','true');
                inAu0.setAttribute('value',' Andrea Garma');
                let inAuL0=document.createElement('label');
                classes(inAuL0,"form-check-label");
                inAu0.setAttribute('for','authr0');
                inAuL0.innerText="Andrea Garma";
                f3f0.appendChild(inAu0);
                f3f0.appendChild(inAuL0);
                fr3.appendChild(f3c0);
                let f3c1=document.createElement('div');
                classes(f3c1,"form-group col-auto mr-2");
                let f3f1=document.createElement('div');
                classes(f3f1,"form-check");
                f3c1.appendChild(f3f1);
                let inAu1=document.createElement('input');
                classes(inAu1,"form-check-input");
                inAu1.setAttribute('type','checkbox');
                if (docDat.cont[0].author.includes(' Javier Pantoja'))inAu1.setAttribute('checked','true');
                inAu1.setAttribute('value',' Javier Pantoja');
                let inAuL1=document.createElement('label');
                classes(inAuL1,"form-check-label");
                inAu1.setAttribute('for','authr1');
                inAuL1.innerText="Javier Pantoja";
                f3f1.appendChild(inAu1);
                f3f1.appendChild(inAuL1);
                fr3.appendChild(f3c1);
                let f3c2=document.createElement('div');
                classes(f3c2,"form-group col-auto mr-2");
                let f3f2=document.createElement('div');
                classes(f3f2,"form-check");
                f3c2.appendChild(f3f2);
                let inAu2=document.createElement('input');
                classes(inAu2,"form-check-input");
                inAu2.setAttribute('type','checkbox');
                if (docDat.cont[0].author.includes(' Paulina Vargas'))inAu2.setAttribute('checked','true');
                inAu2.setAttribute('value',' Paulina Vargas');
                let inAuL2=document.createElement('label');
                classes(inAuL2,"form-check-label");
                inAu2.setAttribute('for','authr2');
                inAuL2.innerText="Paulina Vargas";
                f3f2.appendChild(inAu2);
                f3f2.appendChild(inAuL2);
                fr3.appendChild(f3c2);
                function uptAuthors(a0,a1,a2){
                    let arr=[];
                    if(a0)arr.push(" Andrea Garma");
                    if(a1)arr.push(" Javier Pantoja");
                    if(a2)arr.push(" Paulina Vargas");
                    docDat.cont[0].author=arr.slice();
                    console.log(docDat.cont[0].author);
                }
                inAu0.onclick=function(){
                    uptAuthors(inAu0.checked,inAu1.checked,inAu2.checked);
                };
                inAu1.onclick=function(){
                    uptAuthors(inAu0.checked,inAu1.checked,inAu2.checked);
                };
                inAu2.onclick=function(){
                    uptAuthors(inAu0.checked,inAu1.checked,inAu2.checked);
                };

                fd3.appendChild(fl3);
                fd3.appendChild(fr3);
                subf.appendChild(fd3);
                break;
            case 'ref':
                //AQUI@#
                sect = '<h3>Referencias</h3>\n';
                item.ref.forEach(ref => {
                    let 
                    switch (ref.type){
                        case 'web':

                    }
                    sect += '<p><a href="' + link + '" target="_blank" class="text-warning text-break" rel="nofollow">' + link + ' <i class="fas fa-external-link-alt"></i></a></p>\n'
                });
                break;
            /*case 'parra':
                if (item.title > 0) {
                    sect = '<h' + item.title + '>' + item.titleTxt + '</h' + item.title + '>\n';
                }
                sect += '<p>' + item.text + '</p>\n';
                if (item.br) {
                    sect += '<br>\n';
                }
                break;
            case 'html':
                sect = item.html;
                break;
            //Add more@#*/
        }
        sect.appendChild(subt);
        sect.appendChild(subf);
        document.getElementById('frm').appendChild(sect);
    });
}