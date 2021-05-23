!function(){var e=firebase.storage(),t=firebase.database();let n,l,a,r,s=Date.now(),o=!1,i=null,d=null,c=null;async function u(e,t,n){let l=firebase.app().functions("us-east1").httpsCallable("translations-translateSimple");return(await l({text:e,from:t,target:n})).data}const m=["sun","mon","tue","wed","thu","fri","sat"],g=["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sabado"],b=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];function p(e,t){if("es"==t)switch(e){case 1:return"Enero";case 2:return"Febrero";case 3:return"Marzo";case 4:return"Abril";case 5:return"Mayo";case 6:return"Junio";case 7:return"Julio";case 8:return"Agosto";case 9:return"Septiembre";case 10:return"Octubre";case 11:return"Noviembre";case 12:case 0:return"Diciembre";case 13:return"Enero"}else if("en"==t)switch(e){case 1:return"January";case 2:return"February";case 3:return"March";case 4:return"April";case 5:return"May";case 6:return"June";case 7:return"July";case 8:return"August";case 9:return"September";case 10:return"October";case 11:return"November";case 12:case 0:return"December";case 13:return"January"}}let h;function v(){console.log("Saving...");const e=[];return langs.forEach((t=>{if(t!=lang){let a={published:n.published,finished:n.finished,pastDue:n.pastDue,public:n.public,sentMail:n.sentMail,revised:n.revised,translations:n.translations};a.translations[lang]=n.url,e.push(db.collection("calendars/langs/"+t).doc(l).update(a))}})),Promise.all(e).then((()=>a.update(n)))}function E(){v().then((()=>{c&&I(),o&&clearInterval(h),o=!0,h=setInterval((()=>{let e=Math.floor((Date.now()-s)/6e4);document.getElementById("tagLstSave").innerText=e<60?"Guardado hace "+e+" minutos":"Guardado hace "+Math.floor(e/60)+" horas"}),300010),document.getElementById("tagLstSave").innerText="Se han guardado los cambios",s=Date.now(),console.log("Saved!")})).catch((e=>{document.getElementById("tagLstSave").innerText="Error, no se han guardado todos los cambios: "+e.code,console.log(e)}))}function f(e,t){e=document.getElementById(e),t=Math.floor(t),e.setAttribute("aria-valuenow",t),e.style.width=t+"%",e.innerText=t+"%"}function y(e,t,n){t=Math.floor(t),n=Math.floor(n);for(let l=t;l<=n;l++)setTimeout((()=>{f(e,l)}),5)}function I(){Object.keys(n.events).forEach((e=>{hideEl(document.getElementById(e))})),document.getElementById("mdlEventInfoL").innerHTML=n.events[c].date[lang],showEl(document.getElementById(c)),enable(document.getElementById("btnPriorEve")),enable(document.getElementById("btnNextEve"))}function C(e){document.getElementById("prevMed").src=n.picUrl,e&&(document.getElementById("inMedSrc0").checked=!1,document.getElementById("inMedSrc1").checked=!1),document.getElementById("inChgImg").value="",document.getElementById("inChgImgUrl").value="",document.getElementById("inChgImg").removeAttribute("required"),document.getElementById("inChgImgUrl").removeAttribute("required"),hideEl(document.getElementById("barChgImgCont")),hideEl(document.getElementById("inChgImgFileCont")),hideEl(document.getElementById("inChgImgUrlCont")),document.getElementById("btnCnfChgImg").removeAttribute("disabled"),document.getElementById("btnCanChgImg").removeAttribute("disabled")}function B(){let e=0;return langs.forEach((t=>{let l=n.revised[t]?n.revised[t].length:0;n.revised[t]&&!n.revised[t].includes(uid)&&l++,l>=2&&e++})),e==langs.length}window.loaded=function(){function t(){n.description=document.getElementById("inDesc").value.trim(),n.descriptionShort=document.getElementById("inDescShort").value.trim(),E()}db.collection("config").doc("calTypes").get().then((e=>{r=e.data(),a=calendarsFSRef.doc(urlSrch.get("id")),calendarsFSRef.doc(urlSrch.get("id")).onSnapshot((e=>{e.exists?(n=e.data(),l=e.id,document.getElementById("title").innerHTML=n.title,document.getElementById("prevMed").src=n.picUrl,document.getElementById("inPicCapt").value=n.picCapt,document.getElementById("inPicAlt").value=n.picAlt,document.getElementById("inDesc").value=n.description,document.getElementById("inDescShort").value=n.descriptionShort,function(){document.getElementById("weeksCont").innerHTML="",n.weeks.forEach(((e,t)=>{let a=document.createElement("tr");a.style.height="10rem",document.getElementById("weeksCont").appendChild(a);for(let s=0;s<7;s++){let o=e[m[s]],i=document.createElement("td");if(classes(i,"p-0"),a.appendChild(i),o){let e=document.createElement("p");classes(e,"m-0 p-1"),e.style.fontSize="x-large",e.innerHTML="<b>"+o.date+"</b>",i.appendChild(e);let a=document.createElement("div");classes(a,"autoOverflow"),a.style.maxHeight="7rem",o.events.forEach(((e,n)=>{let l=document.createElement("button");l.setAttribute("data-toggle","modal"),l.setAttribute("data-target","#mdlEventInfo"),classes(l,"btn text-left p-1 mb-1 w-100"),l.style.backgroundColor="#c3e6cb",l.style.borderColor="#8fd19e",l.innerHTML="<small>"+e.name+"</small>",l.onclick=()=>{c=t+m[s]+n,I()},a.appendChild(l)}));let d=document.createElement("button");classes(d,"btn btn-scckie btn-block btn-sm"),d.innerHTML='<i class="fas fa-plus"></i>',d.onclick=()=>{n.events[t+m[s]+o.events.length]={date:{es:g[s]+" "+o.date+" de "+p(l%100,lang),en:b[s]+", "+p(l%100,"en")+" "+o.date},typeIdx:0,vals:{0:{label:"Título",val:"Evento sin nombre"},1:{label:"Description",val:"Sin descripción"}},name:"Evento sin nombre",description:"Sin descripción",visibilidad:r.visOpts[lang][0],horario:["Ciudad de México:","Bogotá:","Madrid:"]},o.events.push({name:"Evento sin nombre"}),E()},a.appendChild(d),i.appendChild(a)}}})),document.getElementById("eventInfoCont").innerHTML="";for(const[a,s]of Object.entries(n.events)){let o=!1;null==s.typeIdx&&(s.typeIdx=0,s.vals={0:{label:"Título",val:s.name},1:{label:"Description",val:s.description}},t(),o=!0),"object"!=typeof s.date&&(s.date={es:g[m.indexOf(a.substring(1,4))]+" "+n.weeks[parseInt(a.charAt(0))][a.substring(1,4)].date+" de "+p(l%100,lang),en:b[m.indexOf(a.substring(1,4))]+", "+p(l%100,"en")+" "+n.weeks[parseInt(a.charAt(0))][a.substring(1,4)].date},o=!0);let i=document.createElement("div");i.id=a,classes(i,"d-none overflow-auto");let d=document.createElement("div");classes(d,"modal-body"),i.appendChild(d);let h=document.createElement("div");classes(h,"d-none"),d.appendChild(h);let v=document.createElement("div");classes(v,"form-group"),h.appendChild(v);let f=document.createElement("label");"es"==lang?f.innerText="Tipo de evento":"en"==lang&&(f.innerText="Event type"),v.appendChild(f);let y=document.createElement("select");classes(y,"form-control"),y.setAttribute("multiple","true"),r[lang].forEach(((e,t)=>{let n=document.createElement("option");n.value=t,n.innerText=e.label,(!s.typeIdx&&0==t||t==s.typeIdx)&&n.setAttribute("selected","true"),y.appendChild(n)})),y.oninput=()=>{o=!0,s.typeIdx=parseInt(y.value),s.typeIdx||(s.typeIdx=0),s.vals={},e()},v.appendChild(y);let I=document.createElement("input");I.setAttribute("type","text"),I.id="inEveTitle"+a,document.createElement("textarea").id="inEveDesc"+a;let C=document.createElement("div");classes(C,"form-row"),h.insertBefore(C,v.nextSibling);let B=document.createElement("div");function e(){C.innerHTML="",r[lang][s.typeIdx].options.forEach(((e,n)=>{let l=document.createElement("div");classes(l,"col-auto form-group");let a,r=document.createElement("label");switch(r.innerText=e.label,l.appendChild(r),e.type){case"select":a=document.createElement("select"),e.options.forEach(((t,l)=>{let r=document.createElement("option");r.value=t.val,r.innerHTML=t.label,(0==l&&(!s.vals||!s.vals[n])||s.vals&&s.vals[n]&&s.vals[n].val==t.val)&&(r.selected=!0,s.vals[n]={label:t.label,val:t.val},e.valForSub==t.val?showEl(B):hideEl(B)),a.appendChild(r)}));break;case"textarea":a=document.createElement("textarea"),a.setAttribute("rows","3"),s.vals[n]&&s.vals[n].val&&(a.value=s.vals[n].val);break;default:a=document.createElement("input"),a.setAttribute("type",e.type),s.vals[n]&&s.vals[n].val&&(a.value=s.vals[n].val)}e.placeholder&&(a.placeholder=e.placeholder),classes(a,"form-control form-control-sm"),l.appendChild(a),C.appendChild(l),e.valForSub&&e.sub.forEach(((l,a)=>{let r=document.createElement("div");classes(r,"col-auto form-group");let i,d=document.createElement("label");switch(d.innerText=l.label,r.appendChild(d),l.type){case"select":i=document.createElement("select"),l.options.forEach(((e,t)=>{let l=document.createElement("option");l.value=e.val,l.innerHTML=e.label,(0==t&&(!s.vals||!s.vals[n+"-"+a])||s.vals&&s.vals[n+"-"+a]&&s.vals[n+"-"+a].val==e.val)&&(l.selected=!0,s.vals[n+"-"+a]={label:e.label,val:e.val}),i.appendChild(l)}));break;case"textarea":i=document.createElement("textarea"),i.setAttribute("rows","3"),s.vals[n+"-"+a]&&s.vals[n+"-"+a].val&&(i.value=s.vals[n+"-"+a].val);break;default:i=document.createElement("input"),i.setAttribute("type",l.type),s.vals[n+"-"+a]&&s.vals[n+"-"+a].val&&(i.value=s.vals[n+"-"+a].val)}l.placeholder&&(i.placeholder=l.placeholder),classes(i,"form-control form-control-sm"),r.appendChild(i),B.appendChild(r),i.oninput=function(){o=!0,s.vals[n+"-"+a]={},s.vals[n+"-"+a].val=i.value,"select"==e.type?s.vals[n+"-"+a].label=i.innerText:s.vals[n+"-"+a].label=l.label,t()}})),a.oninput=function(){o=!0,s.vals[n]={},s.vals[n].val=a.value,"select"==e.type?s.vals[n].label=a.innerText:s.vals[n].label=e.label,e.valForSub&&(e.valForSub==a.value?showEl(B):hideEl(B)),t()}}))}function t(){r[lang][s.typeIdx].multipleTxt?(s.description=parseInt(s.vals[0].val.charAt(0)),s.name=parseInt(s.vals[0].val.charAt(1))):s.description=s.name=0,s.description=r[lang][s.typeIdx].text[s.description],s.name=r[lang][s.typeIdx].titleTxt[s.name];for(const[e,t]of Object.entries(s.vals))s.description=s.description.replaceAll("$"+e+"L$",t.label),s.description=s.description.replaceAll("$"+e+"$",t.val),s.description=s.description.replaceAll("$g-year$",Math.floor(l/100)),s.name=s.name.replaceAll("$"+e+"L$",t.label),s.name=s.name.replaceAll("$"+e+"$",t.val),s.name=s.name.replaceAll("$g-year$",Math.floor(l/100))}classes(B,"form-row d-none"),h.insertBefore(B,C.nextSibling),e(),t();let T=document.createElement("div");classes(T,"form-group"),h.appendChild(T),T.innerHTML="<label>Visiblidad</label>";let w=document.createElement("select");w.id="inVis"+a,classes(w,"form-control"),r.visOpts[lang].forEach(((e,t)=>{let n=document.createElement("option");n.value=t,n.innerHTML=e,e==s.visibilidad&&n.setAttribute("selected","true"),w.appendChild(n)})),T.appendChild(w);let x=document.createElement("div");classes(x,"form-group"),h.appendChild(x),x.innerHTML="<label>Horario</label>";let M=document.createElement("textarea");classes(M,"form-control"),M.id="inTime"+a,M.setAttribute("rows","4"),x.appendChild(M),5==w.value?hideEl(x):showEl(x),w.oninput=()=>{o=!0,5==w.value?hideEl(x):showEl(x)},M.oninput=()=>{o=!0};let A=document.createElement("button"),k=document.createElement("div");classes(k,"row");let L=document.createElement("div");classes(L,"col-auto"),k.appendChild(L);let S=document.createElement("select");classes(S,"form-control ml-auto h-100"),S.setAttribute("name","selTransLang"),L.appendChild(S);let P=document.createElement("button");classes(P,"btn btn-scckie mx-2"),P.innerHTML='<i class="fas fa-language"></i>',P.onclick=function(){db.collection("calendars/langs/"+S.value).doc(l).get().then((async function(e){let t=e.data().events[a];if(t){s.typeIdx=t.typeIdx,s.vals=t.vals;for(let e=0;e<r[lang][s.typeIdx].options.length;e++){const t=r[lang][s.typeIdx].options[e];if("select"==t.type?s.vals[e]=t.options[r[S.value][s.typeIdx].options[e].options.map((function(e){return e.val})).indexOf(s.vals[e].val)]:(t.translatable&&(s.vals[e].val=await u(s.vals[e].val,S.value,lang)),s.vals[e].label=t.label),s.vals[0].val==s.valForSub)for(let n=0;n<r[lang][s.typeIdx].options[e].sub.length;n++){const l=r[lang][s.typeIdx].options[e].sub[n];"select"==l.type?s.vals[e+"-"+n]=t.options[r[S.value][s.typeIdx].options[e].options.map((function(e){return e.val})).indexOf(s.vals[e+"-"+n].val)]:(l.translatable&&(s.vals[e+"-"+n].val=await u(s.vals[e+"-"+n].val,S.value,lang)),s.vals[e+"-"+n].label=l.label)}}s.visibilidad=r.visOpts[lang][r.visOpts[S.value].indexOf(t.visibilidad)],s.horario=[];for(let e=0;e<t.horario.length;e++)s.horario.push(await u(t.horario[e],S.value,lang));M.innerHTML="",s.horario.forEach((e=>{M.innerHTML+=e+"\n"})),o=!0,A.click()}})).catch((e=>console.log(e)))},k.appendChild(P),h.appendChild(k);let D=document.createElement("div");d.appendChild(D);let H=document.createElement("h3");H.innerHTML=s.name,D.appendChild(H);let N=document.createElement("p");N.innerHTML=s.description,D.appendChild(N);let O=document.createElement("p");O.innerHTML="Visibilidad: "+s.visibilidad,D.appendChild(O);let F=document.createElement("p");classes(F,"mb-0"),F.innerHTML="Horario: ",D.appendChild(F);let U=document.createElement("ul");D.appendChild(U),s.horario.forEach((e=>{let t=document.createElement("li");t.innerHTML=e,U.appendChild(t)})),s.visibilidad==r.visOpts[lang][5]?(hideEl(F),hideEl(U)):(showEl(F),showEl(U));let q=document.createElement("div");classes(q,"modal-footer"),i.appendChild(q);let J=document.createElement("button");classes(J,"btn btn-danger mr-auto"),J.setAttribute("type","button"),J.innerText="Borrar",J.onclick=()=>{for(let e=Number(a.substr(4))+1;e<n.weeks[Number(a[0])][a.substr(1,3)].events.length;e++)n.events[a.substr(0,4)+(e-1)]=n.events[a.substr(0,4)+e];delete n.events[a.substr(0,4)+(n.weeks[Number(a[0])][a.substr(1,3)].events.length-1)],n.weeks[Number(a[0])][a.substr(1,3)].events.splice(Number(a.substr(4)),1),$("#mdlEventInfo").modal("hide"),c=null,E()},q.appendChild(J);let j=document.createElement("button");classes(j,"btn btn-info"),j.setAttribute("type","button"),j.innerText="Editar",j.onclick=()=>{w.value=r.visOpts[lang].indexOf(s.visibilidad),5==w.value?hideEl(x):showEl(x),M.innerHTML="",s.horario.forEach((e=>{M.innerHTML+=e+"\n"})),hideEl(D),showEl(h),showEl(A),enable(A),hideEl(j)},q.appendChild(j),classes(A,"btn btn-scckie d-none"),A.setAttribute("type","button"),disable(A),A.innerText="Guardar",A.onclick=()=>{disable(A),o&&(t(),n.weeks[Number(a[0])][a.substr(1,3)].events[a[4]].name=s.name,s.visibilidad=r.visOpts[lang][w.value],s.horario=[],M.value.trim().split("\n").forEach((e=>{""!=e&&" "!=e&&s.horario.push(e)})),E()),hideEl(h),showEl(D),hideEl(A),showEl(j)},q.appendChild(A),document.getElementById("eventInfoCont").appendChild(i)}document.getElementsByName("selTransLang").forEach((e=>{e.innerHTML=""})),langs.forEach(((e,t)=>{if(e!=lang){let n=document.createElement("option");0==t&&n.setAttribute("selected","true"),n.value=n.innerText=e,document.getElementsByName("selTransLang").forEach((e=>{e.appendChild(n.cloneNode(!0))}))}}))}(),n.public?(hideEl(document.getElementById("btnAprove")),hideEl(document.getElementById("btnPub"))):(showEl(document.getElementById("btnAprove")),n.pastDue&&showEl(document.getElementById("btnPub"))),n.revised.includes(uid)?document.getElementById("btnAprove").innerHTML='<i class="fas fa-check-square"></i>':document.getElementById("btnAprove").innerHTML='<i class="far fa-check-square"></i>',document.getElementById("btnPrevCal").href=n.url,document.getElementById("btnPrevMail").href="/vista-email-calendario/"+l,document.getElementById("btnSrcCal").href=`https://in-the-sky.org/newscal.php?month=${urlSrch.get("id").substr(5,6)}&year=${urlSrch.get("id").substr(0,4)}&maxdiff=7&country=1484&reg1=3527646&reg2=8379372&town=3530597`,document.getElementById("btnSrcCal2").href=`https://in-the-sky.org/newscal.php?month=${urlSrch.get("id").substr(5,6)}&year=${urlSrch.get("id").substr(0,4)}&maxdiff=7&country=1170&reg1=3688685&reg2=9609540&town=3688689`,document.getElementById("btnSrcCal3").href=`https://in-the-sky.org/newscal.php?month=${urlSrch.get("id").substr(5,6)}&year=${urlSrch.get("id").substr(0,4)}&maxdiff=7&country=1724&reg1=3117732&reg2=6355233&town=3117735`):window.location.href="../404"}),(e=>console.log(e)))})).catch((e=>console.log(e))),document.getElementById("frmText").addEventListener("submit",(function(e){e.preventDefault(),t()})),document.getElementById("btnFileTrans").onclick=function(){let e=document.getElementById("selFileTrans").value;db.collection("calendars/langs/"+e).doc(l).get().then((async function(l){n.picCapt=document.getElementById("inPicCapt").value=await u(l.data().picCapt,e,lang),n.picAlt=document.getElementById("inPicAlt").value=await u(l.data().picAlt,e,lang),n.description=document.getElementById("inDesc").value=await u(l.data().description,e,lang),n.descriptionShort=document.getElementById("inDescShort").value=await u(l.data().descriptionShort,e,lang),t()})).catch((e=>console.log(e)))},document.getElementById("frmTranslate").addEventListener("submit",(function(e){e.preventDefault(),classes(document.getElementById("btnCnfTranslate"),"disabled"),classes(document.getElementById("btnCanTranslate0"),"disabled"),classes(document.getElementById("btnCanTranslate1"),"disabled"),f("barTranslate",0),showEl(document.getElementById("barTranslateCont")),y("barTranslate",0,73),firebase.app().functions("us-east1").httpsCallable("translations-translateFullCalendar")({docId:l,from:document.getElementById("inTransFrom").value,target:lang}).then((e=>{y("barTranslate",73,90),e?(f("barTranslate",100),$("#mdlTranslate").modal("hide"),document.getElementById("btnCnfTranslate").classList.remove("disabled"),document.getElementById("btnCanTranslate0").classList.remove("disabled"),document.getElementById("btnCanTranslate1").classList.remove("disabled"),hideEl(document.getElementById("barTranslateCont"))):("es"==lang?alertTop("<strong>¡Ha ocurrido un error!</strong>",0):"en"==lang&&alertTop("<strong>¡There has been an error!</strong>",0),console.log("err"))}))})),document.getElementById("frmChgImg").addEventListener("submit",(function(t){t.preventDefault(),f("barChgImg",0),showEl(document.getElementById("barChgImgCont")),hideEl(document.getElementById("frmChgImg")),document.getElementById("btnCnfChgImg").setAttribute("disabled","true"),document.getElementById("btnCanChgImg").setAttribute("disabled","true"),"home"==d?function(){let t=e.ref("calendarMedia/"+l+"/pic");t.put(i).on("state_changed",(function(e){f("barChgImg",e.bytesTransferred/e.totalBytes*100)}),(function(e){"es"==lang?alertTop("<strong>¡Ha ocurrido un error!</strong> "+e.code,0):"en"==lang&&alertTop("<strong>¡There has been an error!</strong> "+e.code,0),console.log(e),$("#mdlAddMed").modal("hide")}),(function(){t.getDownloadURL().then((e=>{n.picUrl=e,E(),C(!0),hideEl(document.getElementById("frmChgImg"))})).catch((e=>{console.log(e)}))}))}():(n.picUrl=document.getElementById("inChgImgUrl").value,E(),C(!0),hideEl(document.getElementById("frmChgImg")))}))},document.getElementById("inPicCapt").oninput=()=>{n.picCapt=document.getElementById("inPicCapt").value.trim()},document.getElementById("inPicAlt").oninput=()=>{n.picAlt=document.getElementById("inPicAlt").value.trim()},document.getElementById("inDesc").oninput=()=>{n.picDesc=document.getElementById("inDesc").value.trim()},document.getElementById("inDescShort").oninput=()=>{n.picDescShort=document.getElementById("inDescShort").value.trim()},document.getElementById("btnPriorEve").onclick=()=>{let e=Object.keys(n.events).slice().sort(((e,t)=>{if(Number(e[0])==Number(t[0])){if(e.substring(1,4)==t.substring(1,4))return Number(e[4])-Number(t[4]);switch(e.substring(1,4)){case"sun":return-1;case"mon":return"sun"==t.substring(1,4)?1:-1;case"tue":return"sun"==t.substring(1,4)||"mon"==t.substring(1,4)?1:-1;case"wed":return"sun"==t.substring(1,4)||"mon"==t.substring(1,4)||"tue"==t.substring(1,4)?1:-1;case"thu":return"sun"==t.substring(1,4)||"mon"==t.substring(1,4)||"tue"==t.substring(1,4)||"wed"==t.substring(1,4)?1:-1;case"fri":return"sun"==t.substring(1,4)||"mon"==t.substring(1,4)||"tue"==t.substring(1,4)||"wed"==t.substring(1,4)||"thu"==t.substring(1,4)?1:-1;case"sat":return 1}}return Number(e[0])-Number(t[0])})),t=e.indexOf(c)-1;t>=0?(c=e[t],I()):disable(document.getElementById("btnPriorEve"))},document.getElementById("btnNextEve").onclick=()=>{let e=Object.keys(n.events).slice().sort(((e,t)=>{if(Number(e[0])==Number(t[0])){if(e.substring(1,4)==t.substring(1,4))return Number(e[4])-Number(t[4]);switch(e.substring(1,4)){case"sun":return-1;case"mon":return"sun"==t.substring(1,4)?1:-1;case"tue":return"sun"==t.substring(1,4)||"mon"==t.substring(1,4)?1:-1;case"wed":return"sun"==t.substring(1,4)||"mon"==t.substring(1,4)||"tue"==t.substring(1,4)?1:-1;case"thu":return"sun"==t.substring(1,4)||"mon"==t.substring(1,4)||"tue"==t.substring(1,4)||"wed"==t.substring(1,4)?1:-1;case"fri":return"sun"==t.substring(1,4)||"mon"==t.substring(1,4)||"tue"==t.substring(1,4)||"wed"==t.substring(1,4)||"thu"==t.substring(1,4)?1:-1;case"sat":return 1}}return Number(e[0])-Number(t[0])})),t=e.indexOf(c)+1;t<e.length?(c=e[t],I()):disable(document.getElementById("btnNextEve"))},document.getElementById("btnChgImg").onclick=()=>{C(!0),toggleEl(document.getElementById("frmChgImg"))},document.getElementById("inChgImg").addEventListener("change",(e=>{var t;i=e.target.files[0],i.name=ultraClean(i.name,""),document.getElementById("inChgImgL").innerHTML=i.name,(t=new FileReader).readAsDataURL(i),t.onload=function(e){document.getElementById("prevMed").src=e.target.result}})),document.getElementById("inChgImgUrl").onchange=function(){document.getElementById("prevMed").src=document.getElementById("inChgImgUrl").value},document.getElementById("inMedSrc0").onclick=function(){d="home",C(!1),document.getElementById("inChgImg").setAttribute("required","true"),showEl(document.getElementById("inChgImgFileCont"))},document.getElementById("inMedSrc1").onclick=function(){d="out",C(!1),document.getElementById("inChgImgUrl").setAttribute("required","true"),showEl(document.getElementById("inChgImgUrlCont"))},document.getElementById("btnPrevCal").onclick=function(){n.timePrev=new firebase.firestore.Timestamp.fromMillis(new Date(Date.now()).getTime()+9e5),E()},document.getElementById("btnPrevMail").onclick=function(){n.timePrev=new firebase.firestore.Timestamp.fromMillis(new Date(Date.now()).getTime()+9e5),E()},document.getElementById("btnAprove").onclick=function(){n.revised[lang]&&n.revised[lang].includes(uid)?(n.revised[lang].splice(n.revised[lang].indexOf(uid),1),document.getElementById("btnAprove").innerHTML='<i class="far fa-check-square"></i>'):(n.revised[lang]||(n.revised[lang]=[]),n.revised[lang].push(uid),document.getElementById("btnAprove").innerHTML='<i class="fas fa-check-square"></i>'),B()?(n.finished=!0,function(){let e;t.ref("nextCal").transaction((t=>(t&&(e=t,++t%100==13&&(t-=12,t+=100)),t)),(t=>{if(!t){let t,n=new Date((e-e%100)/100+" "+e%100+" 00:00"),l=[];t=1==n.getMonth()?n.getFullYear()%4==0?29:28:n.getMonth()%2==0?n.getMonth()<=6?31:30:n.getMonth()<=6?30:31;let a=n.getDay();for(let e=1;e<=t;){let n={};for(let l=a;l<m.length&&!(e>t);l++)n[m[l]]={date:e,events:[]},e++;l.push(n),a=0}const r=[];return langs.forEach((t=>{let a={events:{},published:firebase.firestore.Timestamp.fromDate(n),description:"",descriptionShort:"",finished:!1,pastDue:!1,picUrl:"",picAlt:"",picCapt:"",public:!1,sentMail:!1,revised:{},title:"",url:"",nextCal:"",priorCal:"",weeks:l,translations:{}},s=parseInt(e),o=(s-s%100)/100,i=(s-s%100)/100,d=(s-s%100)/100;s%100==12&&i++,s%100==1&&d--;let c=p(s%100,t),u=p(s%100+1,t).toLowerCase(),m=p(s%100-1,t).toLowerCase(),g="";switch(t){case"es":g="calendario-astronomico",a.title="Calendario Astronómico de "+c+" "+o;break;case"en":g="astronomic-calendar",a.title="Astronomic Calendar of "+c+" "+o}a.url="https://sciencecookies.net/"+g+"/"+o+"/"+c.toLowerCase()+"/",a.nextCal="https://sciencecookies.net/"+g+"/"+i+"/"+u+"/",a.priorCal="https://sciencecookies.net/"+g+"/"+d+"/"+m+"/",r.push(db.collection("calendars/langs/"+t).doc(Math.abs(e).toString()).set(a))})),Promise.all(r).then((()=>{console.log("exito")})).catch((e=>console.log(e)))}console.log(t)}))}()):n.finished=!1,E()},$("#mdlPublish").on("show.bs.modal",(e=>{B()?(showEl(document.getElementById("btnCnfPublish")),document.getElementById("mdlPublishTxt").innerText="El calendario está listo para publicar"):(hideEl(document.getElementById("btnCnfPublish")),document.getElementById("mdlPublishTxt").innerText="Para publicar es necesario que lo hayan aprovado al menos dos personas.")})),document.getElementById("btnCnfPublish").onclick=function(){n.public||(f("barPublish",0),showEl(document.getElementById("barPublishCont")),n.public=!0,f("barPublish",25),v().then((()=>{f("barPublish",58),admin.database().ref("calendarios/"+l).set({pop:0},(e=>{if(!e)return f("barPublish",100),classes(document.getElementById("barPublish"),"bg-success"),"es"==lang?alertTop("Publicado correctamente",1):"en"==lang&&alertTop("Published successfully",1),setTimeout((function(){window.open(n.url,"_blank").focus()}),2500),$("#mdlPublish").modal("hide"),console.log("Published "+l+" calendar"),null;"es"==lang?alertTop("<strong>¡Ha ocurrido un error!</strong> "+e.code,0):"en"==lang&&alertTop("<strong>¡There has been an error!</strong> "+e.code,0),console.log(e)}))})).catch((e=>{"es"==lang?alertTop("<strong>¡Ha ocurrido un error!</strong> "+e.code,0):"en"==lang&&alertTop("<strong>¡There has been an error!</strong> "+e.code,0),console.log(e)})))}}();
//# sourceMappingURL=editCal.js.map
