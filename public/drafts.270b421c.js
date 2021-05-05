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
})({"js/drafts.js":[function(require,module,exports) {
var rtDB = firebase.database();

window.loaded = function loaded() {
  initSrch(false);

  function newSrch() {
    let srchStr = '?k=';
    let wordArr = document.getElementById('srcBox').value.split(' ');
    srchStr = srchStr + wordArr[0];

    for (let i = 1; i < wordArr.length; i++) {
      srchStr = srchStr + '+' + wordArr[i];
    }

    srchStr = srchStr + '&o=' + document.getElementById('inOrd').value;
    srchStr = srchStr + '&d=' + document.getElementById('inDir').value;
    window.location.href = srchStr;
  }

  document.getElementById("frmSrch").addEventListener("submit", e => {
    e.preventDefault();
    newSrch();
  });

  function plusCookie() {
    let title = document.getElementById('inTitle').value.trim();
    let file = document.getElementById('inFile').value;
    cookiesFSRef.where('file', '==', file).limit(1).get().then(snap => {
      if (!snap.empty) {
        if (lang = "es") {
          alertTop("Ese nombre de archivo ya esta en uso.", 0, 'alrtPlusContainer');
        } else if (lang = "en") {
          alertTop("That file name is already in use.", 0, 'alrtPlusContainer');
        }
      } else {
        document.getElementById('btnPlusConf').classList.add('d-none');
        document.getElementById('btnCanPlus0').setAttribute('disabled', 'true');
        document.getElementById('btnCanPlus1').setAttribute('disabled', 'true');
        document.getElementById('barCont').classList.remove('d-none');
        setprog('3');
        let id;
        rtDB.ref('tdaysID').transaction(today => {
          if (today) {
            today.last++;
            id = today.today;
            if (today.last < 10) id += '0';
            id += today.last;
          }

          return today;
        }, err => {
          if (err) {
            setprog('0');

            if (lang = "es") {
              alertTop("<strong>Ocurrió un error: " + err + ".</strong><br>LLamar a Javier.", 0, 'alrtPlusContainer');
            } else if (lang = "en") {
              alertTop("<strong>There has been an error: " + err + ".</strong><br>Call Javier.", 0, 'alrtPlusContainer');
            }

            console.log(err);
          } else {
            setprog('52');
            const promises = [];
            langs.forEach((l, i) => {
              setprog(30 / langs.length * i);
              promises.push(db.collection('cookies/langs/' + l).doc(id).set({
                authors: [author],
                cont: [{
                  type: "head",
                  title: title,
                  author: [author]
                }, {
                  type: "ref",
                  ref: []
                }],
                media: [],
                picUrl: "",
                title: title,
                description: "",
                file: file,
                owner: uid,
                java: "",
                revised: {},
                notify: false,
                public: false,
                beenPublic: false,
                dledit: false,
                created: new firebase.firestore.Timestamp.now(),
                ledit: new firebase.firestore.Timestamp.now(),
                published: new firebase.firestore.Timestamp.now(),
                pop: 0,
                likes: 0,
                favs: 0,
                url: "",
                fixedCats: [],
                cats: [],
                translations: {
                  es: file
                }
              }));
            });
            Promise.all(promises).then(() => {
              setprog('90');
              setTimeout(function () {
                setprog('100');
                document.getElementById('bar').classList.add('bg-success');

                if (lang = "es") {
                  alertTop(`Creado con exito. Redirigiendo...<br>Si no te redirige automáticamente, haz <a class="btn-link-scckie" href="../editar?id=${id}">click aqui</a>.`, 1, 'alrtPlusContainer');
                } else if (lang = "en") {
                  alertTop(`Successfully created. Redirigiendo...<br>If you aren't automatically redirected, <a class="btn-link-scckie" href="../edit?id=${id}">click here</a>.`, 1, 'alrtPlusContainer');
                }
              }, 1000);
              setTimeout(function () {
                if (lang = "es") {
                  window.location.href = '../editar?id=' + id;
                } else if (lang = "en") {
                  window.location.href = '../edit?id=' + id;
                }
              }, 3000);
            }).catch(err => console.log(err));
          }
        });
      }
    }).catch(err => console.log(err));
  }

  document.getElementById("frmPlus").addEventListener("submit", e => {
    e.preventDefault();
    plusCookie();
  });
};

const previewLim = 21; //Get search params

var kywords, srtOrd, desc, srchRef;
var nxtp = false,
    paglast = [null],
    page = 1;
var allChk = false;

function initSrch(stAf) {
  kywords = "";

  if (urlSrch.get('k') != null) {
    kywords = urlSrch.get('k').replace('+', ' ');
    document.getElementById('srcBox').value = kywords;
  }

  ;
  document.getElementById("inSrchOrd0").selected = false;
  document.getElementById("inSrchOrd1").selected = false;
  document.getElementById("inSrchOrd2").selected = false;
  document.getElementById("inSrchOrd3").selected = false;
  srtOrd = urlSrch.get('o');

  switch (srtOrd) {
    case 'created':
      document.getElementById("inSrchOrd0").selected = true;
      break;

    case 'published':
      document.getElementById("inSrchOrd1").selected = true;
      break;

    case 'ledit':
      document.getElementById("inSrchOrd2").selected = true;
      break;

    case 'pop':
      document.getElementById("inSrchOrd3").selected = true;
      break;

    default:
      srtOrd = 'created';
      break;
  }

  document.getElementById("inSrchDir0").selected = false;
  document.getElementById("inSrchDir1").selected = false;
  desc = urlSrch.get('d');

  if (desc == 'asc') {
    desc = false;
    document.getElementById("inSrchDir1").selected = true;
  } else {
    desc = true;
    document.getElementById("inSrchDir0").selected = true;
  }

  if (page > 1 && stAf && paglast[page - 1] != null && paglast[page - 1] != undefined) {
    if (kywords == undefined || kywords == null || kywords == "") {
      if (!desc) {
        srchRef = cookiesFSRef.orderBy(srtOrd).startAfter(paglast[page - 1]).limit(previewLim);
      } else {
        srchRef = cookiesFSRef.orderBy(srtOrd, 'desc').startAfter(paglast[page - 1]).limit(previewLim);
      }
    } else {
      if (!desc) {
        srchRef = cookiesFSRef.where('title', '==', kywords).orderBy(srtOrd).startAfter(paglast[page - 1]).limit(previewLim);
      } else {
        srchRef = dcookiesFSRef.where('title', '==', kywords).orderBy(srtOrd, 'desc').startAfter(paglast[page - 1]).limit(previewLim);
      }
    }
  } else {
    if (kywords == undefined || kywords == null || kywords == "") {
      if (!desc) {
        srchRef = cookiesFSRef.orderBy(srtOrd).limit(previewLim);
      } else {
        srchRef = cookiesFSRef.orderBy(srtOrd, 'desc').limit(previewLim);
      }
    } else {
      if (!desc) {
        srchRef = cookiesFSRef.where('title', '==', kywords).orderBy(srtOrd).limit(previewLim);
      } else {
        srchRef = cookiesFSRef.where('title', '==', kywords).orderBy(srtOrd, 'desc').limit(previewLim);
      }
    }
  }

  shwSrch();
}

function shwSrch() {
  if ((kywords == undefined || kywords == null || kywords == "") && page == 1) {
    document.getElementById('crdContainer').innerHTML = `<div class="col mb-4">
            <div class="card text-dark bg-light h-100 cardBorder" style="border-color: #343a40;">
                <a type="button" data-toggle="modal" data-target="#mdlPlus" class="text-decoration-none text-dark h-100 d-flex align-items-center justify-content-center">
                    <h1 style="font-size: 6rem;" class="mb-0"><i class="far fa-plus-square"></i></h1>
                </a>
            </div>
        </div>`;
  } else {
    document.getElementById('crdContainer').innerHTML = "";
  }

  srchRef.get().then(snap => {
    let docs = snap.docs;
    nxtp = false;
    let idx = 0;

    if (docs.length < 1) {
      document.getElementById('crdContainer').innerHTML = `<h5 class="mt-0 text-center">No se han encontrado resultados</h5><div class="col mb-4">
            <div class="card text-dark bg-light h-100 cardBorder" style="border-color: #343a40;">
                <a type="button" data-toggle="modal" data-target="#mdlPlus" class="text-decoration-none text-dark h-100 d-flex align-items-center justify-content-center">
                    <h1 style="font-size: 6rem;" class="mb-0"><i class="far fa-plus-square"></i></h1>
                </a>
            </div>
        </div>`;
    }

    docs.forEach(function (doc) {
      let col = document.createElement('col');
      col.classList.add('col');
      col.classList.add('mb-4');
      let card = document.createElement('div');
      let helpStr = "card text-dark bg-light h-100 cardBorder";
      helpStr = helpStr.split(' ');
      helpStr.forEach(clas => {
        card.classList.add(clas);
      });

      if (doc.data().owner == uid) {
        card.classList.add('border-success');
      } else {
        card.classList.add('border-secondary');
      }

      let h = document.createElement('div');
      helpStr = "card-header bg-light m-0 py-0 text-right";
      helpStr = helpStr.split(' ');
      helpStr.forEach(clas => {
        h.classList.add(clas);
      });
      let row = document.createElement('div');
      row.classList.add('row');
      row.classList.add('justify-content-between');

      if (!doc.data().public) {
        let col0 = document.createElement('div');
        col0.classList.add('col-auto');
        col0.classList.add('p-0');
        let badge = document.createElement('span');
        badge.classList.add('badge');
        badge.classList.add('badge-warning');
        badge.innerText = 'Draft';
        col0.appendChild(badge);
        row.appendChild(col0);
      }

      let col1 = document.createElement('div');
      col1.classList.add('col-auto');
      col1.classList.add('p-0');
      col1.classList.add('ml-auto');
      let drp = document.createElement('div');
      drp.classList.add('dropdown');
      let btndrp = document.createElement('button');
      btndrp.classList.add('btn');
      btndrp.classList.add('btn-light');
      btndrp.setAttribute('type', 'button');
      btndrp.setAttribute('data-toogle', 'dropdown');
      btndrp.setAttribute('aria-haspopup', "true");
      btndrp.setAttribute('aria-expanded', "false");
      btndrp.innerHTML = '<i class="fas fa-ellipsis-h"></i>';

      btndrp.onclick = function () {
        if (document.getElementById("drpMenu" + doc.id).classList.contains('show')) {
          $("#drpMenu" + doc.id).dropdown('hide');
        } else {
          $("#drpMenu" + doc.id).dropdown('show');
          setTimeout(function () {
            $("#drpMenu" + doc.id).dropdown('hide');
          }, 5000);
        }
      };

      drp.appendChild(btndrp);
      let drpmenu = document.createElement('div');
      drpmenu.classList.add('dropdown-menu');
      drpmenu.classList.add('dropdown-menu-right');
      drpmenu.setAttribute('id', "drpMenu" + doc.id);
      let drpitm0 = document.createElement('button');
      drpitm0.classList.add('dropdown-item');

      drpitm0.onclick = function () {
        if (lang == "es") {
          window.location.href = '../editar?id=' + doc.id;
        } else if (lang == "en") {
          window.location.href = '../edit?id=' + doc.id;
        }
      };

      if (lang == "es") {
        drpitm0.innerHTML = 'Editar <i class="fas fa-edit"></i>';
      } else if (lang == "en") {
        drpitm0.innerHTML = 'Edit <i class="fas fa-edit"></i>';
      }

      drpmenu.appendChild(drpitm0);
      let drpitm1 = document.createElement('button');
      drpitm1.classList.add('dropdown-item');

      drpitm1.onclick = function () {
        window.open('../vista-email/' + doc.data().file, '_blank').focus();
      };

      drpitm1.innerHTML = 'Vista correo <i class="fas fa-envelope"></i>';
      drpmenu.appendChild(drpitm1);
      let drpitm2 = document.createElement('button');
      let drpitm3 = document.createElement('button');
      let d = doc.data().created.toDate();

      if (doc.data().public) {
        drpitm2.classList.add('dropdown-item');

        drpitm2.onclick = function () {
          let month = d.getFullYear().toString();

          if (d.getMonth() < 9) {
            month += '0';
          }

          month += d.getMonth() + 1;
          window.open(doc.data().url, '_blank').focus();
        };

        drpitm2.innerHTML = 'Ver artículo <i class="fas fa-eye"></i>';
        drpmenu.appendChild(drpitm2);
        /*drpitm3.classList.add('dropdown-item');@# sync langs
        drpitm3.onclick = function () {
            cookiesFSRef.doc(doc.id).update({
                public: false
            });
        };
        drpitm3.innerHTML = 'Volver privado <i class="fas fa-lock"></i>';*/

        drpmenu.appendChild(drpitm3);
      }

      drp.appendChild(drpmenu);
      col1.appendChild(drp);
      row.appendChild(col1);
      h.appendChild(row);
      card.appendChild(h);
      let authTxt, noImgTxt, creatTxt, uptTxt, pubTxt, noPubTxt;

      if (lang = "es") {
        authTxt = "Autor(es)";
        noImgTxt = "No hay imagen";
        noPubTxt = "Sin publicar";
        creatTxt = "Creado: ";
        uptTxt = "Actualizado: ";
        pubTxt = "Publicado: ";
      } else if (lang = "en") {
        authTxt = "Author(s)";
        noImgTxt = "No image";
        noPubTxt = "Not public";
        creatTxt = "Created: ";
        uptTxt = "Updated: ";
        pubTxt = "Published: ";
      }

      let a = document.createElement('a');

      if (lang == "es") {
        a.href = '../editar?id=' + doc.id;
      } else if (lang == "en") {
        a.href = '../edit?id=' + doc.id;
      }

      a.classList.add('text-decoration-none');
      a.classList.add('text-dark');
      let img = document.createElement('img');
      img.src = doc.data().picUrl;
      img.classList.add('card-img-top');
      img.alt = noImgTxt;
      a.appendChild(img);
      let cbody = document.createElement('div');
      cbody.classList.add('card-body');
      cbody.innerHTML = '<h3 class="card-title">' + doc.data().title + '</h3>\n<p>' + authTxt + ':' + doc.data().authors + '</p>\n<p class="card-text">' + doc.data().description + '</p>\n';
      a.appendChild(cbody);
      let f = document.createElement('div');
      f.classList.add('card-footer');
      f.classList.add('text-muted');
      f.innerHTML = '<p>' + creatTxt + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + '</p>\n';
      d = doc.data().ledit.toDate();
      f.innerHTML += '<p>' + uptTxt + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + '</p>\n';

      if (doc.data().public) {
        d = doc.data().published.toDate();
        f.innerHTML += '<p>' + pubTxt + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + '</p>\n';
      } else {
        f.innerHTML += '<p>' + noPubTxt + '</p>\n';
      }

      a.appendChild(f);
      card.appendChild(a);
      col.appendChild(card);
      document.getElementById('crdContainer').appendChild(col);

      if (idx == previewLim - 1) {
        if (paglast[page] == undefined || paglast[page] == null) {
          paglast.push(docs[docs.length - 1]);
        } else if (paglast[page] != docs[docs.length - 1]) {
          paglast.splice(page, 1, docs[docs.length - 1]);
        }

        nxtp = true;
        document.getElementById("pgNavT").classList.remove('d-none');
        document.getElementById("pgNavB").classList.remove('d-none');
      }

      idx++;
    });

    if (!nxtp) {
      document.getElementById("pgTNxt").setAttribute('disabled', 'true');
      document.getElementById("pgBNxt").setAttribute('disabled', 'true');
    } else {
      document.getElementById("pgTNxt").removeAttribute('disabled');
      document.getElementById("pgBNxt").removeAttribute('disabled');
    }

    if (page == 1) {
      document.getElementById("pgTPrv").setAttribute('disabled', 'true');
      document.getElementById("pgBPrv").setAttribute('disabled', 'true');
    } else {
      document.getElementById("pgTPrv").removeAttribute('disabled');
      document.getElementById("pgBPrv").removeAttribute('disabled');
    }
  }).catch(err => {
    console.log(err);
  });
}

document.getElementById("pgTPrv").onclick = function () {
  reSrch(-1);
};

document.getElementById("pgBPrv").onclick = function () {
  reSrch(-1);
};

document.getElementById("pgTNxt").onclick = function () {
  reSrch(1);
};

document.getElementById("pgBNxt").onclick = function () {
  reSrch(1);
};

function reSrch(np) {
  if (page < 1 && np == -1) return;
  if (!nxtp && np == 1) return;
  page += np;
  document.getElementById('disPgT').innerText = page;
  document.getElementById('disPgB').innerText = page;
  initSrch(true);
  document.getElementById("cookCnt").scrollIntoView();
}

document.getElementById('btnPlus').onclick = function () {
  $('#mdlPlus').modal('show');
};

var inFileChanged = false;

function cancelPlus() {
  document.getElementById('inTitle').value = "";
  document.getElementById('inFile').value = "";
  document.getElementById('alrtPlusContainer').innerHTML = '';
  inFileChanged = false;
}

document.getElementById('btnCanPlus0').onclick = function () {
  cancelPlus();
};

document.getElementById('btnCanPlus1').onclick = function () {
  cancelPlus();
};

document.getElementById('inTitle').onfocus = function () {
  document.getElementById('alrtPlusContainer').innerHTML = '';
};

document.getElementById('inTitle').onchange = function () {
  document.getElementById('inTitle').value = document.getElementById('inTitle').value.trim();
  if (inFileChanged) return;
  let title = document.getElementById('inTitle').value;
  title = rmDiacs(title);
  title = title.toLowerCase();
  document.getElementById('inFile').value = title.replaceAll(' ', '-');
};

document.getElementById('inFile').onfocus = function () {
  inFileChanged = true;
};

document.getElementById('inFile').onchange = function () {
  document.getElementById('alrtPlusContainer').innerHTML = '';
};

function setprog(n) {
  document.getElementById('bar').setAttribute('aria-valuenow', n);
  document.getElementById('bar').style.width = n + '%';
  document.getElementById('bar').innerText = n + '%';
}

document.getElementById('inFile').oninput = function () {
  document.getElementById('inFile').value = rmDiacs(document.getElementById('inFile').value.trim().replaceAll(' ', '-'));
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
},{}]},{},["../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/drafts.js"], null)
//# sourceMappingURL=/drafts.270b421c.js.map