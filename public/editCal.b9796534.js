parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"D94y":[function(require,module,exports) {

},{}],"Pqf4":[function(require,module,exports) {
"use strict";function e(e,r){return o(e)||i(e,r)||n(e,r)||t()}function t(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function n(e,t){if(e){if("string"==typeof e)return r(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?r(e,t):void 0}}function r(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function i(e,t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var n=[],r=!0,i=!1,o=void 0;try{for(var s,a=e[Symbol.iterator]();!(r=(s=a.next()).done)&&(n.push(s.value),!t||n.length!==t);r=!0);}catch(l){i=!0,o=l}finally{try{r||null==a.return||a.return()}finally{if(i)throw o}}return n}}function o(e){if(Array.isArray(e))return e}require("../styles/editCal.scss");var s,a,l,c=firebase.storage(),u=firebase.database(),d=Date.now(),m=!1,g=null,b=null,h=null,f=["sun","mon","tue","wed","thu","fri","sat"],p=["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sabado"];function E(e,t){if("es"==t)switch(e){case 1:return"Enero";case 2:return"Febrero";case 3:return"Marzo";case 4:return"Abril";case 5:return"Mayo";case 6:return"Junio";case 7:return"Julio";case 8:return"Agosto";case 9:return"Septiembre";case 10:return"Octubre";case 11:return"Noviembre";case 12:case 0:return"Diciembre";case 13:return"Enero"}else if("en"==t)switch(e){case 1:return"January";case 2:return"February";case 3:return"March";case 4:return"April";case 5:return"May";case 6:return"June";case 7:return"July";case 8:return"August";case 9:return"September";case 10:return"October";case 11:return"November";case 12:case 0:return"December";case 13:return"January"}}function v(){console.log("Saving...");var e=[];return langs.forEach(function(t){if(t!=lang){var n={published:s.published,finished:s.finished,pastDue:s.pastDue,public:s.public,sentMail:s.sentMail,revised:s.revised,translations:s.translations};n.translations[lang]=s.url,e.push(db.collection("cookies/langs/"+t).doc(a).update(n))}}),Promise.all(e).then(function(){return docRef.update(s)})}function y(){v().then(function(){h&&C(),m&&clearInterval(l),m=!0,l=setInterval(function(){var e=Math.floor((Date.now()-d)/6e4);document.getElementById("tagLstSave").innerText=e<60?"Guardado hace "+e+" minutos":"Guardado hace "+Math.floor(e/60)+" horas"},300010),document.getElementById("tagLstSave").innerText="Se han guardado los cambios",d=Date.now()}).catch(function(e){document.getElementById("tagLstSave").innerText="Error, no se han guardado todos los cambios: "+e.code,console.log(e)})}function I(e,t){t=Math.floor(t),e.setAttribute("aria-valuenow",t),e.style.width=t+"%",e.innerText=t+"%"}function C(){Object.keys(s.events).forEach(function(e){hideEl(document.getElementById(e))}),document.getElementById("mdlEventInfoL").innerHTML=s.events[h].date,showEl(document.getElementById(h)),enable(document.getElementById("btnPriorEve")),enable(document.getElementById("btnNextEve"))}function B(){document.getElementById("weeksCont").innerHTML="",s.weeks.forEach(function(e,t){var n=document.createElement("tr");n.style.height="10rem",document.getElementById("weeksCont").appendChild(n);for(var r=function(r){var i=e[f[r]],o=document.createElement("td");if(classes(o,"p-0"),n.appendChild(o),i){var l=document.createElement("p");classes(l,"m-0 p-1"),l.style.fontSize="x-large",l.innerHTML="<b>"+i.date+"</b>",o.appendChild(l);var c=document.createElement("div");classes(c,"autoOverflow"),c.style.maxHeight="7rem",i.events.forEach(function(e,n){var i=document.createElement("button");i.setAttribute("data-toggle","modal"),i.setAttribute("data-target","#mdlEventInfo"),classes(i,"btn text-left p-1 mb-1 w-100"),i.style.backgroundColor="#c3e6cb",i.style.borderColor="#8fd19e",i.innerHTML="<small>"+e.name+"</small>",i.onclick=function(){h=t+f[r]+n,C()},c.appendChild(i)});var u=document.createElement("button");classes(u,"btn btn-scckie btn-block btn-sm"),u.innerHTML='<i class="fas fa-plus"></i>',u.onclick=function(){s.events[t+f[r]+i.events.length]={date:p[r]+" "+i.date+" de "+E(a%100),name:"Evento sin nombre",description:"Sin descripción",visibilidad:"Visible a simple vista",horario:["Ciudad de México:","Bogotá:","Madrid:"]},i.events.push({name:"Evento sin nombre"}),y()},c.appendChild(u),o.appendChild(c)}},i=0;i<7;i++)r(i)}),document.getElementById("eventInfoCont").innerHTML="";for(var t=function(){var t=e(r[n],2),i=t[0],o=t[1],a=!1,l=document.createElement("div");l.id=i,classes(l,"d-none overflow-auto");var c=document.createElement("div");classes(c,"modal-body"),l.appendChild(c);var u=document.createElement("div");classes(u,"d-none"),c.appendChild(u);var d=document.createElement("div");classes(d,"form-group"),u.appendChild(d),d.innerHTML="<label>Nombre del evento</label>";var m=document.createElement("input");m.id="inEveTitle"+i,m.setAttribute("type","text"),classes(m,"form-control"),d.appendChild(m);var g=document.createElement("div");classes(g,"form-group"),u.appendChild(g),g.innerHTML="<label>Descripción</label>";var b=document.createElement("textarea");classes(b,"form-control"),b.id="inEveDesc"+i,b.setAttribute("rows","3"),g.appendChild(b);var f=document.createElement("div");classes(f,"form-group"),u.appendChild(f),f.innerHTML="<label>Visiblidad</label>";var p=document.createElement("select");p.id="inVis"+i,classes(p,"form-control");var E=["Visible a simple vista","Visible con binoculares","Visible con un telescopio pequeño","Visible con un telescopio de 4 pulgadas","Visible con un telescopio grande","No observable"];E.forEach(function(e,t){var n=document.createElement("option");n.value=t,n.innerHTML=e,e==o.visibilidad&&n.setAttribute("selected","true"),p.appendChild(n)}),f.appendChild(p);var v=document.createElement("div");classes(v,"form-group"),u.appendChild(v),v.innerHTML="<label>Horario</label>";var I=document.createElement("textarea");classes(I,"form-control"),I.id="inTime"+i,I.setAttribute("rows","4"),v.appendChild(I),5==p.value?hideEl(v):showEl(v),m.oninput=function(){enable(x),a=!0},b.oninput=function(){enable(x),a=!0},p.oninput=function(){enable(x),a=!0,5==p.value?hideEl(v):showEl(v)},I.oninput=function(){enable(x),a=!0};var C=document.createElement("div");c.appendChild(C);var B=document.createElement("h3");B.innerHTML=o.name,C.appendChild(B);var w=document.createElement("p");w.innerHTML=o.description,C.appendChild(w);var M=document.createElement("p");M.innerHTML="Visibilidad: "+o.visibilidad,C.appendChild(M);var T=document.createElement("p");classes(T,"mb-0"),T.innerHTML="Horario: ",C.appendChild(T);var A=document.createElement("ul");C.appendChild(A),o.horario.forEach(function(e){var t=document.createElement("li");t.innerHTML=e,A.appendChild(t)}),"No observable"==o.visibilidad?(hideEl(T),hideEl(A)):(showEl(T),showEl(A));var k=document.createElement("div");classes(k,"modal-footer"),l.appendChild(k);var L=document.createElement("button");classes(L,"btn btn-danger mr-auto"),L.setAttribute("type","button"),L.innerText="Borrar",L.onclick=function(){for(var e=Number(i.substr(4))+1;e<s.weeks[Number(i[0])][i.substr(1,3)].events.length;e++)s.events[i.substr(0,4)+(e-1)]=s.events[i.substr(0,4)+e];delete s.events[i.substr(0,4)+(s.weeks[Number(i[0])][i.substr(1,3)].events.length-1)],s.weeks[Number(i[0])][i.substr(1,3)].events.splice(Number(i.substr(4)),1),$("#mdlEventInfo").modal("hide"),h=null,y()},k.appendChild(L);var S=document.createElement("button");classes(S,"btn btn-info"),S.setAttribute("type","button"),S.innerText="Editar",S.onclick=function(){m.value=o.name,b.innerHTML=o.description,p.value=E.indexOf(o.visibilidad),5==p.value?hideEl(v):showEl(v),I.innerHTML="",o.horario.forEach(function(e){I.innerHTML+=e+"\n"}),hideEl(C),showEl(u),showEl(x),showEl(P),enable(P),hideEl(S)},k.appendChild(S);var x=document.createElement("button");classes(x,"btn btn-secondary mr-1 d-none"),x.setAttribute("type","button"),disable(x),x.innerText="Revertir",x.onclick=function(){a=!1,disable(x),m.value=o.name,b.innerHTML=o.description,p.value=E.indexOf(o.visibilidad),5==p.value?hideEl(v):showEl(v),I.innerHTML="",o.horario.forEach(function(e){I.innerHTML+=e.trim()+"\n"})},k.appendChild(x);var P=document.createElement("button");classes(P,"btn btn-scckie d-none"),P.setAttribute("type","button"),disable(P),P.innerText="Guardar",P.onclick=function(){disable(x),disable(P),a?(s.weeks[Number(i[0])][i.substr(1,3)].events[i[4]].name=o.name=m.value,o.description=b.value.trim(),o.visibilidad=E[p.value],o.horario=[],I.value.trim().split("\n").forEach(function(e){""!=e&&" "!=e&&o.horario.push(e)}),y()):(hideEl(u),showEl(C),hideEl(x),hideEl(P),showEl(S))},k.appendChild(P),document.getElementById("eventInfoCont").appendChild(l)},n=0,r=Object.entries(s.events);n<r.length;n++)t()}function w(e){document.getElementById("prevMed").src=s.picUrl,e&&(document.getElementById("inMedSrc0").checked=!1,document.getElementById("inMedSrc1").checked=!1),document.getElementById("inChgImg").value="",document.getElementById("inChgImgUrl").value="",document.getElementById("inChgImg").removeAttribute("required"),document.getElementById("inChgImgUrl").removeAttribute("required"),hideEl(document.getElementById("barChgImgCont")),hideEl(document.getElementById("inChgImgFileCont")),hideEl(document.getElementById("inChgImgUrlCont")),document.getElementById("btnCnfChgImg").removeAttribute("disabled"),document.getElementById("btnCanChgImg").removeAttribute("disabled")}function M(){var e=0;return langs.forEach(function(t){var n=s.revised[t]?s.revised[t].length:0;s.revised[t]&&!s.revised[t].includes(uid)&&n++,n>=2&&e++}),e==langs.length}function T(){var e;u.ref("nextCal").transaction(function(t){return t&&(e=t,++t%100==13&&(t-=12,t+=100)),t},function(t){if(!t){var n,r=new Date((e-e%100)/100+" "+e%100+" 00:00"),i=[];n=1==r.getMonth()?r.getFullYear()%4==0?29:28:r.getMonth()%2==0?r.getMonth()<=6?31:30:r.getMonth()<=6?30:31;for(var o=r.getDay(),s=1;s<=n;s=s){for(var a={},l=o;l<f.length&&!(s>n);l++)a[f[l]]={date:s,events:[]},s++;i.push(a),o=0}var c=[];return langs.forEach(function(t){if(t!=lang){var n={events:{},published:firebase.firestore.Timestamp.fromDate(r),description:"",descriptionShort:"",finished:!1,pastDue:!1,picUrl:"",picAlt:"",picCapt:"",public:!1,sentMail:!1,revised:{},title:"",url:"",nextCal:"",priorCal:"",weeks:i,translations:{}},o=parseInt(e),s=(o-o%100)/100,a=(o-o%100)/100,l=(o-o%100)/100;o%100==12&&a++,o%100==1&&l--;var u=E(o%100),d=E(o%100+1).toLowerCase(),m=E(o%100-1).toLowerCase(),g="";switch(t){case"es":g="calendario-astronomico",n.title="Calendario Astronómico de "+u+" "+s;break;case"en":g="astronomic-calendar",n.title="Astronomic Calendar of "+u+" "+s}n.url="https://sciencecookies.net/"+g+"/"+s+"/"+u.toLowerCase()+"/",n.nextCal="https://sciencecookies.net/"+g+"/"+a+"/"+d+"/",n.priorCal="https://sciencecookies.net/"+g+"/"+l+"/"+m+"/",c.push(db.collection("calendars/langs/"+t).doc(Math.abs(e).toString()).set(n))}}),Promise.all(c).then(function(){console.log("exito")}).catch(function(e){return console.log(e)})}console.log(t)})}window.loaded=function(){calendarsFSRef.doc(urlSrch.get("id")).onSnapshot(function(e){e.exists?(s=e.data(),a=e.id,document.getElementById("title").innerHTML=s.title,document.getElementById("prevMed").src=s.picUrl,document.getElementById("inPicCapt").value=s.picCapt,document.getElementById("inPicAlt").value=s.picAlt,document.getElementById("inDesc").value=s.description,document.getElementById("inDescShort").value=s.descriptionShort,B(),s.public?(hideEl(document.getElementById("btnAprove")),hideEl(document.getElementById("btnPub"))):(showEl(document.getElementById("btnAprove")),s.pastDue&&showEl(document.getElementById("btnPub"))),s.revised.includes(uid)?document.getElementById("btnAprove").innerHTML='<i class="fas fa-check-square"></i>':document.getElementById("btnAprove").innerHTML='<i class="far fa-check-square"></i>',document.getElementById("btnPrevCal").href=s.url,document.getElementById("btnPrevMail").href="/vista-email-calendario/"+a,document.getElementById("btnSrcCal").href="https://in-the-sky.org/newscal.php?month=".concat(urlSrch.get("id").substr(5,6),"&year=").concat(urlSrch.get("id").substr(0,4),"&maxdiff=7&country=1484&reg1=3527646&reg2=8379372&town=3530597"),document.getElementById("btnSrcCal2").href="https://in-the-sky.org/newscal.php?month=".concat(urlSrch.get("id").substr(5,6),"&year=").concat(urlSrch.get("id").substr(0,4),"&maxdiff=7&country=1170&reg1=3688685&reg2=9609540&town=3688689"),document.getElementById("btnSrcCal3").href="https://in-the-sky.org/newscal.php?month=".concat(urlSrch.get("id").substr(5,6),"&year=").concat(urlSrch.get("id").substr(0,4),"&maxdiff=7&country=1724&reg1=3117732&reg2=6355233&town=3117735")):window.location.href="../404"},function(e){return console.log(e)}),document.getElementById("frmText").addEventListener("submit",function(e){e.preventDefault(),s.description=document.getElementById("inDesc").value.trim(),s.descriptionShort=document.getElementById("inDescShort").value.trim(),y()}),document.getElementById("frmChgImg").addEventListener("submit",function(e){var t;e.preventDefault(),I(document.getElementById("barChgImg"),0),showEl(document.getElementById("barChgImgCont")),hideEl(document.getElementById("frmChgImg")),document.getElementById("btnCnfChgImg").setAttribute("disabled","true"),document.getElementById("btnCanChgImg").setAttribute("disabled","true"),"home"==b?(t=c.ref("calendarMedia/"+a+"/pic")).put(g).on("state_changed",function(e){I(document.getElementById("barChgImg"),e.bytesTransferred/e.totalBytes*100)},function(e){alertTop("<strong>!Ha ocurrido un error! </strong>"+e,0),console.log(e),$("#mdlAddMed").modal("hide")},function(){t.getDownloadURL().then(function(e){s.picUrl=e,y(),w(!0),hideEl(document.getElementById("frmChgImg"))}).catch(function(e){console.log(e)})}):(s.picUrl=document.getElementById("inChgImgUrl").value,y(),w(!0),hideEl(document.getElementById("frmChgImg")))})},document.getElementById("inPicCapt").oninput=function(){s.picCapt=document.getElementById("inPicCapt").value.trim()},document.getElementById("inPicAlt").oninput=function(){s.picAlt=document.getElementById("inPicAlt").value.trim()},document.getElementById("inDesc").oninput=function(){s.picDesc=document.getElementById("inDesc").value.trim()},document.getElementById("inDescShort").oninput=function(){s.picDescShort=document.getElementById("inDescShort").value.trim()},document.getElementById("btnPriorEve").onclick=function(){var e=Object.keys(s.events).slice().sort(function(e,t){if(Number(e[0])==Number(t[0])){if(e.substring(1,4)==t.substring(1,4))return Number(e[4])-Number(t[4]);switch(e.substring(1,4)){case"sun":return-1;case"mon":return"sun"==t.substring(1,4)?1:-1;case"tue":return"sun"==t.substring(1,4)||"mon"==t.substring(1,4)?1:-1;case"wed":return"sun"==t.substring(1,4)||"mon"==t.substring(1,4)||"tue"==t.substring(1,4)?1:-1;case"thu":return"sun"==t.substring(1,4)||"mon"==t.substring(1,4)||"tue"==t.substring(1,4)||"wed"==t.substring(1,4)?1:-1;case"fri":return"sun"==t.substring(1,4)||"mon"==t.substring(1,4)||"tue"==t.substring(1,4)||"wed"==t.substring(1,4)||"thu"==t.substring(1,4)?1:-1;case"sat":return 1}}return Number(e[0])-Number(t[0])}),t=e.indexOf(h)-1;t>=0?(h=e[t],C()):disable(document.getElementById("btnPriorEve"))},document.getElementById("btnNextEve").onclick=function(){var e=Object.keys(s.events).slice().sort(function(e,t){if(Number(e[0])==Number(t[0])){if(e.substring(1,4)==t.substring(1,4))return Number(e[4])-Number(t[4]);switch(e.substring(1,4)){case"sun":return-1;case"mon":return"sun"==t.substring(1,4)?1:-1;case"tue":return"sun"==t.substring(1,4)||"mon"==t.substring(1,4)?1:-1;case"wed":return"sun"==t.substring(1,4)||"mon"==t.substring(1,4)||"tue"==t.substring(1,4)?1:-1;case"thu":return"sun"==t.substring(1,4)||"mon"==t.substring(1,4)||"tue"==t.substring(1,4)||"wed"==t.substring(1,4)?1:-1;case"fri":return"sun"==t.substring(1,4)||"mon"==t.substring(1,4)||"tue"==t.substring(1,4)||"wed"==t.substring(1,4)||"thu"==t.substring(1,4)?1:-1;case"sat":return 1}}return Number(e[0])-Number(t[0])}),t=e.indexOf(h)+1;t<e.length?(h=e[t],C()):disable(document.getElementById("btnNextEve"))},document.getElementById("btnChgImg").onclick=function(){w(!0),toggleEl(document.getElementById("frmChgImg"))},document.getElementById("inChgImg").addEventListener("change",function(e){var t;(g=e.target.files[0]).name=ultraClean(g.name,""),document.getElementById("inChgImgL").innerHTML=g.name,(t=new FileReader).readAsDataURL(g),t.onload=function(e){document.getElementById("prevMed").src=e.target.result}}),document.getElementById("inChgImgUrl").onchange=function(){document.getElementById("prevMed").src=document.getElementById("inChgImgUrl").value},document.getElementById("inMedSrc0").onclick=function(){b="home",w(!1),document.getElementById("inChgImg").setAttribute("required","true"),showEl(document.getElementById("inChgImgFileCont"))},document.getElementById("inMedSrc1").onclick=function(){b="out",w(!1),document.getElementById("inChgImgUrl").setAttribute("required","true"),showEl(document.getElementById("inChgImgUrlCont"))},document.getElementById("btnPrevCal").onclick=function(){s.timePrev=new firebase.firestore.Timestamp.fromMillis(new Date(Date.now()).getTime()+9e5),y()},document.getElementById("btnPrevMail").onclick=function(){s.timePrev=new firebase.firestore.Timestamp.fromMillis(new Date(Date.now()).getTime()+9e5),y()},document.getElementById("btnAprove").onclick=function(){s.revised[lang]&&s.revised[lang].includes(uid)?(s.revised[lang].splice(s.revised[lang].indexOf(uid),1),document.getElementById("btnAprove").innerHTML='<i class="far fa-check-square"></i>'):(s.revised[lang]||(s.revised[lang]=[]),s.revised[lang].push(uid),document.getElementById("btnAprove").innerHTML='<i class="fas fa-check-square"></i>'),M()?(s.finished=!0,T()):s.finished=!1,y()},$("#mdlPublish").on("show.bs.modal",function(e){M()?(showEl(document.getElementById("btnCnfPublish")),document.getElementById("mdlPublishTxt").innerText="El calendario está listo para publicar"):(hideEl(document.getElementById("btnCnfPublish")),document.getElementById("mdlPublishTxt").innerText="Para publicar es necesario que lo hayan aprovado al menos dos personas.")}),document.getElementById("btnCnfPublish").onclick=function(){s.public||(I(document.getElementById("barPublish"),0),showEl(document.getElementById("barPublishCont")),s.public=!0,I(document.getElementById("barPublish"),25),v().then(function(){I(document.getElementById("barPublish"),58),admin.database().ref("calendarios/"+a).set({pop:0},function(e){if(!e)return I(document.getElementById("barPublish"),100),classes(document.getElementById("barPublish"),"bg-success"),alertTop("Publicado correctamente ",1),setTimeout(function(){window.open(s.url,"_blank").focus()},2500),$("#mdlPublish").modal("hide"),console.log("Published "+a+" calendar"),null;alertTop("<strong>!Ha ocurrido un error! </strong>"+e,0),console.log(e)})}).catch(function(e){alertTop("<strong>!Ha ocurrido un error! </strong>"+e,0),console.log(e)}))};
},{"../styles/editCal.scss":"D94y"}]},{},["Pqf4"], null)
//# sourceMappingURL=/editCal.b9796534.js.map