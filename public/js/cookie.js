!function(){var e,t=null,n=-1;window.loaded=function(){t=firebase.database().ref("galletas/"+id),console.log(cRef),t.on("value",(e=>{e.val()&&(document.getElementById("favCount").innerText=e.val().favs,document.getElementById("likeCount").innerText=e.val().likes)})),t.transaction((e=>(e&&e.pop++,e))),firebase.database().ref("uptCook/"+id).set("true").then((()=>{})).catch((e=>console.error("err"))),document.getElementById("frmRprt").addEventListener("submit",(function(e){e.preventDefault(),actSsn&&db.collection("reports").add({from:email,reason:document.getElementById("inReas").value,comm:l,mess:document.getElementById("inText").value}).then((function(){"es"==lang?alertTop("Gracias por tu reporte, lo revisaremos lo antes posible.",2):"en"==lang&&alertTop("Thank you for your report, we will review it as soon as posible.",2),$("#mdlRprt").modal("hide")})).catch((function(e){console.log("err"),"es"==lang?alertTop("Ha ocurrido un error, por favor intenta nuevamente.",0):"en"==lang&&alertTop("There has been an error, please try again.",0),$("#mdlRprt").modal("hide")}))})),document.getElementById("frmNwCom").addEventListener("submit",(function(t){t.preventDefault(),actSsn&&(document.getElementById("btnAddCom").classList.add("disabled"),document.getElementById("btnCanCom").classList.add("disabled"),document.getElementById("btnAddCom").innerHTML='<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>',firebase.app().functions("us-east1").httpsCallable("addComment")({id:id,from:displayName,pic:photoURL,authKey:e,to:n,text:document.getElementById("inNwCom").value}).then((e=>{if(-1==e.data.res)"es"==lang?alertTop("Ha ocurrido un error, por favor intenta nuevamente.",0):"en"==lang&&alertTop("There has been an error, please try again.",0),$("#mdlRprt").modal("hide");else if(-2==e.data.res){i(a);let t=new Date(1e3*e.data.blc._seconds),n=t.getDate()+"/"+(t.getMonth()+1)+"/"+t.getFullYear();"es"==lang?alertTop("No puedes comentar. Un moderador te ha bloqueado hasta "+n,0):"en"==lang&&alertTop("You cannot comment. A moderator has blocked you until "+n,0),$("#mdlRprt").modal("hide")}else 0==e.data.res?(d[e.data.pos]=e.data.com,a++):d[e.data.pos].reps.push(e.data.com),s++,i(a),"es"==lang?alertTop("Se ha publicado tu comentario",1):"en"==lang&&alertTop("Your comment has been published",1),$("#mdlRprt").modal("hide");n=-1,document.getElementById("frmNwComBtns").classList.add("d-none"),document.getElementById("inNwCom").setAttribute("placeholder","Nuevo comentario"),document.getElementById("btnAddCom").innerHTML="Comentar",document.getElementById("btnCanCom").classList.remove("disabled"),document.getElementById("btnAddCom").classList.remove("disabled"),document.getElementById("inNwCom").value=""})).catch((e=>{console.log("err")})))}))},document.getElementById("btnFav").onclick=function(){actSsn?db.collection("users").doc(uid).get().then((function(e){let t=e.data().fav,n=e.data().favn,d=e.data().favn,a=e.data().liked,s=e.data().likedn,l=e.data().likedl,i=t.indexOf(id),o=a.indexOf(id),c=0,r=0,m=0;return-1!=i?(t.splice(i,1),n.splice(n.indexOf(cTitle),1),d.splice(d.indexOf(cRef),1),document.getElementById("btnFav").innerText="Añadir a favoritos",document.getElementById("btnFavTxt").classList.remove("fas"),document.getElementById("btnFavTxt").classList.add("far"),document.getElementById("btnFav").classList.remove("btn-light"),document.getElementById("btnFav").classList.add("btn-outline-light"),c=-20,m=-1):(t.push(id),n.push(cTitle),d.push(cRef),-1==o?(a.push(id),s.push(cTitle),l.push(cRef),c=30,r=1,document.getElementById("btnLike").innerText="Me gusta",document.getElementById("btnLikeTxt").classList.add("fas"),document.getElementById("btnLikeTxt").classList.remove("far"),document.getElementById("btnLike").classList.remove("btn-outline-light"),document.getElementById("btnLike").classList.add("btn-light")):c=20,m=1,document.getElementById("btnFav").innerText="En mis favoritos",document.getElementById("btnFavTxt").classList.remove("far"),document.getElementById("btnFavTxt").classList.add("fas"),document.getElementById("btnFav").classList.remove("btn-outline-light"),document.getElementById("btnFav").classList.add("btn-light")),db.collection("users").doc(uid).update({fav:t,liked:a,favn:n,favl:d,likedn:s,likedl:l})})).then((()=>db.collection("usersPublic").doc(e).update({name:displayName,pic:photoURL,email:email,favn:favn,favl:favl,likedn:likedn,likedl:likedl}))).then((()=>{t.transaction((e=>(e&&(e.pop+=npop,e.likes+=nlik,e.favs+=nfav),e)))})).catch((function(e){console.log("err")})):(document.getElementById("mdlRgsL").innerHTML="Debes iniciar sesión o registrarte para continuar",$("#mdlRgstr").modal("show"))},document.getElementById("btnLike").onclick=function(){actSsn?db.collection("users").doc(uid).get().then((function(e){let t=e.data().fav,n=e.data().favn,d=e.data().favn,a=e.data().liked,s=e.data().likedn,l=e.data().likedl,i=t.indexOf(id),o=a.indexOf(id),c=0,r=0,m=0;-1==o?(a.push(id),s.push(cTitle),l.push(cRef),c=10,r=1,document.getElementById("btnLike").innerText="Me gusta",document.getElementById("btnLikeTxt").classList.add("fas"),document.getElementById("btnLikeTxt").classList.remove("far"),document.getElementById("btnLike").classList.remove("btn-outline-light"),document.getElementById("btnLike").classList.add("btn-light")):(a.splice(o,1),s.splice(s.indexOf(cTitle),1),l.splice(l.indexOf(cRef),1),-1==i?c=-10:(t.splice(i,1),n.splice(n.indexOf(cTitle),1),d.splice(d.indexOf(cRef),1),c=-30,m=-1,document.getElementById("btnFav").innerText="Añadir a favoritos",document.getElementById("btnFavTxt").classList.remove("fas"),document.getElementById("btnFavTxt").classList.add("far"),document.getElementById("btnFav").classList.remove("btn-light"),document.getElementById("btnFav").classList.add("btn-outline-light")),r=-1,document.getElementById("btnLike").innerText="Dar me gusta",document.getElementById("btnLikeTxt").classList.add("far"),document.getElementById("btnLikeTxt").classList.remove("fas"),document.getElementById("btnLike").classList.remove("btn-light"),document.getElementById("btnLike").classList.add("btn-outline-light"))})).then((()=>db.collection("users").doc(uid).update({fav:fav,liked:liked,favn:favn,favl:favl,likedn:likedn,likedl:likedl}))).then((()=>db.collection("usersPublic").doc(e).update({name:displayName,pic:photoURL,email:email,favn:favn,favl:favl,likedn:likedn,likedl:likedl}))).then((()=>{t.transaction((e=>(e&&(e.pop+=npop,e.likes+=nlik,e.favs+=nfav),e)))})).catch((function(e){console.log("err")})):(document.getElementById("mdlRgsL").innerHTML="Debes iniciar sesión o registrarte para continuar",$("#mdlRgstr").modal("show"))},$("#mdlRgstr").on("hidden.bs.modal",(function(e){document.getElementById("mdlRgsL").innerHTML="Inicia sesión o regístrate"})),document.getElementById("inNwCom").onfocus=function(){actSsn?document.getElementById("frmNwComBtns").classList.remove("d-none"):(document.getElementById("mdlRgsL").innerHTML="Inicia sesión o regístrate para continuar",$("#mdlRgstr").modal("show"))};var d=[],a=5,s=0,l=null;function i(e){document.getElementById("btnLdMrComs").classList.add("d-none"),document.getElementById("cntComs2").innerHTML="",document.getElementById("comCount").innerHTML=s+" comentario",1!=s&&(document.getElementById("comCount").innerHTML+="s");for(let t=1;t<=e&&!(t>d.length);t++)null!=d[d.length-t]&&document.getElementById("cntComs2").appendChild(o(d[d.length-t]));d.length>e&&document.getElementById("btnLdMrComs").classList.remove("d-none"),document.getElementById("spnCom").classList.add("d-none"),document.getElementById("cntComs").classList.remove("d-none"),document.getElementById("cntComs2").classList.remove("d-none")}function o(e){let t=document.createElement("div");t.classList.add("container-fluid"),t.classList.add("bg-light"),t.classList.add("rounded-lg"),t.classList.add("p-2"),t.classList.add("mb-1");let n=document.createElement("div");n.classList.add("row"),n.classList.add("justify-content-between");let d=document.createElement("div");d.classList.add("col-auto");let a=document.createElement("a");a.classList.add("text-decoration-none"),a.classList.add("text-dark"),a.href="../../ver-perfil?user="+e.authKey,a.innerHTML='<img src="'+e.pic+'" alt="" class="rounded-circle mr-2" height="35" width="35" onerror="this.src=`https://via.placeholder.com/20.webp`">'+e.from,d.appendChild(a),n.appendChild(d);let s=document.createElement("div");s.classList.add("col-auto"),s.classList.add("dropleft");let l=document.createElement("button");l.classList.add("btn"),l.classList.add("btn-light"),l.setAttribute("data-toggle","dropdown"),l.setAttribute("aria-haspopup","true"),l.setAttribute("aria-expanded","false"),l.innerHTML='<i class="fas fa-ellipsis-h"></i>',s.appendChild(l);let i=document.createElement("div");i.classList.add("dropdown-menu"),i.classList.add("border-0");let o=id+"c"+e.id;o="'".concat(o).concat("'"),i.innerHTML='<button class="dropdown-item" onclick="report('+o+');"><i class="fas fa-flag"></i> Reportar</button>',s.appendChild(i),n.appendChild(s);let c=document.createElement("div");c.classList.add("row"),c.classList.add("pl-3"),c.classList.add("pr-2");let r=document.createElement("p");r.innerText=e.text,c.appendChild(r);let m=document.createElement("div");m.classList.add("row");let u=document.createElement("div");u.classList.add("col-auto");let p=document.createElement("button");p.classList.add("btn"),p.classList.add("btn-scckie"),p.classList.add("mr-3"),p.setAttribute("onclick","reply("+e.id+")"),p.innerHTML="Responder",u.appendChild(p),e.reps.length>0&&(p=document.createElement("button"),p.classList.add("btn"),p.classList.add("btn-link-scckie"),p.setAttribute("onclick",'document.getElementById("'+e.id+'Reps").classList.toggle("d-none")'),p.innerHTML='Respuestas <i class="fas fa-caret-down"></i>',u.appendChild(p)),m.appendChild(u),t.appendChild(n),t.appendChild(c),t.appendChild(m);let g=document.createElement("div");g.classList.add("row"),g.classList.add("pl-4"),g.classList.add("pt-2"),g.classList.add("d-none"),g.setAttribute("id",e.id+"Reps");for(let t=0;t<e.reps.length;t++){let n=document.createElement("div");n.classList.add("col-11"),n.classList.add("p-2"),n.classList.add("rounded-lg"),n.classList.add("mb-1"),n.classList.add("ml-auto"),n.classList.add("mr-2"),n.classList.add("border");let d=document.createElement("div");d.classList.add("row"),d.classList.add("justify-content-between");let a=document.createElement("div");a.classList.add("col-auto");let s=document.createElement("a");s.classList.add("text-decoration-none"),s.classList.add("text-dark"),s.href="../../ver-perfil?user="+e.reps[t].authKey,s.innerHTML='<img src="'+e.reps[t].pic+'" alt="" class="rounded-circle mr-2" height="35" width="35" onerror="this.src=`https://via.placeholder.com/20.webp`">'+e.reps[t].from,a.appendChild(s),d.appendChild(a);let l=document.createElement("div");l.classList.add("col-auto"),l.classList.add("dropleft");let i=document.createElement("button");i.classList.add("btn"),i.classList.add("btn-light"),i.setAttribute("data-toggle","dropdown"),i.setAttribute("aria-haspopup","true"),i.setAttribute("aria-expanded","false"),i.innerHTML='<i class="fas fa-ellipsis-h"></i>',l.appendChild(i);let o=document.createElement("div");o.classList.add("dropdown-menu"),o.classList.add("border-0");let c=id+"c"+e.id+"r"+e.reps[t].id;c="'".concat(c).concat("'"),o.innerHTML='<button class="dropdown-item" onclick="report('+c+');"><i class="fas fa-flag"></i> Reportar</button>',l.appendChild(o),d.appendChild(l);let r=document.createElement("div");r.classList.add("row"),r.classList.add("pl-3"),r.classList.add("pr-2");let m=document.createElement("p");m.innerText=e.reps[t].text,r.appendChild(m),n.appendChild(d),n.appendChild(r),g.appendChild(n)}return t.appendChild(g),t}document.getElementById("btnLdComs").onclick=function(){document.getElementById("btnLdComs").classList.add("d-none"),document.getElementById("spnCom").classList.remove("d-none"),db.collection("cookies/comments/"+id).doc("1").get().then((e=>{e.exists?(d=e.data().coms,s=e.data().comCount,i(a)):(document.getElementById("spnCom").classList.add("d-none"),document.getElementById("cntComs").classList.remove("d-none"),document.getElementById("cntComs2").classList.remove("d-none"))})).catch((e=>{console.log("err")}))}}();
//# sourceMappingURL=cookie.js.map
