parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"AnJc":[function(require,module,exports) {

},{}],"ppKG":[function(require,module,exports) {
"use strict";function e(e,a){return o(e)||l(e,a)||n(e,a)||t()}function t(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function n(e,t){if(e){if("string"==typeof e)return a(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?a(e,t):void 0}}function a(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=new Array(t);n<t;n++)a[n]=e[n];return a}function l(e,t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var n=[],a=!0,l=!1,o=void 0;try{for(var r,d=e[Symbol.iterator]();!(a=(r=d.next()).done)&&(n.push(r.value),!t||n.length!==t);a=!0);}catch(i){l=!0,o=i}finally{try{a||null==d.return||d.return()}finally{if(l)throw o}}return n}}function o(e){if(Array.isArray(e))return e}require("../styles/edit.scss");var r,d,i,c,s=firebase.storage(),u=firebase.database(),m=-1,p=-1,h=Date.now(),b=!1,g=-1,v=-1,f=-1,E=null,y=null,C=[];function I(){console.log("Saving...");var e=r.published.toDate(),t=e.getFullYear().toString();e.getMonth()<9&&(t+="0"),t+=e.getMonth()+1;var n="";switch(lang){case"es":n="galletas";break;case"en":n="cookies"}r.url="https://sciencecookies.net/"+n+"/"+t+"/"+r.file+"/",U();var a=[];return langs.forEach(function(e){if(e!=lang){var t={authors:r.authors,media:r.media,java:r.java,notify:r.notify,public:r.public,beenPublic:r.beenPublic,dledit:r.dledit,created:r.created,ledit:r.ledit,published:r.published,pop:r.pop,likes:r.likes,favs:r.favs,revised:r.revised,translations:r.translations};t.translations[lang]=r.url,a.push(db.collection("cookies/langs/"+e).doc(d).update(t))}}),Promise.all(a).then(function(){return i.update(r)})}function T(){I().then(function(){b&&clearInterval(c),b=!0,c=setInterval(function(){var e=Math.floor((Date.now()-h)/6e4);document.getElementById("tagLstSave").innerText=e<60?"Guardado hace "+e+" minutos":"Guardado hace "+Math.floor(e/60)+" horas"},300010),document.getElementById("tagLstSave").innerText="Se han guardado todos los cambios",h=Date.now()}).catch(function(e){document.getElementById("tagLstSave").innerText="Error, no se han guardado todos los cambios: "+e.code,console.log(e)})}function B(e){var t=null;"html"==e?t={type:e,html:""}:"parra"==e?t={type:e,text:"",title:"0"}:"youtube"==e?t={type:e,vidUrl:"",ratio:"16by9"}:"medSimple"==e&&(t={type:e,medUrl:"https://via.placeholder.com/150.webp",alt:"",caption:"",hasCapt:"true",width:"75%"}),null!=t&&r.cont.splice(p,0,t),x()}function M(e,t){t=Math.floor(t),e.setAttribute("aria-valuenow",t),e.style.width=t+"%",e.innerText=t+"%"}function k(e,t,n){t=Math.floor(t),n=Math.floor(n);for(var a=t;a<=n;a++)M(e,a)}function w(e){return s.ref("cookieMedia/"+d+"/"+e).delete()}function A(){document.getElementById("contMedMan").innerHTML='<div class="col mb-4">\n        <div class="card text-dark bg-light h-100 cardBorder" style="border-color: #343a40;">\n            <a type="button" data-toggle="modal" data-target="#mdlAddMed" data-dismiss="modal" aria-label="Close" class="text-decoration-none text-dark h-100 d-flex align-items-center justify-content-center" onclick="addFrom=0;">\n                <h1 style="font-size: 6rem;" class="mb-0"><i class="far fa-plus-square"></i></h1>\n            </a>\n        </div>\n    </div>',document.getElementById("contMedCho").innerHTML='<div class="col mb-4">\n        <div class="card text-dark bg-light h-100 cardBorder" style="border-color: #343a40;">\n            <a type="button" data-toggle="modal" data-target="#mdlAddMed" data-dismiss="modal" aria-label="Close" class="text-decoration-none text-dark h-100 d-flex align-items-center justify-content-center" onclick="addFrom=1;">\n                <h1 style="font-size: 6rem;" class="mb-0"><i class="far fa-plus-square"></i></h1>\n            </a>\n        </div>\n    </div>',r.media.forEach(function(e,t){var n=document.createElement("div");classes(n,"col mb-4");var a=document.createElement("div");classes(a,"card text-light bg-dark"),n.appendChild(a);var l=document.createElement("img");classes(l,"card-img"),l.src=e.medUrl,a.appendChild(l);var o=document.createElement("div");classes(o,"card-img-overlay pt-0"),o.style.paddingLeft=".9rem",o.style.paddingRight=".9rem",a.appendChild(o);var d=document.createElement("div");classes(d,"row mb-2 p-0"),o.appendChild(d);var i=document.createElement("button");classes(i,"btn btn-light btn-scckie btn-sm"),i.innerHTML='<i class="fas fa-trash-alt"></i>',i.onclick=function(){v==t?(v=-1,document.getElementById("btnAlrtClsSsn")&&document.getElementById("btnAlrtClsSsn").click(),"externo"!=e.medFile?w(e.medFile).then(function(){e.medUrl==r.picUrl&&(r.picUrl=""),r.media.splice(t,1),T()}).catch(function(e){return console.log(e)}):(e.medUrl==r.picUrl&&(r.picUrl=""),r.media.splice(t,1),T())):((lang="es")?alertTop("<strong>¿Quieres eliminar esta imagen?</strong> Presiona de nuevo el botón para confirmar.",2):(lang="en")&&alertTop("<strong>Do you want to delete this image? </strong> Press the button again to confirm.",2),v=t,setTimeout(function(){v=-1},3e3))},d.appendChild(i);var c=document.createElement("div");classes(c,"tooltipn ml-auto");var s=document.createElement("button");classes(s,"btn btn-light btn-scckie btn-sm");var u=document.createElement("span");classes(u,"tooltipTextn"),u.innerHTML="Copiar",s.appendChild(u),s.innerHTML+='<i class="fas fa-link"></i>',s.onclick=function(){window.open(e.medUrl).focus(),u.innerHTML="URL copiado"},s.onmouseout=function(){u.innerHTML="Copiar"},c.appendChild(s),d.appendChild(c);var m=document.createElement("button"),p=document.createElement("button");e.medUrl==r.picUrl?(classes(m,"btn btn-light btn-scckie btn-sm ml-1"),m.innerHTML='<i class="fas fa-star"></i>',m.onclick=function(){r.picUrl="",T()},d.appendChild(m)):(classes(p,"btn btn-light btn-scckie btn-sm ml-1"),p.innerHTML='<i class="far fa-star"></i>',p.onclick=function(){r.picUrl=e.medUrl,T()},d.appendChild(p)),document.getElementById("contMedMan").appendChild(n);var h=document.createElement("div");classes(h,"col mb-4");var b=document.createElement("a");classes(b,"text-decoration-none"),b.setAttribute("type","button"),b.onclick=function(){-1!=f&&(r.cont[f].medUrl=e.medUrl,T())},b.setAttribute("data-dismiss","modal"),h.appendChild(b);var g=document.createElement("div");classes(g,"card text-light bg-dark"),b.appendChild(g);var E=document.createElement("img");classes(E,"card-img"),E.src=e.medUrl,g.appendChild(E),document.getElementById("contMedCho").appendChild(h)})}function x(){var e;document.getElementById("cont").innerHTML="",r.beenPublic?e=r.published:r.published=e=new firebase.firestore.Timestamp.now,r.cont.forEach(function(t,n){var a=document.createElement("div");a.id="sect"+n;var l=document.createElement("div");classes(l,"dropdown-divider mx-2"),"head"!=t.type&&a.appendChild(l);var o=document.createElement("div");o.id="sect"+n+"t";var d=document.createElement("div");classes(d,"d-none"),d.id="sect"+n+"f";var i,c,s,u,b=document.createElement("div");if(classes(b,"row mb-2 px-2"),"head"!=t.type&&"ref"!=t.type&&(i=document.createElement("button"),classes(i,"btn btn-light btn-link-scckie ml-2"),i.innerHTML='<i class="fas fa-trash-alt"></i>',i.onclick=function(){m==n?(m=-1,document.getElementById("btnAlrtClsSsn")&&document.getElementById("btnAlrtClsSsn").click(),r.cont.splice(n,1),x(),T()):((lang="es")?alertTop("<strong>¿Quieres eliminar esta sección?</strong> Presiona de nuevo el botón para confirmar.",2):(lang="en")&&alertTop("<strong>Do you want to delete this section? </strong> Press the button again to confirm.",2),m=n,setTimeout(function(){m=-1},3e3))},b.appendChild(i)),"ref"!=t.type&&(c=document.createElement("button"),classes(c,"btn btn-light btn-link-scckie ml-auto"),c.innerHTML='<i class="fas fa-edit"></i>',c.onclick=function(){if(toggleEl(c),toggleEl(s),toggleEl(d),"Se han guardado todos los cambios"==document.getElementById("tagLstSave").innerText){var e=Math.floor((Date.now()-h)/6e4);document.getElementById("tagLstSave").innerText=e>0?e>59?"Guardado hace "+Math.floor(e/60)+" horas":"Guardado hace "+e+" minutos":"Guardado hace "+Math.floor((Date.now()-h)/1e3)+" segundos"}},b.appendChild(c),s=document.createElement("button"),classes(s,"btn btn-light btn-link-scckie ml-auto d-none"),s.innerHTML='<i class="fas fa-check"></i>',s.onclick=function(){toggleEl(c),toggleEl(s),toggleEl(d),T()},b.appendChild(s),u=document.createElement("button"),classes(u,"btn btn-light btn-link-scckie mx-2"),u.innerHTML='<i class="fas fa-plus"></i>',u.setAttribute("data-toggle","modal"),u.setAttribute("data-target","#mdlPlusSect"),u.onclick=function(){p=n+1},b.appendChild(u)),a.appendChild(b),"head"==t.type){var g=e.toDate();g=g.getDate()+"/"+(g.getMonth()+1)+"/"+g.getFullYear();var v=r.ledit.toDate();v=v.getDate()+"/"+(v.getMonth()+1)+"/"+v.getFullYear();var E=document.createElement("h1");classes(E,"text-center"),E.innerHTML=r.cont[0].title,o.appendChild(E);var y=document.createElement("p");if(y.innerText="Publicado: "+g,o.appendChild(y),r.dledit){var C=document.createElement("p");C.innerText="Ultima actualización: "+v,o.appendChild(C)}var I=document.createElement("p");I.innerText="Autor(es):"+r.cont[0].author,o.appendChild(I);var B=document.createElement("div");classes(B,"row justify-content-center mb-2");var M=document.createElement("div");classes(M,"col col-lg-6");var k=document.createElement("input");classes(k,"form-control form-control-lg text-center"),k.setAttribute("type","text"),k.setAttribute("placeholder",r.cont[0].title),k.value=r.cont[0].title,M.appendChild(k),B.appendChild(M),d.appendChild(B),k.oninput=function(){r.title=r.cont[0].title=k.value.trim(),E.innerHTML=r.cont[0].title};var w=document.createElement("div");classes(w,"row mb-2");var A=document.createElement("label");classes(A,"col-sm-2 col-form-label"),A.innerText="Publicado: ";var L=document.createElement("div");classes(L,"col");var P=document.createElement("input");classes(P,"form-control"),P.setAttribute("type","text"),P.setAttribute("readonly","true"),P.value=g,L.appendChild(P),w.appendChild(A),w.appendChild(L),d.appendChild(w);var U=document.createElement("div"),H=document.createElement("label"),N=document.createElement("div"),S=document.createElement("input");r.dledit&&(classes(U,"row mb-2"),classes(H,"col-sm-2 col-form-label"),H.innerText="Ultima actualización: ",classes(N,"col"),classes(S,"form-control"),S.setAttribute("type","text"),S.setAttribute("readonly","true"),S.value=v,N.appendChild(S),U.appendChild(H),U.appendChild(N),d.appendChild(U));var D=document.createElement("div");classes(D,"row mb-2");var F=document.createElement("label");classes(F,"col-sm-2 col-form-label"),F.innerText="Autor(es): ";var j=document.createElement("div");classes(j,"form-row justify-content-around pt-2");var q=document.createElement("div");classes(q,"form-group col-auto mr-2");var J=document.createElement("div");classes(J,"form-check"),q.appendChild(J);var R=document.createElement("input");classes(R,"form-check-input"),R.setAttribute("type","checkbox"),r.cont[0].author.includes(" Andrea Garma")&&R.setAttribute("checked","true"),R.value=" Andrea Garma";var $=document.createElement("label");classes($,"form-check-label"),R.setAttribute("for","authr0"),$.innerText="Andrea Garma",J.appendChild(R),J.appendChild($),j.appendChild(q);var G=document.createElement("div");classes(G,"form-group col-auto mr-2");var O=document.createElement("div");classes(O,"form-check"),G.appendChild(O);var z=document.createElement("input");classes(z,"form-check-input"),z.setAttribute("type","checkbox"),r.cont[0].author.includes(" Javier Pantoja")&&z.setAttribute("checked","true"),z.value=" Javier Pantoja";var Y=document.createElement("label");classes(Y,"form-check-label"),z.setAttribute("for","authr1"),Y.innerText="Javier Pantoja",O.appendChild(z),O.appendChild(Y),j.appendChild(G);var V=document.createElement("div");classes(V,"form-group col-auto mr-2");var _=document.createElement("div");classes(_,"form-check"),V.appendChild(_);var Q=document.createElement("input");classes(Q,"form-check-input"),Q.setAttribute("type","checkbox"),r.cont[0].author.includes(" Paulina Vargas")&&Q.setAttribute("checked","true"),Q.value=" Paulina Vargas";var W=document.createElement("label");function K(e,t,n){var a=[];e&&a.push(" Andrea Garma"),t&&a.push(" Javier Pantoja"),n&&a.push(" Paulina Vargas"),a.empty&&a.push(" Anónimo"),r.cont[0].author=a.slice(),r.authors=a.slice(),I.innerText="Autor(es):"+r.cont[0].author}classes(W,"form-check-label"),Q.setAttribute("for","authr2"),W.innerText="Paulina Vargas",_.appendChild(Q),_.appendChild(W),j.appendChild(V),R.onclick=function(){K(R.checked,z.checked,Q.checked)},z.onclick=function(){K(R.checked,z.checked,Q.checked)},Q.onclick=function(){K(R.checked,z.checked,Q.checked)},D.appendChild(F),D.appendChild(j),d.appendChild(D)}else if("ref"==t.type){var X=document.createElement("h3");X.innerHTML="<br>Referencias",o.appendChild(X),t.ref.forEach(function(e,t){var a=document.createElement("div");classes(a,"row mb-2");var l=document.createElement("div");classes(l,"col"),a.appendChild(l);var d=document.createElement("div");classes(d,"col d-none"),a.appendChild(d);var i=document.createElement("div");classes(i,"col-auto"),a.appendChild(i);var c,s=document.createElement("p");function u(e){s.innerHTML=e}function m(e){s.innerHTML="",c=document.createElement("a"),classes(c,"text-warning text-break"),c.href=e,c.setAttribute("target","_blank"),c.setAttribute("rel","nofollow"),c.innerHTML=e+' <i class="fas fa-external-link-alt"></i>',s.appendChild(c)}function p(){E.value=E.value.trim(),r.cont[n].ref[t].link=f.value,r.cont[n].ref[t].type=E.value,"web"==e.type?(m(e.link),f.setAttribute("placeholder","https://google.com")):"cite"==e.type&&(u(e.link),f.setAttribute("placeholder","Referencia"))}l.appendChild(s),"web"==e.type?m(e.link):"cite"==e.type&&u(e.link);var b=document.createElement("div");classes(b,"row");var g=document.createElement("div");classes(g,"col");var v=document.createElement("div");classes(v,"col-auto");var f=document.createElement("input"),E=document.createElement("select");classes(f,"form-control"),f.setAttribute("type","text"),f.value=e.link,"web"==e.type&&f.setAttribute("placeholder","https://google.com"),"cite"==e.type&&f.setAttribute("placeholder","Referencia"),f.onchange=function(){p()},classes(E,"form-control form-control-sm");var y=document.createElement("option");y.value="web","web"==e.type&&y.setAttribute("selected","true"),y.innerText="Web",E.appendChild(y);var C,I,B=document.createElement("option");function M(){toggleEl(l),toggleEl(d),toggleEl(C),toggleEl(I)}"cite"==e.type&&B.setAttribute("selected","true"),B.value="cite",B.innerText="Otro",E.appendChild(B),E.onchange=function(){p()},g.appendChild(f),v.appendChild(E),b.appendChild(g),b.appendChild(v),d.appendChild(b),C=document.createElement("button"),classes(C,"btn btn-light btn-link-scckie ml-auto"),C.innerHTML='<i class="fas fa-edit"></i>',C.onclick=function(){M(),"Se han guardado todos los cambios"==document.getElementById("tagLstSave").innerText&&(document.getElementById("tagLstSave").innerText="Guardado hace "+Math.floor((Date.now()-h)/6e4)+" minutos")},I=document.createElement("button"),classes(I,"btn btn-light btn-link-scckie ml-auto d-none"),I.innerHTML='<i class="fas fa-check"></i>',I.onclick=function(){M(),r.cont[n].ref.sort(function(e,t){var n=e.link.toUpperCase(),a=t.link.toUpperCase();return n<a?-1:n>a?1:0}),T()},i.appendChild(C),i.appendChild(I);var k=document.createElement("button");classes(k,"btn btn-light btn-link-scckie ml-2"),k.innerHTML='<i class="fas fa-trash-alt"></i>',k.onclick=function(){r.cont[n].ref.splice(t,1),T()},i.appendChild(k),o.appendChild(a),""==e.link&&C.click()});var Z=document.createElement("a");classes(Z,"btn btn-light btn-scckie"),Z.onclick=function(){te()},Z.innerHTML='<i class="fas fa-plus"></i>',X.appendChild(Z);var ee=document.createElement("a");function te(){r.cont[n].ref.push({type:"web",link:""}),x()}classes(ee,"btn btn-light btn-scckie btn-lg btn-block border border-light"),ee.onclick=function(){te()},ee.innerHTML='<i class="fas fa-plus"></i>',o.appendChild(ee)}else if("parra"==t.type){var ne;Number(t.title)>0&&(2==Number(t.title)&&(o.innerHTML="<br>"),(ne=document.createElement("h"+t.title)).innerHTML=t.titleTxt,o.appendChild(ne));var ae=document.createElement("p");ae.innerHTML=t.text,o.appendChild(ae);var le=document.createElement("div");classes(le,"row");var oe=document.createElement("div");classes(oe,"col");var re=document.createElement("div");classes(re,"col-auto");var de=document.createElement("input"),ie=document.createElement("select");classes(de,"form-control"),de.setAttribute("type","text"),Number(t.title)>0?(de.value=t.titleTxt,de.setAttribute("placeholder","Subtítulo"),de.removeAttribute("readonly")):(de.value="",de.setAttribute("placeholder",""),de.setAttribute("readonly","true")),de.oninput=function(){r.cont[n].titleTxt=ne.innerHTML=de.value},classes(ie,"form-control form-control-sm");for(var ce=0;ce<7;ce++){var se=document.createElement("option");se.value=ce,t.title==ce&&se.setAttribute("selected","true"),se.innerText=ce,ie.appendChild(se)}ie.oninput=function(){r.cont[n].title=ie.value,Number(ie.value)>0?(de.setAttribute("placeholder","Subtítulo"),de.removeAttribute("readonly"),2==Number(t.title)?o.innerHTML="<br>":o.innerHTML="",(ne=document.createElement("h"+t.title)).innerHTML=r.cont[n].titleTxt=de.value,o.appendChild(ne),o.appendChild(ae)):(de.value="",de.setAttribute("placeholder",""),de.setAttribute("readonly","true"),r.cont[n].titleTxt=de.value,o.innerHTML="",o.appendChild(ae))},oe.appendChild(de),re.appendChild(ie),le.appendChild(oe),le.appendChild(re),d.appendChild(le);var ue=document.createElement("div");classes(le,"row mb-2");var me=document.createElement("div");classes(oe,"col");var pe=document.createElement("textarea");classes(pe,"form-control"),pe.setAttribute("rows","8"),pe.value=t.text,pe.oninput=function(){r.cont[n].text=ae.innerHTML=pe.value.trim()},me.appendChild(pe),ue.appendChild(me),d.appendChild(ue),Number(t.title)>0&&""==t.titleTxt&&c.click()}else if("html"==t.type){var he=document.createElement("div");he.innerHTML=t.html,o.appendChild(he);var be=document.createElement("div");classes(be,"row mb-2");var ge=document.createElement("div");classes(ge,"col");var ve=document.createElement("textarea");classes(ve,"form-control"),ve.setAttribute("rows","8"),ve.value=t.html,ve.onchange=function(){r.cont[n].html=he.innerHTML=ve.value.trim()},ge.appendChild(ve),be.appendChild(ge),d.appendChild(be),""==t.html&&c.click()}else if("youtube"==t.type){var fe=document.createElement("div");classes(fe,"embed-responsive embed-responsive-"+t.ratio);var Ee=document.createElement("iframe");Ee.src=t.vidUrl,Ee.setAttribute("frameborder","0"),Ee.setAttribute("allow","accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"),Ee.setAttribute("allowfullscreen","true"),fe.appendChild(Ee),o.appendChild(fe);var ye=document.createElement("div");classes(ye,"row");var Ce=document.createElement("div");classes(Ce,"col");var Ie=document.createElement("div");classes(Ie,"col-auto");var Te=document.createElement("label");Te.innerText="URL";var Be=document.createElement("input");classes(Be,"form-control"),Be.setAttribute("type","text"),Be.value=t.vidUrl,Be.onchange=function(){var e=Be.value.trim();if(11==e.length)e="https://www.youtube.com/embed/"+e;else{var t,a=1;do{t=e[a-1]+e[a],a++}while("e/"!=t&&"v="!=t);e="https://www.youtube.com/embed/"+e.substr(a,11)}r.cont[n].vidUrl=Ee.src=e};var Me=document.createElement("small");classes(Me,"text-muted"),Me.innerText="aaaaaaaaaaa o https://youtu.be/aaaaaaaaaaa o https://www.youtube.com/watch?v=aaaaaaaaaaa";var ke=document.createElement("label");ke.innerText="Ratio";var we=document.createElement("select");classes(we,"form-control form-control-sm");for(var Ae=["21by9","16by9","4by3","1by1"],xe=0;xe<4;xe++){var Le=document.createElement("option");Le.value=Ae[xe],t.ratio==Ae[xe]&&Le.setAttribute("selected","true"),Le.innerText=Ae[xe].replaceAll("by",":"),we.appendChild(Le)}we.oninput=function(){r.cont[n].ratio=we.value,Ae.forEach(function(e){fe.classList.remove("embed-responsive-"+e)}),classes(fe,"embed-responsive-"+t.ratio)},Ce.appendChild(Te),Ce.appendChild(Be),Ce.appendChild(Me),Ie.appendChild(ke),Ie.appendChild(we),ye.appendChild(Ce),ye.appendChild(Ie),d.appendChild(ye),""==t.vidUrl&&c.click()}else if("medSimple"==t.type){var Pe=document.createElement("figure");classes(Pe,"mx-auto"),Pe.style.width=t.width,Pe.style.position="relative",Pe.style.borderRadius=".25rem";var Ue=document.createElement("img");Ue.setAttribute("alt",t.alt),Ue.src=t.medUrl,classes(Ue,"w-100"),Pe.appendChild(Ue);var He=document.createElement("div");classes(He,"card-img-overlay pt-0"),He.style.paddingLeft=".9rem",He.style.paddingRight=".9rem";var Ne=document.createElement("div");classes(Ne,"row mb-2 p-0"),He.appendChild(Ne);var Se=document.createElement("button");classes(Se,"btn btn-light btn-scckie btn-sm ml-auto"),Se.innerHTML='<i class="fas fa-exchange-alt"></i>',Se.setAttribute("data-toggle","modal"),Se.setAttribute("data-target","#mdlMedCho"),Se.onclick=function(){f=n},Ne.appendChild(Se),Pe.appendChild(He);var De=document.createElement("figcaption");De.style.fontSize="70%",De.style.fontWeight="lighter",De.innerHTML=t.caption,t.hasCapt&&Pe.appendChild(De),o.appendChild(Pe);var Fe=document.createElement("div");classes(Fe,"form-group mb-2");var je=document.createElement("label");je.innerText="Tamaño";var qe=document.createElement("div");classes(qe,"row");var Je=document.createElement("div");classes(Je,"col align-center d-flex pr-0");var Re=document.createElement("input");Re.setAttribute("type","range"),Re.setAttribute("max","100"),Re.setAttribute("min","0"),Re.setAttribute("step","1"),Re.value="75",classes(Re,"form-control-range"),Re.oninput=function(){$e.innerHTML=Re.value+"%",Pe.style.width=r.cont[n].width=Re.value+"%"},Je.appendChild(Re);var $e=document.createElement("span");classes($e,"badge badge-primary range-value-L"),$e.innerText="75%";var Ge=document.createElement("div");classes(Ge,"col-auto"),Ge.appendChild($e),qe.appendChild(Je),qe.appendChild(Ge),Fe.appendChild(je),Fe.appendChild(qe),d.appendChild(Fe);var Oe=document.createElement("div");classes(Oe,"row");var ze=document.createElement("div");classes(ze,"col");var Ye=document.createElement("div");classes(Ye,"col-auto");var Ve=document.createElement("label");Ve.innerText="Pie de foto";var _e=document.createElement("input");classes(_e,"form-control"),_e.setAttribute("type","text"),_e.value=t.caption,_e.oninput=function(){De.innerHTML=r.cont[n].caption=_e.value.trim()};var Qe=document.createElement("select");classes(Qe,"form-control form-control-sm");var We=document.createElement("option");We.value="true","true"==t.hasCapt&&We.setAttribute("selected","true"),We.innerText="Sí",Qe.appendChild(We);var Ke=document.createElement("option");Ke.value="false","false"==t.hasCapt&&Ke.setAttribute("selected","true"),Ke.innerText="No",Qe.appendChild(Ke),Qe.oninput=function(){r.cont[n].hasCapt=Qe.value,"true"==Qe.value?(De.innerHTML=_e.value=r.cont[n].caption,_e.removeAttribute("readonly"),Pe.appendChild(De)):(_e.value=r.cont[n].caption="",_e.setAttribute("readonly","true"),De.innerHTML="",Pe.innerHTML="",Pe.appendChild(Ue),Pe.appendChild(He))},ze.appendChild(Ve),ze.appendChild(_e),Ye.appendChild(Qe),Oe.appendChild(ze),Oe.appendChild(Ye),d.appendChild(Oe);var Xe=document.createElement("div");classes(Xe,"row");var Ze=document.createElement("div");classes(Ze,"col");var et=document.createElement("label");et.innerText="Alt";var tt=document.createElement("input");classes(tt,"form-control"),tt.setAttribute("type","text"),tt.value=t.alt,tt.oninput=function(){r.cont[n].alt=tt.value.trim(),Ue.setAttribute("alt",tt.value.trim())},Ze.appendChild(et),Ze.appendChild(tt),Xe.appendChild(Ze),d.appendChild(Xe),"true"==t.hasCapt&&""==t.caption&&c.click()}a.appendChild(o),a.appendChild(d),document.getElementById("cont").appendChild(a)}),document.getElementById("inJava").innerText=r.java,document.getElementById("javaIns").innerHTML=r.java}function L(){langs.forEach(function(e){if(e!=lang){var t=document.createElement("option");t.value=t.innerText=e,document.getElementById("inTransFrom").appendChild(t)}})}function P(){M(document.getElementById("barPublish"),100),classes(document.getElementById("barPublish"),"bg-success"),(lang="es")?alertTop("Publicado correctamente",1):(lang="en")&&alertTop("Published successfully",1),setTimeout(function(){window.open(r.url,"_blank").focus()},2500),console.log("Data saved successfully."),$("#mdlPublish").modal("hide")}function U(){var t=0;function n(){M(document.getElementById("barPublish"),t)}(C=[]).push(r.published.toDate().getFullYear().toString()),C.push(r.ledit.toDate().getFullYear().toString()),t++,n(),allCats.forEach(function(e,t){document.getElementById("cat"+t).checked&&C.push(e)}),t++,n(),r.authors.forEach(function(e){e.substring(1).split(" ").forEach(function(e){C.push(ultraClean(e,""))}),t+=3/r.authors.length,n()});var a=[];r.title.split(" ").forEach(function(e){a.push(e.replaceAll(/(<([^>]*)>)/gi," ").trim())}),t++,n(),r.description.split(" ").forEach(function(e){a.push(e.replaceAll(/(<([^>]*)>)/gi," ").trim()),t+=3/r.description.split(" ").length,n()}),r.cont.forEach(function(e){"parra"==e.type?(Number(e.title)>0&&e.titleTxt.split(" ").forEach(function(e){a.push(e.replaceAll(/(<([^>]*)>)/gi," ").trim())}),e.text.split(" ").forEach(function(l){a.push(l.replaceAll(/(<([^>]*)>)/gi," ").trim()),t+=14/r.cont.length/e.text.split(" ").length,n()})):"medSimple"==e.type&&(""!=e.alt&&e.alt.split(" ").forEach(function(e){a.push(e.replaceAll(/(<([^>]*)>)/gi," ").trim())}),""!=e.caption&&e.caption.split(" ").forEach(function(e){a.push(e.replaceAll(/(<([^>]*)>)/gi," ").trim())}),t+=14/r.cont.length,n())});for(var l=[],o=a.length,d=0;d<o;d++){var i=a[d];-1!=i.indexOf(" ")&&(i.split(" ").forEach(function(e){l.push(e)}),a.splice(d,1),d--,o--)}l.forEach(function(e){a.push(e)}),t++,n(),o=a.length;for(var c=0;c<o;c++)a.splice(c,1,ultraClean(a[c],"")),t+=3/a.length,n();var s={},u=0,m=0,p=["1","2","3","4","6","7","8","9","0","tan","ser","los","serian","pero","podemos","su","o","y","e","la","del","es","si","en","otro","de","tendrian","no","se","una","mas","el","a","embargo","las","sin","con","un","para","por","les","","vez","gran","este","esta","estos","estas","nos","al","dio","has","preguntado","el","lo","tu","tus","hacen","otros","para","ellos","ellas","ese","esa","esos","esas","detras","delante","nos","le","muy","casi","son","pues","a","ha","han","fue"];a.forEach(function(e){p.includes(e)||(s[e]?s[e]++:(s[e]=1,m++),u++);t+=3/a.length,n()});for(var h=0,b=Object.entries(s);h<b.length;h++){var g=e(b[h],2),v=g[0];g[1]>u/m&&C.push(v),t+=3/Object.entries(s).length,n()}r.cats=C,console.log(C)}window.loaded=function(){(i=cookiesFSRef.doc(urlSrch.get("id"))).onSnapshot(function(e){r=e.data(),d=e.id,document.getElementById("inFile").value=r.file,document.getElementById("inDesc").value=r.description,x(),A(),r.public?(document.getElementById("btnPrivate").classList.remove("d-none"),document.getElementById("btnAprove").classList.add("d-none"),document.getElementById("btnPub").classList.add("d-none")):(document.getElementById("btnPrivate").classList.add("d-none"),document.getElementById("btnAprove").classList.remove("d-none"),document.getElementById("btnPub").classList.remove("d-none")),r.revised[lang]&&r.revised[lang].includes(uid)?document.getElementById("btnAprove").innerHTML='<i class="fas fa-check-square"></i>':document.getElementById("btnAprove").innerHTML='<i class="far fa-check-square"></i>',document.getElementById("btnPrevCook").href=r.url,document.getElementById("btnPrevMail").href="../vista-email/"+r.file},function(e){console.log(e)}),L(),document.getElementById("frmTranslate").addEventListener("submit",function(e){e.preventDefault(),classes(document.getElementById("btnCnfTranslate"),"disabled"),classes(document.getElementById("btnCanTranslate0"),"disabled"),classes(document.getElementById("btnCanTranslate1"),"disabled"),M("barTranslate",0),showEl(document.getElementById("barTranslateCont")),k("barTranslate",0,90),firebase.app().functions("us-east1").httpsCallable("translations-translateFullCookie")({docId:d,from:document.getElementById("inTransFrom").value,target:lang}).then(function(e){M("barTranslate",100),$("#mdlTranslate").modal("hide"),document.getElementById("btnCnfTranslate").classList.remove("disabled"),document.getElementById("btnCanTranslate0").classList.remove("disabled"),document.getElementById("btnCanTranslate1").classList.remove("disabled"),hideEl(document.getElementById("barTranslateCont"))}).catch(function(e){(lang="es")?alertTop("<strong>¡Ha ocurrido un error!</strong> "+e.code,0):(lang="en")&&alertTop("<strong>¡There has been an error!</strong> "+e.code,0),console.log(e)})}),document.getElementById("frmFile").addEventListener("submit",function(e){var t;e.preventDefault(),t=document.getElementById("inFile").value,i.get().then(function(e){e.empty||t==r.file?(r.description=document.getElementById("inDesc").value.trim(),r.file=t,T()):(lang="es")?alertTop("Ese nombre de archivo ya esta en uso.",0,"alrtPlusContainer"):(lang="en")&&alertTop("That file name is already in use.",0,"alrtPlusContainer")}).then(function(){console.log("exito")}).catch(function(e){return console.log(e)})}),document.getElementById("frmAddMed").addEventListener("submit",function(e){e.preventDefault(),M(document.getElementById("barNewMed"),0),showEl(document.getElementById("barNewMedCont")),hideEl(document.getElementById("frmAddMed")),document.getElementById("btnCnfNewMed").setAttribute("disabled","true"),document.getElementById("btnCanNewMed0").setAttribute("disabled","true"),document.getElementById("btnCanNewMed1").setAttribute("disabled","true"),"home"==y?function e(t){var n=s.ref("cookieMedia/"+d+"/i"+t+E.name);n.getDownloadURL().then(function(n){e(t+1)}).catch(function(e){"storage/object-not-found"==e.code?n.put(E).on("state_changed",function(e){M(document.getElementById("barNewMed"),e.bytesTransferred/e.totalBytes*100)},function(e){(lang="es")?alertTop("<strong>¡Ha ocurrido un error!</strong> "+e.code,0):(lang="en")&&alertTop("<strong>¡There has been an error!</strong> "+e.code,0),console.log(e),$("#mdlAddMed").modal("hide")},function(){n.getDownloadURL().then(function(e){r.media.push({medFile:"i"+t+E.name,medUrl:e}),T(),A(),$("#mdlAddMed").modal("hide"),0==g?$("#mdlMedMan").modal("show"):$("#mdlMedCho").modal("show")}).catch(function(e){console.log(e)})}):console.log(e)})}(0):(r.media.push({medFile:"externo",medUrl:document.getElementById("inNewMedUrl").value}),T(),$("#mdlAddMed").modal("hide"),0==g?$("#mdlMedMan").modal("show"):$("#mdlMedCho").modal("show"))})},document.getElementById("inFile").oninput=function(){document.getElementById("inFile").value=ultraClean(document.getElementById("inFile").value,"-")},document.getElementById("inJava").onchange=function(){r.java=document.getElementById("javaIns").innerHTML=document.getElementById("inJava").value},document.getElementById("btnEditJs").onclick=function(){toggleEl(document.getElementById("btnEditJs")),toggleEl(document.getElementById("btnCheckJs")),document.getElementById("inJava").removeAttribute("readonly")},document.getElementById("btnCheckJs").onclick=function(){toggleEl(document.getElementById("btnEditJs")),toggleEl(document.getElementById("btnCheckJs")),document.getElementById("inJava").setAttribute("readonly","true"),T()},$("#mdlAddMed").on("hidden.bs.modal",function(e){document.getElementById("prevNewMed").src="",document.getElementById("inNewMedL").innerHTML="Elige una imagen",document.getElementById("inNewMedUrl").value="",document.getElementById("inNewMed").removeAttribute("required"),document.getElementById("inNewMedUrl").removeAttribute("required"),hideEl(document.getElementById("barNewMedCont")),hideEl(document.getElementById("inNewMedFileCont")),hideEl(document.getElementById("inNewMedUrlCont")),showEl(document.getElementById("frmAddMed")),document.getElementById("btnCnfNewMed").removeAttribute("disabled"),document.getElementById("btnCanNewMed0").removeAttribute("disabled"),document.getElementById("btnCanNewMed1").removeAttribute("disabled")}),document.getElementById("inNewMed").addEventListener("change",function(e){var t;(E=e.target.files[0]).name=ultraClean(E.name,""),document.getElementById("inNewMedL").innerHTML=E.name,(t=new FileReader).readAsDataURL(E),t.onload=function(e){document.getElementById("prevNewMed").src=e.target.result}}),document.getElementById("inNewMedUrl").onchange=function(){document.getElementById("prevNewMed").src=document.getElementById("inNewMedUrl").value},document.getElementById("inMedSrc0").onclick=function(){y="home",document.getElementById("inNewMed").setAttribute("required","true"),document.getElementById("inNewMedUrl").removeAttribute("required"),showEl(document.getElementById("inNewMedFileCont")),hideEl(document.getElementById("inNewMedUrlCont"))},document.getElementById("inMedSrc1").onclick=function(){y="out",document.getElementById("inNewMed").removeAttribute("required"),document.getElementById("inNewMedUrl").setAttribute("required","true"),hideEl(document.getElementById("inNewMedFileCont")),showEl(document.getElementById("inNewMedUrlCont"))},document.getElementById("inSendUpt").onclick=function(){document.getElementById("inSendUpt").checked?(showEl(document.getElementById("uptDescCont")),document.getElementById("inUptDesc").setAttribute("required","true")):(hideEl(document.getElementById("uptDescCont")),document.getElementById("inUptDesc").removeAttribute("required"))},document.getElementById("btnPrevCook").onclick=function(){r.timePrev=new firebase.firestore.Timestamp.fromMillis(new Date(Date.now()).getTime()+9e5),T()},document.getElementById("btnPrevMail").onclick=function(){r.timePrev=new firebase.firestore.Timestamp.fromMillis(new Date(Date.now()).getTime()+9e5),T()},document.getElementById("btnPrivate").onclick=function(){r.public=!1,T()},document.getElementById("btnAprove").onclick=function(){r.revised[lang]&&r.revised[lang].includes(uid)?(r.revised[lang].splice(r.revised[lang].indexOf(uid),1),document.getElementById("btnAprove").innerHTML='<i class="far fa-check-square"></i>'):(r.revised[lang]||(r.revised[lang]=[]),r.revised[lang].push(uid),document.getElementById("btnAprove").innerHTML='<i class="fas fa-check-square"></i>'),T()},$("#mdlAddMed").on("hiden.bs.modal",function(e){document.getElementById("inMedSrc0").setAttribute("checked","false"),document.getElementById("inMedSrc1").setAttribute("checked","false"),document.getElementById("inNewMed").removeAttribute("required"),document.getElementById("inNewMedUrl").removeAttribute("required"),hideEl(document.getElementById("inNewMedFileCont")),hideEl(document.getElementById("inNewMedUrlCont"))}),$("#mdlPublish").on("show.bs.modal",function(e){var t=0;langs.forEach(function(e){var n=r.revised[e]?r.revised[e].length:0;r.revised[e]&&!r.revised[e].includes(uid)&&n++,n>=2&&t++}),t==langs.length?(classes(document.getElementById("btnCnfPublish"),"d-none"),document.getElementById("mdlPublishTxt").innerText="Para publicar es necesario que lo hayan aprovado al menos dos personas.",document.getElementById("frmPublish").classList.add("d-none")):(document.getElementById("btnCnfPublish").classList.remove("d-none"),document.getElementById("mdlPublishTxt").innerText="La galleta está lista para publicar",document.getElementById("frmPublish").classList.remove("d-none"),r.beenPublic&&document.getElementById("sendUptCont").classList.remove("d-none"))}),document.getElementById("btnCnfPublish").onclick=function(){r.public||(M(document.getElementById("barPublish"),0),showEl(document.getElementById("barPublishCont")),r.public=!0,r.ledit=new firebase.firestore.Timestamp.now,r.beenPublic=!0,r.revised={},M(document.getElementById("barPublish"),31),r.beenPublic?(document.getElementById("inSendUpt").checked?(r.dledit=!0,r.notify=!0):(r.dledit=!1,r.notify=!1),M(document.getElementById("barPublish"),45),document.getElementById("inSendUpt").checked?(r.uptMsg=!0,r.uptDescrip=document.getElementById("inUptDesc").value.trim()):(r.uptMsg=!1,r.uptDescrip=""),M(document.getElementById("barPublish"),62)):(r.notify=!0,r.published=new firebase.firestore.Timestamp.now,M(document.getElementById("barPublish"),62)),I().then(function(){u.ref("galletas/"+d).set({pop:r.pop,likes:r.likes,favs:r.favs},function(e){e?console.log("Data could not be saved."+e):(M(document.getElementById("barPublish"),84),P())})}).catch(function(e){(lang="es")?alertTop("<strong>¡Ha ocurrido un error!</strong> "+e.code,0):(lang="en")&&alertTop("<strong>¡There has been an error!</strong> "+e.code,0),console.log(e)}))};
},{"../styles/edit.scss":"AnJc"}]},{},["ppKG"], null)
//# sourceMappingURL=/edit.84186515.js.map