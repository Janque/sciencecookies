parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"AnJc":[function(require,module,exports) {

},{}],"ppKG":[function(require,module,exports) {
"use strict";function e(e,a){return o(e)||l(e,a)||n(e,a)||t()}function t(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function n(e,t){if(e){if("string"==typeof e)return a(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?a(e,t):void 0}}function a(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=new Array(t);n<t;n++)a[n]=e[n];return a}function l(e,t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var n=[],a=!0,l=!1,o=void 0;try{for(var d,i=e[Symbol.iterator]();!(a=(d=i.next()).done)&&(n.push(d.value),!t||n.length!==t);a=!0);}catch(c){l=!0,o=c}finally{try{a||null==i.return||i.return()}finally{if(l)throw o}}return n}}function o(e){if(Array.isArray(e))return e}require("../styles/edit.scss");var d,i,c,r,s=firebase.storage(),u=firebase.database(),m=-1,p=-1,h=Date.now(),v=!1,b=-1,g=-1,f=-1,E=null,y=null,C=[];function M(){console.log("Saving...");var e=d.published.toDate(),t=e.getFullYear().toString();e.getMonth()<9&&(t+="0"),t+=e.getMonth()+1;var n="";switch(lang){case"es":n="galletas";break;case"en":n="cookies"}d.url="https://sciencecookies.net/"+n+"/"+t+"/"+d.file+"/",L();var a=[];return langs.forEach(function(e){if(e!=lang){var t={authors:d.authors,media:d.media,java:d.java,notify:d.notify,public:d.public,beenPublic:d.beenPublic,dledit:d.dledit,created:d.created,ledit:d.ledit,published:d.published,pop:d.pop,likes:d.likes,favs:d.favs,revised:d.revised,translations:d.translations};t.translations[lang]=d.url,a.push(db.collection("cookies/langs/"+e).doc(i).update(t))}}),Promise.all(a).then(function(){return c.update(d)})}function k(){M().then(function(){v&&clearInterval(r),v=!0,r=setInterval(function(){var e=Math.floor((Date.now()-h)/6e4);document.getElementById("tagLstSave").innerText=e<60?"Guardado hace "+e+" minutos":"Guardado hace "+Math.floor(e/60)+" horas"},300010),document.getElementById("tagLstSave").innerText="Se han guardado todos los cambios",h=Date.now()}).catch(function(e){document.getElementById("tagLstSave").innerText="Error, no se han guardado todos los cambios: "+e.code,console.log(e)})}function I(e){var t=null;"html"==e?t={type:e,html:""}:"parra"==e?t={type:e,text:"",title:"0"}:"youtube"==e?t={type:e,vidUrl:"",ratio:"16by9"}:"medSimple"==e&&(t={type:e,medUrl:"https://via.placeholder.com/150.webp",alt:"",caption:"",hasCapt:"true",width:"75%"}),null!=t&&d.cont.splice(p,0,t),T()}function w(e,t){t=Math.floor(t),e.setAttribute("aria-valuenow",t),e.style.width=t+"%",e.innerText=t+"%"}function B(e){return s.ref("cookieMedia/"+i+"/"+e).delete()}function A(){document.getElementById("contMedMan").innerHTML='<div class="col mb-4">\n        <div class="card text-dark bg-light h-100 cardBorder" style="border-color: #343a40;">\n            <a type="button" data-toggle="modal" data-target="#mdlAddMed" data-dismiss="modal" aria-label="Close" class="text-decoration-none text-dark h-100 d-flex align-items-center justify-content-center" onclick="addFrom=0;">\n                <h1 style="font-size: 6rem;" class="mb-0"><i class="far fa-plus-square"></i></h1>\n            </a>\n        </div>\n    </div>',document.getElementById("contMedCho").innerHTML='<div class="col mb-4">\n        <div class="card text-dark bg-light h-100 cardBorder" style="border-color: #343a40;">\n            <a type="button" data-toggle="modal" data-target="#mdlAddMed" data-dismiss="modal" aria-label="Close" class="text-decoration-none text-dark h-100 d-flex align-items-center justify-content-center" onclick="addFrom=1;">\n                <h1 style="font-size: 6rem;" class="mb-0"><i class="far fa-plus-square"></i></h1>\n            </a>\n        </div>\n    </div>',d.media.forEach(function(e,t){var n=document.createElement("div");classes(n,"col mb-4");var a=document.createElement("div");classes(a,"card text-light bg-dark"),n.appendChild(a);var l=document.createElement("img");classes(l,"card-img"),l.src=e.medUrl,a.appendChild(l);var o=document.createElement("div");classes(o,"card-img-overlay pt-0"),o.style.paddingLeft=".9rem",o.style.paddingRight=".9rem",a.appendChild(o);var i=document.createElement("div");classes(i,"row mb-2 p-0"),o.appendChild(i);var c=document.createElement("button");classes(c,"btn btn-light btn-scckie btn-sm"),c.innerHTML='<i class="fas fa-trash-alt"></i>',c.onclick=function(){g==t?(g=-1,document.getElementById("btnAlrtClsSsn")&&document.getElementById("btnAlrtClsSsn").click(),"externo"!=e.medFile?B(e.medFile).then(function(){e.medUrl==d.picUrl&&(d.picUrl=""),d.media.splice(t,1),k()}).catch(function(e){return console.log(e)}):(e.medUrl==d.picUrl&&(d.picUrl=""),d.media.splice(t,1),k())):(alertTop("<strong>¿Quieres eliminar esta imagen?</strong> Presiona de nuevo el botón para confirmar.",2),g=t,setTimeout(function(){g=-1},3e3))},i.appendChild(c);var r=document.createElement("div");classes(r,"tooltipn ml-auto");var s=document.createElement("button");classes(s,"btn btn-light btn-scckie btn-sm");var u=document.createElement("span");classes(u,"tooltipTextn"),u.innerHTML="Copiar",s.appendChild(u),s.innerHTML+='<i class="fas fa-link"></i>',s.onclick=function(){window.open(e.medUrl).focus(),u.innerHTML="URL copiado"},s.onmouseout=function(){u.innerHTML="Copiar"},r.appendChild(s),i.appendChild(r);var m=document.createElement("button"),p=document.createElement("button");e.medUrl==d.picUrl?(classes(m,"btn btn-light btn-scckie btn-sm ml-1"),m.innerHTML='<i class="fas fa-star"></i>',m.onclick=function(){d.picUrl="",k()},i.appendChild(m)):(classes(p,"btn btn-light btn-scckie btn-sm ml-1"),p.innerHTML='<i class="far fa-star"></i>',p.onclick=function(){d.picUrl=e.medUrl,k()},i.appendChild(p)),document.getElementById("contMedMan").appendChild(n);var h=document.createElement("div");classes(h,"col mb-4");var v=document.createElement("a");classes(v,"text-decoration-none"),v.setAttribute("type","button"),v.onclick=function(){-1!=f&&(d.cont[f].medUrl=e.medUrl,k())},v.setAttribute("data-dismiss","modal"),h.appendChild(v);var b=document.createElement("div");classes(b,"card text-light bg-dark"),v.appendChild(b);var E=document.createElement("img");classes(E,"card-img"),E.src=e.medUrl,b.appendChild(E),document.getElementById("contMedCho").appendChild(h)})}function T(){var e;document.getElementById("cont").innerHTML="",d.beenPublic?e=d.published:d.published=e=new firebase.firestore.Timestamp.now,d.cont.forEach(function(t,n){var a=document.createElement("div");a.id="sect"+n;var l=document.createElement("div");classes(l,"dropdown-divider mx-2"),"head"!=t.type&&a.appendChild(l);var o=document.createElement("div");o.id="sect"+n+"t";var i=document.createElement("div");classes(i,"d-none"),i.id="sect"+n+"f";var c,r,s,u,v=document.createElement("div");if(classes(v,"row mb-2 px-2"),"head"!=t.type&&"ref"!=t.type&&(c=document.createElement("button"),classes(c,"btn btn-light btn-link-scckie ml-2"),c.innerHTML='<i class="fas fa-trash-alt"></i>',c.onclick=function(){m==n?(m=-1,document.getElementById("btnAlrtClsSsn")&&document.getElementById("btnAlrtClsSsn").click(),d.cont.splice(n,1),T(),k()):(alertTop("<strong>¿Quieres eliminar esta sección?</strong> Presiona de nuevo el botón para confirmar.",2),m=n,setTimeout(function(){m=-1},3e3))},v.appendChild(c)),"ref"!=t.type&&(r=document.createElement("button"),classes(r,"btn btn-light btn-link-scckie ml-auto"),r.innerHTML='<i class="fas fa-edit"></i>',r.onclick=function(){if(toggleEl(r),toggleEl(s),toggleEl(i),"Se han guardado todos los cambios"==document.getElementById("tagLstSave").innerText){var e=Math.floor((Date.now()-h)/6e4);document.getElementById("tagLstSave").innerText=e>0?e>59?"Guardado hace "+Math.floor(e/60)+" horas":"Guardado hace "+e+" minutos":"Guardado hace "+Math.floor((Date.now()-h)/1e3)+" segundos"}},v.appendChild(r),s=document.createElement("button"),classes(s,"btn btn-light btn-link-scckie ml-auto d-none"),s.innerHTML='<i class="fas fa-check"></i>',s.onclick=function(){toggleEl(r),toggleEl(s),toggleEl(i),k()},v.appendChild(s),u=document.createElement("button"),classes(u,"btn btn-light btn-link-scckie mx-2"),u.innerHTML='<i class="fas fa-plus"></i>',u.setAttribute("data-toggle","modal"),u.setAttribute("data-target","#mdlPlusSect"),u.onclick=function(){p=n+1},v.appendChild(u)),a.appendChild(v),"head"==t.type){var b=e.toDate();b=b.getDate()+"/"+(b.getMonth()+1)+"/"+b.getFullYear();var g=d.ledit.toDate();g=g.getDate()+"/"+(g.getMonth()+1)+"/"+g.getFullYear();var E=document.createElement("h1");classes(E,"text-center"),E.innerHTML=d.cont[0].title,o.appendChild(E);var y=document.createElement("p");if(y.innerText="Publicado: "+b,o.appendChild(y),d.dledit){var C=document.createElement("p");C.innerText="Ultima actualización: "+g,o.appendChild(C)}var M=document.createElement("p");M.innerText="Autor(es):"+d.cont[0].author,o.appendChild(M);var I=document.createElement("div");classes(I,"row justify-content-center mb-2");var w=document.createElement("div");classes(w,"col col-lg-6");var B=document.createElement("input");classes(B,"form-control form-control-lg text-center"),B.setAttribute("type","text"),B.setAttribute("placeholder",d.cont[0].title),B.value=d.cont[0].title,w.appendChild(B),I.appendChild(w),i.appendChild(I),B.oninput=function(){d.title=d.cont[0].title=B.value.trim(),E.innerHTML=d.cont[0].title};var A=document.createElement("div");classes(A,"row mb-2");var x=document.createElement("label");classes(x,"col-sm-2 col-form-label"),x.innerText="Publicado: ";var L=document.createElement("div");classes(L,"col");var U=document.createElement("input");classes(U,"form-control"),U.setAttribute("type","text"),U.setAttribute("readonly","true"),U.value=b,L.appendChild(U),A.appendChild(x),A.appendChild(L),i.appendChild(A);var P=document.createElement("div"),H=document.createElement("label"),N=document.createElement("div"),S=document.createElement("input");d.dledit&&(classes(P,"row mb-2"),classes(H,"col-sm-2 col-form-label"),H.innerText="Ultima actualización: ",classes(N,"col"),classes(S,"form-control"),S.setAttribute("type","text"),S.setAttribute("readonly","true"),S.value=g,N.appendChild(S),P.appendChild(H),P.appendChild(N),i.appendChild(P));var D=document.createElement("div");classes(D,"row mb-2");var F=document.createElement("label");classes(F,"col-sm-2 col-form-label"),F.innerText="Autor(es): ";var j=document.createElement("div");classes(j,"form-row justify-content-around pt-2");var q=document.createElement("div");classes(q,"form-group col-auto mr-2");var J=document.createElement("div");classes(J,"form-check"),q.appendChild(J);var R=document.createElement("input");classes(R,"form-check-input"),R.setAttribute("type","checkbox"),d.cont[0].author.includes(" Andrea Garma")&&R.setAttribute("checked","true"),R.value=" Andrea Garma";var $=document.createElement("label");classes($,"form-check-label"),R.setAttribute("for","authr0"),$.innerText="Andrea Garma",J.appendChild(R),J.appendChild($),j.appendChild(q);var G=document.createElement("div");classes(G,"form-group col-auto mr-2");var O=document.createElement("div");classes(O,"form-check"),G.appendChild(O);var z=document.createElement("input");classes(z,"form-check-input"),z.setAttribute("type","checkbox"),d.cont[0].author.includes(" Javier Pantoja")&&z.setAttribute("checked","true"),z.value=" Javier Pantoja";var Y=document.createElement("label");classes(Y,"form-check-label"),z.setAttribute("for","authr1"),Y.innerText="Javier Pantoja",O.appendChild(z),O.appendChild(Y),j.appendChild(G);var V=document.createElement("div");classes(V,"form-group col-auto mr-2");var _=document.createElement("div");classes(_,"form-check"),V.appendChild(_);var Q=document.createElement("input");classes(Q,"form-check-input"),Q.setAttribute("type","checkbox"),d.cont[0].author.includes(" Paulina Vargas")&&Q.setAttribute("checked","true"),Q.value=" Paulina Vargas";var W=document.createElement("label");function K(e,t,n){var a=[];e&&a.push(" Andrea Garma"),t&&a.push(" Javier Pantoja"),n&&a.push(" Paulina Vargas"),a.empty&&a.push(" Anónimo"),d.cont[0].author=a.slice(),d.authors=a.slice(),M.innerText="Autor(es):"+d.cont[0].author}classes(W,"form-check-label"),Q.setAttribute("for","authr2"),W.innerText="Paulina Vargas",_.appendChild(Q),_.appendChild(W),j.appendChild(V),R.onclick=function(){K(R.checked,z.checked,Q.checked)},z.onclick=function(){K(R.checked,z.checked,Q.checked)},Q.onclick=function(){K(R.checked,z.checked,Q.checked)},D.appendChild(F),D.appendChild(j),i.appendChild(D)}else if("ref"==t.type){var X=document.createElement("h3");X.innerHTML="<br>Referencias",o.appendChild(X),t.ref.forEach(function(e,t){var a=document.createElement("div");classes(a,"row mb-2");var l=document.createElement("div");classes(l,"col"),a.appendChild(l);var i=document.createElement("div");classes(i,"col d-none"),a.appendChild(i);var c=document.createElement("div");classes(c,"col-auto"),a.appendChild(c);var r,s=document.createElement("p");function u(e){s.innerHTML=e}function m(e){s.innerHTML="",r=document.createElement("a"),classes(r,"text-warning text-break"),r.href=e,r.setAttribute("target","_blank"),r.setAttribute("rel","nofollow"),r.innerHTML=e+' <i class="fas fa-external-link-alt"></i>',s.appendChild(r)}function p(){E.value=E.value.trim(),d.cont[n].ref[t].link=f.value,d.cont[n].ref[t].type=E.value,"web"==e.type?(m(e.link),f.setAttribute("placeholder","https://google.com")):"cite"==e.type&&(u(e.link),f.setAttribute("placeholder","Referencia"))}l.appendChild(s),"web"==e.type?m(e.link):"cite"==e.type&&u(e.link);var v=document.createElement("div");classes(v,"row");var b=document.createElement("div");classes(b,"col");var g=document.createElement("div");classes(g,"col-auto");var f=document.createElement("input"),E=document.createElement("select");classes(f,"form-control"),f.setAttribute("type","text"),f.value=e.link,"web"==e.type&&f.setAttribute("placeholder","https://google.com"),"cite"==e.type&&f.setAttribute("placeholder","Referencia"),f.onchange=function(){p()},classes(E,"form-control form-control-sm");var y=document.createElement("option");y.value="web","web"==e.type&&y.setAttribute("selected","true"),y.innerText="Web",E.appendChild(y);var C,M,I=document.createElement("option");function w(){toggleEl(l),toggleEl(i),toggleEl(C),toggleEl(M)}"cite"==e.type&&I.setAttribute("selected","true"),I.value="cite",I.innerText="Otro",E.appendChild(I),E.onchange=function(){p()},b.appendChild(f),g.appendChild(E),v.appendChild(b),v.appendChild(g),i.appendChild(v),C=document.createElement("button"),classes(C,"btn btn-light btn-link-scckie ml-auto"),C.innerHTML='<i class="fas fa-edit"></i>',C.onclick=function(){w(),"Se han guardado todos los cambios"==document.getElementById("tagLstSave").innerText&&(document.getElementById("tagLstSave").innerText="Guardado hace "+Math.floor((Date.now()-h)/6e4)+" minutos")},M=document.createElement("button"),classes(M,"btn btn-light btn-link-scckie ml-auto d-none"),M.innerHTML='<i class="fas fa-check"></i>',M.onclick=function(){w(),d.cont[n].ref.sort(function(e,t){var n=e.link.toUpperCase(),a=t.link.toUpperCase();return n<a?-1:n>a?1:0}),k()},c.appendChild(C),c.appendChild(M);var B=document.createElement("button");classes(B,"btn btn-light btn-link-scckie ml-2"),B.innerHTML='<i class="fas fa-trash-alt"></i>',B.onclick=function(){d.cont[n].ref.splice(t,1),k()},c.appendChild(B),o.appendChild(a),""==e.link&&C.click()});var Z=document.createElement("a");classes(Z,"btn btn-light btn-scckie"),Z.onclick=function(){te()},Z.innerHTML='<i class="fas fa-plus"></i>',X.appendChild(Z);var ee=document.createElement("a");function te(){d.cont[n].ref.push({type:"web",link:""}),T()}classes(ee,"btn btn-light btn-scckie btn-lg btn-block border border-light"),ee.onclick=function(){te()},ee.innerHTML='<i class="fas fa-plus"></i>',o.appendChild(ee)}else if("parra"==t.type){var ne;Number(t.title)>0&&(2==Number(t.title)&&(o.innerHTML="<br>"),(ne=document.createElement("h"+t.title)).innerHTML=t.titleTxt,o.appendChild(ne));var ae=document.createElement("p");ae.innerHTML=t.text,o.appendChild(ae);var le=document.createElement("div");classes(le,"row");var oe=document.createElement("div");classes(oe,"col");var de=document.createElement("div");classes(de,"col-auto");var ie=document.createElement("input"),ce=document.createElement("select");classes(ie,"form-control"),ie.setAttribute("type","text"),Number(t.title)>0?(ie.value=t.titleTxt,ie.setAttribute("placeholder","Subtítulo"),ie.removeAttribute("readonly")):(ie.value="",ie.setAttribute("placeholder",""),ie.setAttribute("readonly","true")),ie.oninput=function(){d.cont[n].titleTxt=ne.innerHTML=ie.value},classes(ce,"form-control form-control-sm");for(var re=0;re<7;re++){var se=document.createElement("option");se.value=re,t.title==re&&se.setAttribute("selected","true"),se.innerText=re,ce.appendChild(se)}ce.oninput=function(){d.cont[n].title=ce.value,Number(ce.value)>0?(ie.setAttribute("placeholder","Subtítulo"),ie.removeAttribute("readonly"),2==Number(t.title)?o.innerHTML="<br>":o.innerHTML="",(ne=document.createElement("h"+t.title)).innerHTML=d.cont[n].titleTxt=ie.value,o.appendChild(ne),o.appendChild(ae)):(ie.value="",ie.setAttribute("placeholder",""),ie.setAttribute("readonly","true"),d.cont[n].titleTxt=ie.value,o.innerHTML="",o.appendChild(ae))},oe.appendChild(ie),de.appendChild(ce),le.appendChild(oe),le.appendChild(de),i.appendChild(le);var ue=document.createElement("div");classes(le,"row mb-2");var me=document.createElement("div");classes(oe,"col");var pe=document.createElement("textarea");classes(pe,"form-control"),pe.setAttribute("rows","8"),pe.value=t.text,pe.oninput=function(){d.cont[n].text=ae.innerHTML=pe.value.trim()},me.appendChild(pe),ue.appendChild(me),i.appendChild(ue),Number(t.title)>0&&""==t.titleTxt&&r.click()}else if("html"==t.type){var he=document.createElement("div");he.innerHTML=t.html,o.appendChild(he);var ve=document.createElement("div");classes(ve,"row mb-2");var be=document.createElement("div");classes(be,"col");var ge=document.createElement("textarea");classes(ge,"form-control"),ge.setAttribute("rows","8"),ge.value=t.html,ge.onchange=function(){d.cont[n].html=he.innerHTML=ge.value.trim()},be.appendChild(ge),ve.appendChild(be),i.appendChild(ve),""==t.html&&r.click()}else if("youtube"==t.type){var fe=document.createElement("div");classes(fe,"embed-responsive embed-responsive-"+t.ratio);var Ee=document.createElement("iframe");Ee.src=t.vidUrl,Ee.setAttribute("frameborder","0"),Ee.setAttribute("allow","accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"),Ee.setAttribute("allowfullscreen","true"),fe.appendChild(Ee),o.appendChild(fe);var ye=document.createElement("div");classes(ye,"row");var Ce=document.createElement("div");classes(Ce,"col");var Me=document.createElement("div");classes(Me,"col-auto");var ke=document.createElement("label");ke.innerText="URL";var Ie=document.createElement("input");classes(Ie,"form-control"),Ie.setAttribute("type","text"),Ie.value=t.vidUrl,Ie.onchange=function(){var e=Ie.value.trim();if(11==e.length)e="https://www.youtube.com/embed/"+e;else{var t,a=1;do{t=e[a-1]+e[a],a++}while("e/"!=t&&"v="!=t);e="https://www.youtube.com/embed/"+e.substr(a,11)}d.cont[n].vidUrl=Ee.src=e};var we=document.createElement("small");classes(we,"text-muted"),we.innerText="aaaaaaaaaaa o https://youtu.be/aaaaaaaaaaa o https://www.youtube.com/watch?v=aaaaaaaaaaa";var Be=document.createElement("label");Be.innerText="Ratio";var Ae=document.createElement("select");classes(Ae,"form-control form-control-sm");for(var Te=["21by9","16by9","4by3","1by1"],xe=0;xe<4;xe++){var Le=document.createElement("option");Le.value=Te[xe],t.ratio==Te[xe]&&Le.setAttribute("selected","true"),Le.innerText=Te[xe].replaceAll("by",":"),Ae.appendChild(Le)}Ae.oninput=function(){d.cont[n].ratio=Ae.value,Te.forEach(function(e){fe.classList.remove("embed-responsive-"+e)}),classes(fe,"embed-responsive-"+t.ratio)},Ce.appendChild(ke),Ce.appendChild(Ie),Ce.appendChild(we),Me.appendChild(Be),Me.appendChild(Ae),ye.appendChild(Ce),ye.appendChild(Me),i.appendChild(ye),""==t.vidUrl&&r.click()}else if("medSimple"==t.type){var Ue=document.createElement("figure");classes(Ue,"mx-auto"),Ue.style.width=t.width,Ue.style.position="relative",Ue.style.borderRadius=".25rem";var Pe=document.createElement("img");Pe.setAttribute("alt",t.alt),Pe.src=t.medUrl,classes(Pe,"w-100"),Ue.appendChild(Pe);var He=document.createElement("div");classes(He,"card-img-overlay pt-0"),He.style.paddingLeft=".9rem",He.style.paddingRight=".9rem";var Ne=document.createElement("div");classes(Ne,"row mb-2 p-0"),He.appendChild(Ne);var Se=document.createElement("button");classes(Se,"btn btn-light btn-scckie btn-sm ml-auto"),Se.innerHTML='<i class="fas fa-exchange-alt"></i>',Se.setAttribute("data-toggle","modal"),Se.setAttribute("data-target","#mdlMedCho"),Se.onclick=function(){f=n},Ne.appendChild(Se),Ue.appendChild(He);var De=document.createElement("figcaption");De.style.fontSize="70%",De.style.fontWeight="lighter",De.innerHTML=t.caption,t.hasCapt&&Ue.appendChild(De),o.appendChild(Ue);var Fe=document.createElement("div");classes(Fe,"form-group mb-2");var je=document.createElement("label");je.innerText="Tamaño";var qe=document.createElement("div");classes(qe,"row");var Je=document.createElement("div");classes(Je,"col align-center d-flex pr-0");var Re=document.createElement("input");Re.setAttribute("type","range"),Re.setAttribute("max","100"),Re.setAttribute("min","0"),Re.setAttribute("step","1"),Re.value="75",classes(Re,"form-control-range"),Re.oninput=function(){$e.innerHTML=Re.value+"%",Ue.style.width=d.cont[n].width=Re.value+"%"},Je.appendChild(Re);var $e=document.createElement("span");classes($e,"badge badge-primary range-value-L"),$e.innerText="75%";var Ge=document.createElement("div");classes(Ge,"col-auto"),Ge.appendChild($e),qe.appendChild(Je),qe.appendChild(Ge),Fe.appendChild(je),Fe.appendChild(qe),i.appendChild(Fe);var Oe=document.createElement("div");classes(Oe,"row");var ze=document.createElement("div");classes(ze,"col");var Ye=document.createElement("div");classes(Ye,"col-auto");var Ve=document.createElement("label");Ve.innerText="Pie de foto";var _e=document.createElement("input");classes(_e,"form-control"),_e.setAttribute("type","text"),_e.value=t.caption,_e.oninput=function(){De.innerHTML=d.cont[n].caption=_e.value.trim()};var Qe=document.createElement("select");classes(Qe,"form-control form-control-sm");var We=document.createElement("option");We.value="true","true"==t.hasCapt&&We.setAttribute("selected","true"),We.innerText="Sí",Qe.appendChild(We);var Ke=document.createElement("option");Ke.value="false","false"==t.hasCapt&&Ke.setAttribute("selected","true"),Ke.innerText="No",Qe.appendChild(Ke),Qe.oninput=function(){d.cont[n].hasCapt=Qe.value,"true"==Qe.value?(De.innerHTML=_e.value=d.cont[n].caption,_e.removeAttribute("readonly"),Ue.appendChild(De)):(_e.value=d.cont[n].caption="",_e.setAttribute("readonly","true"),De.innerHTML="",Ue.innerHTML="",Ue.appendChild(Pe),Ue.appendChild(He))},ze.appendChild(Ve),ze.appendChild(_e),Ye.appendChild(Qe),Oe.appendChild(ze),Oe.appendChild(Ye),i.appendChild(Oe);var Xe=document.createElement("div");classes(Xe,"row");var Ze=document.createElement("div");classes(Ze,"col");var et=document.createElement("label");et.innerText="Alt";var tt=document.createElement("input");classes(tt,"form-control"),tt.setAttribute("type","text"),tt.value=t.alt,tt.oninput=function(){d.cont[n].alt=tt.value.trim(),Pe.setAttribute("alt",tt.value.trim())},Ze.appendChild(et),Ze.appendChild(tt),Xe.appendChild(Ze),i.appendChild(Xe),"true"==t.hasCapt&&""==t.caption&&r.click()}a.appendChild(o),a.appendChild(i),document.getElementById("cont").appendChild(a)}),document.getElementById("inJava").innerText=d.java,document.getElementById("javaIns").innerHTML=d.java}function x(){w(document.getElementById("barPublish"),100),classes(document.getElementById("barPublish"),"bg-success"),alertTop("Publicado correctamente<strong></strong>",1),setTimeout(function(){window.open(d.url,"_blank").focus()},2500),console.log("Data saved successfully."),$("#mdlPublish").modal("hide")}function L(){var t=0;function n(){w(document.getElementById("barPublish"),t)}(C=[]).push(d.published.toDate().getFullYear().toString()),C.push(d.ledit.toDate().getFullYear().toString()),t++,n(),allCats.forEach(function(e,t){document.getElementById("cat"+t).checked&&C.push(e)}),t++,n(),d.authors.forEach(function(e){e.substring(1).split(" ").forEach(function(e){C.push(ultraClean(e,""))}),t+=3/d.authors.length,n()});var a=[];d.title.split(" ").forEach(function(e){a.push(e.replaceAll(/(<([^>]*)>)/gi," ").trim())}),t++,n(),d.description.split(" ").forEach(function(e){a.push(e.replaceAll(/(<([^>]*)>)/gi," ").trim()),t+=3/d.description.split(" ").length,n()}),d.cont.forEach(function(e){"parra"==e.type?(Number(e.title)>0&&e.titleTxt.split(" ").forEach(function(e){a.push(e.replaceAll(/(<([^>]*)>)/gi," ").trim())}),e.text.split(" ").forEach(function(l){a.push(l.replaceAll(/(<([^>]*)>)/gi," ").trim()),t+=14/d.cont.length/e.text.split(" ").length,n()})):"medSimple"==e.type&&(""!=e.alt&&e.alt.split(" ").forEach(function(e){a.push(e.replaceAll(/(<([^>]*)>)/gi," ").trim())}),""!=e.caption&&e.caption.split(" ").forEach(function(e){a.push(e.replaceAll(/(<([^>]*)>)/gi," ").trim())}),t+=14/d.cont.length,n())});for(var l=[],o=a.length,i=0;i<o;i++){var c=a[i];-1!=c.indexOf(" ")&&(c.split(" ").forEach(function(e){l.push(e)}),a.splice(i,1),i--,o--)}l.forEach(function(e){a.push(e)}),t++,n(),o=a.length;for(var r=0;r<o;r++)a.splice(r,1,ultraClean(a[r],"")),t+=3/a.length,n();var s={},u=0,m=0,p=["1","2","3","4","6","7","8","9","0","tan","ser","los","serian","pero","podemos","su","o","y","e","la","del","es","si","en","otro","de","tendrian","no","se","una","mas","el","a","embargo","las","sin","con","un","para","por","les","","vez","gran","este","esta","estos","estas","nos","al","dio","has","preguntado","el","lo","tu","tus","hacen","otros","para","ellos","ellas","ese","esa","esos","esas","detras","delante","nos","le","muy","casi","son","pues","a","ha","han","fue"];a.forEach(function(e){p.includes(e)||(s[e]?s[e]++:(s[e]=1,m++),u++);t+=3/a.length,n()});for(var h=0,v=Object.entries(s);h<v.length;h++){var b=e(v[h],2),g=b[0];b[1]>u/m&&C.push(g),t+=3/Object.entries(s).length,n()}d.cats=C,console.log(C)}window.loaded=function(){(c=cookiesFSRef.doc(urlSrch.get("id"))).onSnapshot(function(e){d=e.data(),i=e.id,document.getElementById("inFile").value=d.file,document.getElementById("inDesc").value=d.description,T(),A(),d.public?(document.getElementById("btnPrivate").classList.remove("d-none"),document.getElementById("btnAprove").classList.add("d-none"),document.getElementById("btnPub").classList.add("d-none")):(document.getElementById("btnPrivate").classList.add("d-none"),document.getElementById("btnAprove").classList.remove("d-none"),document.getElementById("btnPub").classList.remove("d-none")),d.revised[lang]&&d.revised[lang].includes(uid)?document.getElementById("btnAprove").innerHTML='<i class="fas fa-check-square"></i>':document.getElementById("btnAprove").innerHTML='<i class="far fa-check-square"></i>',document.getElementById("btnPrevCook").href=d.url,document.getElementById("btnPrevMail").href="../vista-email/"+d.file},function(e){console.log(e)}),document.getElementById("frmFile").addEventListener("submit",function(e){var t;e.preventDefault(),t=document.getElementById("inFile").value,c.get().then(function(e){e.empty||t==d.file?(d.description=document.getElementById("inDesc").value.trim(),d.file=t,k()):alertTop("Ese nombre de archivo ya esta en uso.",0,"alrtPlusContainer")}).then(function(){console.log("exito")}).catch(function(e){return console.log(e)})}),document.getElementById("frmAddMed").addEventListener("submit",function(e){e.preventDefault(),w(document.getElementById("barNewMed"),0),showEl(document.getElementById("barNewMedCont")),hideEl(document.getElementById("frmAddMed")),document.getElementById("btnCnfNewMed").setAttribute("disabled","true"),document.getElementById("btnCanNewMed0").setAttribute("disabled","true"),document.getElementById("btnCanNewMed1").setAttribute("disabled","true"),"home"==y?function e(t){var n=s.ref("cookieMedia/"+i+"/i"+t+E.name);n.getDownloadURL().then(function(n){e(t+1)}).catch(function(e){"storage/object-not-found"==e.code?n.put(E).on("state_changed",function(e){w(document.getElementById("barNewMed"),e.bytesTransferred/e.totalBytes*100)},function(e){alertTop("<strong>¡Ocurrió un error!</strong> "+e.code,0),console.log(e),$("#mdlAddMed").modal("hide")},function(){n.getDownloadURL().then(function(e){d.media.push({medFile:"i"+t+E.name,medUrl:e}),k(),A(),$("#mdlAddMed").modal("hide"),0==b?$("#mdlMedMan").modal("show"):$("#mdlMedCho").modal("show")}).catch(function(e){console.log(e)})}):console.log(e)})}(0):(d.media.push({medFile:"externo",medUrl:document.getElementById("inNewMedUrl").value}),k(),$("#mdlAddMed").modal("hide"),0==b?$("#mdlMedMan").modal("show"):$("#mdlMedCho").modal("show"))})},document.getElementById("inFile").oninput=function(){document.getElementById("inFile").value=ultraClean(document.getElementById("inFile").value,"-")},document.getElementById("inJava").onchange=function(){d.java=document.getElementById("javaIns").innerHTML=document.getElementById("inJava").value},document.getElementById("btnEditJs").onclick=function(){toggleEl(document.getElementById("btnEditJs")),toggleEl(document.getElementById("btnCheckJs")),document.getElementById("inJava").removeAttribute("readonly")},document.getElementById("btnCheckJs").onclick=function(){toggleEl(document.getElementById("btnEditJs")),toggleEl(document.getElementById("btnCheckJs")),document.getElementById("inJava").setAttribute("readonly","true"),k()},$("#mdlAddMed").on("hidden.bs.modal",function(e){document.getElementById("prevNewMed").src="",document.getElementById("inNewMedL").innerHTML="Elige una imagen",document.getElementById("inNewMedUrl").value="",document.getElementById("inNewMed").removeAttribute("required"),document.getElementById("inNewMedUrl").removeAttribute("required"),hideEl(document.getElementById("barNewMedCont")),hideEl(document.getElementById("inNewMedFileCont")),hideEl(document.getElementById("inNewMedUrlCont")),showEl(document.getElementById("frmAddMed")),document.getElementById("btnCnfNewMed").removeAttribute("disabled"),document.getElementById("btnCanNewMed0").removeAttribute("disabled"),document.getElementById("btnCanNewMed1").removeAttribute("disabled")}),document.getElementById("inNewMed").addEventListener("change",function(e){var t;(E=e.target.files[0]).name=ultraClean(E.name,""),document.getElementById("inNewMedL").innerHTML=E.name,(t=new FileReader).readAsDataURL(E),t.onload=function(e){document.getElementById("prevNewMed").src=e.target.result}}),document.getElementById("inNewMedUrl").onchange=function(){document.getElementById("prevNewMed").src=document.getElementById("inNewMedUrl").value},document.getElementById("inMedSrc0").onclick=function(){y="home",document.getElementById("inNewMed").setAttribute("required","true"),document.getElementById("inNewMedUrl").removeAttribute("required"),showEl(document.getElementById("inNewMedFileCont")),hideEl(document.getElementById("inNewMedUrlCont"))},document.getElementById("inMedSrc1").onclick=function(){y="out",document.getElementById("inNewMed").removeAttribute("required"),document.getElementById("inNewMedUrl").setAttribute("required","true"),hideEl(document.getElementById("inNewMedFileCont")),showEl(document.getElementById("inNewMedUrlCont"))},document.getElementById("inSendUpt").onclick=function(){document.getElementById("inSendUpt").checked?(showEl(document.getElementById("uptDescCont")),document.getElementById("inUptDesc").setAttribute("required","true")):(hideEl(document.getElementById("uptDescCont")),document.getElementById("inUptDesc").removeAttribute("required"))},document.getElementById("btnPrevCook").onclick=function(){d.timePrev=new firebase.firestore.Timestamp.fromMillis(new Date(Date.now()).getTime()+9e5),k()},document.getElementById("btnPrevMail").onclick=function(){d.timePrev=new firebase.firestore.Timestamp.fromMillis(new Date(Date.now()).getTime()+9e5),k()},document.getElementById("btnPrivate").onclick=function(){d.public=!1,k()},document.getElementById("btnAprove").onclick=function(){d.revised[lang]&&d.revised[lang].includes(uid)?(d.revised[lang].splice(d.revised[lang].indexOf(uid),1),document.getElementById("btnAprove").innerHTML='<i class="far fa-check-square"></i>'):(d.revised[lang]||(d.revised[lang]=[]),d.revised[lang].push(uid),document.getElementById("btnAprove").innerHTML='<i class="fas fa-check-square"></i>'),k()},$("#mdlAddMed").on("hiden.bs.modal",function(e){document.getElementById("inMedSrc0").setAttribute("checked","false"),document.getElementById("inMedSrc1").setAttribute("checked","false"),document.getElementById("inNewMed").removeAttribute("required"),document.getElementById("inNewMedUrl").removeAttribute("required"),hideEl(document.getElementById("inNewMedFileCont")),hideEl(document.getElementById("inNewMedUrlCont"))}),$("#mdlPublish").on("show.bs.modal",function(e){var t=0;langs.forEach(function(e){var n=d.revised[e]?d.revised[e].length:0;d.revised[e]&&!d.revised[e].includes(uid)&&n++,n>=2&&t++}),t==langs.length?(classes(document.getElementById("btnCnfPublish"),"d-none"),document.getElementById("mdlPublishTxt").innerText="Para publicar es necesario que lo hayan aprovado al menos dos personas.",document.getElementById("frmPublish").classList.add("d-none")):(document.getElementById("btnCnfPublish").classList.remove("d-none"),document.getElementById("mdlPublishTxt").innerText="La galleta está lista para publicar",document.getElementById("frmPublish").classList.remove("d-none"),d.beenPublic&&document.getElementById("sendUptCont").classList.remove("d-none"))}),document.getElementById("btnCnfPublish").onclick=function(){d.public||(w(document.getElementById("barPublish"),0),showEl(document.getElementById("barPublishCont")),d.public=!0,d.ledit=new firebase.firestore.Timestamp.now,d.beenPublic=!0,d.revised={},w(document.getElementById("barPublish"),31),d.beenPublic?(document.getElementById("inSendUpt").checked?(d.dledit=!0,d.notify=!0):(d.dledit=!1,d.notify=!1),w(document.getElementById("barPublish"),45),document.getElementById("inSendUpt").checked?(d.uptMsg=!0,d.uptDescrip=document.getElementById("inUptDesc").value.trim()):(d.uptMsg=!1,d.uptDescrip=""),w(document.getElementById("barPublish"),62)):(d.notify=!0,d.published=new firebase.firestore.Timestamp.now,w(document.getElementById("barPublish"),62)),M().then(function(){u.ref("galletas/"+i).set({pop:d.pop,likes:d.likes,favs:d.favs},function(e){e?console.log("Data could not be saved."+e):(w(document.getElementById("barPublish"),84),x())})}).catch(function(e){alertTop("<strong>!Ha ocurrido un error! </strong>"+e,0),console.log(e)}))};
},{"../styles/edit.scss":"AnJc"}]},{},["ppKG"], null)
//# sourceMappingURL=/edit.9cc6c6a3.js.map