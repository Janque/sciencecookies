// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/global.js":[function(require,module,exports) {
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//Init database
window.db = firebase.firestore();
window.urlSrch = '';
var url = new URL(window.location.href);
var actSsn = false;
var mod = false,
    author = "";

window.classes = function classes(elm, cls) {
  cls = cls.split(' ');
  cls.forEach(function (itm) {
    elm.classList.add(itm);
  });
};

window.hideEl = function hideEl(elm) {
  elm.classList.add('d-none');
};

window.showEl = function showEl(elm) {
  elm.classList.remove('d-none');
};

window.toggleEl = function toggleEl(elm) {
  elm.classList.toggle('d-none');
};

window.enable = function enable(btn) {
  btn.classList.remove('disabled');
  btn.removeAttribute('disabled');
};

window.disable = function disable(btn) {
  classes(btn, "disabled");
  btn.setAttribute("disabled", "true");
}; //Check auth


window.displayName;
window.email;
window.photoURL;
window.uid;
firebase.auth().onAuthStateChanged(function (user) {
  var modAuth = firebase.app().functions('us-east1').httpsCallable('publish-modAuth');

  if (user) {
    displayName = user.displayName;
    email = user.email;
    photoURL = user.photoURL;
    uid = user.uid;
    actSsn = true;
    modAuth(uid).then(function (res) {
      mod = res.data.mod;
      author = res.data.name;

      if (url.pathname.substring(0, 7) == "/drafts" || url.pathname.substring(0, 7) == "/editar" || url.pathname.substring(0, 13) == "/vista-previa" || url.pathname.substring(0, 12) == "/vista-email") {
        if (!mod) window.location.href = 'https://sciencecookies.net';
      }

      shwSsnBtns(true);
    }).catch(function (err) {
      return console.log(err);
    });
  } else {
    if (url.pathname.substring(0, 7) == "/perfil" || url.pathname.substring(0, 9) == "/contacto" || url.pathname.substring(0, 7) == "/drafts" || url.pathname.substring(0, 7) == "/editar" || url.pathname.substring(0, 13) == "/vista-previa" || url.pathname.substring(0, 12) == "/vista-email") {
      window.location.href = 'https://sciencecookies.net';
    }

    actSsn = false;
    mod = false;
    shwSsnBtns(false);
  }
}); //Botones de sesion

function shwSsnBtns(ac) {
  if (ac) {
    document.getElementById('icnUsr').classList.remove('fa-user-slash');
    document.getElementById('icnUsr').classList.add('fa-user');
    document.getElementById('picUsr').setAttribute('onerror', "this.src='https://sciencecookies.net/img/nopp.png'");
    document.getElementById('picUsr').src = photoURL;

    if (document.getElementById('ppCom')) {
      document.getElementById('ppCom').setAttribute('onerror', "this.src='https://sciencecookies.net/img/nopp.png'");
      document.getElementById('ppCom').src = photoURL;
    }

    document.getElementById('btnPrfl').classList.remove('d-none');
    document.getElementById('btnPref').classList.remove('d-none');

    if (mod) {
      document.getElementById('btnDraft').classList.remove('d-none');
      document.getElementById('btnCals').classList.remove('d-none');
    }

    document.getElementById('btnLgO').classList.remove('d-none');
    if (document.getElementById('btnLgI')) document.getElementById('btnLgI').classList.add('d-none');

    if (url.pathname.substring(0, 10) == "/galletas/") {
      db.collection('users').doc(uid).get().then(function (doc) {
        var fav = doc.data().fav;
        var liked = doc.data().liked;
        pubID = doc.data().publicID;

        if (fav.indexOf(id) != -1) {
          document.getElementById('btnFav').innerHTML = 'En mis favoritos <i class="fas fa-heart"></i>'.concat(' ', document.getElementById('btnFav').innerHTML.substr(document.getElementById('btnFav').innerHTML.search('<sp')));
          document.getElementById('btnFav').classList.remove('btn-outline-light');
          document.getElementById('btnFav').classList.add('btn-light');
        } else {
          document.getElementById('btnFav').innerHTML = 'Añadir a favoritos <i class="far fa-heart"></i>'.concat(' ', document.getElementById('btnFav').innerHTML.substr(document.getElementById('btnFav').innerHTML.search('<sp')));
          document.getElementById('btnFav').classList.remove('btn-light');
          document.getElementById('btnFav').classList.add('btn-outline-light');
        }

        if (liked.indexOf(id) != -1) {
          document.getElementById('btnLike').innerHTML = 'Me gusta <i class="fas fa-thumbs-up"></i>'.concat(' ', document.getElementById('btnLike').innerHTML.substr(document.getElementById('btnLike').innerHTML.search('<sp')));
          document.getElementById('btnLike').classList.remove('btn-outline-light');
          document.getElementById('btnLike').classList.add('btn-light');
        } else {
          document.getElementById('btnLike').innerHTML = 'Dar me gusta <i class="far fa-thumbs-up"></i>'.concat(' ', document.getElementById('btnLike').innerHTML.substr(document.getElementById('btnLike').innerHTML.search('<sp')));
          document.getElementById('btnLike').classList.remove('btn-light');
          document.getElementById('btnLike').classList.add('btn-outline-light');
        }
      }).catch(function (err) {
        console.log('err');
      });
    }
  } else {
    document.getElementById('icnUsr').classList.remove('fa-user');
    document.getElementById('icnUsr').classList.add('fa-user-slash');
    document.getElementById('picUsr').setAttribute('onerror', "");
    document.getElementById('picUsr').src = '';
    document.getElementById('btnPrfl').classList.add('d-none');
    document.getElementById('btnPref').classList.add('d-none');
    document.getElementById('btnDraft').classList.add('d-none');
    document.getElementById('btnLgO').classList.add('d-none');
    if (document.getElementById('btnLgI')) document.getElementById('btnLgI').classList.remove('d-none');
  }

  if (url.pathname.substring(0, 10) == "/galletas/") {
    document.getElementById('btnFav').classList.remove('disabled');
    document.getElementById('btnLike').classList.remove('disabled');
    document.getElementById('btnLdComs').classList.remove('disabled');
    document.getElementById('btnLdMrComs').classList.remove('disabled');
  }
} //Log Out


document.getElementById("btnLgO").onclick = function () {
  firebase.auth().signOut().then(function () {
    document.getElementById("alrtClsSsn").innerHTML = '<div id="alrtClsSsnAlrt" class="alert alert-warning alert-dismissible fade show fixed-bottom" role="alert">Haz cerrado tu sesión correctamente. <strong>!Vuelve pronto!</strong>                                                                           <button id="btnAlrtClsSsn" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
  }).catch(function (error) {
    document.getElementById("alrtClsSsn").innerHTML = '<div id="alrtClsSsnAlrt" class="alert alert-danger alert-dismissible fade show fixed-bottom" role="alert"><strong>!Ha ocurrido un error! </strong>' + error.code + '<button id="btnAlrtClsSsn" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
  });
  setTimeout(function () {
    document.getElementById("btnAlrtClsSsn").click();
  }, 3000);
  $('#alrtClsSsnAlrt').on('closed.bs.alert', function () {
    document.getElementById("alrtClsSsn").innerHTML = '';
  });
}; //Autenticaciones


var uiConfig = {
  signInSuccessUrl: window.location,
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID, firebase.auth.FacebookAuthProvider.PROVIDER_ID, _defineProperty({
    provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
    signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
    forceSameDevice: false,
    requireDisplayName: true
  }, "signInMethod", 'emailLink') //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
  ],
  tosUrl: 'https://sciencecookies.net/docs/tos',
  privacyPolicyUrl: 'https://sciencecookies.net/docs/privacidad'
};
var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', uiConfig);
window.addEventListener("load", function () {
  url = new URL(document.location.href);
  urlSrch = new URLSearchParams(location.search);
  if (ui.isPendingRedirect()) ui.start('#firebaseui-auth-container', uiConfig);
  if (urlSrch.get('mode') == 'select') $('#mdlRgstr').modal('show');
  shwRecom();
  loaded();
});

function shwRecom() {
  db.collection('galletas').where('public', '==', true).orderBy('date', 'desc').limit(1).get().then(function (snap) {
    var docs = snap.docs;
    docs.forEach(function (doc) {
      var dat = doc.data();
      var a0 = document.createElement('a');
      classes(a0, "text-decoration-none text-dark d-none d-md-inline");
      a0.href = dat.url;
      var card = document.createElement('div');
      classes(card, "card mb-2");
      a0.appendChild(card);
      var img0 = document.createElement('img');
      classes(img0, "card-img-top");
      img0.src = dat.picUrl;
      img0.alt = dat.title;
      card.appendChild(img0);
      var bod0 = document.createElement('div');
      classes(bod0, "card-body");
      var d = dat.date.toDate();
      bod0.innerHTML = "<h5 class=\"card-title\">" + dat.title + "</h5>\n                <p class=\"card-text\">" + dat.descrip + "</p>\n                <p class=\"card-text\">" + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + " Autor(es):" + dat.authrs + "</p>";
      card.appendChild(bod0);
      document.getElementById("newCook").appendChild(a0);
      var a1 = document.createElement('a');
      classes(a1, "text-decoration-none text-dark d-md-none");
      a1.href = dat.url;
      var med = document.createElement('div');
      classes(med, "media mb-3");
      a1.appendChild(med);
      var img1 = document.createElement('img');
      classes(img1, "align-self-center mr-3");
      img1.style.width = "64px";
      img1.style.height = "64px";
      img1.src = dat.picUrl;
      img1.alt = dat.title;
      med.appendChild(img1);
      var bod1 = document.createElement('div');
      classes(bod1, "media-body");
      bod1.innerHTML = "<h6 class=\"card-title\">" + dat.title + "</h6>\n                <p class=\"card-text\">" + dat.descrip + "</p>\n                <p class=\"card-text\">" + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + " Autor(es):" + dat.authrs + "</p>";
      med.appendChild(bod1);
      document.getElementById("newCook").appendChild(a1);
    });
  }).catch(function (err) {
    return console.log(err);
  });
  db.collection('galletas').where('public', '==', true).orderBy('pop', 'desc').limit(3).get().then(function (snap) {
    var docs = snap.docs;
    docs.forEach(function (doc) {
      var dat = doc.data();
      var a0 = document.createElement('a');
      classes(a0, "text-decoration-none text-dark d-none d-md-inline");
      a0.href = dat.url;
      var card = document.createElement('div');
      classes(card, "card mb-2");
      a0.appendChild(card);
      var img0 = document.createElement('img');
      classes(img0, "card-img-top");
      img0.src = dat.picUrl;
      img0.alt = dat.title;
      card.appendChild(img0);
      var bod0 = document.createElement('div');
      classes(bod0, "card-body");
      var d = dat.date.toDate();
      bod0.innerHTML = "<h5 class=\"card-title\">" + dat.title + "</h5>\n                <p class=\"card-text\">" + dat.descrip + "</p>\n                <p class=\"card-text\">" + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + " Autor(es):" + dat.authrs + "</p>";
      card.appendChild(bod0);
      document.getElementById("popCook").appendChild(a0);
      var a1 = document.createElement('a');
      classes(a1, "text-decoration-none text-dark d-md-none");
      a1.href = dat.url;
      var med = document.createElement('div');
      classes(med, "media mb-3");
      a1.appendChild(med);
      var img1 = document.createElement('img');
      classes(img1, "align-self-center mr-3");
      img1.style.width = "64px";
      img1.style.height = "64px";
      img1.src = dat.picUrl;
      img1.alt = dat.title;
      med.appendChild(img1);
      var bod1 = document.createElement('div');
      classes(bod1, "media-body");
      bod1.innerHTML = "<h6 class=\"card-title\">" + dat.title + "</h6>\n                <p class=\"card-text\">" + dat.descrip + "</p>\n                <p class=\"card-text\">" + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + " Autor(es):" + dat.authrs + "</p>";
      med.appendChild(bod1);
      document.getElementById("popCook").appendChild(a1);
      var divider = document.createElement('div');
      classes(divider, "dropdown-divider d-md-none");
      document.getElementById("popCook").appendChild(divider);
    });
  }).catch(function (err) {
    return console.log(err);
  });
  db.collection('calendarios').where("public", "==", true).orderBy('date', 'desc').limit(1).get().then(function (snap) {
    var docs = snap.docs;
    docs.forEach(function (doc) {
      var dat = doc.data();
      var a0 = document.createElement('a');
      classes(a0, "text-decoration-none text-dark d-none d-md-inline");
      a0.href = dat.url;
      var card = document.createElement('div');
      classes(card, "card mb-2");
      a0.appendChild(card);
      var img0 = document.createElement('img');
      classes(img0, "card-img-top");
      img0.src = dat.picUrl;
      img0.alt = dat.title;
      card.appendChild(img0);
      var bod0 = document.createElement('div');
      classes(bod0, "card-body");
      bod0.innerHTML = "<h5 class=\"card-title\">" + dat.title + "</h5>\n                <p class=\"card-text\">" + dat.descriptionShort + "</p>";
      card.appendChild(bod0);
      document.getElementById("calCnt").appendChild(a0);
      var a1 = document.createElement('a');
      classes(a1, "text-decoration-none text-dark d-md-none");
      a1.href = dat.url;
      var med = document.createElement('div');
      classes(med, "media mb-3");
      a1.appendChild(med);
      var img1 = document.createElement('img');
      classes(img1, "align-self-center mr-3");
      img1.style.width = "64px";
      img1.style.height = "64px";
      img1.src = dat.picUrl;
      img1.alt = dat.title;
      med.appendChild(img1);
      var bod1 = document.createElement('div');
      classes(bod1, "media-body");
      bod1.innerHTML = "<h6 class=\"card-title\">" + dat.title + "</h6>\n                <p class=\"card-text\">" + dat.descriptionShort + "</p>";
      med.appendChild(bod1);
      document.getElementById("calCnt").appendChild(a1);
      var divider = document.createElement('div');
      classes(divider, "dropdown-divider d-md-none");
      document.getElementById("calCnt").appendChild(divider);
      showEl(document.getElementById("calRecom"));
    });
  }).catch(function (err) {
    console.log(err);
  });
} //Show Adds


document.getElementById('adsV').innerHTML = "<h5 class=\"text-center mx-auto\">Publicidad</h5>\n    <a href=\"https://www.instagram.com/p/CDLE_t6nsdU/?igshid=ttb1h94rs65\" rel=\"sponsored\"><img class=\"w-100 mb-2\" src=\"https://sciencecookies.net/publicidad/CubreMid.jpg\" alt=\"Cubre Mid\"></a>\n    <a href=\"https://www.instagram.com/_pedacitode_cielo/\" rel=\"sponsored\"><img class=\"w-100 mb-2\" src=\"https://sciencecookies.net/publicidad/PedacitoDeCielo.jpeg\" alt=\"Pedacito de Cielo\"></a>\n    <a href=\"https://www.instagram.com/p/CC_2AELnaMi/?igshid=yp0v3i285a37\" rel=\"sponsored\">\n        <img class=\"w-100\" src=\"https://sciencecookies.net/publicidad/Lool-Ha1.jpeg\" alt=\"Lool-Ha\">\n        <img class=\"w-100\" src=\"https://sciencecookies.net/publicidad/Lool-Ha2.jpeg\" alt=\"Lool-Ha\">\n        <img class=\"w-100 mb-2\" src=\"https://sciencecookies.net/publicidad/Lool-Ha3.jpeg\" alt=\"Lool-Ha\">\n    </a>\n    <a href=\"https://www.google.com/url?sa=t&source=web&rct=j&url=https://www.instagram.com/awesomefundas/&ved=2ahUKEwi7pZiOvfjqAhUD2qwKHSV_ChQQFjAAegQIBhAC&usg=AOvVaw072K32mWOHN9b7u3cEzrcd\" rel=\"sponsored\"><img class=\"w-100 mb-2\" src=\"https://sciencecookies.net/publicidad/AwesomeFundas.jpg\" alt=\"Awesome Fundas\"></a>\n    <a href=\"https://m.facebook.com/pages/category/Beauty-Supply-Store/mondlermid-100749941724343/\" rel=\"sponsored\"><img class=\"w-100 mb-2\" src=\"https://sciencecookies.net/publicidad/Mondler.jpeg\" alt=\"Mondler\"></a>";
document.getElementById('adsH').innerHTML = "<div class=\"col-12 pt-2\">\n        <h5 class=\"text-center mx-auto\">Publicidad</h5>\n    </div>\n    <div class=\"col-6 px-1\">\n        <a href=\"https://www.instagram.com/p/CDLE_t6nsdU/?igshid=ttb1h94rs65\" rel=\"sponsored\"><img class=\"w-100 mb-2\" src=\"https://sciencecookies.net/publicidad/CubreMid.jpg\" alt=\"Cubre Mid\"></a>\n        <a href=\"https://www.instagram.com/_pedacitode_cielo/\" rel=\"sponsored\"><img class=\"w-100 mb-2\" src=\"https://sciencecookies.net/publicidad/PedacitoDeCielo.jpeg\" alt=\"Pedacito de Cielo\"></a>\n        <a href=\"https://www.instagram.com/p/CC_2AELnaMi/?igshid=yp0v3i285a37\" rel=\"sponsored\">\n            <img class=\"w-100\" src=\"https://sciencecookies.net/publicidad/Lool-Ha1.jpeg\" alt=\"Lool-Ha\">\n            <img class=\"w-100\" src=\"https://sciencecookies.net/publicidad/Lool-Ha2.jpeg\" alt=\"Lool-Ha\">\n            <img class=\"w-100 mb-2\" src=\"https://sciencecookies.net/publicidad/Lool-Ha3.jpeg\" alt=\"Lool-Ha\">\n        </a>\n    </div>\n    <div class=\"col-6 px-1\">\n        <a href=\"https://www.google.com/url?sa=t&source=web&rct=j&url=https://www.instagram.com/awesomefundas/&ved=2ahUKEwi7pZiOvfjqAhUD2qwKHSV_ChQQFjAAegQIBhAC&usg=AOvVaw072K32mWOHN9b7u3cEzrcd\" rel=\"sponsored\"><img class=\"w-100 mb-2\" src=\"https://sciencecookies.net/publicidad/AwesomeFundas.jpg\" alt=\"Awesome Fundas\"></a>\n        <a href=\"https://m.facebook.com/pages/category/Beauty-Supply-Store/mondlermid-100749941724343/\" rel=\"sponsored\"><img class=\"w-100 mb-2\" src=\"https://sciencecookies.net/publicidad/Mondler.jpeg\" alt=\"Mondler\"></a>\n    </div>";
var defDiacs = [{
  'corr': 'A',
  'lt': "A\u24B6\uFF21\xC0\xC1\xC2\u1EA6\u1EA4\u1EAA\u1EA8\xC3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\xC4\u01DE\u1EA2\xC5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F"
}, {
  'corr': 'AA',
  'lt': "\uA732"
}, {
  'corr': 'AE',
  'lt': "\xC6\u01FC\u01E2"
}, {
  'corr': 'AO',
  'lt': "\uA734"
}, {
  'corr': 'AU',
  'lt': "\uA736"
}, {
  'corr': 'AV',
  'lt': "\uA738\uA73A"
}, {
  'corr': 'AY',
  'lt': "\uA73C"
}, {
  'corr': 'B',
  'lt': "B\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181"
}, {
  'corr': 'C',
  'lt': "C\u24B8\uFF23\u0106\u0108\u010A\u010C\xC7\u1E08\u0187\u023B\uA73E"
}, {
  'corr': 'D',
  'lt': "D\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779\xD0"
}, {
  'corr': 'DZ',
  'lt': "\u01F1\u01C4"
}, {
  'corr': 'Dz',
  'lt': "\u01F2\u01C5"
}, {
  'corr': 'E',
  'lt': "E\u24BA\uFF25\xC8\xC9\xCA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\xCB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E"
}, {
  'corr': 'F',
  'lt': "F\u24BB\uFF26\u1E1E\u0191\uA77B"
}, {
  'corr': 'G',
  'lt': "G\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E"
}, {
  'corr': 'H',
  'lt': "H\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D"
}, {
  'corr': 'I',
  'lt': "I\u24BE\uFF29\xCC\xCD\xCE\u0128\u012A\u012C\u0130\xCF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197"
}, {
  'corr': 'J',
  'lt': "J\u24BF\uFF2A\u0134\u0248"
}, {
  'corr': 'K',
  'lt': "K\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2"
}, {
  'corr': 'L',
  'lt': "L\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780"
}, {
  'corr': 'LJ',
  'lt': "\u01C7"
}, {
  'corr': 'Lj',
  'lt': "\u01C8"
}, {
  'corr': 'M',
  'lt': "M\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C"
}, {
  'corr': 'N',
  'lt': "N\u24C3\uFF2E\u01F8\u0143\xD1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4"
}, {
  'corr': 'NJ',
  'lt': "\u01CA"
}, {
  'corr': 'Nj',
  'lt': "\u01CB"
}, {
  'corr': 'O',
  'lt': "O\u24C4\uFF2F\xD2\xD3\xD4\u1ED2\u1ED0\u1ED6\u1ED4\xD5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\xD6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\xD8\u01FE\u0186\u019F\uA74A\uA74C"
}, {
  'corr': 'OI',
  'lt': "\u01A2"
}, {
  'corr': 'OO',
  'lt': "\uA74E"
}, {
  'corr': 'OU',
  'lt': "\u0222"
}, {
  'corr': 'OE',
  'lt': "\x8C\u0152"
}, {
  'corr': 'oe',
  'lt': "\x9C\u0153"
}, {
  'corr': 'P',
  'lt': "P\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754"
}, {
  'corr': 'Q',
  'lt': "Q\u24C6\uFF31\uA756\uA758\u024A"
}, {
  'corr': 'R',
  'lt': "R\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782"
}, {
  'corr': 'S',
  'lt': "S\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784"
}, {
  'corr': 'T',
  'lt': "T\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786"
}, {
  'corr': 'TZ',
  'lt': "\uA728"
}, {
  'corr': 'U',
  'lt': "U\u24CA\uFF35\xD9\xDA\xDB\u0168\u1E78\u016A\u1E7A\u016C\xDC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244"
}, {
  'corr': 'V',
  'lt': "V\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245"
}, {
  'corr': 'VY',
  'lt': "\uA760"
}, {
  'corr': 'W',
  'lt': "W\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72"
}, {
  'corr': 'X',
  'lt': "X\u24CD\uFF38\u1E8A\u1E8C"
}, {
  'corr': 'Y',
  'lt': "Y\u24CE\uFF39\u1EF2\xDD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE"
}, {
  'corr': 'Z',
  'lt': "Z\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762"
}, {
  'corr': 'a',
  'lt': "a\u24D0\uFF41\u1E9A\xE0\xE1\xE2\u1EA7\u1EA5\u1EAB\u1EA9\xE3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\xE4\u01DF\u1EA3\xE5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250"
}, {
  'corr': 'aa',
  'lt': "\uA733"
}, {
  'corr': 'ae',
  'lt': "\xE6\u01FD\u01E3"
}, {
  'corr': 'ao',
  'lt': "\uA735"
}, {
  'corr': 'au',
  'lt': "\uA737"
}, {
  'corr': 'av',
  'lt': "\uA739\uA73B"
}, {
  'corr': 'ay',
  'lt': "\uA73D"
}, {
  'corr': 'b',
  'lt': "b\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253"
}, {
  'corr': 'c',
  'lt': "c\u24D2\uFF43\u0107\u0109\u010B\u010D\xE7\u1E09\u0188\u023C\uA73F\u2184"
}, {
  'corr': 'd',
  'lt': "d\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A"
}, {
  'corr': 'dz',
  'lt': "\u01F3\u01C6"
}, {
  'corr': 'e',
  'lt': "e\u24D4\uFF45\xE8\xE9\xEA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\xEB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD"
}, {
  'corr': 'f',
  'lt': "f\u24D5\uFF46\u1E1F\u0192\uA77C"
}, {
  'corr': 'g',
  'lt': "g\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F"
}, {
  'corr': 'h',
  'lt': "h\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265"
}, {
  'corr': 'hv',
  'lt': "\u0195"
}, {
  'corr': 'i',
  'lt': "i\u24D8\uFF49\xEC\xED\xEE\u0129\u012B\u012D\xEF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131"
}, {
  'corr': 'j',
  'lt': "j\u24D9\uFF4A\u0135\u01F0\u0249"
}, {
  'corr': 'k',
  'lt': "k\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3"
}, {
  'corr': 'l',
  'lt': "l\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747"
}, {
  'corr': 'lj',
  'lt': "\u01C9"
}, {
  'corr': 'm',
  'lt': "m\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F"
}, {
  'corr': 'n',
  'lt': "n\u24DD\uFF4E\u01F9\u0144\xF1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5"
}, {
  'corr': 'nj',
  'lt': "\u01CC"
}, {
  'corr': 'o',
  'lt': "o\u24DE\uFF4F\xF2\xF3\xF4\u1ED3\u1ED1\u1ED7\u1ED5\xF5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\xF6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\xF8\u01FF\u0254\uA74B\uA74D\u0275"
}, {
  'corr': 'oi',
  'lt': "\u01A3"
}, {
  'corr': 'ou',
  'lt': "\u0223"
}, {
  'corr': 'oo',
  'lt': "\uA74F"
}, {
  'corr': 'p',
  'lt': "p\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755"
}, {
  'corr': 'q',
  'lt': "q\u24E0\uFF51\u024B\uA757\uA759"
}, {
  'corr': 'r',
  'lt': "r\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783"
}, {
  'corr': 's',
  'lt': "s\u24E2\uFF53\xDF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B"
}, {
  'corr': 't',
  'lt': "t\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787"
}, {
  'corr': 'tz',
  'lt': "\uA729"
}, {
  'corr': 'u',
  'lt': "u\u24E4\uFF55\xF9\xFA\xFB\u0169\u1E79\u016B\u1E7B\u016D\xFC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289"
}, {
  'corr': 'v',
  'lt': "v\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C"
}, {
  'corr': 'vy',
  'lt': "\uA761"
}, {
  'corr': 'w',
  'lt': "w\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73"
}, {
  'corr': 'x',
  'lt': "x\u24E7\uFF58\u1E8B\u1E8D"
}, {
  'corr': 'y',
  'lt': "y\u24E8\uFF59\u1EF3\xFD\u0177\u1EF9\u0233\u1E8F\xFF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF"
}, {
  'corr': 'z',
  'lt': "z\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763"
}];
var diacs = {};

for (var i = 0; i < defDiacs.length; i++) {
  var lt = defDiacs[i].lt;

  for (var j = 0; j < lt.length; j++) {
    diacs[lt[j]] = defDiacs[i].corr;
  }
}

window.rmDiacs = function rmDiacs(s) {
  return s.replace(/[^\u0000-\u007E]/g, function (a) {
    return diacs[a] || a;
  });
};

window.ultraClean = function ultraClean(str, rep) {
  str = rmDiacs(str.trim().toLowerCase());
  var banChars = ",.^*!¡'?¿#@[]-:;ªº$%&()=/+{} ";
  banChars.split('').forEach(function (c) {
    str = str.replaceAll(c, rep);
  });
  return str;
};
},{}],"../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49622" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/global.js"], null)
//# sourceMappingURL=/global.6825d2fa.js.map