//Init database
var db=firebase.firestore();

//Global
var urlSrch='';
var points,rank,gotFL=false;
var favn,favl,likedn,likedl;
var ppic,pname,pemail;
var visible,vmail,vfl;

//Check auth
var displayName,email,photoURL,uid,providerData;
firebase.auth().onAuthStateChanged(function(user) {
    if(user){
        displayName=user.displayName;
        photoURL=user.photoURL;
        uid=user.uid;
        providerData=user.providerData;
        shwSsnBtns(true);
    }else{
        shwSsnBtns(false);
    }
});
//Botones de sesion
function shwSsnBtns(ac){ 
    if(ac){
        document.getElementById('icnUsr').classList.remove('fa-user-slash');
        document.getElementById('icnUsr').classList.add('fa-user');
        document.getElementById('picUsr').setAttribute('onerror',"this.src='img/nopp.png'");
        document.getElementById('picUsr').src=photoURL;
        document.getElementById('btnPrfl').classList.remove('d-none');
        document.getElementById('btnPref').classList.remove('d-none');
        document.getElementById('btnLgO').classList.remove('d-none');
        document.getElementById('btnLgI').classList.add('d-none');
    }else{
        document.getElementById('icnUsr').classList.remove('fa-user');
        document.getElementById('icnUsr').classList.add('fa-user-slash');
        document.getElementById('picUsr').setAttribute('onerror',"");
        document.getElementById('picUsr').src='';
        document.getElementById('btnLgI').classList.remove('d-none');
        document.getElementById('btnPrfl').classList.add('d-none');
        document.getElementById('btnPref').classList.add('d-none');
        document.getElementById('btnLgO').classList.add('d-none');
    }
}
//Log Out
document.getElementById("btnLgO").onclick=function(){
    firebase.auth().signOut().then(function() {
        document.getElementById("alrtClsSsn").innerHTML='<div id="alrtClsSsnAlrt" class="alert alert-warning alert-dismissible fade show fixed-bottom" role="alert">Haz cerrado tu sesión correctamente. <strong>!Vuelve pronto!</strong>                                                                           <button id="btnAlrtClsSsn" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    }).catch(function(error) {
        document.getElementById("alrtClsSsn").innerHTML='<div id="alrtClsSsnAlrt" class="alert alert-danger alert-dismissible fade show fixed-bottom" role="alert"><strong>!Ha ocurrido un error! </strong>'+error+'<button id="btnAlrtClsSsn" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    });
    setTimeout(function(){
        document.getElementById("btnAlrtClsSsn").click();
    },3000);
    $('#alrtClsSsnAlrt').on('closed.bs.alert', function () {
        document.getElementById("alrtClsSsn").innerHTML='';
    });
};
//Autenticaciones
var uiConfig={
    signInSuccessUrl:window.location,
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
            forceSameDevice: false,
            requireDisplayName: true,
            signInMethod:'emailLink',
        },
        //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    ],
    // Terms of service url.
    tosUrl: 'docs/tos',
    // Privacy policy url.
    privacyPolicyUrl: 'docs/privacidad'
};
var ui=new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', uiConfig);

window.addEventListener("load",function(){
    urlSrch=new URLSearchParams(location.search);
    if(ui.isPendingRedirect())ui.start('#firebaseui-auth-container', uiConfig);
    if(urlSrch.get('mode')=='select')$('#mdlRgstr').modal('show');
    shwRecom();
    shwCrds(urlSrch.get('tab'),urlSrch.get('user'));
});

function shwPrfl(){
    document.getElementById('navBtnPrfl').classList.add('active');
    firebase.storage().ref('ppics/'+urlSrch.get('u')+'/pp_200x200').getDownloadURL().then(url=>{
        if(ppic!=null)document.getElementById('disPP').setAttribute('onerror',"this.src='"+ppic+"'");
        else document.getElementById('disPP').setAttribute('onerror',"this.src='img/nopp.png'");
        document.getElementById('disPP').src=url;
        if(pemail!=null)document.getElementById('contEmail').classList.remove('d-none');
        document.getElementById('disMail').innerHTML=pemail;
        document.getElementById('disName').innerHTML=pname;
        document.getElementById('crdPrfl').classList.remove('d-none');
    }).catch(err=>{
        if(ppic!=null)document.getElementById('disPP').setAttribute('onerror',"this.src='"+ppic+"'");
        else document.getElementById('disPP').setAttribute('onerror',"this.src='img/nopp.png'");
        document.getElementById('disPP').src='';
        if(pemail!=null)document.getElementById('contEmail').classList.remove('d-none');
        document.getElementById('disMail').innerHTML=pemail;
        document.getElementById('disName').innerHTML=pname;
        document.getElementById('crdPrfl').classList.remove('d-none');
    });
}
function shwFav(){
    if(favn==null)return;
    document.getElementById('navBtnFav').classList.add('active');
    let favStr='';
    favn.forEach(function(itm,idx){
        favStr=favStr+'<li class="list-group-item text-light border-light bg-transparent"><a class="text-decoration-none text-light" href="galletas/'+favl[idx]+'">'+itm+' <i class="fas fa-link"></i></a></li>';
    });
    document.getElementById('cntFav').innerHTML=favStr;
    document.getElementById('crdFav').classList.remove('d-none');
}
function shwLike(){
    if(likedn==null)return;
    document.getElementById('navBtnLike').classList.add('active');
    let likedStr='';
    likedn.forEach(function(itm,idx){
        likedStr=likedStr+'<li class="list-group-item text-light border-light bg-transparent"><a class="text-decoration-none text-light" href="galletas/'+likedl[idx]+'">'+itm+' <i class="fas fa-link"></i></a></li>';
    });
    document.getElementById('cntLike').innerHTML=likedStr;
    document.getElementById('crdLike').classList.remove('d-none');
}
function shwCrds(t,u){
    if((u==null||u=='')&&!gotFL){
        window.location.href='https://sciencecookies.net';
    }
    if(t==null||favn==null)t='prof';
    if(gotFL==false){
        let getUserPublic=firebase.app().functions('us-east1').httpsCallable('getUserPublic');
        getUserPublic(u).then(userPublic=>{
            userPublic=userPublic.data;
            if(userPublic==null){
                document.getElementById('navBtnFav').classList.add('disabled');
                document.getElementById('navBtnLike').classList.add('disabled');
                document.getElementById('navBtnPrfl').classList.add('disabled');
                document.getElementById('contEmail').classList.add('d-none');
                document.getElementById('contPic').classList.add('d-none');
                document.getElementById('contNull').innerHTML='<div class="col"><strong>Este perfíl no existe o es privado</strong></div>';
                document.getElementById('crdPrfl').classList.remove('d-none');
            }else{
                favn=userPublic.favn;
                favl=userPublic.favl;
                likedn=userPublic.likedn;
                likedl=userPublic.likedl;
                points=userPublic.points;
                rank=userPublic.rank;
                visible=userPublic.visible;
                vemail=userPublic.vemail;
                vfl=userPublic.vfl;
                ppic=userPublic.ppic;
                pemail=userPublic.pemail;
                pname=userPublic.pname;
                if(favn==null){
                    document.getElementById('navBtnFav').classList.add('disabled');
                    document.getElementById('navBtnLike').classList.add('disabled');
                }
                shwCrds2(t);
            }
        }).catch(err=>{});
        gotFL=true;
    }else{
        shwCrds2(t);
    }
}
function shwCrds2(t){
    if(t=='favs'){
        if(favn==null)return;
        document.getElementById('crdPrfl').classList.add('d-none');
        document.getElementById('navBtnPrfl').classList.remove('active');
        document.getElementById('crdLike').classList.add('d-none');
        document.getElementById('navBtnLike').classList.remove('active');
        shwFav();
    }else{
        if(t=='likes'){
            if(likedn==null)return;
            document.getElementById('crdFav').classList.add('d-none');
            document.getElementById('navBtnFav').classList.remove('active');
            document.getElementById('crdPrfl').classList.add('d-none');
            document.getElementById('navBtnPrfl').classList.remove('active');
            shwLike();
        }else{
            document.getElementById('crdFav').classList.add('d-none');
            document.getElementById('navBtnFav').classList.remove('active');
            document.getElementById('crdLike').classList.add('d-none');
            document.getElementById('navBtnLike').classList.remove('active');
            shwPrfl();
        }
    }
}

function shwRecom(){
    db.collection('galletas').orderBy('date','desc').limit(1).get().then(function(docs){
        docs.forEach(function(doc){
            document.getElementById('crd0').href='galletas/'+doc.data().url;
            document.getElementById('crd0i').src='galletas/'+doc.data().picUrl;
            let d=doc.data().date.toDate();
            document.getElementById('crd0t').innerHTML='                                      <h5 class="card-title">'+doc.data().title+'</h5>                                 <p class="card-text">'+doc.data().descrip+'</p>                                   <p class="card-text">'+d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' Autor(es):'+doc.data().authrs+'</p>';
            document.getElementById('rmed0').href='galletas/'+doc.data().url;
            document.getElementById('rmed0i').src='galletas/'+doc.data().picUrl;
            d=doc.data().date.toDate();
            document.getElementById('rmed0t').innerHTML='                                    <h6 class="card-title">'+doc.data().title+'</h6>                                 <p class="card-text">'+doc.data().descrip+'</p>                                   <p class="card-text">'+d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' Autor(es):'+doc.data().authrs+'</p>';
        })
    });
    db.collection('galletas').orderBy('pop','desc').limit(3).get().then(function(docs){
        let idx=1;
        docs.forEach(function(doc){
            document.getElementById('crd'+idx).href='galletas/'+doc.data().url;
            document.getElementById('crd'+idx+'i').src='galletas/'+doc.data().picUrl;
            let d=doc.data().date.toDate();
            document.getElementById('crd'+idx+'t').innerHTML='                                <h5 class="card-title">'+doc.data().title+'</h5>                                 <p class="card-text">'+doc.data().descrip+'</p>                                   <p class="card-text">'+d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' Autor(es):'+doc.data().authrs+'</p>';
            document.getElementById('rmed'+idx).href='galletas/'+doc.data().url;
            document.getElementById('rmed'+idx+'i').src='galletas/'+doc.data().picUrl;
            d=doc.data().date.toDate();
            document.getElementById('rmed'+idx+'t').innerHTML='                              <h6 class="card-title">'+doc.data().title+'</h6>                                 <p class="card-text">'+doc.data().descrip+'</p>                                   <p class="card-text">'+d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' Autor(es):'+doc.data().authrs+'</p>';
            idx++;
        })
    });
}