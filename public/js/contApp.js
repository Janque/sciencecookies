//Init database
var db=firebase.firestore();

//Check auth
firebase.auth().onAuthStateChanged(function(user) {
    if(user){
        document.getElementById('inEmail').value=email;
    }else{
        $('#mdlRgstr').modal('show');
    }
});

function loaded(){
    if(urlSrch.get('sub')=='suger'||urlSrch.get('sub')=='fallo'||urlSrch.get('sub')=='tos'||urlSrch.get('sub')=='priv'||urlSrch.get('sub')=='otro')document.getElementById('inO'+urlSrch.get('sub')).selected=true;
    function send(){
        db.collection('messages').add({
            from:email,
            subject:document.getElementById('inSubj').value,
            mess:document.getElementById('inText').value,
        }).then(res=>{
            document.getElementById("alrtClsSsn").innerHTML='<div id="alrtClsSsnAlrt" class="alert alert-success alert-dismissible fade show fixed-bottom" role="alert">Gracias por tu mensaje, se ha enviado correctamente.            <button id="btnAlrtClsSsn" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
            setTimeout(function(){
                document.getElementById("btnAlrtClsSsn").click();
            },3000);
            $('#alrtClsSsnAlrt').on('closed.bs.alert', function () {
                document.getElementById("alrtClsSsn").innerHTML='';
            });
        }).catch(function(err){
            document.getElementById("alrtClsSsn").innerHTML='<div id="alrtClsSsnAlrt" class="alert alert-danger alert-dismissible fade show fixed-bottom" role="alert">Ha ocurrido un error, por favor intenta nuevamente.            <button id="btnAlrtClsSsn" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
            setTimeout(function(){
                document.getElementById("btnAlrtClsSsn").click();
            },3000);
            $('#alrtClsSsnAlrt').on('closed.bs.alert', function () {
                document.getElementById("alrtClsSsn").innerHTML='';
            });
        })
    }
    document.getElementById("frmCont").addEventListener("submit",function(event){
        event.preventDefault();
        send();
    });
}