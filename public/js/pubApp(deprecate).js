//Check auth
var displayName,email,photoURL,uid,providerData;
firebase.auth().onAuthStateChanged(function(user) {
    if(user){
        displayName=user.displayName;
        photoURL=user.photoURL;
        uid=user.uid;
        providerData=user.providerData;
        shwSsnBtns();
        let modAuth=firebase.app().functions('us-east1').httpsCallable('modAuth');
        modAuth(uid).then(res=>{
            if(!res.data){
                window.location.href='https://sciencecookies.net';
            }
        }).catch(err=>console.log(err));
    }else{
        window.location.href='https://sciencecookies.net';
    }
});
//Log Out
document.getElementById("btnLgO").onclick=function(){
    firebase.auth().signOut().then(function() {
        document.getElementById("alrtClsSsn").innerHTML='<div id="alrtClsSsnAlrt" class="alert alert-warning alert-dismissible fade show fixed-bottom" role="alert">Haz cerrado tu sesión correctamente. <strong>!Vuelve pronto!</strong>                                                                           <button id="btnAlrtClsSsn" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    }).catch(function(error) {
        document.getElementById("alrtClsSsn").innerHTML='<div id="alrtClsSsnAlrt" class="alert alert-danger alert-dismissible fade show fixed-bottom" role="alert"><strong>!Ha ocurrido un error! </strong>'+error+'<button id="btnAlrtClsSsn" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
        console.log(error);
    });
    setTimeout(function(){
        document.getElementById("btnAlrtClsSsn").click();
    },3000);
    $('#alrtClsSsnAlrt').on('closed.bs.alert', function () {
        document.getElementById("alrtClsSsn").innerHTML='';
    });
    window.location.href='https://sciencecookies.net';
};

function loaded(){
    preFill();
    function send(){
        let bUrl="20"+(Math.floor(document.getElementById('inId').value/10000))+"/";
        let authrs=[];
        for(let i=0;i<3;i++){
            if(document.getElementById('authr'+i).checked)authrs.push(document.getElementById('authr'+i).value);
        }
        db.collection('galletas').doc(document.getElementById('inId').value).set({
            likes:0,
            favs:0,
            pop:0,
            date:new firebase.firestore.Timestamp.fromDate(new Date(document.getElementById('inDate').value)),
            title:document.getElementById('inTtl').value,
            descrip:document.getElementById('inDesc').value,
            url:bUrl+document.getElementById('inFile').value,
            picUrl:bUrl+document.getElementById('inId').value+"pic."+document.getElementById('inPicF').value,
            authrs:authrs,
            cats:document.getElementById('inKw').value.split(' '),
        }).then(function() {
            document.getElementById("alrtClsSsn").innerHTML='<div id="alrtClsSsnAlrt" class="alert alert-success alert-dismissible fade show fixed-bottom" role="alert">Publicado correctamente<strong></strong>                                                                           <button id="btnAlrtClsSsn" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
            firebase.database().ref('galletas/'+document.getElementById('inId').value).set({
                pop:0,
                likes:0,
                favs:0
            });
        }).catch(function(error) {
            document.getElementById("alrtClsSsn").innerHTML='<div id="alrtClsSsnAlrt" class="alert alert-danger alert-dismissible fade show fixed-bottom" role="alert"><strong>!Ha ocurrido un error! </strong>'+error+'<button id="btnAlrtClsSsn" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
            console.log(error);
        });
        setTimeout(function(){
            document.getElementById("btnAlrtClsSsn").click();
        },3000);
        $('#alrtClsSsnAlrt').on('closed.bs.alert', function () {
            document.getElementById("alrtClsSsn").innerHTML='';
        })
    }
    document.getElementById("frmPub").addEventListener("submit",function(event){
        event.preventDefault();
        send();
    });
}

function preFill(){
    let date=new Date();
    let id=date.getFullYear()%100;
    id*=100;
    id+=date.getMonth()+1;
    id*=100;
    id+=date.getDate();
    id*=100;
    id++;
    document.getElementById('inId').value=id;
    let dateStr=date.getFullYear()+'-';
    if(date.getMonth()+1<10)dateStr+='0';
    dateStr+=(date.getMonth()+1)+'-'+date.getDate();
    document.getElementById('inDate').value=dateStr;
}
