parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"AnJc":[function(require,module,exports) {

},{}],"ppKG":[function(require,module,exports) {
"use strict";function e(e,l){return i(e)||a(e,l)||n(e,l)||t()}function t(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function n(e,t){if(e){if("string"==typeof e)return l(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?l(e,t):void 0}}function l(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,l=new Array(t);n<t;n++)l[n]=e[n];return l}function a(e,t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var n=[],l=!0,a=!1,i=void 0;try{for(var d,o=e[Symbol.iterator]();!(l=(d=o.next()).done)&&(n.push(d.value),!t||n.length!==t);l=!0);}catch(r){a=!0,i=r}finally{try{l||null==o.return||o.return()}finally{if(a)throw i}}return n}}function i(e){if(Array.isArray(e))return e}require("../styles/edit.scss");var d,o,r,c,s=firebase.storage(),u=firebase.database(),m=-1,p=-1,h=Date.now(),b=!1,v=-1,g=-1,f=-1,E=null,y=null,C=[];function I(){console.log("Saving...");var e=d.published.toDate(),t=e.getFullYear().toString();e.getMonth()<9&&(t+="0"),t+=e.getMonth()+1,d.url="https://sciencecookies.net/galletas/"+t+"/"+d.file+"/",L();var n=[];return langs.forEach(function(e){if(e!=lang){var t={authors:d.authors,media:d.media,java:d.java,notify:d.notify,public:d.public,beenPublic:d.beenPublic,dledit:d.dledit,created:d.created,ledit:d.ledit,published:d.published,pop:d.pop,likes:d.likes,favs:d.favs,translations:d.translations};t.translations[lang]=d.file,n.push(db.collection("cookies/langs/"+e).doc(o).update(t))}}),Promise.all(n).then(function(){return r.update(d)})}function A(){I().then(function(){b&&clearInterval(c),b=!0,c=setInterval(function(){var e=Math.floor((Date.now()-h)/6e4);document.getElementById("tagLstSave").innerText=e<60?"Guardado hace "+e+" minutos":"Guardado hace "+Math.floor(e/60)+" horas"},300010),document.getElementById("tagLstSave").innerText="Se han guardado todos los cambios",h=Date.now()}).catch(function(e){document.getElementById("tagLstSave").innerText="Error, no se han guardado todos los cambios: "+e.code,console.log(e)})}function B(e){var t=null;"html"==e?t={type:e,html:""}:"parra"==e?t={type:e,text:"",title:"0"}:"youtube"==e?t={type:e,vidUrl:"",ratio:"16by9"}:"medSimple"==e&&(t={type:e,medUrl:"https://via.placeholder.com/150.webp",alt:"",caption:"",hasCapt:"true",width:"75%"}),null!=t&&d.cont.splice(p,0,t),T()}function M(e,t){t=Math.floor(t),e.setAttribute("aria-valuenow",t),e.style.width=t+"%",e.innerText=t+"%"}function w(e){return s.ref("cookieMedia/"+o+"/"+e).delete()}function k(){document.getElementById("contMedMan").innerHTML='<div class="col mb-4">\n        <div class="card text-dark bg-light h-100 cardBorder" style="border-color: #343a40;">\n            <a type="button" data-toggle="modal" data-target="#mdlAddMed" data-dismiss="modal" aria-label="Close" class="text-decoration-none text-dark h-100 d-flex align-items-center justify-content-center" onclick="addFrom=0;">\n                <h1 style="font-size: 6rem;" class="mb-0"><i class="far fa-plus-square"></i></h1>\n            </a>\n        </div>\n    </div>',document.getElementById("contMedCho").innerHTML='<div class="col mb-4">\n        <div class="card text-dark bg-light h-100 cardBorder" style="border-color: #343a40;">\n            <a type="button" data-toggle="modal" data-target="#mdlAddMed" data-dismiss="modal" aria-label="Close" class="text-decoration-none text-dark h-100 d-flex align-items-center justify-content-center" onclick="addFrom=1;">\n                <h1 style="font-size: 6rem;" class="mb-0"><i class="far fa-plus-square"></i></h1>\n            </a>\n        </div>\n    </div>',d.media.forEach(function(e,t){var n=document.createElement("div");classes(n,"col mb-4");var l=document.createElement("div");classes(l,"card text-light bg-dark"),n.appendChild(l);var a=document.createElement("img");classes(a,"card-img"),a.src=e.medUrl,l.appendChild(a);var i=document.createElement("div");classes(i,"card-img-overlay pt-0"),i.style.paddingLeft=".9rem",i.style.paddingRight=".9rem",l.appendChild(i);var o=document.createElement("div");classes(o,"row mb-2 p-0"),i.appendChild(o);var r=document.createElement("button");classes(r,"btn btn-light btn-scckie btn-sm"),r.innerHTML='<i class="fas fa-trash-alt"></i>',r.onclick=function(){g==t?(g=-1,document.getElementById("btnAlrtClsSsn")&&document.getElementById("btnAlrtClsSsn").click(),"externo"!=e.medFile?w(e.medFile).then(function(){e.medUrl==d.picUrl&&(d.picUrl=""),d.media.splice(t,1),A()}).catch(function(e){return console.log(e)}):(e.medUrl==d.picUrl&&(d.picUrl=""),d.media.splice(t,1),A())):(document.getElementById("alrtClsSsn").innerHTML='<div id="alrtClsSsnAlrt" class="alert alert-danger alert-dismissible fade show fixed-top" role="alert">\n                    <strong>¿Quieres eliminar esta imagen?</strong> Presiona de nuevo el botón para confirmar.\n                    <button id="btnAlrtClsSsn" type="button" class="close" data-dismiss="alert" aria-label="Close">\n                        <span aria-hidden="true">&times;</span>\n                    </button>\n                </div>',g=t,setTimeout(function(){g=-1,document.getElementById("btnAlrtClsSsn")&&document.getElementById("btnAlrtClsSsn").click()},3e3))},o.appendChild(r);var c=document.createElement("div");classes(c,"tooltipn ml-auto");var s=document.createElement("button");classes(s,"btn btn-light btn-scckie btn-sm");var u=document.createElement("span");classes(u,"tooltipTextn"),u.innerHTML="Copiar",s.appendChild(u),s.innerHTML+='<i class="fas fa-link"></i>',s.onclick=function(){window.open(e.medUrl).focus(),u.innerHTML="URL copiado"},s.onmouseout=function(){u.innerHTML="Copiar"},c.appendChild(s),o.appendChild(c);var m=document.createElement("button"),p=document.createElement("button");e.medUrl==d.picUrl?(classes(m,"btn btn-light btn-scckie btn-sm ml-1"),m.innerHTML='<i class="fas fa-star"></i>',m.onclick=function(){d.picUrl="",A()},o.appendChild(m)):(classes(p,"btn btn-light btn-scckie btn-sm ml-1"),p.innerHTML='<i class="far fa-star"></i>',p.onclick=function(){d.picUrl=e.medUrl,A()},o.appendChild(p)),document.getElementById("contMedMan").appendChild(n);var h=document.createElement("div");classes(h,"col mb-4");var b=document.createElement("a");classes(b,"text-decoration-none"),b.setAttribute("type","button"),b.onclick=function(){-1!=f&&(d.cont[f].medUrl=e.medUrl,A())},b.setAttribute("data-dismiss","modal"),h.appendChild(b);var v=document.createElement("div");classes(v,"card text-light bg-dark"),b.appendChild(v);var E=document.createElement("img");classes(E,"card-img"),E.src=e.medUrl,v.appendChild(E),document.getElementById("contMedCho").appendChild(h)})}function T(){var e;document.getElementById("cont").innerHTML="",d.beenPublic?e=d.published:d.published=e=new firebase.firestore.Timestamp.now,d.cont.forEach(function(t,n){var l=document.createElement("div");l.id="sect"+n;var a=document.createElement("div");classes(a,"dropdown-divider mx-2"),"head"!=t.type&&l.appendChild(a);var i=document.createElement("div");i.id="sect"+n+"t";var o=document.createElement("div");classes(o,"d-none"),o.id="sect"+n+"f";var r,c,s,u,b=document.createElement("div");if(classes(b,"row mb-2 px-2"),"head"!=t.type&&"ref"!=t.type&&(r=document.createElement("button"),classes(r,"btn btn-light btn-link-scckie ml-2"),r.innerHTML='<i class="fas fa-trash-alt"></i>',r.onclick=function(){m==n?(m=-1,document.getElementById("btnAlrtClsSsn")&&document.getElementById("btnAlrtClsSsn").click(),d.cont.splice(n,1),T(),A()):(document.getElementById("alrtClsSsn").innerHTML='<div id="alrtClsSsnAlrt" class="alert alert-danger alert-dismissible fade show fixed-top" role="alert">\n                        <strong>¿Quieres eliminar esta sección?</strong> Presiona de nuevo el botón para confirmar.\n                        <button id="btnAlrtClsSsn" type="button" class="close" data-dismiss="alert" aria-label="Close">\n                            <span aria-hidden="true">&times;</span>\n                        </button>\n                    </div>',m=n,setTimeout(function(){m=-1,document.getElementById("btnAlrtClsSsn")&&document.getElementById("btnAlrtClsSsn").click()},3e3))},b.appendChild(r)),"ref"!=t.type&&(c=document.createElement("button"),classes(c,"btn btn-light btn-link-scckie ml-auto"),c.innerHTML='<i class="fas fa-edit"></i>',c.onclick=function(){if(toggleEl(c),toggleEl(s),toggleEl(o),"Se han guardado todos los cambios"==document.getElementById("tagLstSave").innerText){var e=Math.floor((Date.now()-h)/6e4);document.getElementById("tagLstSave").innerText=e>0?e>59?"Guardado hace "+Math.floor(e/60)+" horas":"Guardado hace "+e+" minutos":"Guardado hace "+Math.floor((Date.now()-h)/1e3)+" segundos"}},b.appendChild(c),s=document.createElement("button"),classes(s,"btn btn-light btn-link-scckie ml-auto d-none"),s.innerHTML='<i class="fas fa-check"></i>',s.onclick=function(){toggleEl(c),toggleEl(s),toggleEl(o),A()},b.appendChild(s),u=document.createElement("button"),classes(u,"btn btn-light btn-link-scckie mx-2"),u.innerHTML='<i class="fas fa-plus"></i>',u.setAttribute("data-toggle","modal"),u.setAttribute("data-target","#mdlPlusSect"),u.onclick=function(){p=n+1},b.appendChild(u)),l.appendChild(b),"head"==t.type){var v=e.toDate();v=v.getDate()+"/"+(v.getMonth()+1)+"/"+v.getFullYear();var g=d.ledit.toDate();g=g.getDate()+"/"+(g.getMonth()+1)+"/"+g.getFullYear();var E=document.createElement("h1");classes(E,"text-center"),E.innerHTML=d.cont[0].title,i.appendChild(E);var y=document.createElement("p");if(y.innerText="Publicado: "+v,i.appendChild(y),d.dledit){var C=document.createElement("p");C.innerText="Ultima actualización: "+g,i.appendChild(C)}var I=document.createElement("p");I.innerText="Autor(es):"+d.cont[0].author,i.appendChild(I);var B=document.createElement("div");classes(B,"row justify-content-center mb-2");var M=document.createElement("div");classes(M,"col col-lg-6");var w=document.createElement("input");classes(w,"form-control form-control-lg text-center"),w.setAttribute("type","text"),w.setAttribute("placeholder",d.cont[0].title),w.value=d.cont[0].title,M.appendChild(w),B.appendChild(M),o.appendChild(B),w.oninput=function(){d.title=d.cont[0].title=w.value.trim(),E.innerHTML=d.cont[0].title};var k=document.createElement("div");classes(k,"row mb-2");var x=document.createElement("label");classes(x,"col-sm-2 col-form-label"),x.innerText="Publicado: ";var L=document.createElement("div");classes(L,"col");var S=document.createElement("input");classes(S,"form-control"),S.setAttribute("type","text"),S.setAttribute("readonly","true"),S.value=v,L.appendChild(S),k.appendChild(x),k.appendChild(L),o.appendChild(k);var H=document.createElement("div"),U=document.createElement("label"),P=document.createElement("div"),N=document.createElement("input");d.dledit&&(classes(H,"row mb-2"),classes(U,"col-sm-2 col-form-label"),U.innerText="Ultima actualización: ",classes(P,"col"),classes(N,"form-control"),N.setAttribute("type","text"),N.setAttribute("readonly","true"),N.value=g,P.appendChild(N),H.appendChild(U),H.appendChild(P),o.appendChild(H));var D=document.createElement("div");classes(D,"row mb-2");var F=document.createElement("label");classes(F,"col-sm-2 col-form-label"),F.innerText="Autor(es): ";var j=document.createElement("div");classes(j,"form-row justify-content-around pt-2");var q=document.createElement("div");classes(q,"form-group col-auto mr-2");var J=document.createElement("div");classes(J,"form-check"),q.appendChild(J);var R=document.createElement("input");classes(R,"form-check-input"),R.setAttribute("type","checkbox"),d.cont[0].author.includes(" Andrea Garma")&&R.setAttribute("checked","true"),R.value=" Andrea Garma";var $=document.createElement("label");classes($,"form-check-label"),R.setAttribute("for","authr0"),$.innerText="Andrea Garma",J.appendChild(R),J.appendChild($),j.appendChild(q);var G=document.createElement("div");classes(G,"form-group col-auto mr-2");var O=document.createElement("div");classes(O,"form-check"),G.appendChild(O);var z=document.createElement("input");classes(z,"form-check-input"),z.setAttribute("type","checkbox"),d.cont[0].author.includes(" Javier Pantoja")&&z.setAttribute("checked","true"),z.value=" Javier Pantoja";var Y=document.createElement("label");classes(Y,"form-check-label"),z.setAttribute("for","authr1"),Y.innerText="Javier Pantoja",O.appendChild(z),O.appendChild(Y),j.appendChild(G);var V=document.createElement("div");classes(V,"form-group col-auto mr-2");var _=document.createElement("div");classes(_,"form-check"),V.appendChild(_);var Q=document.createElement("input");classes(Q,"form-check-input"),Q.setAttribute("type","checkbox"),d.cont[0].author.includes(" Paulina Vargas")&&Q.setAttribute("checked","true"),Q.value=" Paulina Vargas";var W=document.createElement("label");function K(e,t,n){var l=[];e&&l.push(" Andrea Garma"),t&&l.push(" Javier Pantoja"),n&&l.push(" Paulina Vargas"),l.empty&&l.push(" Anónimo"),d.cont[0].author=l.slice(),d.authors=l.slice(),I.innerText="Autor(es):"+d.cont[0].author}classes(W,"form-check-label"),Q.setAttribute("for","authr2"),W.innerText="Paulina Vargas",_.appendChild(Q),_.appendChild(W),j.appendChild(V),R.onclick=function(){K(R.checked,z.checked,Q.checked)},z.onclick=function(){K(R.checked,z.checked,Q.checked)},Q.onclick=function(){K(R.checked,z.checked,Q.checked)},D.appendChild(F),D.appendChild(j),o.appendChild(D)}else if("ref"==t.type){var X=document.createElement("h3");X.innerHTML="<br>Referencias",i.appendChild(X),t.ref.forEach(function(e,t){var l=document.createElement("div");classes(l,"row mb-2");var a=document.createElement("div");classes(a,"col"),l.appendChild(a);var o=document.createElement("div");classes(o,"col d-none"),l.appendChild(o);var r=document.createElement("div");classes(r,"col-auto"),l.appendChild(r);var c,s=document.createElement("p");function u(e){s.innerHTML=e}function m(e){s.innerHTML="",c=document.createElement("a"),classes(c,"text-warning text-break"),c.href=e,c.setAttribute("target","_blank"),c.setAttribute("rel","nofollow"),c.innerHTML=e+' <i class="fas fa-external-link-alt"></i>',s.appendChild(c)}function p(){E.value=E.value.trim(),d.cont[n].ref[t].link=f.value,d.cont[n].ref[t].type=E.value,"web"==e.type?(m(e.link),f.setAttribute("placeholder","https://google.com")):"cite"==e.type&&(u(e.link),f.setAttribute("placeholder","Referencia"))}a.appendChild(s),"web"==e.type?m(e.link):"cite"==e.type&&u(e.link);var b=document.createElement("div");classes(b,"row");var v=document.createElement("div");classes(v,"col");var g=document.createElement("div");classes(g,"col-auto");var f=document.createElement("input"),E=document.createElement("select");classes(f,"form-control"),f.setAttribute("type","text"),f.value=e.link,"web"==e.type&&f.setAttribute("placeholder","https://google.com"),"cite"==e.type&&f.setAttribute("placeholder","Referencia"),f.onchange=function(){p()},classes(E,"form-control form-control-sm");var y=document.createElement("option");y.value="web","web"==e.type&&y.setAttribute("selected","true"),y.innerText="Web",E.appendChild(y);var C,I,B=document.createElement("option");function M(){toggleEl(a),toggleEl(o),toggleEl(C),toggleEl(I)}"cite"==e.type&&B.setAttribute("selected","true"),B.value="cite",B.innerText="Otro",E.appendChild(B),E.onchange=function(){p()},v.appendChild(f),g.appendChild(E),b.appendChild(v),b.appendChild(g),o.appendChild(b),C=document.createElement("button"),classes(C,"btn btn-light btn-link-scckie ml-auto"),C.innerHTML='<i class="fas fa-edit"></i>',C.onclick=function(){M(),"Se han guardado todos los cambios"==document.getElementById("tagLstSave").innerText&&(document.getElementById("tagLstSave").innerText="Guardado hace "+Math.floor((Date.now()-h)/6e4)+" minutos")},I=document.createElement("button"),classes(I,"btn btn-light btn-link-scckie ml-auto d-none"),I.innerHTML='<i class="fas fa-check"></i>',I.onclick=function(){M(),d.cont[n].ref.sort(function(e,t){var n=e.link.toUpperCase(),l=t.link.toUpperCase();return n<l?-1:n>l?1:0}),A()},r.appendChild(C),r.appendChild(I);var w=document.createElement("button");classes(w,"btn btn-light btn-link-scckie ml-2"),w.innerHTML='<i class="fas fa-trash-alt"></i>',w.onclick=function(){d.cont[n].ref.splice(t,1),A()},r.appendChild(w),i.appendChild(l),""==e.link&&C.click()});var Z=document.createElement("a");classes(Z,"btn btn-light btn-scckie"),Z.onclick=function(){te()},Z.innerHTML='<i class="fas fa-plus"></i>',X.appendChild(Z);var ee=document.createElement("a");function te(){d.cont[n].ref.push({type:"web",link:""}),T()}classes(ee,"btn btn-light btn-scckie btn-lg btn-block border border-light"),ee.onclick=function(){te()},ee.innerHTML='<i class="fas fa-plus"></i>',i.appendChild(ee)}else if("parra"==t.type){var ne;Number(t.title)>0&&(2==Number(t.title)&&(i.innerHTML="<br>"),(ne=document.createElement("h"+t.title)).innerHTML=t.titleTxt,i.appendChild(ne));var le=document.createElement("p");le.innerHTML=t.text,i.appendChild(le);var ae=document.createElement("div");classes(ae,"row");var ie=document.createElement("div");classes(ie,"col");var de=document.createElement("div");classes(de,"col-auto");var oe=document.createElement("input"),re=document.createElement("select");classes(oe,"form-control"),oe.setAttribute("type","text"),Number(t.title)>0?(oe.value=t.titleTxt,oe.setAttribute("placeholder","Subtítulo"),oe.removeAttribute("readonly")):(oe.value="",oe.setAttribute("placeholder",""),oe.setAttribute("readonly","true")),oe.oninput=function(){d.cont[n].titleTxt=ne.innerHTML=oe.value},classes(re,"form-control form-control-sm");for(var ce=0;ce<7;ce++){var se=document.createElement("option");se.value=ce,t.title==ce&&se.setAttribute("selected","true"),se.innerText=ce,re.appendChild(se)}re.oninput=function(){d.cont[n].title=re.value,Number(re.value)>0?(oe.setAttribute("placeholder","Subtítulo"),oe.removeAttribute("readonly"),2==Number(t.title)?i.innerHTML="<br>":i.innerHTML="",(ne=document.createElement("h"+t.title)).innerHTML=d.cont[n].titleTxt=oe.value,i.appendChild(ne),i.appendChild(le)):(oe.value="",oe.setAttribute("placeholder",""),oe.setAttribute("readonly","true"),d.cont[n].titleTxt=oe.value,i.innerHTML="",i.appendChild(le))},ie.appendChild(oe),de.appendChild(re),ae.appendChild(ie),ae.appendChild(de),o.appendChild(ae);var ue=document.createElement("div");classes(ae,"row mb-2");var me=document.createElement("div");classes(ie,"col");var pe=document.createElement("textarea");classes(pe,"form-control"),pe.setAttribute("rows","8"),pe.value=t.text,pe.oninput=function(){d.cont[n].text=le.innerHTML=pe.value.trim()},me.appendChild(pe),ue.appendChild(me),o.appendChild(ue),Number(t.title)>0&&""==t.titleTxt&&c.click()}else if("html"==t.type){var he=document.createElement("div");he.innerHTML=t.html,i.appendChild(he);var be=document.createElement("div");classes(be,"row mb-2");var ve=document.createElement("div");classes(ve,"col");var ge=document.createElement("textarea");classes(ge,"form-control"),ge.setAttribute("rows","8"),ge.value=t.html,ge.onchange=function(){d.cont[n].html=he.innerHTML=ge.value.trim()},ve.appendChild(ge),be.appendChild(ve),o.appendChild(be),""==t.html&&c.click()}else if("youtube"==t.type){var fe=document.createElement("div");classes(fe,"embed-responsive embed-responsive-"+t.ratio);var Ee=document.createElement("iframe");Ee.src=t.vidUrl,Ee.setAttribute("frameborder","0"),Ee.setAttribute("allow","accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"),Ee.setAttribute("allowfullscreen","true"),fe.appendChild(Ee),i.appendChild(fe);var ye=document.createElement("div");classes(ye,"row");var Ce=document.createElement("div");classes(Ce,"col");var Ie=document.createElement("div");classes(Ie,"col-auto");var Ae=document.createElement("label");Ae.innerText="URL";var Be=document.createElement("input");classes(Be,"form-control"),Be.setAttribute("type","text"),Be.value=t.vidUrl,Be.onchange=function(){var e=Be.value.trim();if(11==e.length)e="https://www.youtube.com/embed/"+e;else{var t,l=1;do{t=e[l-1]+e[l],l++}while("e/"!=t&&"v="!=t);e="https://www.youtube.com/embed/"+e.substr(l,11)}d.cont[n].vidUrl=Ee.src=e};var Me=document.createElement("small");classes(Me,"text-muted"),Me.innerText="aaaaaaaaaaa o https://youtu.be/aaaaaaaaaaa o https://www.youtube.com/watch?v=aaaaaaaaaaa";var we=document.createElement("label");we.innerText="Ratio";var ke=document.createElement("select");classes(ke,"form-control form-control-sm");for(var Te=["21by9","16by9","4by3","1by1"],xe=0;xe<4;xe++){var Le=document.createElement("option");Le.value=Te[xe],t.ratio==Te[xe]&&Le.setAttribute("selected","true"),Le.innerText=Te[xe].replaceAll("by",":"),ke.appendChild(Le)}ke.oninput=function(){d.cont[n].ratio=ke.value,Te.forEach(function(e){fe.classList.remove("embed-responsive-"+e)}),classes(fe,"embed-responsive-"+t.ratio)},Ce.appendChild(Ae),Ce.appendChild(Be),Ce.appendChild(Me),Ie.appendChild(we),Ie.appendChild(ke),ye.appendChild(Ce),ye.appendChild(Ie),o.appendChild(ye),""==t.vidUrl&&c.click()}else if("medSimple"==t.type){var Se=document.createElement("figure");classes(Se,"mx-auto"),Se.style.width=t.width,Se.style.position="relative",Se.style.borderRadius=".25rem";var He=document.createElement("img");He.setAttribute("alt",t.alt),He.src=t.medUrl,classes(He,"w-100"),Se.appendChild(He);var Ue=document.createElement("div");classes(Ue,"card-img-overlay pt-0"),Ue.style.paddingLeft=".9rem",Ue.style.paddingRight=".9rem";var Pe=document.createElement("div");classes(Pe,"row mb-2 p-0"),Ue.appendChild(Pe);var Ne=document.createElement("button");classes(Ne,"btn btn-light btn-scckie btn-sm ml-auto"),Ne.innerHTML='<i class="fas fa-exchange-alt"></i>',Ne.setAttribute("data-toggle","modal"),Ne.setAttribute("data-target","#mdlMedCho"),Ne.onclick=function(){f=n},Pe.appendChild(Ne),Se.appendChild(Ue);var De=document.createElement("figcaption");De.style.fontSize="70%",De.style.fontWeight="lighter",De.innerHTML=t.caption,t.hasCapt&&Se.appendChild(De),i.appendChild(Se);var Fe=document.createElement("div");classes(Fe,"form-group mb-2");var je=document.createElement("label");je.innerText="Tamaño";var qe=document.createElement("div");classes(qe,"row");var Je=document.createElement("div");classes(Je,"col align-center d-flex pr-0");var Re=document.createElement("input");Re.setAttribute("type","range"),Re.setAttribute("max","100"),Re.setAttribute("min","0"),Re.setAttribute("step","1"),Re.value="75",classes(Re,"form-control-range"),Re.oninput=function(){$e.innerHTML=Re.value+"%",Se.style.width=d.cont[n].width=Re.value+"%"},Je.appendChild(Re);var $e=document.createElement("span");classes($e,"badge badge-primary range-value-L"),$e.innerText="75%";var Ge=document.createElement("div");classes(Ge,"col-auto"),Ge.appendChild($e),qe.appendChild(Je),qe.appendChild(Ge),Fe.appendChild(je),Fe.appendChild(qe),o.appendChild(Fe);var Oe=document.createElement("div");classes(Oe,"row");var ze=document.createElement("div");classes(ze,"col");var Ye=document.createElement("div");classes(Ye,"col-auto");var Ve=document.createElement("label");Ve.innerText="Pie de foto";var _e=document.createElement("input");classes(_e,"form-control"),_e.setAttribute("type","text"),_e.value=t.caption,_e.oninput=function(){De.innerHTML=d.cont[n].caption=_e.value.trim()};var Qe=document.createElement("select");classes(Qe,"form-control form-control-sm");var We=document.createElement("option");We.value="true","true"==t.hasCapt&&We.setAttribute("selected","true"),We.innerText="Sí",Qe.appendChild(We);var Ke=document.createElement("option");Ke.value="false","false"==t.hasCapt&&Ke.setAttribute("selected","true"),Ke.innerText="No",Qe.appendChild(Ke),Qe.oninput=function(){d.cont[n].hasCapt=Qe.value,"true"==Qe.value?(De.innerHTML=_e.value=d.cont[n].caption,_e.removeAttribute("readonly"),Se.appendChild(De)):(_e.value=d.cont[n].caption="",_e.setAttribute("readonly","true"),De.innerHTML="",Se.innerHTML="",Se.appendChild(He),Se.appendChild(Ue))},ze.appendChild(Ve),ze.appendChild(_e),Ye.appendChild(Qe),Oe.appendChild(ze),Oe.appendChild(Ye),o.appendChild(Oe);var Xe=document.createElement("div");classes(Xe,"row");var Ze=document.createElement("div");classes(Ze,"col");var et=document.createElement("label");et.innerText="Alt";var tt=document.createElement("input");classes(tt,"form-control"),tt.setAttribute("type","text"),tt.value=t.alt,tt.oninput=function(){d.cont[n].alt=tt.value.trim(),He.setAttribute("alt",tt.value.trim())},Ze.appendChild(et),Ze.appendChild(tt),Xe.appendChild(Ze),o.appendChild(Xe),"true"==t.hasCapt&&""==t.caption&&c.click()}l.appendChild(i),l.appendChild(o),document.getElementById("cont").appendChild(l)}),document.getElementById("inJava").innerText=d.java,document.getElementById("javaIns").innerHTML=d.java}function x(){M(document.getElementById("barPublish"),100),classes(document.getElementById("barPublish"),"bg-success"),document.getElementById("alrtClsSsn").innerHTML='<div id="alrtClsSsnAlrt" class="alert alert-success alert-dismissible fade show fixed-bottom" role="alert">Publicado correctamente<strong></strong>                                                                           <button id="btnAlrtClsSsn" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>',setTimeout(function(){window.open(d.url,"_blank").focus()},2500),console.log("Data saved successfully."),setTimeout(function(){document.getElementById("btnAlrtClsSsn").click()},3e3),$("#alrtClsSsnAlrt").on("closed.bs.alert",function(){document.getElementById("alrtClsSsn").innerHTML=""}),$("#mdlPublish").modal("hide")}function L(){var t=0;function n(){M(document.getElementById("barPublish"),t)}(C=[]).push(d.published.toDate().getFullYear().toString()),C.push(d.ledit.toDate().getFullYear().toString()),t++,n(),allCats.forEach(function(e,t){document.getElementById("cat"+t).checked&&C.push(e)}),t++,n(),d.authors.forEach(function(e){e.substring(1).split(" ").forEach(function(e){C.push(ultraClean(e,""))}),t+=3/d.authors.length,n()});var l=[];d.title.split(" ").forEach(function(e){l.push(e.replaceAll(/(<([^>]*)>)/gi," ").trim())}),t++,n(),d.description.split(" ").forEach(function(e){l.push(e.replaceAll(/(<([^>]*)>)/gi," ").trim()),t+=3/d.description.split(" ").length,n()}),d.cont.forEach(function(e){"parra"==e.type?(Number(e.title)>0&&e.titleTxt.split(" ").forEach(function(e){l.push(e.replaceAll(/(<([^>]*)>)/gi," ").trim())}),e.text.split(" ").forEach(function(a){l.push(a.replaceAll(/(<([^>]*)>)/gi," ").trim()),t+=14/d.cont.length/e.text.split(" ").length,n()})):"medSimple"==e.type&&(""!=e.alt&&e.alt.split(" ").forEach(function(e){l.push(e.replaceAll(/(<([^>]*)>)/gi," ").trim())}),""!=e.caption&&e.caption.split(" ").forEach(function(e){l.push(e.replaceAll(/(<([^>]*)>)/gi," ").trim())}),t+=14/d.cont.length,n())});for(var a=[],i=l.length,o=0;o<i;o++){var r=l[o];-1!=r.indexOf(" ")&&(r.split(" ").forEach(function(e){a.push(e)}),l.splice(o,1),o--,i--)}a.forEach(function(e){l.push(e)}),t++,n(),i=l.length;for(var c=0;c<i;c++)l.splice(c,1,ultraClean(l[c],"")),t+=3/l.length,n();var s={},u=0,m=0,p=["1","2","3","4","6","7","8","9","0","tan","ser","los","serian","pero","podemos","su","o","y","e","la","del","es","si","en","otro","de","tendrian","no","se","una","mas","el","a","embargo","las","sin","con","un","para","por","les","","vez","gran","este","esta","estos","estas","nos","al","dio","has","preguntado","el","lo","tu","tus","hacen","otros","para","ellos","ellas","ese","esa","esos","esas","detras","delante","nos","le","muy","casi","son","pues","a","ha","han","fue"];l.forEach(function(e){p.includes(e)||(s[e]?s[e]++:(s[e]=1,m++),u++);t+=3/l.length,n()});for(var h=0,b=Object.entries(s);h<b.length;h++){var v=e(b[h],2),g=v[0];v[1]>u/m&&C.push(g),t+=3/Object.entries(s).length,n()}d.cats=C,console.log(C)}window.loaded=function(){(r=cookiesFSRef.doc(urlSrch.get("id"))).onSnapshot(function(e){d=e.data(),o=e.id,document.getElementById("inFile").value=d.file,document.getElementById("inDesc").value=d.description,T(),k(),d.public?(document.getElementById("btnPrivate").classList.remove("d-none"),document.getElementById("btnAprove").classList.add("d-none"),document.getElementById("btnPub").classList.add("d-none")):(document.getElementById("btnPrivate").classList.add("d-none"),document.getElementById("btnAprove").classList.remove("d-none"),document.getElementById("btnPub").classList.remove("d-none")),d.revised[lang]&&d.revised[lang].includes(uid)?document.getElementById("btnAprove").innerHTML='<i class="fas fa-check-square"></i>':document.getElementById("btnAprove").innerHTML='<i class="far fa-check-square"></i>',document.getElementById("btnPrevCook").href=d.url,document.getElementById("btnPrevMail").href="../vista-email/"+d.file},function(e){console.log(e)}),document.getElementById("frmFile").addEventListener("submit",function(e){var t;e.preventDefault(),t=document.getElementById("inFile").value,r.get().then(function(e){e.empty||t==d.file?(d.description=document.getElementById("inDesc").value.trim(),d.file=t,A()):document.getElementById("alrtPlusContainer").innerHTML='<div class="alert alert-danger alert-dismissible fade show fixed-top" role="alert">\n                    Ese nombre de archivo ya esta en uso.\n                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n                </div>'}).then(function(){console.log("exito")}).catch(function(e){return console.log(e)})}),document.getElementById("frmAddMed").addEventListener("submit",function(e){e.preventDefault(),M(document.getElementById("barNewMed"),0),showEl(document.getElementById("barNewMedCont")),hideEl(document.getElementById("frmAddMed")),document.getElementById("btnCnfNewMed").setAttribute("disabled","true"),document.getElementById("btnCanNewMed0").setAttribute("disabled","true"),document.getElementById("btnCanNewMed1").setAttribute("disabled","true"),"home"==y?function e(t){var n=s.ref("cookieMedia/"+o+"/i"+t+E.name);n.getDownloadURL().then(function(n){e(t+1)}).catch(function(e){"storage/object-not-found"==e.code?n.put(E).on("state_changed",function(e){M(document.getElementById("barNewMed"),e.bytesTransferred/e.totalBytes*100)},function(e){document.getElementById("alrtClsSsn").innerHTML='<div id="alrtClsSsnAlrt" class="alert alert-warning alert-dismissible fade show fixed-bottom" role="alert"><strong>¡Ocurrió un error!</strong> '+e.code+'<button id="btnAlrtClsSsn" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>',setTimeout(function(){document.getElementById("btnAlrtClsSsn")&&document.getElementById("btnAlrtClsSsn").click()},3e3),console.log(e),$("#mdlAddMed").modal("hide")},function(){n.getDownloadURL().then(function(e){d.media.push({medFile:"i"+t+E.name,medUrl:e}),A(),k(),$("#mdlAddMed").modal("hide"),0==v?$("#mdlMedMan").modal("show"):$("#mdlMedCho").modal("show")}).catch(function(e){console.log(e)})}):console.log(e)})}(0):(d.media.push({medFile:"externo",medUrl:document.getElementById("inNewMedUrl").value}),A(),$("#mdlAddMed").modal("hide"),0==v?$("#mdlMedMan").modal("show"):$("#mdlMedCho").modal("show"))})},document.getElementById("inFile").oninput=function(){document.getElementById("inFile").value=ultraClean(document.getElementById("inFile").value,"-")},document.getElementById("inJava").onchange=function(){d.java=document.getElementById("javaIns").innerHTML=document.getElementById("inJava").value},document.getElementById("btnEditJs").onclick=function(){toggleEl(document.getElementById("btnEditJs")),toggleEl(document.getElementById("btnCheckJs")),document.getElementById("inJava").removeAttribute("readonly")},document.getElementById("btnCheckJs").onclick=function(){toggleEl(document.getElementById("btnEditJs")),toggleEl(document.getElementById("btnCheckJs")),document.getElementById("inJava").setAttribute("readonly","true"),A()},$("#mdlAddMed").on("hidden.bs.modal",function(e){document.getElementById("prevNewMed").src="",document.getElementById("inNewMedL").innerHTML="Elige una imagen",document.getElementById("inNewMedUrl").value="",document.getElementById("inNewMed").removeAttribute("required"),document.getElementById("inNewMedUrl").removeAttribute("required"),hideEl(document.getElementById("barNewMedCont")),hideEl(document.getElementById("inNewMedFileCont")),hideEl(document.getElementById("inNewMedUrlCont")),showEl(document.getElementById("frmAddMed")),document.getElementById("btnCnfNewMed").removeAttribute("disabled"),document.getElementById("btnCanNewMed0").removeAttribute("disabled"),document.getElementById("btnCanNewMed1").removeAttribute("disabled")}),document.getElementById("inNewMed").addEventListener("change",function(e){var t;(E=e.target.files[0]).name=ultraClean(E.name,""),document.getElementById("inNewMedL").innerHTML=E.name,(t=new FileReader).readAsDataURL(E),t.onload=function(e){document.getElementById("prevNewMed").src=e.target.result}}),document.getElementById("inNewMedUrl").onchange=function(){document.getElementById("prevNewMed").src=document.getElementById("inNewMedUrl").value},document.getElementById("inMedSrc0").onclick=function(){y="home",document.getElementById("inNewMed").setAttribute("required","true"),document.getElementById("inNewMedUrl").removeAttribute("required"),showEl(document.getElementById("inNewMedFileCont")),hideEl(document.getElementById("inNewMedUrlCont"))},document.getElementById("inMedSrc1").onclick=function(){y="out",document.getElementById("inNewMed").removeAttribute("required"),document.getElementById("inNewMedUrl").setAttribute("required","true"),hideEl(document.getElementById("inNewMedFileCont")),showEl(document.getElementById("inNewMedUrlCont"))},document.getElementById("inSendUpt").onclick=function(){document.getElementById("inSendUpt").checked?(showEl(document.getElementById("uptDescCont")),document.getElementById("inUptDesc").setAttribute("required","true")):(hideEl(document.getElementById("uptDescCont")),document.getElementById("inUptDesc").removeAttribute("required"))},document.getElementById("btnPrevCook").onclick=function(){d.timePrev=new firebase.firestore.Timestamp.fromMillis(new Date(Date.now()).getTime()+9e5),A()},document.getElementById("btnPrevMail").onclick=function(){d.timePrev=new firebase.firestore.Timestamp.fromMillis(new Date(Date.now()).getTime()+9e5),A()},document.getElementById("btnPrivate").onclick=function(){d.public=!1,A()},document.getElementById("btnAprove").onclick=function(){d.revised[lang]&&d.revised[lang].includes(uid)?(d.revised[lang].splice(d.revised[lang].indexOf(uid),1),document.getElementById("btnAprove").innerHTML='<i class="far fa-check-square"></i>'):(d.revised[lang]||(d.revised[lang]=[]),d.revised[lang].push(uid),document.getElementById("btnAprove").innerHTML='<i class="fas fa-check-square"></i>'),A()},$("#mdlAddMed").on("hiden.bs.modal",function(e){document.getElementById("inMedSrc0").setAttribute("checked","false"),document.getElementById("inMedSrc1").setAttribute("checked","false"),document.getElementById("inNewMed").removeAttribute("required"),document.getElementById("inNewMedUrl").removeAttribute("required"),hideEl(document.getElementById("inNewMedFileCont")),hideEl(document.getElementById("inNewMedUrlCont"))}),$("#mdlPublish").on("show.bs.modal",function(e){var t=0;langs.forEach(function(e){var n=d.revised[e]?d.revised[e].length:0;d.revised[e]&&!d.revised[e].includes(uid)&&n++,n>=2&&t++}),t==langs.length?(classes(document.getElementById("btnCnfPublish"),"d-none"),document.getElementById("mdlPublishTxt").innerText="Para publicar es necesario que lo hayan aprovado al menos dos personas.",document.getElementById("frmPublish").classList.add("d-none")):(document.getElementById("btnCnfPublish").classList.remove("d-none"),document.getElementById("mdlPublishTxt").innerText="La galleta está lista para publicar",document.getElementById("frmPublish").classList.remove("d-none"),d.beenPublic&&document.getElementById("sendUptCont").classList.remove("d-none"))}),document.getElementById("btnCnfPublish").onclick=function(){d.public||(M(document.getElementById("barPublish"),0),showEl(document.getElementById("barPublishCont")),d.public=!0,d.ledit=new firebase.firestore.Timestamp.now,d.beenPublic=!0,d.revised={},M(document.getElementById("barPublish"),31),d.beenPublic?(document.getElementById("inSendUpt").checked?(d.dledit=!0,d.notify=!0):(d.dledit=!1,d.notify=!1),M(document.getElementById("barPublish"),45),document.getElementById("inSendUpt").checked?(d.uptMsg=!0,d.uptDescrip=document.getElementById("inUptDesc").value.trim()):(d.uptMsg=!1,d.uptDescrip=""),M(document.getElementById("barPublish"),62)):(d.notify=!0,d.published=new firebase.firestore.Timestamp.now,M(document.getElementById("barPublish"),62)),I().then(function(){u.ref("galletas/"+o).set({pop:d.pop,likes:d.likes,favs:d.favs},function(e){e?console.log("Data could not be saved."+e):(M(document.getElementById("barPublish"),84),x())})}).catch(function(e){document.getElementById("alrtClsSsn").innerHTML='<div id="alrtClsSsnAlrt" class="alert alert-danger alert-dismissible fade show fixed-bottom" role="alert"><strong>!Ha ocurrido un error! </strong>'+e+'<button id="btnAlrtClsSsn" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>',console.log(e),setTimeout(function(){document.getElementById("btnAlrtClsSsn").click()},3e3),$("#alrtClsSsnAlrt").on("closed.bs.alert",function(){document.getElementById("alrtClsSsn").innerHTML=""})}))};
},{"../styles/edit.scss":"AnJc"}]},{},["ppKG"], null)
//# sourceMappingURL=/edit.740950bf.js.map