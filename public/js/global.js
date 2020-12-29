//Init database
var db=firebase.firestore();
var store=firebase.storage();

var urlSrch='';
var url='';
var actSsn=false;
var mod=false,author="";

//Check auth
var displayName,email,photoURL,uid;
firebase.auth().onAuthStateChanged(function(user) {
    let modAuth=firebase.app().functions('us-east1').httpsCallable('publish-modAuth');
    if(user){
        displayName=user.displayName;
        email=user.email;
        photoURL=user.photoURL;
        uid=user.uid;
        actSsn=true;
        modAuth(uid).then(res=>{
            mod=res.data.name;
            author=res.data.name;
            if(url.pathname.substring(0,7)=="/drafts"||url.pathname.substring(0,7)=="/editar"||url.pathname.substring(0,13)=="/vista-previa"||url.pathname.substring(0,12)=="/vista-email"){
                if(!mod)window.location.href='https://sciencecookies.net';
            }
            shwSsnBtns(true);
        }).catch(err=>console.log(err));
    }else{
        if(url.pathname.substring(0,7)=="/perfil"||url.pathname.substring(0,9)=="/contacto"||url.pathname.substring(0,7)=="/drafts"||url.pathname.substring(0,7)=="/editar"||url.pathname.substring(0,13)=="/vista-previa"||url.pathname.substring(0,12)=="/vista-email"){
            window.location.href='https://sciencecookies.net';
        }
        actSsn=false;
        mod=false;
        shwSsnBtns(false);
    }
});
//Botones de sesion
function shwSsnBtns(ac){
    if(ac){
        document.getElementById('icnUsr').classList.remove('fa-user-slash');
        document.getElementById('icnUsr').classList.add('fa-user');
        document.getElementById('picUsr').setAttribute('onerror',"this.src='https://sciencecookies.net/img/nopp.png'");
        document.getElementById('picUsr').src=photoURL;
        if(document.getElementById('ppCom')){
            document.getElementById('ppCom').setAttribute('onerror',"this.src='https://sciencecookies.net/img/nopp.png'");
            document.getElementById('ppCom').src=photoURL;
        }
        document.getElementById('btnPrfl').classList.remove('d-none');
        document.getElementById('btnPref').classList.remove('d-none');
        if(mod){
            document.getElementById('btnDraft').classList.remove('d-none');
        }
        document.getElementById('btnLgO').classList.remove('d-none');
        if(document.getElementById('btnLgI'))document.getElementById('btnLgI').classList.add('d-none');
        if(url.pathname.substring(0,10)=="/galletas/"){
            db.collection('users').doc(uid).get().then(function(doc){
                let fav=doc.data().fav;
                let liked=doc.data().liked;
                pubID=doc.data().publicID;
                if(fav.indexOf(id)!=-1){
                    document.getElementById('btnFav').innerHTML=('En mis favoritos <i class="fas fa-heart"></i>').concat(' ',document.getElementById('btnFav').innerHTML.substr(document.getElementById('btnFav').innerHTML.search('<sp')));
                    document.getElementById('btnFav').classList.remove('btn-outline-light');
                    document.getElementById('btnFav').classList.add('btn-light');
                }
                else{
                    document.getElementById('btnFav').innerHTML=('Añadir a favoritos <i class="far fa-heart"></i>').concat(' ',document.getElementById('btnFav').innerHTML.substr(document.getElementById('btnFav').innerHTML.search('<sp')));
                    document.getElementById('btnFav').classList.remove('btn-light');
                    document.getElementById('btnFav').classList.add('btn-outline-light');
                }
                if(liked.indexOf(id)!=-1){
                    document.getElementById('btnLike').innerHTML=('Me gusta <i class="fas fa-thumbs-up"></i>').concat(' ',document.getElementById('btnLike').innerHTML.substr(document.getElementById('btnLike').innerHTML.search('<sp')));
                    document.getElementById('btnLike').classList.remove('btn-outline-light');
                    document.getElementById('btnLike').classList.add('btn-light');
                }
                else{
                    document.getElementById('btnLike').innerHTML=('Dar me gusta <i class="far fa-thumbs-up"></i>').concat(' ',document.getElementById('btnLike').innerHTML.substr(document.getElementById('btnLike').innerHTML.search('<sp')));
                    document.getElementById('btnLike').classList.remove('btn-light');
                    document.getElementById('btnLike').classList.add('btn-outline-light');
                }
            }).catch(function(err){console.log('err')});
        }
    }else{
        document.getElementById('icnUsr').classList.remove('fa-user');
        document.getElementById('icnUsr').classList.add('fa-user-slash');
        document.getElementById('picUsr').setAttribute('onerror',"");
        document.getElementById('picUsr').src='';
        document.getElementById('btnPrfl').classList.add('d-none');
        document.getElementById('btnPref').classList.add('d-none');
        document.getElementById('btnDraft').classList.add('d-none');
        document.getElementById('btnLgO').classList.add('d-none');
        if(document.getElementById('btnLgI'))document.getElementById('btnLgI').classList.remove('d-none');
    }
    if(url.pathname.substring(0,10)=="/galletas/"){
        document.getElementById('btnFav').classList.remove('disabled');
        document.getElementById('btnLike').classList.remove('disabled');
        document.getElementById('btnLdComs').classList.remove('disabled');
        document.getElementById('btnLdMrComs').classList.remove('disabled');
    }
}
//Log Out
document.getElementById("btnLgO").onclick=function(){
    firebase.auth().signOut().then(function() {
        document.getElementById("alrtClsSsn").innerHTML='<div id="alrtClsSsnAlrt" class="alert alert-warning alert-dismissible fade show fixed-bottom" role="alert">Haz cerrado tu sesión correctamente. <strong>!Vuelve pronto!</strong>                                                                           <button id="btnAlrtClsSsn" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    }).catch(function(error) {
        document.getElementById("alrtClsSsn").innerHTML='<div id="alrtClsSsnAlrt" class="alert alert-danger alert-dismissible fade show fixed-bottom" role="alert"><strong>!Ha ocurrido un error! </strong>'+error.code+'<button id="btnAlrtClsSsn" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
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
    tosUrl: 'https://sciencecookies.net/docs/tos',
    privacyPolicyUrl: 'https://sciencecookies.net/docs/privacidad'
};
var ui=new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', uiConfig);

window.addEventListener("load",function(){
    url = new URL(document.location.href);
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
            document.getElementById('crd0').href='https://sciencecookies.net/galletas/'+doc.data().url;
            document.getElementById('crd0i').src=doc.data().picUrl;
            let d=doc.data().date.toDate();
            document.getElementById('crd0t').innerHTML='                                      <h5 class="card-title">'+doc.data().title+'</h5>                                 <p class="card-text">'+doc.data().descrip+'</p>                                   <p class="card-text">'+d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' Autor(es):'+doc.data().authrs+'</p>';
            document.getElementById('rmed0').href='https://sciencecookies.net/galletas/'+doc.data().url;
            document.getElementById('rmed0i').src=doc.data().picUrl;
            d=doc.data().date.toDate();
            document.getElementById('rmed0t').innerHTML='                                    <h6 class="card-title"><strong>'+doc.data().title+'</strong></h6>                <p class="card-text">'+doc.data().descrip+'</p>                                   <p class="card-text">'+d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' Autor(es):'+doc.data().authrs+'</p>';
        })
    });
    db.collection('galletas').orderBy('pop','desc').limit(3).get().then(snap=>{
        let docs=snap.docs;
        let idx=1;
        docs.forEach(function(doc){
            document.getElementById('crd'+idx).href='https://sciencecookies.net/galletas/'+doc.data().url;
            document.getElementById('crd'+idx+'i').src=doc.data().picUrl;
            let d=doc.data().date.toDate();
            document.getElementById('crd'+idx+'t').innerHTML='                                <h5 class="card-title">'+doc.data().title+'</h5>                                 <p class="card-text">'+doc.data().descrip+'</p>                                   <p class="card-text">'+d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' Autor(es):'+doc.data().authrs+'</p>';
            document.getElementById('rmed'+idx).href='https://sciencecookies.net/galletas/'+doc.data().url;
            document.getElementById('rmed'+idx+'i').src=doc.data().picUrl;
            d=doc.data().date.toDate();
            document.getElementById('rmed'+idx+'t').innerHTML='                              <h6 class="card-title"><strong>'+doc.data().title+'</strong></h6>                 <p class="card-text">'+doc.data().descrip+'</p>                                   <p class="card-text">'+d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' Autor(es):'+doc.data().authrs+'</p>';
            idx++;
        })
    });
}

var defDiacs = [
    { 'corr': 'A', 'lt': '\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F' },
    { 'corr': 'AA', 'lt': '\uA732' },
    { 'corr': 'AE', 'lt': '\u00C6\u01FC\u01E2' },
    { 'corr': 'AO', 'lt': '\uA734' },
    { 'corr': 'AU', 'lt': '\uA736' },
    { 'corr': 'AV', 'lt': '\uA738\uA73A' },
    { 'corr': 'AY', 'lt': '\uA73C' },
    { 'corr': 'B', 'lt': '\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181' },
    { 'corr': 'C', 'lt': '\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E' },
    { 'corr': 'D', 'lt': '\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779\u00D0' },
    { 'corr': 'DZ', 'lt': '\u01F1\u01C4' },
    { 'corr': 'Dz', 'lt': '\u01F2\u01C5' },
    { 'corr': 'E', 'lt': '\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E' },
    { 'corr': 'F', 'lt': '\u0046\u24BB\uFF26\u1E1E\u0191\uA77B' },
    { 'corr': 'G', 'lt': '\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E' },
    { 'corr': 'H', 'lt': '\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D' },
    { 'corr': 'I', 'lt': '\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197' },
    { 'corr': 'J', 'lt': '\u004A\u24BF\uFF2A\u0134\u0248' },
    { 'corr': 'K', 'lt': '\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2' },
    { 'corr': 'L', 'lt': '\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780' },
    { 'corr': 'LJ', 'lt': '\u01C7' },
    { 'corr': 'Lj', 'lt': '\u01C8' },
    { 'corr': 'M', 'lt': '\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C' },
    { 'corr': 'N', 'lt': '\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4' },
    { 'corr': 'NJ', 'lt': '\u01CA' },
    { 'corr': 'Nj', 'lt': '\u01CB' },
    { 'corr': 'O', 'lt': '\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C' },
    { 'corr': 'OI', 'lt': '\u01A2' },
    { 'corr': 'OO', 'lt': '\uA74E' },
    { 'corr': 'OU', 'lt': '\u0222' },
    { 'corr': 'OE', 'lt': '\u008C\u0152' },
    { 'corr': 'oe', 'lt': '\u009C\u0153' },
    { 'corr': 'P', 'lt': '\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754' },
    { 'corr': 'Q', 'lt': '\u0051\u24C6\uFF31\uA756\uA758\u024A' },
    { 'corr': 'R', 'lt': '\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782' },
    { 'corr': 'S', 'lt': '\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784' },
    { 'corr': 'T', 'lt': '\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786' },
    { 'corr': 'TZ', 'lt': '\uA728' },
    { 'corr': 'U', 'lt': '\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244' },
    { 'corr': 'V', 'lt': '\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245' },
    { 'corr': 'VY', 'lt': '\uA760' },
    { 'corr': 'W', 'lt': '\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72' },
    { 'corr': 'X', 'lt': '\u0058\u24CD\uFF38\u1E8A\u1E8C' },
    { 'corr': 'Y', 'lt': '\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE' },
    { 'corr': 'Z', 'lt': '\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762' },
    { 'corr': 'a', 'lt': '\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250' },
    { 'corr': 'aa', 'lt': '\uA733' },
    { 'corr': 'ae', 'lt': '\u00E6\u01FD\u01E3' },
    { 'corr': 'ao', 'lt': '\uA735' },
    { 'corr': 'au', 'lt': '\uA737' },
    { 'corr': 'av', 'lt': '\uA739\uA73B' },
    { 'corr': 'ay', 'lt': '\uA73D' },
    { 'corr': 'b', 'lt': '\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253' },
    { 'corr': 'c', 'lt': '\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184' },
    { 'corr': 'd', 'lt': '\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A' },
    { 'corr': 'dz', 'lt': '\u01F3\u01C6' },
    { 'corr': 'e', 'lt': '\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD' },
    { 'corr': 'f', 'lt': '\u0066\u24D5\uFF46\u1E1F\u0192\uA77C' },
    { 'corr': 'g', 'lt': '\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F' },
    { 'corr': 'h', 'lt': '\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265' },
    { 'corr': 'hv', 'lt': '\u0195' },
    { 'corr': 'i', 'lt': '\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131' },
    { 'corr': 'j', 'lt': '\u006A\u24D9\uFF4A\u0135\u01F0\u0249' },
    { 'corr': 'k', 'lt': '\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3' },
    { 'corr': 'l', 'lt': '\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747' },
    { 'corr': 'lj', 'lt': '\u01C9' },
    { 'corr': 'm', 'lt': '\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F' },
    { 'corr': 'n', 'lt': '\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5' },
    { 'corr': 'nj', 'lt': '\u01CC' },
    { 'corr': 'o', 'lt': '\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275' },
    { 'corr': 'oi', 'lt': '\u01A3' },
    { 'corr': 'ou', 'lt': '\u0223' },
    { 'corr': 'oo', 'lt': '\uA74F' },
    { 'corr': 'p', 'lt': '\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755' },
    { 'corr': 'q', 'lt': '\u0071\u24E0\uFF51\u024B\uA757\uA759' },
    { 'corr': 'r', 'lt': '\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783' },
    { 'corr': 's', 'lt': '\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B' },
    { 'corr': 't', 'lt': '\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787' },
    { 'corr': 'tz', 'lt': '\uA729' },
    { 'corr': 'u', 'lt': '\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289' },
    { 'corr': 'v', 'lt': '\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C' },
    { 'corr': 'vy', 'lt': '\uA761' },
    { 'corr': 'w', 'lt': '\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73' },
    { 'corr': 'x', 'lt': '\u0078\u24E7\uFF58\u1E8B\u1E8D' },
    { 'corr': 'y', 'lt': '\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF' },
    { 'corr': 'z', 'lt': '\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763' }
];
var diacs = {};
for (var i = 0; i < defDiacs.length; i++) {
    var lt = defDiacs[i].lt;
    for (var j = 0; j < lt.length; j++) {
        diacs[lt[j]] = defDiacs[i].corr;
    }
}
function rmDiacs(s) {
    return s.replace(/[^\u0000-\u007E]/g, function (a) {
        return diacs[a] || a;
    });
}