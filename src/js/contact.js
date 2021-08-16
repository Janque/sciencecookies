import { getAuth, onAuthStateChanged} from "firebase/auth";
const AUTH = getAuth();

//Check auth
onAuthStateChanged(AUTH, (user) => {
    if (user) {
        document.getElementById('inEmail').value = email;
    } else {
        $('#mdlRgstr').modal('show');
    }
});

window.loaded = function loaded() {
    if (urlSrch.get('sub') == 'suger' || urlSrch.get('sub') == 'fallo' || urlSrch.get('sub') == 'tos' || urlSrch.get('sub') == 'priv' || urlSrch.get('sub') == 'otro') document.getElementById('inO' + urlSrch.get('sub')).selected = true;
    function send() {
        db.collection('messages').add({
            from: email,
            subject: document.getElementById('inSubj').value,
            mess: document.getElementById('inText').value,
        }).then(res => {
            alertTop("Gracias por tu mensaje, se ha enviado correctamente.", 1);
        }).catch(function (err) {
            alertTop("Ha ocurrido un error, por favor intenta nuevamente.", 0);
        })
    }
    document.getElementById("frmCont").addEventListener("submit", function (event) {
        event.preventDefault();
        send();
    });
}