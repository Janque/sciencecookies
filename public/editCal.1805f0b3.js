parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"D94y":[function(require,module,exports) {

},{}],"Pqf4":[function(require,module,exports) {
"use strict";require("../styles/editCal.scss");var e=firebase.storage(),t=firebase.database();let n,r,l=Date.now(),s=!1,i=null,o=null,d=null;const a=["sun","mon","tue","wed","thu","fri","sat"],c=["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sabado"];function u(e,t){if("es"==t)switch(e){case 1:return"Enero";case 2:return"Febrero";case 3:return"Marzo";case 4:return"Abril";case 5:return"Mayo";case 6:return"Junio";case 7:return"Julio";case 8:return"Agosto";case 9:return"Septiembre";case 10:return"Octubre";case 11:return"Noviembre";case 12:case 0:return"Diciembre";case 13:return"Enero"}else if("en"==t)switch(e){case 1:return"January";case 2:return"February";case 3:return"March";case 4:return"April";case 5:return"May";case 6:return"June";case 7:return"July";case 8:return"August";case 9:return"September";case 10:return"October";case 11:return"November";case 12:case 0:return"December";case 13:return"January"}}let m;function g(){console.log("Saving...");const e=[];return langs.forEach(t=>{if(t!=lang){let l={published:n.published,finished:n.finished,pastDue:n.pastDue,public:n.public,sentMail:n.sentMail,revised:n.revised,translations:n.translations};l.translations[lang]=n.url,e.push(db.collection("cookies/langs/"+t).doc(r).update(l))}}),Promise.all(e).then(()=>docRef.update(n))}function b(){g().then(()=>{d&&p(),s&&clearInterval(m),s=!0,m=setInterval(()=>{let e=Math.floor((Date.now()-l)/6e4);document.getElementById("tagLstSave").innerText=e<60?"Guardado hace "+e+" minutos":"Guardado hace "+Math.floor(e/60)+" horas"},300010),document.getElementById("tagLstSave").innerText="Se han guardado los cambios",l=Date.now()}).catch(e=>{document.getElementById("tagLstSave").innerText="Error, no se han guardado todos los cambios: "+e.code,console.log(e)})}function h(e,t){t=Math.floor(t),e.setAttribute("aria-valuenow",t),e.style.width=t+"%",e.innerText=t+"%"}function p(){Object.keys(n.events).forEach(e=>{hideEl(document.getElementById(e))}),document.getElementById("mdlEventInfoL").innerHTML=n.events[d].date,showEl(document.getElementById(d)),enable(document.getElementById("btnPriorEve")),enable(document.getElementById("btnNextEve"))}function E(){document.getElementById("weeksCont").innerHTML="",n.weeks.forEach((e,t)=>{let l=document.createElement("tr");l.style.height="10rem",document.getElementById("weeksCont").appendChild(l);for(let s=0;s<7;s++){let i=e[a[s]],o=document.createElement("td");if(classes(o,"p-0"),l.appendChild(o),i){let e=document.createElement("p");classes(e,"m-0 p-1"),e.style.fontSize="x-large",e.innerHTML="<b>"+i.date+"</b>",o.appendChild(e);let l=document.createElement("div");classes(l,"autoOverflow"),l.style.maxHeight="7rem",i.events.forEach((e,n)=>{let r=document.createElement("button");r.setAttribute("data-toggle","modal"),r.setAttribute("data-target","#mdlEventInfo"),classes(r,"btn text-left p-1 mb-1 w-100"),r.style.backgroundColor="#c3e6cb",r.style.borderColor="#8fd19e",r.innerHTML="<small>"+e.name+"</small>",r.onclick=(()=>{d=t+a[s]+n,p()}),l.appendChild(r)});let m=document.createElement("button");classes(m,"btn btn-scckie btn-block btn-sm"),m.innerHTML='<i class="fas fa-plus"></i>',m.onclick=(()=>{n.events[t+a[s]+i.events.length]={date:c[s]+" "+i.date+" de "+u(r%100),name:"Evento sin nombre",description:"Sin descripción",visibilidad:"Visible a simple vista",horario:["Ciudad de México:","Bogotá:","Madrid:"]},i.events.push({name:"Evento sin nombre"}),b()}),l.appendChild(m),o.appendChild(l)}}}),document.getElementById("eventInfoCont").innerHTML="";for(const[e,t]of Object.entries(n.events)){let r=!1,l=document.createElement("div");l.id=e,classes(l,"d-none overflow-auto");let s=document.createElement("div");classes(s,"modal-body"),l.appendChild(s);let i=document.createElement("div");classes(i,"d-none"),s.appendChild(i);let o=document.createElement("div");classes(o,"form-group"),i.appendChild(o),o.innerHTML="<label>Nombre del evento</label>";let a=document.createElement("input");a.id="inEveTitle"+e,a.setAttribute("type","text"),classes(a,"form-control"),o.appendChild(a);let c=document.createElement("div");classes(c,"form-group"),i.appendChild(c),c.innerHTML="<label>Descripción</label>";let u=document.createElement("textarea");classes(u,"form-control"),u.id="inEveDesc"+e,u.setAttribute("rows","3"),c.appendChild(u);let m=document.createElement("div");classes(m,"form-group"),i.appendChild(m),m.innerHTML="<label>Visiblidad</label>";let g=document.createElement("select");g.id="inVis"+e,classes(g,"form-control");let h=["Visible a simple vista","Visible con binoculares","Visible con un telescopio pequeño","Visible con un telescopio de 4 pulgadas","Visible con un telescopio grande","No observable"];h.forEach((e,n)=>{let r=document.createElement("option");r.value=n,r.innerHTML=e,e==t.visibilidad&&r.setAttribute("selected","true"),g.appendChild(r)}),m.appendChild(g);let p=document.createElement("div");classes(p,"form-group"),i.appendChild(p),p.innerHTML="<label>Horario</label>";let E=document.createElement("textarea");classes(E,"form-control"),E.id="inTime"+e,E.setAttribute("rows","4"),p.appendChild(E),5==g.value?hideEl(p):showEl(p),a.oninput=(()=>{enable(k),r=!0}),u.oninput=(()=>{enable(k),r=!0}),g.oninput=(()=>{enable(k),r=!0,5==g.value?hideEl(p):showEl(p)}),E.oninput=(()=>{enable(k),r=!0});let f=document.createElement("div");s.appendChild(f);let v=document.createElement("h3");v.innerHTML=t.name,f.appendChild(v);let y=document.createElement("p");y.innerHTML=t.description,f.appendChild(y);let I=document.createElement("p");I.innerHTML="Visibilidad: "+t.visibilidad,f.appendChild(I);let C=document.createElement("p");classes(C,"mb-0"),C.innerHTML="Horario: ",f.appendChild(C);let B=document.createElement("ul");f.appendChild(B),t.horario.forEach(e=>{let t=document.createElement("li");t.innerHTML=e,B.appendChild(t)}),"No observable"==t.visibilidad?(hideEl(C),hideEl(B)):(showEl(C),showEl(B));let w=document.createElement("div");classes(w,"modal-footer"),l.appendChild(w);let M=document.createElement("button");classes(M,"btn btn-danger mr-auto"),M.setAttribute("type","button"),M.innerText="Borrar",M.onclick=(()=>{for(let t=Number(e.substr(4))+1;t<n.weeks[Number(e[0])][e.substr(1,3)].events.length;t++)n.events[e.substr(0,4)+(t-1)]=n.events[e.substr(0,4)+t];delete n.events[e.substr(0,4)+(n.weeks[Number(e[0])][e.substr(1,3)].events.length-1)],n.weeks[Number(e[0])][e.substr(1,3)].events.splice(Number(e.substr(4)),1),$("#mdlEventInfo").modal("hide"),d=null,b()}),w.appendChild(M);let T=document.createElement("button");classes(T,"btn btn-info"),T.setAttribute("type","button"),T.innerText="Editar",T.onclick=(()=>{a.value=t.name,u.innerHTML=t.description,g.value=h.indexOf(t.visibilidad),5==g.value?hideEl(p):showEl(p),E.innerHTML="",t.horario.forEach(e=>{E.innerHTML+=e+"\n"}),hideEl(f),showEl(i),showEl(k),showEl(L),enable(L),hideEl(T)}),w.appendChild(T);let k=document.createElement("button");classes(k,"btn btn-secondary mr-1 d-none"),k.setAttribute("type","button"),disable(k),k.innerText="Revertir",k.onclick=(()=>{r=!1,disable(k),a.value=t.name,u.innerHTML=t.description,g.value=h.indexOf(t.visibilidad),5==g.value?hideEl(p):showEl(p),E.innerHTML="",t.horario.forEach(e=>{E.innerHTML+=e.trim()+"\n"})}),w.appendChild(k);let L=document.createElement("button");classes(L,"btn btn-scckie d-none"),L.setAttribute("type","button"),disable(L),L.innerText="Guardar",L.onclick=(()=>{disable(k),disable(L),r?(n.weeks[Number(e[0])][e.substr(1,3)].events[e[4]].name=t.name=a.value,t.description=u.value.trim(),t.visibilidad=h[g.value],t.horario=[],E.value.trim().split("\n").forEach(e=>{""!=e&&" "!=e&&t.horario.push(e)}),b()):(hideEl(i),showEl(f),hideEl(k),hideEl(L),showEl(T))}),w.appendChild(L),document.getElementById("eventInfoCont").appendChild(l)}}function f(e){document.getElementById("prevMed").src=n.picUrl,e&&(document.getElementById("inMedSrc0").checked=!1,document.getElementById("inMedSrc1").checked=!1),document.getElementById("inChgImg").value="",document.getElementById("inChgImgUrl").value="",document.getElementById("inChgImg").removeAttribute("required"),document.getElementById("inChgImgUrl").removeAttribute("required"),hideEl(document.getElementById("barChgImgCont")),hideEl(document.getElementById("inChgImgFileCont")),hideEl(document.getElementById("inChgImgUrlCont")),document.getElementById("btnCnfChgImg").removeAttribute("disabled"),document.getElementById("btnCanChgImg").removeAttribute("disabled")}function v(){let e=0;return langs.forEach(t=>{let r=n.revised[t]?n.revised[t].length:0;n.revised[t]&&!n.revised[t].includes(uid)&&r++,r>=2&&e++}),e==langs.length}function y(){let e;t.ref("nextCal").transaction(t=>(t&&(e=t,++t%100==13&&(t-=12,t+=100)),t),t=>{if(!t){let t,n=new Date((e-e%100)/100+" "+e%100+" 00:00"),r=[];t=1==n.getMonth()?n.getFullYear()%4==0?29:28:n.getMonth()%2==0?n.getMonth()<=6?31:30:n.getMonth()<=6?30:31;let l=n.getDay();for(let e=1;e<=t;e=e){let n={};for(let r=l;r<a.length&&!(e>t);r++)n[a[r]]={date:e,events:[]},e++;r.push(n),l=0}const s=[];return langs.forEach(t=>{if(t!=lang){let l={events:{},published:firebase.firestore.Timestamp.fromDate(n),description:"",descriptionShort:"",finished:!1,pastDue:!1,picUrl:"",picAlt:"",picCapt:"",public:!1,sentMail:!1,revised:{},title:"",url:"",nextCal:"",priorCal:"",weeks:r,translations:{}},i=parseInt(e),o=(i-i%100)/100,d=(i-i%100)/100,a=(i-i%100)/100;i%100==12&&d++,i%100==1&&a--;let c=u(i%100),m=u(i%100+1).toLowerCase(),g=u(i%100-1).toLowerCase(),b="";switch(t){case"es":b="calendario-astronomico",l.title="Calendario Astronómico de "+c+" "+o;break;case"en":b="astronomic-calendar",l.title="Astronomic Calendar of "+c+" "+o}l.url="https://sciencecookies.net/"+b+"/"+o+"/"+c.toLowerCase()+"/",l.nextCal="https://sciencecookies.net/"+b+"/"+d+"/"+m+"/",l.priorCal="https://sciencecookies.net/"+b+"/"+a+"/"+g+"/",s.push(db.collection("calendars/langs/"+t).doc(Math.abs(e).toString()).set(l))}}),Promise.all(s).then(()=>{console.log("exito")}).catch(e=>console.log(e))}console.log(t)})}window.loaded=function(){calendarsFSRef.doc(urlSrch.get("id")).onSnapshot(e=>{e.exists?(n=e.data(),r=e.id,document.getElementById("title").innerHTML=n.title,document.getElementById("prevMed").src=n.picUrl,document.getElementById("inPicCapt").value=n.picCapt,document.getElementById("inPicAlt").value=n.picAlt,document.getElementById("inDesc").value=n.description,document.getElementById("inDescShort").value=n.descriptionShort,E(),n.public?(hideEl(document.getElementById("btnAprove")),hideEl(document.getElementById("btnPub"))):(showEl(document.getElementById("btnAprove")),n.pastDue&&showEl(document.getElementById("btnPub"))),n.revised.includes(uid)?document.getElementById("btnAprove").innerHTML='<i class="fas fa-check-square"></i>':document.getElementById("btnAprove").innerHTML='<i class="far fa-check-square"></i>',document.getElementById("btnPrevCal").href=n.url,document.getElementById("btnPrevMail").href="/vista-email-calendario/"+r,document.getElementById("btnSrcCal").href=`https://in-the-sky.org/newscal.php?month=${urlSrch.get("id").substr(5,6)}&year=${urlSrch.get("id").substr(0,4)}&maxdiff=7&country=1484&reg1=3527646&reg2=8379372&town=3530597`,document.getElementById("btnSrcCal2").href=`https://in-the-sky.org/newscal.php?month=${urlSrch.get("id").substr(5,6)}&year=${urlSrch.get("id").substr(0,4)}&maxdiff=7&country=1170&reg1=3688685&reg2=9609540&town=3688689`,document.getElementById("btnSrcCal3").href=`https://in-the-sky.org/newscal.php?month=${urlSrch.get("id").substr(5,6)}&year=${urlSrch.get("id").substr(0,4)}&maxdiff=7&country=1724&reg1=3117732&reg2=6355233&town=3117735`):window.location.href="../404"},e=>console.log(e)),document.getElementById("frmText").addEventListener("submit",function(e){e.preventDefault(),n.description=document.getElementById("inDesc").value.trim(),n.descriptionShort=document.getElementById("inDescShort").value.trim(),b()}),document.getElementById("frmChgImg").addEventListener("submit",function(t){t.preventDefault(),h(document.getElementById("barChgImg"),0),showEl(document.getElementById("barChgImgCont")),hideEl(document.getElementById("frmChgImg")),document.getElementById("btnCnfChgImg").setAttribute("disabled","true"),document.getElementById("btnCanChgImg").setAttribute("disabled","true"),"home"==o?function(){let t=e.ref("calendarMedia/"+r+"/pic");t.put(i).on("state_changed",function(e){h(document.getElementById("barChgImg"),e.bytesTransferred/e.totalBytes*100)},function(e){(lang="es")?alertTop("<strong>¡Ha ocurrido un error!</strong> "+e.code,0):(lang="en")&&alertTop("<strong>¡There has been an error!</strong> "+e.code,0),console.log(e),$("#mdlAddMed").modal("hide")},function(){t.getDownloadURL().then(e=>{n.picUrl=e,b(),f(!0),hideEl(document.getElementById("frmChgImg"))}).catch(e=>{console.log(e)})})}():(n.picUrl=document.getElementById("inChgImgUrl").value,b(),f(!0),hideEl(document.getElementById("frmChgImg")))})},document.getElementById("inPicCapt").oninput=(()=>{n.picCapt=document.getElementById("inPicCapt").value.trim()}),document.getElementById("inPicAlt").oninput=(()=>{n.picAlt=document.getElementById("inPicAlt").value.trim()}),document.getElementById("inDesc").oninput=(()=>{n.picDesc=document.getElementById("inDesc").value.trim()}),document.getElementById("inDescShort").oninput=(()=>{n.picDescShort=document.getElementById("inDescShort").value.trim()}),document.getElementById("btnPriorEve").onclick=(()=>{let e=Object.keys(n.events).slice().sort((e,t)=>{if(Number(e[0])==Number(t[0])){if(e.substring(1,4)==t.substring(1,4))return Number(e[4])-Number(t[4]);switch(e.substring(1,4)){case"sun":return-1;case"mon":return"sun"==t.substring(1,4)?1:-1;case"tue":return"sun"==t.substring(1,4)||"mon"==t.substring(1,4)?1:-1;case"wed":return"sun"==t.substring(1,4)||"mon"==t.substring(1,4)||"tue"==t.substring(1,4)?1:-1;case"thu":return"sun"==t.substring(1,4)||"mon"==t.substring(1,4)||"tue"==t.substring(1,4)||"wed"==t.substring(1,4)?1:-1;case"fri":return"sun"==t.substring(1,4)||"mon"==t.substring(1,4)||"tue"==t.substring(1,4)||"wed"==t.substring(1,4)||"thu"==t.substring(1,4)?1:-1;case"sat":return 1}}return Number(e[0])-Number(t[0])}),t=e.indexOf(d)-1;t>=0?(d=e[t],p()):disable(document.getElementById("btnPriorEve"))}),document.getElementById("btnNextEve").onclick=(()=>{let e=Object.keys(n.events).slice().sort((e,t)=>{if(Number(e[0])==Number(t[0])){if(e.substring(1,4)==t.substring(1,4))return Number(e[4])-Number(t[4]);switch(e.substring(1,4)){case"sun":return-1;case"mon":return"sun"==t.substring(1,4)?1:-1;case"tue":return"sun"==t.substring(1,4)||"mon"==t.substring(1,4)?1:-1;case"wed":return"sun"==t.substring(1,4)||"mon"==t.substring(1,4)||"tue"==t.substring(1,4)?1:-1;case"thu":return"sun"==t.substring(1,4)||"mon"==t.substring(1,4)||"tue"==t.substring(1,4)||"wed"==t.substring(1,4)?1:-1;case"fri":return"sun"==t.substring(1,4)||"mon"==t.substring(1,4)||"tue"==t.substring(1,4)||"wed"==t.substring(1,4)||"thu"==t.substring(1,4)?1:-1;case"sat":return 1}}return Number(e[0])-Number(t[0])}),t=e.indexOf(d)+1;t<e.length?(d=e[t],p()):disable(document.getElementById("btnNextEve"))}),document.getElementById("btnChgImg").onclick=(()=>{f(!0),toggleEl(document.getElementById("frmChgImg"))}),document.getElementById("inChgImg").addEventListener("change",e=>{(i=e.target.files[0]).name=ultraClean(i.name,""),document.getElementById("inChgImgL").innerHTML=i.name,function(){var e=new FileReader;e.readAsDataURL(i),e.onload=function(e){document.getElementById("prevMed").src=e.target.result}}()}),document.getElementById("inChgImgUrl").onchange=function(){document.getElementById("prevMed").src=document.getElementById("inChgImgUrl").value},document.getElementById("inMedSrc0").onclick=function(){o="home",f(!1),document.getElementById("inChgImg").setAttribute("required","true"),showEl(document.getElementById("inChgImgFileCont"))},document.getElementById("inMedSrc1").onclick=function(){o="out",f(!1),document.getElementById("inChgImgUrl").setAttribute("required","true"),showEl(document.getElementById("inChgImgUrlCont"))},document.getElementById("btnPrevCal").onclick=function(){n.timePrev=new firebase.firestore.Timestamp.fromMillis(new Date(Date.now()).getTime()+9e5),b()},document.getElementById("btnPrevMail").onclick=function(){n.timePrev=new firebase.firestore.Timestamp.fromMillis(new Date(Date.now()).getTime()+9e5),b()},document.getElementById("btnAprove").onclick=function(){n.revised[lang]&&n.revised[lang].includes(uid)?(n.revised[lang].splice(n.revised[lang].indexOf(uid),1),document.getElementById("btnAprove").innerHTML='<i class="far fa-check-square"></i>'):(n.revised[lang]||(n.revised[lang]=[]),n.revised[lang].push(uid),document.getElementById("btnAprove").innerHTML='<i class="fas fa-check-square"></i>'),v()?(n.finished=!0,y()):n.finished=!1,b()},$("#mdlPublish").on("show.bs.modal",e=>{v()?(showEl(document.getElementById("btnCnfPublish")),document.getElementById("mdlPublishTxt").innerText="El calendario está listo para publicar"):(hideEl(document.getElementById("btnCnfPublish")),document.getElementById("mdlPublishTxt").innerText="Para publicar es necesario que lo hayan aprovado al menos dos personas.")}),document.getElementById("btnCnfPublish").onclick=function(){n.public||(h(document.getElementById("barPublish"),0),showEl(document.getElementById("barPublishCont")),n.public=!0,h(document.getElementById("barPublish"),25),g().then(()=>{h(document.getElementById("barPublish"),58),admin.database().ref("calendarios/"+r).set({pop:0},e=>{if(!e)return h(document.getElementById("barPublish"),100),classes(document.getElementById("barPublish"),"bg-success"),(lang="es")?alertTop("Publicado correctamente",1):(lang="en")&&alertTop("Published successfully",1),setTimeout(function(){window.open(n.url,"_blank").focus()},2500),$("#mdlPublish").modal("hide"),console.log("Published "+r+" calendar"),null;(lang="es")?alertTop("<strong>¡Ha ocurrido un error!</strong> "+e.code,0):(lang="en")&&alertTop("<strong>¡There has been an error!</strong> "+e.code,0),console.log(e)})}).catch(e=>{(lang="es")?alertTop("<strong>¡Ha ocurrido un error!</strong> "+e.code,0):(lang="en")&&alertTop("<strong>¡There has been an error!</strong> "+e.code,0),console.log(e)}))};
},{"../styles/editCal.scss":"D94y"}]},{},["Pqf4"], null)
//# sourceMappingURL=/editCal.1805f0b3.js.map