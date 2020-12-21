//Init database
var db=firebase.firestore();
var store=firebase.storage();

var urlSrch='';

//Check auth
var displayName,email,photoURL,uid;
firebase.auth().onAuthStateChanged(function(user) {
    if(user){
        displayName=user.displayName;
        photoURL=user.photoURL;
        uid=user.uid;
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
    tosUrl: 'docs/tos',
    privacyPolicyUrl: 'docs/privacidad'
};
var ui=new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', uiConfig);

window.addEventListener("load",function(){
    urlSrch=new URLSearchParams(location.search);
    if(ui.isPendingRedirect())ui.start('#firebaseui-auth-container', uiConfig);
    if(urlSrch.get('mode')=='select')$('#mdlRgstr').modal('show');
    shwRecom();
    loaded();
});

function shwRecom(){
    db.collection('galletas').orderBy('date','desc').limit(1).get().then(snap=>{
        let docs=snap.docs;
        docs.forEach(function(doc){
            document.getElementById('crd0').href='galletas/'+doc.data().url;
            document.getElementById('crd0i').src=doc.data().picUrl;
            let d=doc.data().date.toDate();
            document.getElementById('crd0t').innerHTML='                                      <h5 class="card-title">'+doc.data().title+'</h5>                                 <p class="card-text">'+doc.data().descrip+'</p>                                   <p class="card-text">'+d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' Autor(es):'+doc.data().authrs+'</p>';
            document.getElementById('rmed0').href='galletas/'+doc.data().url;
            document.getElementById('rmed0i').src=doc.data().picUrl;
            d=doc.data().date.toDate();
            document.getElementById('rmed0t').innerHTML='                                    <h6 class="card-title"><strong>'+doc.data().title+'</strong></h6>                <p class="card-text">'+doc.data().descrip+'</p>                                   <p class="card-text">'+d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' Autor(es):'+doc.data().authrs+'</p>';
        })
    });
    db.collection('galletas').orderBy('pop','desc').limit(3).get().then(snap=>{
        let docs=snap.docs;
        let idx=1;
        docs.forEach(function(doc){
            document.getElementById('crd'+idx).href='galletas/'+doc.data().url;
            document.getElementById('crd'+idx+'i').src=doc.data().picUrl;
            let d=doc.data().date.toDate();
            document.getElementById('crd'+idx+'t').innerHTML='                                <h5 class="card-title">'+doc.data().title+'</h5>                                 <p class="card-text">'+doc.data().descrip+'</p>                                   <p class="card-text">'+d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' Autor(es):'+doc.data().authrs+'</p>';
            document.getElementById('rmed'+idx).href='galletas/'+doc.data().url;
            document.getElementById('rmed'+idx+'i').src=doc.data().picUrl;
            d=doc.data().date.toDate();
            document.getElementById('rmed'+idx+'t').innerHTML='                              <h6 class="card-title"><strong>'+doc.data().title+'</strong></h6>                 <p class="card-text">'+doc.data().descrip+'</p>                                   <p class="card-text">'+d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' Autor(es):'+doc.data().authrs+'</p>';
            idx++;
        })
    });
}