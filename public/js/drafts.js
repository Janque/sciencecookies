function loaded(){
    initSrch(false);
    function send(){
        let srchStr='?k=';
        let wordArr=document.getElementById('srcBox').value.split(' ');
        srchStr=srchStr+wordArr[0];
        for(let i=1;i<wordArr.length;i++){
            srchStr=srchStr+'+'+wordArr[i];
        }
        srchStr=srchStr+'&o='+document.getElementById('inOrd').value;
        srchStr=srchStr+'&d='+document.getElementById('inDir').value;
        window.location.href=srchStr;
    }
    document.getElementById("frmSrch").addEventListener("submit",function(event){
        event.preventDefault();
        send();
    });
}

const previewLim=21;
//Get search params
var urlSrch,kywords,srtOrd,desc,srchRef;
var nxtp=false,paglast=[null],page=1;
var allChk=false;
function initSrch(stAf){
    kywrds="";
    if(urlSrch.get('k')!=null){
        kywrds=urlSrch.get('k').replace('+',' ');
        document.getElementById('srcBox').value=kywords;
    };
    document.getElementById("inSrchOrd0").selected=false;
    document.getElementById("inSrchOrd1").selected=false;
    document.getElementById("inSrchOrd2").selected=false;
    document.getElementById("inSrchOrd3").selected=false;
    srtOrd=urlSrch.get('o');
    switch (srtOrd){
        case 'created':
            document.getElementById("inSrchOrd0").selected=true;
            break;
        case 'published':
            document.getElementById("inSrchOrd1").selected=true;
            break;
        case 'ledit':
            document.getElementById("inSrchOrd2").selected=true;
            break;
        case 'pop':
            document.getElementById("inSrchOrd3").selected=true;
            break;
        default:
            srtOrd='created';
            break;
    }
    document.getElementById("inSrchDir0").selected=false;
    document.getElementById("inSrchDir1").selected=false;
    desc=urlSrch.get('d');
    if(desc=='asc'){
        desc=false;
        document.getElementById("inSrchDir1").selected=true;
    }else{
        desc=true;
        document.getElementById("inSrchDir0").selected=true;
    }
    if(page>1&&stAf&&paglast[page-1]!=null&&paglast[page-1]!=undefined){
        if(kywords==undefined||kywords==null||kywords==""){
            if(!desc){
                srchRef=db.collection('drafts').orderBy(srtOrd).startAfter(paglast[page-1]).limit(previewLim);
            }else{
                srchRef=db.collection('drafts').orderBy(srtOrd,'desc').startAfter(paglast[page-1]).limit(previewLim);
            }
        }else{
            if(!desc){
                srchRef=db.collection('drafts').where('title','==',kywords).orderBy(srtOrd).startAfter(paglast[page-1]).limit(previewLim);
            }else{
                srchRef=db.collection('galletas').where('title','==',kywords).orderBy(srtOrd,'desc').startAfter(paglast[page-1]).limit(previewLim);
            }
        }
    }else{
        if(kywords==undefined||kywords==null||kywords==""){
            if(!desc){
                srchRef=db.collection('drafts').orderBy(srtOrd).limit(previewLim);
            }else{
                srchRef=db.collection('drafts').orderBy(srtOrd,'desc').limit(previewLim);
            }
        }else{
            if(!desc){
                srchRef=db.collection('galletas').where('title','==',kywords).orderBy(srtOrd).limit(previewLim);
            }else{
                srchRef=db.collection('galletas').where('title','==',kywords).orderBy(srtOrd,'desc').limit(previewLim);
            }
        }
    }
    shwSrch();
}
function shwSrch(){
    document.getElementById('crdContainer').innerHTML="";
    srchRef.get().then(snap=>{
        let docs=snap.docs;
        nxtp=false;
        let idx=0;
        if(docs.length<1){
            document.getElementById('crdContainer').innerHTML='<h5 class="mt-0 text-center">No se han encontrado resultados</h5>';
        }
        docs.forEach(function(doc){
            let col=document.createElement('col');
            col.classList.add('col');
            col.classList.add('mb-4');

            let card=document.createElement('div');
            let helpStr="card text-dark bg-light h-100 cardBorder";
            helpStr=helpStr.split(' ');
            helpStr.forEach(clas=>{
                card.classList.add(clas);
            });
            if(doc.data().owner==uid){
                card.classList.add('border-success');
            }else{
                card.classList.add('border-secondary');
            }
            
            let h=document.createElement('div');
            helpStr="card-header bg-light m-0 py-0 text-right";
            helpStr=helpStr.split(' ');
            helpStr.forEach(clas=>{
                h.classList.add(clas);
            });
            let row=document.createElement('div');
            row.classList.add('row');
            row.classList.add('justify-content-between');
            if(!doc.data().public){
                let col0=document.createElement('div');
                col0.classList.add('col-auto');
                col0.classList.add('p-0');
                let badge=document.createElement('span');
                badge.classList.add('badge');
                badge.classList.add('badge-warning');
                badge.innerText='Draft';
                col0.appendChild(badge);
                row.appendChild(col0);
            }
            let col1=document.createElement('div');
            col1.classList.add('col-auto');
            col1.classList.add('p-0');
            col1.classList.add('ml-auto');
            let drp=document.createElement('div');
            drp.classList.add('dropdown');
            let btndrp=document.createElement('button');
            btndrp.classList.add('btn');
            btndrp.classList.add('btn-light');
            btndrp.setAttribute('type','button');
            btndrp.setAttribute('data-toogle','dropdown');
            btndrp.setAttribute('aria-haspopup',"true");
            btndrp.setAttribute('aria-expanded',"false");
            btndrp.innerHTML='<i class="fas fa-ellipsis-h"></i>';
            drp.appendChild(btndrp);
            let drpmenu=document.createElement('div');
            drpmenu.classList.add('dropdown-menu');
            let drpitm0=document.createElement('a');
            drpitm0.classList.add('dropdown-item');
            drpitm0.href='../editar/'+doc.data().file;
            drpitm0.innerHTML='Editar <i class="fas fa-edit"></i>';
            drpmenu.appendChild(drpitm0);
            let drpitm1=document.createElement('a');
            drpitm1.classList.add('dropdown-item');
            drpitm1.href='../vista-previa/'+doc.data().file;
            drpitm1.innerHTML='Vista previa <i class="fas fa-eye"></i>';
            drpmenu.appendChild(drpitm1);
            let drpitm2=document.createElement('a');
            drpitm2.classList.add('dropdown-item');
            drpitm2.href='../vista-email/'+doc.data().file;
            drpitm2.innerHTML='Vista correo <i class="fas fa-eye"></i>';
            drpmenu.appendChild(drpitm2);
            drp.appendChild(drpmenu);
            col1.appendChild(drp);
            row.appendChild(col1);
            h.appendChild(row);
            card.appendChild(h);

            let a=document.createElement('a');
            a.href='../editar/'+doc.data().file;
            a.classList.add('text-decoration-none');
            a.classList.add('text-dark');
            let img=document.createElement('img');
            img.src=doc.data().picUrl;
            img.classList.add('card-img-top');
            img.alt='No hay imagen'
            a.appendChild(img);
            let cbody=document.createElement('div');
            cbody.classList.add('card-body');
            cbody.innerHTML='<h3 class="card-title">'+doc.data().title+'</h3>\n<p>Autor(es):' + doc.data().authors + '</p>\n<p class="card-text">'+doc.data().description+'</p>\n'
            a.appendChild(cbody);
            let f=document.createElement('div');
            f.classList.add('card-footer');
            f.classList.add('text-muted');
            let d = doc.data().created.toDate();
            f.innerHTML='<p>Creado: ' + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + '</p>\n';
            d = doc.data().ledit.toDate();
            f.innerHTML+= '<p>Acutalizado: ' + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + '</p>\n';
            if(doc.data().public){
                d = doc.data().published.toDate();
                f.innerHTML+= '<p>Publicado: ' + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + '</p>\n';
            }else{
                f.innerHTML+='<p>Sin publicar</p>\n';
            }
            a.appendChild(f)
            card.appendChild(a);

            col.appendChild(card);
            document.getElementById('crdContainer').appendChild(col);
            if(idx==previewLim-1){
                if(paglast[page]==undefined||paglast[page]==null){
                    paglast.push(docs[docs.length-1]);
                }else if(paglast[page]!=docs[docs.length-1]){
                    paglast.splice(page,1,docs[docs.length-1]);
                }
                nxtp=true;
                document.getElementById("pgNavT").classList.remove('d-none');
                document.getElementById("pgNavB").classList.remove('d-none');
            }
            idx++;
        });
        if(!nxtp){
            document.getElementById("pgTNxt").setAttribute('disabled','true');
            document.getElementById("pgBNxt").setAttribute('disabled','true');
        }else{
            document.getElementById("pgTNxt").removeAttribute('disabled');
            document.getElementById("pgBNxt").removeAttribute('disabled');
        }
        if(page==1){
            document.getElementById("pgTPrv").setAttribute('disabled','true');
            document.getElementById("pgBPrv").setAttribute('disabled','true');
        }else{
            document.getElementById("pgTPrv").removeAttribute('disabled');
            document.getElementById("pgBPrv").removeAttribute('disabled');
        }
    }).catch(err=>{console.log(err)});
}

document.getElementById("pgTPrv").onclick=function(){reSrch(-1);};
document.getElementById("pgBPrv").onclick=function(){reSrch(-1);};
document.getElementById("pgTNxt").onclick=function(){reSrch(1);};
document.getElementById("pgBNxt").onclick=function(){reSrch(1);};
function reSrch(np){
    if(page<1&&np==-1)return;
    if(!nxtp&&np==1)return;
    page+=np;
    document.getElementById('disPgT').innerText=page;
    document.getElementById('disPgB').innerText=page;
    initSrch(true);
    document.getElementById("cookCnt").scrollIntoView();
}