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
})({"js/profile.js":[function(require,module,exports) {
//Global
var fav,
    liked,
    points,
    rank,
    gotFL = false;
var favn, favl, likedn, likedl;
var publicID;
var visible, vmail, vfl, rNews;
var lvisible,
    lvemail,
    lvfl,
    lrNews,
    prefChanges = false;
var fileForUp = null;

window.loaded = function loaded() {
  //Check auth
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      document.getElementById('picUsr').setAttribute('onerror', "this.src='https://via.placeholder.com/20.webp'");
      document.getElementById('picUsr').src = photoURL;
      shwCrds(urlSrch.get('tab'));
    } else {
      $('#mdlRgstr').modal('show');
    }
  });

  function send() {
    displayName = document.getElementById('inNewNck').value;
    firebase.auth().currentUser.updateProfile({
      displayName: displayName
    }).then(function () {
      db.collection('usersPublic').doc(publicID).update({
        name: displayName,
        pic: photoURL,
        email: email,
        favn: favn,
        favl: favl,
        likedn: likedn,
        likedl: likedl,
        points: points,
        rank: rank,
        visible: document.getElementById('inPubPrfl').checked,
        vemail: document.getElementById('inPubEmail').checked,
        vfl: document.getElementById('inPubFL').checked
      }).then(() => {
        resetFrm();
        document.getElementById('disName').innerHTML = newNk;
      }).catch(err => {
        console.log(err);
      });
    }).catch(function (err) {
      console.log(err);
    });
  }

  document.getElementById("frmChngNk").addEventListener("submit", function (event) {
    event.preventDefault();
    send();
    $('#mdlCngNck').modal('hide');
  });

  function uptPref() {
    db.collection('users').doc(uid).update({
      visible: document.getElementById('inPubPrfl').checked,
      vemail: document.getElementById('inPubEmail').checked,
      vfl: document.getElementById('inPubFL').checked,
      rNews: document.getElementById('inNews').checked
    }).then(() => {
      if (rNews != lrNews) {
        let newsRef = db.collection("newsletters").doc("base");

        if (lrNews) {
          newsRef.update({
            emails: firebase.firestore.FieldValue.arrayUnion(email)
          });
        } else {
          newsRef.update({
            emails: firebase.firestore.FieldValue.arrayRemove(email)
          });
        }
      }

      visible = lvisible;
      vemail = lvemail;
      vfl = lvfl;
      rNews = lrNews;
      db.collection('usersPublic').doc(publicID).update({
        name: displayName,
        pic: photoURL,
        email: email,
        favn: favn,
        favl: favl,
        likedn: likedn,
        likedl: likedl,
        points: points,
        rank: rank,
        visible: document.getElementById('inPubPrfl').checked,
        vemail: document.getElementById('inPubEmail').checked,
        vfl: document.getElementById('inPubFL').checked
      }).then(() => {}).catch(err => {
        console.log(err);
      });
    }).catch(err => {
      console.log(err);
    });
  }

  document.getElementById("frmPref").addEventListener("submit", function (event) {
    event.preventDefault();
    document.getElementById('btnCanPref').setAttribute('disabled', 'true');
    document.getElementById('btnCnfPref').setAttribute('disabled', 'true');
    uptPref();

    if (lang = "es") {
      alertTop("Se han guardado los cambios", 1);
    } else if (lang = "en") {
      alertTop("Changes have been saved", 1);
    }
  });

  function uptPP(file) {
    let ref = storage.ref('ppics/' + publicID + '/pp');
    let task = ref.put(file);
    task.on('state_changed', function progress(snap) {
      let progPer = snap.bytesTransferred / snap.totalBytes * 100;
      document.getElementById('prBarDis').style['width'] = progPer + '%';
    }, function error(err) {
      resetFrm();
      $('#mdlCngPP').modal('hide');

      if (lang = "es") {
        alertTop("<strong>¡Ha ocurrido un error!</strong> Revisa que tu archivo cumpla los límites y sea una imagen e intenta de nuevo.", 2);
      } else if (lang = "en") {
        alertTop("<strong>¡There has been an error!</strong> Check that your file meets the limits and is an image and try again.", 2);
      }
    }, function complete() {
      document.getElementById('picUsr').src = document.getElementById("preVIn").src;
      document.getElementById('disPP').src = document.getElementById("preVIn").src;
      resetFrm();
      $('#mdlCngPP').modal('hide');
      ref.getDownloadURL().then(url => {
        url = url.replace('pp?', 'pp_200x200?');
        firebase.auth().currentUser.updateProfile({
          photoURL: url
        }).then(() => {
          db.collection('usersPublic').doc(publicID).update({
            pic: url,
            email: email,
            favn: favn,
            favl: favl,
            likedn: likedn,
            likedl: likedl,
            points: points,
            rank: rank
          }).then(() => {}).catch(err => {
            console.log(err);
          });
        }).catch(err => {
          console.log(err);
        });
      }).catch(err => {
        console.log(err);
      });
    });
  }

  document.getElementById("frmChngPP").addEventListener("submit", function (event) {
    event.preventDefault();
    document.getElementById("prBar").classList.remove('d-none');
    document.getElementById("frmChngPP").classList.add('d-none');
    document.getElementById("btnCnfNwPP").classList.add('disabled');
    document.getElementById("btnCanNwPP").classList.add('disabled');
    uptPP(fileForUp);
  });
  document.getElementById('inNwPP').addEventListener('change', function (e) {
    fileForUp = e.target.files[0];

    function prevImg() {
      var read = new FileReader();
      read.readAsDataURL(fileForUp);

      read.onload = function (e2) {
        document.getElementById("preVIn").src = e2.target.result;
      };
    }

    ;
    document.getElementById('inNwPPL').innerHTML = fileForUp.name;
    prevImg(fileForUp);
  });
};

function resetFrm() {
  document.getElementById('inNewNck').value = '';
  document.getElementById('inNwPP').value = '';
  document.getElementById("preVIn").src = '';
  document.getElementById('inNwPPL').innerHTML = 'Elige una imagen';
  document.getElementById("prBar").classList.add('d-none');
  document.getElementById("frmChngPP").classList.remove('d-none');
  document.getElementById("btnCnfNwPP").classList.remove('disabled');
  document.getElementById("btnCanNwPP").classList.remove('disabled');
}

function setPrefBtns() {
  if (prefChanges) {
    document.getElementById('btnCanPref').disabled = false;
    document.getElementById('btnCnfPref').disabled = false;
  } else {
    document.getElementById('btnCanPref').setAttribute('disabled', 'true');
    document.getElementById('btnCnfPref').setAttribute('disabled', 'true');
  }
}

document.getElementById('inPubPrfl').onclick = function () {
  if (lvisible) {
    document.getElementById('inPubEmail').setAttribute('disabled', 'true');
    document.getElementById('inPubFL').setAttribute('disabled', 'true');
    document.getElementById('inPubEmail').checked = false;
    document.getElementById('inPubFL').checked = false;
  } else {
    document.getElementById('inPubEmail').disabled = false;
    document.getElementById('inPubFL').disabled = false;
    document.getElementById('inPubEmail').checked = lvemail;
    document.getElementById('inPubFL').checked = lvfl;
  }

  lvisible = !lvisible;
  prefChanges = !(document.getElementById('inPubPrfl').checked == visible && document.getElementById('inPubEmail').checked == vemail && document.getElementById('inPubFL').checked == vfl && document.getElementById('inNews').checked == rNews);
  setPrefBtns();
};

document.getElementById('inPubEmail').onclick = function () {
  lvemail = !lvemail;
  prefChanges = !(document.getElementById('inPubPrfl').checked == visible && document.getElementById('inPubEmail').checked == vemail && document.getElementById('inPubFL').checked == vfl && document.getElementById('inNews').checked == rNews);
  setPrefBtns();
};

document.getElementById('inPubFL').onclick = function () {
  lvfl = !lvfl;
  prefChanges = !(document.getElementById('inPubPrfl').checked == visible && document.getElementById('inPubEmail').checked == vemail && document.getElementById('inPubFL').checked == vfl && document.getElementById('inNews').checked == rNews);
  setPrefBtns();
};

document.getElementById('inNews').onclick = function () {
  lrNews = !lrNews;
  prefChanges = !(document.getElementById('inPubPrfl').checked == visible && document.getElementById('inPubEmail').checked == vemail && document.getElementById('inPubFL').checked == vfl && document.getElementById('inNews').checked == rNews);
  setPrefBtns();
};

function shwPrfl() {
  document.getElementById('navBtnPrfl').classList.add('active');
  document.getElementById('disPP').setAttribute('onerror', "this.src='https://via.placeholder.com/20.webp'");
  document.getElementById('disPP').src = photoURL;
  document.getElementById('disMail').innerHTML = email;
  document.getElementById('disName').innerHTML = displayName;
  document.getElementById('crdPrfl').classList.remove('d-none');
}

function shwFav() {
  document.getElementById('navBtnFav').classList.add('active');
  let favStr = '';
  favn.forEach(function (itm, idx) {
    favStr = favStr + '<li class="list-group-item text-light border-light bg-transparent"><a class="text-decoration-none text-light" href="galletas/' + favl[idx] + '">' + itm + ' <i class="fas fa-link"></i></a></li>';
  });
  document.getElementById('cntFav').innerHTML = favStr;
  document.getElementById('crdFav').classList.remove('d-none');
}

function shwLike() {
  document.getElementById('navBtnLike').classList.add('active');
  let likedStr = '';
  likedn.forEach(function (itm, idx) {
    likedStr = likedStr + '<li class="list-group-item text-light border-light bg-transparent"><a class="text-decoration-none text-light" href="galletas/' + likedl[idx] + '">' + itm + ' <i class="fas fa-link"></i></a></li>';
  });
  document.getElementById('cntLike').innerHTML = likedStr;
  document.getElementById('crdLike').classList.remove('d-none');
}

function shwPref() {
  document.getElementById('navBtnPref').classList.add('active');
  document.getElementById('inPubPrfl').checked = visible;

  if (visible) {
    document.getElementById('inPubEmail').disabled = false;
    document.getElementById('inPubFL').disabled = false;
    document.getElementById('inPubEmail').checked = vemail;
    document.getElementById('inPubFL').checked = vfl;
  } else {
    document.getElementById('inPubEmail').setAttribute('disabled', 'true');
    document.getElementById('inPubFL').setAttribute('disabled', 'true');
    document.getElementById('inPubEmail').checked = false;
    document.getElementById('inPubFL').checked = false;
  }

  document.getElementById('inNews').checked = rNews;
  lvisible = visible;
  lvemail = vemail;
  lvfl = vfl;
  lrNews = rNews;
  prefChanges = false;
  setPrefBtns();
  document.getElementById('crdPref').classList.remove('d-none');
}

function shwCrds(t) {
  if (gotFL == false) {
    db.collection('users').doc(uid).get().then(function (doc) {
      fav = doc.data().fav;
      liked = doc.data().liked;
      favn = doc.data().favn;
      favl = doc.data().favl;
      likedn = doc.data().likedn;
      likedl = doc.data().likedl;
      points = doc.data().points;
      rank = doc.data().rank;
      publicID = doc.data().publicID;
      visible = doc.data().visible;
      vemail = doc.data().vemail;
      vfl = doc.data().vfl;
      lvisible = doc.data().visible;
      lvemail = doc.data().vmail;
      lvfl = doc.data().vfl;
      rNews = doc.data().rNews;
      lrNews = doc.data().rNews;
      shwCrds2(t);
    }).catch(function (err) {
      console.log(err);
    });
    gotFL = true;
  } else {
    shwCrds2(t);
  }
}

function shwCrds2(t) {
  if (t == 'pref') {
    document.getElementById('crdFav').classList.add('d-none');
    document.getElementById('navBtnFav').classList.remove('active');
    document.getElementById('crdLike').classList.add('d-none');
    document.getElementById('navBtnLike').classList.remove('active');
    document.getElementById('crdPrfl').classList.add('d-none');
    document.getElementById('navBtnPrfl').classList.remove('active');
    shwPref();
  } else {
    if (t == 'favs') {
      document.getElementById('crdPrfl').classList.add('d-none');
      document.getElementById('navBtnPrfl').classList.remove('active');
      document.getElementById('crdLike').classList.add('d-none');
      document.getElementById('navBtnLike').classList.remove('active');
      document.getElementById('crdPref').classList.add('d-none');
      document.getElementById('navBtnPref').classList.remove('active');
      shwFav();
    } else {
      if (t == 'likes') {
        document.getElementById('crdFav').classList.add('d-none');
        document.getElementById('navBtnFav').classList.remove('active');
        document.getElementById('crdPrfl').classList.add('d-none');
        document.getElementById('navBtnPrfl').classList.remove('active');
        document.getElementById('crdPref').classList.add('d-none');
        document.getElementById('navBtnPref').classList.remove('active');
        shwLike();
      } else {
        /*if(t=='notif'){
            @#NOTIFICACIONES
        }*/
        document.getElementById('crdFav').classList.add('d-none');
        document.getElementById('navBtnFav').classList.remove('active');
        document.getElementById('crdLike').classList.add('d-none');
        document.getElementById('navBtnLike').classList.remove('active');
        document.getElementById('crdPref').classList.add('d-none');
        document.getElementById('navBtnPref').classList.remove('active');
        shwPrfl(); //}
      }
    }
  }
}
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "64027" + '/');

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
},{}]},{},["../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/profile.js"], null)
//# sourceMappingURL=/profile.3cbec8a6.js.map