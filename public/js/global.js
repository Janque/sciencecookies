parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"IGu4":[function(require,module,exports) {
function e(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}window.db=firebase.firestore(),window.urlSrch="";var t=new URL(window.location.href),n=!1,r=!1,a="",o=!1;function l(e){e?(document.getElementById("icnUsr").classList.remove("fa-user-slash"),document.getElementById("icnUsr").classList.add("fa-user"),document.getElementById("picUsr").setAttribute("onerror","this.src='https://sciencecookies.net/img/nopp.png'"),document.getElementById("picUsr").src=photoURL,document.getElementById("ppCom")&&(document.getElementById("ppCom").setAttribute("onerror","this.src='https://sciencecookies.net/img/nopp.png'"),document.getElementById("ppCom").src=photoURL),document.getElementById("btnPrfl").classList.remove("d-none"),document.getElementById("btnPref").classList.remove("d-none"),r&&(document.getElementById("btnDraft").classList.remove("d-none"),document.getElementById("btnCals").classList.remove("d-none")),document.getElementById("btnLgO").classList.remove("d-none"),null!=document.getElementById("btnLgI")&&document.getElementById("btnLgI").classList.add("d-none"),"/galletas/"==t.pathname.substring(0,10)&&db.collection("users").doc(uid).get().then(function(e){var t=e.data().fav,n=e.data().liked;pubID=e.data().publicID,-1!=t.indexOf(id)?(document.getElementById("btnFav").innerHTML='En mis favoritos <i class="fas fa-heart"></i>'.concat(" ",document.getElementById("btnFav").innerHTML.substr(document.getElementById("btnFav").innerHTML.search("<sp"))),document.getElementById("btnFav").classList.remove("btn-outline-light"),document.getElementById("btnFav").classList.add("btn-light")):(document.getElementById("btnFav").innerHTML='Añadir a favoritos <i class="far fa-heart"></i>'.concat(" ",document.getElementById("btnFav").innerHTML.substr(document.getElementById("btnFav").innerHTML.search("<sp"))),document.getElementById("btnFav").classList.remove("btn-light"),document.getElementById("btnFav").classList.add("btn-outline-light")),-1!=n.indexOf(id)?(document.getElementById("btnLike").innerHTML='Me gusta <i class="fas fa-thumbs-up"></i>'.concat(" ",document.getElementById("btnLike").innerHTML.substr(document.getElementById("btnLike").innerHTML.search("<sp"))),document.getElementById("btnLike").classList.remove("btn-outline-light"),document.getElementById("btnLike").classList.add("btn-light")):(document.getElementById("btnLike").innerHTML='Dar me gusta <i class="far fa-thumbs-up"></i>'.concat(" ",document.getElementById("btnLike").innerHTML.substr(document.getElementById("btnLike").innerHTML.search("<sp"))),document.getElementById("btnLike").classList.remove("btn-light"),document.getElementById("btnLike").classList.add("btn-outline-light"))}).catch(function(e){console.log(e)})):(document.getElementById("icnUsr").classList.remove("fa-user"),document.getElementById("icnUsr").classList.add("fa-user-slash"),document.getElementById("picUsr").setAttribute("onerror",""),document.getElementById("picUsr").src="",document.getElementById("btnPrfl").classList.add("d-none"),document.getElementById("btnPref").classList.add("d-none"),document.getElementById("btnDraft").classList.add("d-none"),document.getElementById("btnCals").classList.add("d-none"),document.getElementById("btnLgO").classList.add("d-none"),document.getElementById("btnLgI")&&document.getElementById("btnLgI").classList.remove("d-none")),"/galletas/"==t.pathname.substring(0,10)&&(document.getElementById("btnFav").classList.remove("disabled"),document.getElementById("btnLike").classList.remove("disabled"),document.getElementById("btnLdComs").classList.remove("disabled"),document.getElementById("btnLdMrComs").classList.remove("disabled"))}window.classes=function(e,t){(t=t.split(" ")).forEach(function(t){e.classList.add(t)})},window.hideEl=function(e){e.classList.add("d-none")},window.showEl=function(e){e.classList.remove("d-none")},window.toggleEl=function(e){e.classList.toggle("d-none")},window.enable=function(e){e.classList.remove("disabled"),e.removeAttribute("disabled")},window.disable=function(e){classes(e,"disabled"),e.setAttribute("disabled","true")},window.displayName,window.email,window.photoURL,window.uid,firebase.auth().onAuthStateChanged(function(e){var o=firebase.app().functions("us-east1").httpsCallable("publish-modAuth");e?(displayName=e.displayName,email=e.email,photoURL=e.photoURL,uid=e.uid,n=!0,o(uid).then(function(e){r=e.data.mod,a=e.data.name,"/drafts"!=t.pathname.substring(0,7)&&"/editar"!=t.pathname.substring(0,7)&&"/vista-previa"!=t.pathname.substring(0,13)&&"/vista-email"!=t.pathname.substring(0,12)||r||(window.location.href="https://sciencecookies.net"),l(!0)}).catch(function(e){return console.log(e)})):("/perfil"!=t.pathname.substring(0,7)&&"/contacto"!=t.pathname.substring(0,9)&&"/drafts"!=t.pathname.substring(0,7)&&"/editar"!=t.pathname.substring(0,7)&&"/vista-previa"!=t.pathname.substring(0,13)&&"/vista-email"!=t.pathname.substring(0,12)||(window.location.href="https://sciencecookies.net"),n=!1,r=!1,displayName=null,email=null,photoURL=null,uid=null,l(!1))}),document.getElementById("btnLgO").onclick=function(){firebase.auth().signOut().then(function(){document.getElementById("alrtClsSsn").innerHTML='<div id="alrtClsSsnAlrt" class="alert alert-warning alert-dismissible fade show fixed-bottom" role="alert">Haz cerrado tu sesión correctamente. <strong>!Vuelve pronto!</strong>                                                                           <button id="btnAlrtClsSsn" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'}).catch(function(e){document.getElementById("alrtClsSsn").innerHTML='<div id="alrtClsSsnAlrt" class="alert alert-danger alert-dismissible fade show fixed-bottom" role="alert"><strong>!Ha ocurrido un error! </strong>'+e.code+'<button id="btnAlrtClsSsn" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'}),setTimeout(function(){document.getElementById("btnAlrtClsSsn").click()},3e3),$("#alrtClsSsnAlrt").on("closed.bs.alert",function(){document.getElementById("alrtClsSsn").innerHTML=""})};var c={signInSuccessUrl:window.location,signInOptions:[firebase.auth.GoogleAuthProvider.PROVIDER_ID,firebase.auth.FacebookAuthProvider.PROVIDER_ID,e({provider:firebase.auth.EmailAuthProvider.PROVIDER_ID,signInMethod:firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,forceSameDevice:!1,requireDisplayName:!0},"signInMethod","emailLink")],tosUrl:"https://sciencecookies.net/docs/tos",privacyPolicyUrl:"https://sciencecookies.net/docs/privacidad"},s=new firebaseui.auth.AuthUI(firebase.auth());function i(){var e,t=!1;return e=navigator.userAgent||navigator.vendor||window.opera,(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(e)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(e.substr(0,4)))&&(t=!0),t}function d(){db.collection("galletas").where("public","==",!0).orderBy("date","desc").limit(1).get().then(function(e){e.docs.forEach(function(e){var t=e.data(),n=document.createElement("a");classes(n,"text-decoration-none text-dark d-none d-md-inline"),n.href=t.url;var r=document.createElement("div");classes(r,"card mb-2"),n.appendChild(r);var a=document.createElement("img");classes(a,"card-img-top"),a.src=t.picUrl,a.alt=t.title,r.appendChild(a);var o=document.createElement("div");classes(o,"card-body");var l=t.date.toDate();o.innerHTML='<h5 class="card-title">'+t.title+'</h5>\n                <p class="card-text">'+t.descrip+'</p>\n                <p class="card-text">'+l.getDate()+"/"+(l.getMonth()+1)+"/"+l.getFullYear()+" Autor(es):"+t.authrs+"</p>",r.appendChild(o),document.getElementById("newCook").appendChild(n);var c=document.createElement("a");classes(c,"text-decoration-none text-dark d-md-none"),c.href=t.url;var s=document.createElement("div");classes(s,"media mb-3"),c.appendChild(s);var i=document.createElement("img");classes(i,"align-self-center mr-3"),i.style.width="64px",i.style.height="64px",i.src=t.picUrl,i.alt=t.title,s.appendChild(i);var d=document.createElement("div");classes(d,"media-body"),d.innerHTML='<h6 class="card-title">'+t.title+'</h6>\n                <p class="card-text">'+t.descrip+'</p>\n                <p class="card-text">'+l.getDate()+"/"+(l.getMonth()+1)+"/"+l.getFullYear()+" Autor(es):"+t.authrs+"</p>",s.appendChild(d),document.getElementById("newCook").appendChild(c)})}).catch(function(e){return console.log(e)}),db.collection("galletas").where("public","==",!0).orderBy("pop","desc").limit(3).get().then(function(e){e.docs.forEach(function(e){var t=e.data(),n=document.createElement("a");classes(n,"text-decoration-none text-dark d-none d-md-inline"),n.href=t.url;var r=document.createElement("div");classes(r,"card mb-2"),n.appendChild(r);var a=document.createElement("img");classes(a,"card-img-top"),a.src=t.picUrl,a.alt=t.title,r.appendChild(a);var o=document.createElement("div");classes(o,"card-body");var l=t.date.toDate();o.innerHTML='<h5 class="card-title">'+t.title+'</h5>\n                <p class="card-text">'+t.descrip+'</p>\n                <p class="card-text">'+l.getDate()+"/"+(l.getMonth()+1)+"/"+l.getFullYear()+" Autor(es):"+t.authrs+"</p>",r.appendChild(o),document.getElementById("popCook").appendChild(n);var c=document.createElement("a");classes(c,"text-decoration-none text-dark d-md-none"),c.href=t.url;var s=document.createElement("div");classes(s,"media mb-3"),c.appendChild(s);var i=document.createElement("img");classes(i,"align-self-center mr-3"),i.style.width="64px",i.style.height="64px",i.src=t.picUrl,i.alt=t.title,s.appendChild(i);var d=document.createElement("div");classes(d,"media-body"),d.innerHTML='<h6 class="card-title">'+t.title+'</h6>\n                <p class="card-text">'+t.descrip+'</p>\n                <p class="card-text">'+l.getDate()+"/"+(l.getMonth()+1)+"/"+l.getFullYear()+" Autor(es):"+t.authrs+"</p>",s.appendChild(d),document.getElementById("popCook").appendChild(c);var m=document.createElement("div");classes(m,"dropdown-divider d-md-none"),document.getElementById("popCook").appendChild(m)})}).catch(function(e){return console.log(e)}),db.collection("calendarios").where("public","==",!0).orderBy("date","desc").limit(1).get().then(function(e){e.docs.forEach(function(e){var t=e.data(),n=document.createElement("a");classes(n,"text-decoration-none text-dark d-none d-md-inline"),n.href=t.url;var r=document.createElement("div");classes(r,"card mb-2"),n.appendChild(r);var a=document.createElement("img");classes(a,"card-img-top"),a.src=t.picUrl,a.alt=t.title,r.appendChild(a);var o=document.createElement("div");classes(o,"card-body"),o.innerHTML='<h5 class="card-title">'+t.title+'</h5>\n                <p class="card-text">'+t.descriptionShort+"</p>",r.appendChild(o),document.getElementById("calCnt").appendChild(n);var l=document.createElement("a");classes(l,"text-decoration-none text-dark d-md-none"),l.href=t.url;var c=document.createElement("div");classes(c,"media mb-3"),l.appendChild(c);var s=document.createElement("img");classes(s,"align-self-center mr-3"),s.style.width="64px",s.style.height="64px",s.src=t.picUrl,s.alt=t.title,c.appendChild(s);var i=document.createElement("div");classes(i,"media-body"),i.innerHTML='<h6 class="card-title">'+t.title+'</h6>\n                <p class="card-text">'+t.descriptionShort+"</p>",c.appendChild(i),document.getElementById("calCnt").appendChild(l);var d=document.createElement("div");classes(d,"dropdown-divider d-md-none"),document.getElementById("calCnt").appendChild(d),showEl(document.getElementById("calRecom"))})}).catch(function(e){console.log(e)})}function m(){document.getElementById("ttShare").href="https://twitter.com/intent/tweet?text="+window.location.href,document.getElementById("fbShare").href="https://www.facebook.com/sharer/sharer.php?u="+window.location.href,document.getElementById("waShare").href=o?"whatsapp://send?text="+window.location.href:"https://web.whatsapp.com/send?text="+window.location.href}s.start("#firebaseui-auth-container",c),window.addEventListener("load",function(){console.log(i()),o=i(),t=new URL(document.location.href),urlSrch=new URLSearchParams(location.search),s.isPendingRedirect()&&s.start("#firebaseui-auth-container",c),"select"==urlSrch.get("mode")&&$("#mdlRgstr").modal("show"),d(),m(),loaded()});for(var u=[{corr:"A",lt:"AⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ"},{corr:"AA",lt:"Ꜳ"},{corr:"AE",lt:"ÆǼǢ"},{corr:"AO",lt:"Ꜵ"},{corr:"AU",lt:"Ꜷ"},{corr:"AV",lt:"ꜸꜺ"},{corr:"AY",lt:"Ꜽ"},{corr:"B",lt:"BⒷＢḂḄḆɃƂƁ"},{corr:"C",lt:"CⒸＣĆĈĊČÇḈƇȻꜾ"},{corr:"D",lt:"DⒹＤḊĎḌḐḒḎĐƋƊƉꝹÐ"},{corr:"DZ",lt:"ǱǄ"},{corr:"Dz",lt:"ǲǅ"},{corr:"E",lt:"EⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎ"},{corr:"F",lt:"FⒻＦḞƑꝻ"},{corr:"G",lt:"GⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾ"},{corr:"H",lt:"HⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍ"},{corr:"I",lt:"IⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ"},{corr:"J",lt:"JⒿＪĴɈ"},{corr:"K",lt:"KⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ"},{corr:"L",lt:"LⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ"},{corr:"LJ",lt:"Ǉ"},{corr:"Lj",lt:"ǈ"},{corr:"M",lt:"MⓂＭḾṀṂⱮƜ"},{corr:"N",lt:"NⓃＮǸŃÑṄŇṆŅṊṈȠƝꞐꞤ"},{corr:"NJ",lt:"Ǌ"},{corr:"Nj",lt:"ǋ"},{corr:"O",lt:"OⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ"},{corr:"OI",lt:"Ƣ"},{corr:"OO",lt:"Ꝏ"},{corr:"OU",lt:"Ȣ"},{corr:"OE",lt:"Œ"},{corr:"oe",lt:"œ"},{corr:"P",lt:"PⓅＰṔṖƤⱣꝐꝒꝔ"},{corr:"Q",lt:"QⓆＱꝖꝘɊ"},{corr:"R",lt:"RⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂ"},{corr:"S",lt:"SⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ"},{corr:"T",lt:"TⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆ"},{corr:"TZ",lt:"Ꜩ"},{corr:"U",lt:"UⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ"},{corr:"V",lt:"VⓋＶṼṾƲꝞɅ"},{corr:"VY",lt:"Ꝡ"},{corr:"W",lt:"WⓌＷẀẂŴẆẄẈⱲ"},{corr:"X",lt:"XⓍＸẊẌ"},{corr:"Y",lt:"YⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ"},{corr:"Z",lt:"ZⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ"},{corr:"a",lt:"aⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐ"},{corr:"aa",lt:"ꜳ"},{corr:"ae",lt:"æǽǣ"},{corr:"ao",lt:"ꜵ"},{corr:"au",lt:"ꜷ"},{corr:"av",lt:"ꜹꜻ"},{corr:"ay",lt:"ꜽ"},{corr:"b",lt:"bⓑｂḃḅḇƀƃɓ"},{corr:"c",lt:"cⓒｃćĉċčçḉƈȼꜿↄ"},{corr:"d",lt:"dⓓｄḋďḍḑḓḏđƌɖɗꝺ"},{corr:"dz",lt:"ǳǆ"},{corr:"e",lt:"eⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝ"},{corr:"f",lt:"fⓕｆḟƒꝼ"},{corr:"g",lt:"gⓖｇǵĝḡğġǧģǥɠꞡᵹꝿ"},{corr:"h",lt:"hⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ"},{corr:"hv",lt:"ƕ"},{corr:"i",lt:"iⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı"},{corr:"j",lt:"jⓙｊĵǰɉ"},{corr:"k",lt:"kⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ"},{corr:"l",lt:"lⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇ"},{corr:"lj",lt:"ǉ"},{corr:"m",lt:"mⓜｍḿṁṃɱɯ"},{corr:"n",lt:"nⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥ"},{corr:"nj",lt:"ǌ"},{corr:"o",lt:"oⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵ"},{corr:"oi",lt:"ƣ"},{corr:"ou",lt:"ȣ"},{corr:"oo",lt:"ꝏ"},{corr:"p",lt:"pⓟｐṕṗƥᵽꝑꝓꝕ"},{corr:"q",lt:"qⓠｑɋꝗꝙ"},{corr:"r",lt:"rⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ"},{corr:"s",lt:"sⓢｓßśṥŝṡšṧṣṩșşȿꞩꞅẛ"},{corr:"t",lt:"tⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ"},{corr:"tz",lt:"ꜩ"},{corr:"u",lt:"uⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ"},{corr:"v",lt:"vⓥｖṽṿʋꝟʌ"},{corr:"vy",lt:"ꝡ"},{corr:"w",lt:"wⓦｗẁẃŵẇẅẘẉⱳ"},{corr:"x",lt:"xⓧｘẋẍ"},{corr:"y",lt:"yⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ"},{corr:"z",lt:"zⓩｚźẑżžẓẕƶȥɀⱬꝣ"}],p={},h=0;h<u.length;h++)for(var g=u[h].lt,b=0;b<g.length;b++)p[g[b]]=u[h].corr;window.rmDiacs=function(e){return e.replace(/[^\u0000-\u007E]/g,function(e){return p[e]||e})},window.ultraClean=function(e,t){e=rmDiacs(e.trim().toLowerCase());return",.^*!¡'?¿#@[]-:;ªº$%&()=/+{} ".split("").forEach(function(n){e=e.replaceAll(n,t)}),e};
},{}]},{},["IGu4"], null)
//# sourceMappingURL=/js/global.js.map