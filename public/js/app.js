const catnmb=5,allCats=['astronomia','biologia','curiosidades','fisica','tecnologia'];
const previewLim=20;

//Get search params
var urlSrch,cats=[],kywords,srtOrd,desc,srchRef;
var nxtp=false,paglast=[null],page=1;
var allChk=false;
function initSrch(stAf){
    cats=allCats.slice();
    kywrds=[''];
    if(urlSrch.get('c')!=null){
        cats=urlSrch.get('c').split('+');
        cats=cats[0].split(' ');
    }
    if(urlSrch.get('k')!=null){
        kywrds=urlSrch.get('k').split('+');
        document.getElementById('srcBox').value=urlSrch.get('k').replace('+',' ');
    };
    kywords=cats.concat(kywrds);
    kywords.forEach(function(itm,idx){
        let str=itm.toLowerCase();
        str=rmDiacs(str);
        kywords.splice(idx,1,str);
    });
    let all=true;
    for(let i=0;i<catnmb;i++){
        if(kywords.indexOf(document.getElementById('cat'+i).value)!=-1){
            document.getElementById('cat'+i).checked=true;
        }else all=false;
    }
    if(all){
        allChk=true;
        document.getElementById('catA').checked=true;
    }
    document.getElementById("inSrchOrd1").selected=false;
    document.getElementById("inSrchOrd2").selected=false;
    document.getElementById("inSrchOrd3").selected=false;
    srtOrd=urlSrch.get('o');
    if(srtOrd!=null){
        if(srtOrd=='new'){
            srtOrd='date';
            desc=true;
            document.getElementById("inSrchOrd1").selected=true;
        }
        if(srtOrd=='old'){
            srtOrd='date';
            desc=false;
            document.getElementById("inSrchOrd2").selected=true;
        }
        if(srtOrd=='pop'){
            desc=true;
            document.getElementById("inSrchOrd3").selected=true;
        }
    }else{
        srtOrd='date';
        desc=true;
    }
    if(page>1&&stAf&&paglast[page-1]!=null&&paglast[page-1]!=undefined){
        if(!desc){
            srchRef=db.collection('galletas').where('cats','array-contains-any',kywords).orderBy(srtOrd).startAfter(paglast[page-1]).limit(previewLim);
        }else{
            srchRef=db.collection('galletas').where('cats','array-contains-any',kywords).orderBy(srtOrd,'desc').startAfter(paglast[page-1]).limit(previewLim);
        }
    }else{
        if(!desc){
            srchRef=db.collection('galletas').where('cats','array-contains-any',kywords).orderBy(srtOrd).limit(previewLim);
        }else{
            srchRef=db.collection('galletas').where('cats','array-contains-any',kywords).orderBy(srtOrd,'desc').limit(previewLim);
        }
    }
    shwSrch();
    const promises=[];
    let notSrchd=[],allP=null;
    for(let i=0;i<kywords.length;i++){
        itm=kywords[i];
        if(itm==''||itm==' ')continue;
        const p=firebase.database().ref('searchQs/'+itm).transaction(search=>{
            if(search){
                notSrchd.splice(notSrchd.indexOf(itm),1);
                search.count++;
            }else{
                notSrchd.push(itm);
            }
            return search;
        });
        promises.push(p);
    }
    allP=Promise.all(promises);
    allP.then(()=>{
        notSrchd.forEach((itm)=>{
            firebase.database().ref('searchQs/'+itm).set({
                count:1
            });
        })
    }).catch(err=>{console.log('err')});
}
function shwSrch(){
    for(let i=0;i<20;i++){
        document.getElementById('med'+i).classList.add('d-none');
        if(i!=0)document.getElementById('div'+i).classList.add('d-none');
        document.getElementById('med'+i).href='';
        document.getElementById('med'+i+'img').classList.remove('d-none');
        document.getElementById('med'+i+'img').src='';
        document.getElementById('med'+i+'t').innerHTML='';
    }
    srchRef.get().then(snap=>{
        let docs=snap.docs;
        nxtp=false;
        let idx=0;
        if(docs.length<1){
            document.getElementById('med'+idx+'img').classList.add('d-none');
            document.getElementById('med'+idx+'t').innerHTML='<h5 class="mt-0 text-center">No se han encontrado resultados</h5>';
            document.getElementById('med'+idx).classList.remove('d-none');
        }
        docs.forEach(function(doc){
            document.getElementById('med'+idx).href='galletas/'+doc.data().url;
            document.getElementById('med'+idx+'img').src=doc.data().picUrl;
            let d=doc.data().date.toDate();
            document.getElementById('med'+idx+'t').innerHTML='                                <h5 class="mt-0">'+doc.data().title+'</h5>                                        <p>'+doc.data().descrip+'</p>                                                   <p class="mb-0">'+d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' Autor(es):'+doc.data().authrs+'</p>';
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
            document.getElementById('med'+idx).classList.remove('d-none');
            if(idx!=0)document.getElementById('div'+idx).classList.remove('d-none');
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
    }).catch(err=>{console.log('Error')});
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

//Submit search
document.getElementById('catA').onclick=function(){
    if(!allChk){
        for(let i=0;i<catnmb;i++){
            document.getElementById('cat'+i).checked=true;
        }
    }else{
        for(let i=0;i<catnmb;i++){
            document.getElementById('cat'+i).checked=false;
        }
    }
    allChk=!allChk;
};
for(let i=0;i<catnmb;i++){
    document.getElementById('cat'+i).onclick=function(){
        if(allChk){
            document.getElementById('catA').checked=false;
            allChk=false;
        }
        else{
            let all=true;
            for(let i=0;i<catnmb;i++){
                if(document.getElementById('cat'+i).checked==false){
                    all=false;
                    break;
                }
            }
            if(all){
                allChk=true;
                document.getElementById('catA').checked=true;
            }
        }
    };
}

function loaded(){
    initSrch(false);
    function send(){
        let srchStr='?c=';
        if(document.getElementById('cat0').checked)srchStr=srchStr+document.getElementById('cat0').value;
        for(let i=1;i<catnmb;i++){
            if(document.getElementById('cat'+i).checked){
                srchStr=srchStr+'+'+document.getElementById('cat'+i).value;
            }
        }
        srchStr=srchStr+'&k=';
        let wordArr=document.getElementById('srcBox').value.split(' ');
        srchStr=srchStr+wordArr[0];
        for(let i=1;i<wordArr.length;i++){
            srchStr=srchStr+'+'+wordArr[i];
        }
        srchStr=srchStr+'&o='+document.getElementById('inOrd').value;
        window.location.href=srchStr;
    }
    document.getElementById("frmSrch").addEventListener("submit",function(event){
        event.preventDefault();
        send();
    });
}