parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"IGu4":[function(require,module,exports) {
function e(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}window.db=firebase.firestore(),window.urlSrch="";var t=new URL(window.location.href),n=!1,r=!1,a="";function s(e){e?(document.getElementById("icnUsr").classList.remove("fa-user-slash"),document.getElementById("icnUsr").classList.add("fa-user"),document.getElementById("picUsr").setAttribute("onerror","this.src='https://sciencecookies.net/img/nopp.png'"),document.getElementById("picUsr").src=photoURL,document.getElementById("ppCom")&&(document.getElementById("ppCom").setAttribute("onerror","this.src='https://sciencecookies.net/img/nopp.png'"),document.getElementById("ppCom").src=photoURL),document.getElementById("btnPrfl").classList.remove("d-none"),document.getElementById("btnPref").classList.remove("d-none"),r&&(document.getElementById("btnDraft").classList.remove("d-none"),document.getElementById("btnCals").classList.remove("d-none")),document.getElementById("btnLgO").classList.remove("d-none"),document.getElementById("btnLgI")&&document.getElementById("btnLgI").classList.add("d-none"),"/galletas/"==t.pathname.substring(0,10)&&db.collection("users").doc(uid).get().then(function(e){var t=e.data().fav,n=e.data().liked;pubID=e.data().publicID,-1!=t.indexOf(id)?(document.getElementById("btnFav").innerHTML='En mis favoritos <i class="fas fa-heart"></i>'.concat(" ",document.getElementById("btnFav").innerHTML.substr(document.getElementById("btnFav").innerHTML.search("<sp"))),document.getElementById("btnFav").classList.remove("btn-outline-light"),document.getElementById("btnFav").classList.add("btn-light")):(document.getElementById("btnFav").innerHTML='Añadir a favoritos <i class="far fa-heart"></i>'.concat(" ",document.getElementById("btnFav").innerHTML.substr(document.getElementById("btnFav").innerHTML.search("<sp"))),document.getElementById("btnFav").classList.remove("btn-light"),document.getElementById("btnFav").classList.add("btn-outline-light")),-1!=n.indexOf(id)?(document.getElementById("btnLike").innerHTML='Me gusta <i class="fas fa-thumbs-up"></i>'.concat(" ",document.getElementById("btnLike").innerHTML.substr(document.getElementById("btnLike").innerHTML.search("<sp"))),document.getElementById("btnLike").classList.remove("btn-outline-light"),document.getElementById("btnLike").classList.add("btn-light")):(document.getElementById("btnLike").innerHTML='Dar me gusta <i class="far fa-thumbs-up"></i>'.concat(" ",document.getElementById("btnLike").innerHTML.substr(document.getElementById("btnLike").innerHTML.search("<sp"))),document.getElementById("btnLike").classList.remove("btn-light"),document.getElementById("btnLike").classList.add("btn-outline-light"))}).catch(function(e){console.log("err")})):(document.getElementById("icnUsr").classList.remove("fa-user"),document.getElementById("icnUsr").classList.add("fa-user-slash"),document.getElementById("picUsr").setAttribute("onerror",""),document.getElementById("picUsr").src="",document.getElementById("btnPrfl").classList.add("d-none"),document.getElementById("btnPref").classList.add("d-none"),document.getElementById("btnDraft").classList.add("d-none"),document.getElementById("btnLgO").classList.add("d-none"),document.getElementById("btnLgI")&&document.getElementById("btnLgI").classList.remove("d-none")),"/galletas/"==t.pathname.substring(0,10)&&(document.getElementById("btnFav").classList.remove("disabled"),document.getElementById("btnLike").classList.remove("disabled"),document.getElementById("btnLdComs").classList.remove("disabled"),document.getElementById("btnLdMrComs").classList.remove("disabled"))}window.classes=function(e,t){(t=t.split(" ")).forEach(function(t){e.classList.add(t)})},window.hideEl=function(e){e.classList.add("d-none")},window.showEl=function(e){e.classList.remove("d-none")},window.toggleEl=function(e){e.classList.toggle("d-none")},window.enable=function(e){e.classList.remove("disabled"),e.removeAttribute("disabled")},window.disable=function(e){classes(e,"disabled"),e.setAttribute("disabled","true")},window.displayName,window.email,window.photoURL,window.uid,firebase.auth().onAuthStateChanged(function(e){var c=firebase.app().functions("us-east1").httpsCallable("publish-modAuth");e?(displayName=e.displayName,email=e.email,photoURL=e.photoURL,uid=e.uid,n=!0,c(uid).then(function(e){r=e.data.mod,a=e.data.name,"/drafts"!=t.pathname.substring(0,7)&&"/editar"!=t.pathname.substring(0,7)&&"/vista-previa"!=t.pathname.substring(0,13)&&"/vista-email"!=t.pathname.substring(0,12)||r||(window.location.href="https://sciencecookies.net"),s(!0)}).catch(function(e){return console.log(e)})):("/perfil"!=t.pathname.substring(0,7)&&"/contacto"!=t.pathname.substring(0,9)&&"/drafts"!=t.pathname.substring(0,7)&&"/editar"!=t.pathname.substring(0,7)&&"/vista-previa"!=t.pathname.substring(0,13)&&"/vista-email"!=t.pathname.substring(0,12)||(window.location.href="https://sciencecookies.net"),n=!1,r=!1,s(!1))}),document.getElementById("btnLgO").onclick=function(){firebase.auth().signOut().then(function(){document.getElementById("alrtClsSsn").innerHTML='<div id="alrtClsSsnAlrt" class="alert alert-warning alert-dismissible fade show fixed-bottom" role="alert">Haz cerrado tu sesión correctamente. <strong>!Vuelve pronto!</strong>                                                                           <button id="btnAlrtClsSsn" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'}).catch(function(e){document.getElementById("alrtClsSsn").innerHTML='<div id="alrtClsSsnAlrt" class="alert alert-danger alert-dismissible fade show fixed-bottom" role="alert"><strong>!Ha ocurrido un error! </strong>'+e.code+'<button id="btnAlrtClsSsn" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'}),setTimeout(function(){document.getElementById("btnAlrtClsSsn").click()},3e3),$("#alrtClsSsnAlrt").on("closed.bs.alert",function(){document.getElementById("alrtClsSsn").innerHTML=""})};var c={signInSuccessUrl:window.location,signInOptions:[firebase.auth.GoogleAuthProvider.PROVIDER_ID,firebase.auth.FacebookAuthProvider.PROVIDER_ID,e({provider:firebase.auth.EmailAuthProvider.PROVIDER_ID,signInMethod:firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,forceSameDevice:!1,requireDisplayName:!0},"signInMethod","emailLink")],tosUrl:"https://sciencecookies.net/docs/tos",privacyPolicyUrl:"https://sciencecookies.net/docs/privacidad"},o=new firebaseui.auth.AuthUI(firebase.auth());function l(){db.collection("galletas").where("public","==",!0).orderBy("date","desc").limit(1).get().then(function(e){e.docs.forEach(function(e){var t=e.data(),n=document.createElement("a");classes(n,"text-decoration-none text-dark d-none d-md-inline"),n.href=t.url;var r=document.createElement("div");classes(r,"card mb-2"),n.appendChild(r);var a=document.createElement("img");classes(a,"card-img-top"),a.src=t.picUrl,a.alt=t.title,r.appendChild(a);var s=document.createElement("div");classes(s,"card-body");var c=t.date.toDate();s.innerHTML='<h5 class="card-title">'+t.title+'</h5>\n                <p class="card-text">'+t.descrip+'</p>\n                <p class="card-text">'+c.getDate()+"/"+(c.getMonth()+1)+"/"+c.getFullYear()+" Autor(es):"+t.authrs+"</p>",r.appendChild(s),document.getElementById("newCook").appendChild(n);var o=document.createElement("a");classes(o,"text-decoration-none text-dark d-md-none"),o.href=t.url;var l=document.createElement("div");classes(l,"media mb-3"),o.appendChild(l);var d=document.createElement("img");classes(d,"align-self-center mr-3"),d.style.width="64px",d.style.height="64px",d.src=t.picUrl,d.alt=t.title,l.appendChild(d);var i=document.createElement("div");classes(i,"media-body"),i.innerHTML='<h6 class="card-title">'+t.title+'</h6>\n                <p class="card-text">'+t.descrip+'</p>\n                <p class="card-text">'+c.getDate()+"/"+(c.getMonth()+1)+"/"+c.getFullYear()+" Autor(es):"+t.authrs+"</p>",l.appendChild(i),document.getElementById("newCook").appendChild(o)})}).catch(function(e){return console.log(e)}),db.collection("galletas").where("public","==",!0).orderBy("pop","desc").limit(3).get().then(function(e){e.docs.forEach(function(e){var t=e.data(),n=document.createElement("a");classes(n,"text-decoration-none text-dark d-none d-md-inline"),n.href=t.url;var r=document.createElement("div");classes(r,"card mb-2"),n.appendChild(r);var a=document.createElement("img");classes(a,"card-img-top"),a.src=t.picUrl,a.alt=t.title,r.appendChild(a);var s=document.createElement("div");classes(s,"card-body");var c=t.date.toDate();s.innerHTML='<h5 class="card-title">'+t.title+'</h5>\n                <p class="card-text">'+t.descrip+'</p>\n                <p class="card-text">'+c.getDate()+"/"+(c.getMonth()+1)+"/"+c.getFullYear()+" Autor(es):"+t.authrs+"</p>",r.appendChild(s),document.getElementById("popCook").appendChild(n);var o=document.createElement("a");classes(o,"text-decoration-none text-dark d-md-none"),o.href=t.url;var l=document.createElement("div");classes(l,"media mb-3"),o.appendChild(l);var d=document.createElement("img");classes(d,"align-self-center mr-3"),d.style.width="64px",d.style.height="64px",d.src=t.picUrl,d.alt=t.title,l.appendChild(d);var i=document.createElement("div");classes(i,"media-body"),i.innerHTML='<h6 class="card-title">'+t.title+'</h6>\n                <p class="card-text">'+t.descrip+'</p>\n                <p class="card-text">'+c.getDate()+"/"+(c.getMonth()+1)+"/"+c.getFullYear()+" Autor(es):"+t.authrs+"</p>",l.appendChild(i),document.getElementById("popCook").appendChild(o);var m=document.createElement("div");classes(m,"dropdown-divider d-md-none"),document.getElementById("popCook").appendChild(m)})}).catch(function(e){return console.log(e)}),db.collection("calendarios").where("public","==",!0).orderBy("date","desc").limit(1).get().then(function(e){e.docs.forEach(function(e){var t=e.data(),n=document.createElement("a");classes(n,"text-decoration-none text-dark d-none d-md-inline"),n.href=t.url;var r=document.createElement("div");classes(r,"card mb-2"),n.appendChild(r);var a=document.createElement("img");classes(a,"card-img-top"),a.src=t.picUrl,a.alt=t.title,r.appendChild(a);var s=document.createElement("div");classes(s,"card-body"),s.innerHTML='<h5 class="card-title">'+t.title+'</h5>\n                <p class="card-text">'+t.descriptionShort+"</p>",r.appendChild(s),document.getElementById("calCnt").appendChild(n);var c=document.createElement("a");classes(c,"text-decoration-none text-dark d-md-none"),c.href=t.url;var o=document.createElement("div");classes(o,"media mb-3"),c.appendChild(o);var l=document.createElement("img");classes(l,"align-self-center mr-3"),l.style.width="64px",l.style.height="64px",l.src=t.picUrl,l.alt=t.title,o.appendChild(l);var d=document.createElement("div");classes(d,"media-body"),d.innerHTML='<h6 class="card-title">'+t.title+'</h6>\n                <p class="card-text">'+t.descriptionShort+"</p>",o.appendChild(d),document.getElementById("calCnt").appendChild(c);var i=document.createElement("div");classes(i,"dropdown-divider d-md-none"),document.getElementById("calCnt").appendChild(i),showEl(document.getElementById("calRecom"))})}).catch(function(e){console.log(e)})}o.start("#firebaseui-auth-container",c),window.addEventListener("load",function(){t=new URL(document.location.href),urlSrch=new URLSearchParams(location.search),o.isPendingRedirect()&&o.start("#firebaseui-auth-container",c),"select"==urlSrch.get("mode")&&$("#mdlRgstr").modal("show"),l(),loaded()}),document.getElementById("adsV").innerHTML='<h5 class="text-center mx-auto">Publicidad</h5>\n    <a href="https://www.instagram.com/p/CDLE_t6nsdU/?igshid=ttb1h94rs65" rel="sponsored"><img class="w-100 mb-2" src="https://sciencecookies.net/publicidad/CubreMid.jpg" alt="Cubre Mid"></a>\n    <a href="https://www.instagram.com/_pedacitode_cielo/" rel="sponsored"><img class="w-100 mb-2" src="https://sciencecookies.net/publicidad/PedacitoDeCielo.jpeg" alt="Pedacito de Cielo"></a>\n    <a href="https://www.instagram.com/p/CC_2AELnaMi/?igshid=yp0v3i285a37" rel="sponsored">\n        <img class="w-100" src="https://sciencecookies.net/publicidad/Lool-Ha1.jpeg" alt="Lool-Ha">\n        <img class="w-100" src="https://sciencecookies.net/publicidad/Lool-Ha2.jpeg" alt="Lool-Ha">\n        <img class="w-100 mb-2" src="https://sciencecookies.net/publicidad/Lool-Ha3.jpeg" alt="Lool-Ha">\n    </a>\n    <a href="https://www.google.com/url?sa=t&source=web&rct=j&url=https://www.instagram.com/awesomefundas/&ved=2ahUKEwi7pZiOvfjqAhUD2qwKHSV_ChQQFjAAegQIBhAC&usg=AOvVaw072K32mWOHN9b7u3cEzrcd" rel="sponsored"><img class="w-100 mb-2" src="https://sciencecookies.net/publicidad/AwesomeFundas.jpg" alt="Awesome Fundas"></a>\n    <a href="https://m.facebook.com/pages/category/Beauty-Supply-Store/mondlermid-100749941724343/" rel="sponsored"><img class="w-100 mb-2" src="https://sciencecookies.net/publicidad/Mondler.jpeg" alt="Mondler"></a>',document.getElementById("adsH").innerHTML='<div class="col-12 pt-2">\n        <h5 class="text-center mx-auto">Publicidad</h5>\n    </div>\n    <div class="col-6 px-1">\n        <a href="https://www.instagram.com/p/CDLE_t6nsdU/?igshid=ttb1h94rs65" rel="sponsored"><img class="w-100 mb-2" src="https://sciencecookies.net/publicidad/CubreMid.jpg" alt="Cubre Mid"></a>\n        <a href="https://www.instagram.com/_pedacitode_cielo/" rel="sponsored"><img class="w-100 mb-2" src="https://sciencecookies.net/publicidad/PedacitoDeCielo.jpeg" alt="Pedacito de Cielo"></a>\n        <a href="https://www.instagram.com/p/CC_2AELnaMi/?igshid=yp0v3i285a37" rel="sponsored">\n            <img class="w-100" src="https://sciencecookies.net/publicidad/Lool-Ha1.jpeg" alt="Lool-Ha">\n            <img class="w-100" src="https://sciencecookies.net/publicidad/Lool-Ha2.jpeg" alt="Lool-Ha">\n            <img class="w-100 mb-2" src="https://sciencecookies.net/publicidad/Lool-Ha3.jpeg" alt="Lool-Ha">\n        </a>\n    </div>\n    <div class="col-6 px-1">\n        <a href="https://www.google.com/url?sa=t&source=web&rct=j&url=https://www.instagram.com/awesomefundas/&ved=2ahUKEwi7pZiOvfjqAhUD2qwKHSV_ChQQFjAAegQIBhAC&usg=AOvVaw072K32mWOHN9b7u3cEzrcd" rel="sponsored"><img class="w-100 mb-2" src="https://sciencecookies.net/publicidad/AwesomeFundas.jpg" alt="Awesome Fundas"></a>\n        <a href="https://m.facebook.com/pages/category/Beauty-Supply-Store/mondlermid-100749941724343/" rel="sponsored"><img class="w-100 mb-2" src="https://sciencecookies.net/publicidad/Mondler.jpeg" alt="Mondler"></a>\n    </div>';for(var d=[{corr:"A",lt:"AⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ"},{corr:"AA",lt:"Ꜳ"},{corr:"AE",lt:"ÆǼǢ"},{corr:"AO",lt:"Ꜵ"},{corr:"AU",lt:"Ꜷ"},{corr:"AV",lt:"ꜸꜺ"},{corr:"AY",lt:"Ꜽ"},{corr:"B",lt:"BⒷＢḂḄḆɃƂƁ"},{corr:"C",lt:"CⒸＣĆĈĊČÇḈƇȻꜾ"},{corr:"D",lt:"DⒹＤḊĎḌḐḒḎĐƋƊƉꝹÐ"},{corr:"DZ",lt:"ǱǄ"},{corr:"Dz",lt:"ǲǅ"},{corr:"E",lt:"EⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎ"},{corr:"F",lt:"FⒻＦḞƑꝻ"},{corr:"G",lt:"GⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾ"},{corr:"H",lt:"HⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍ"},{corr:"I",lt:"IⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ"},{corr:"J",lt:"JⒿＪĴɈ"},{corr:"K",lt:"KⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ"},{corr:"L",lt:"LⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ"},{corr:"LJ",lt:"Ǉ"},{corr:"Lj",lt:"ǈ"},{corr:"M",lt:"MⓂＭḾṀṂⱮƜ"},{corr:"N",lt:"NⓃＮǸŃÑṄŇṆŅṊṈȠƝꞐꞤ"},{corr:"NJ",lt:"Ǌ"},{corr:"Nj",lt:"ǋ"},{corr:"O",lt:"OⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ"},{corr:"OI",lt:"Ƣ"},{corr:"OO",lt:"Ꝏ"},{corr:"OU",lt:"Ȣ"},{corr:"OE",lt:"Œ"},{corr:"oe",lt:"œ"},{corr:"P",lt:"PⓅＰṔṖƤⱣꝐꝒꝔ"},{corr:"Q",lt:"QⓆＱꝖꝘɊ"},{corr:"R",lt:"RⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂ"},{corr:"S",lt:"SⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ"},{corr:"T",lt:"TⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆ"},{corr:"TZ",lt:"Ꜩ"},{corr:"U",lt:"UⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ"},{corr:"V",lt:"VⓋＶṼṾƲꝞɅ"},{corr:"VY",lt:"Ꝡ"},{corr:"W",lt:"WⓌＷẀẂŴẆẄẈⱲ"},{corr:"X",lt:"XⓍＸẊẌ"},{corr:"Y",lt:"YⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ"},{corr:"Z",lt:"ZⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ"},{corr:"a",lt:"aⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐ"},{corr:"aa",lt:"ꜳ"},{corr:"ae",lt:"æǽǣ"},{corr:"ao",lt:"ꜵ"},{corr:"au",lt:"ꜷ"},{corr:"av",lt:"ꜹꜻ"},{corr:"ay",lt:"ꜽ"},{corr:"b",lt:"bⓑｂḃḅḇƀƃɓ"},{corr:"c",lt:"cⓒｃćĉċčçḉƈȼꜿↄ"},{corr:"d",lt:"dⓓｄḋďḍḑḓḏđƌɖɗꝺ"},{corr:"dz",lt:"ǳǆ"},{corr:"e",lt:"eⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝ"},{corr:"f",lt:"fⓕｆḟƒꝼ"},{corr:"g",lt:"gⓖｇǵĝḡğġǧģǥɠꞡᵹꝿ"},{corr:"h",lt:"hⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ"},{corr:"hv",lt:"ƕ"},{corr:"i",lt:"iⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı"},{corr:"j",lt:"jⓙｊĵǰɉ"},{corr:"k",lt:"kⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ"},{corr:"l",lt:"lⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇ"},{corr:"lj",lt:"ǉ"},{corr:"m",lt:"mⓜｍḿṁṃɱɯ"},{corr:"n",lt:"nⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥ"},{corr:"nj",lt:"ǌ"},{corr:"o",lt:"oⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵ"},{corr:"oi",lt:"ƣ"},{corr:"ou",lt:"ȣ"},{corr:"oo",lt:"ꝏ"},{corr:"p",lt:"pⓟｐṕṗƥᵽꝑꝓꝕ"},{corr:"q",lt:"qⓠｑɋꝗꝙ"},{corr:"r",lt:"rⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ"},{corr:"s",lt:"sⓢｓßśṥŝṡšṧṣṩșşȿꞩꞅẛ"},{corr:"t",lt:"tⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ"},{corr:"tz",lt:"ꜩ"},{corr:"u",lt:"uⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ"},{corr:"v",lt:"vⓥｖṽṿʋꝟʌ"},{corr:"vy",lt:"ꝡ"},{corr:"w",lt:"wⓦｗẁẃŵẇẅẘẉⱳ"},{corr:"x",lt:"xⓧｘẋẍ"},{corr:"y",lt:"yⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ"},{corr:"z",lt:"zⓩｚźẑżžẓẕƶȥɀⱬꝣ"}],i={},m=0;m<d.length;m++)for(var u=d[m].lt,p=0;p<u.length;p++)i[u[p]]=d[m].corr;window.rmDiacs=function(e){return e.replace(/[^\u0000-\u007E]/g,function(e){return i[e]||e})},window.ultraClean=function(e,t){e=rmDiacs(e.trim().toLowerCase());return",.^*!¡'?¿#@[]-:;ªº$%&()=/+{} ".split("").forEach(function(n){e=e.replaceAll(n,t)}),e};
},{}]},{},["IGu4"], null)
//# sourceMappingURL=/global.c249c66a.js.map