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
})({"js/draftsCal.js":[function(require,module,exports) {
window.loaded = function loaded() {
  initSrch(false);
};

const previewLim = 21; //Get search params

var nxtp = false,
    paglast = [null],
    page = 1;
var allChk = false;

function initSrch(stAf) {
  if (page > 1 && stAf && paglast[page - 1] != null && paglast[page - 1] != undefined) {
    srchRef = calendarsFSRef.orderBy('published', 'desc').startAfter(paglast[page - 1]).limit(previewLim);
  } else {
    srchRef = calendarsFSRef.orderBy('published', 'desc').limit(previewLim);
  }

  shwSrch();
}

function shwSrch() {
  document.getElementById('crdContainer').innerHTML = "";
  srchRef.get().then(snap => {
    let docs = snap.docs;
    nxtp = false;
    docs.forEach((doc, idx) => {
      let dat = doc.data();
      let col = document.createElement('col');
      classes(col, 'col');
      classes(col, 'mb-4');
      let card = document.createElement('div');
      classes(card, "card text-dark bg-light h-100 cardBorder");

      if (dat.public) {
        classes(card, 'border-success');
      } else {
        classes(card, 'border-secondary');
      }

      let h = document.createElement('div');
      classes(h, "card-header bg-light m-0 py-0 text-right");
      let row = document.createElement('div');
      classes(row, 'row');
      classes(row, 'justify-content-between');

      if (!dat.public) {
        let col0 = document.createElement('div');
        classes(col0, 'col-auto');
        classes(col0, 'p-0');
        let badge = document.createElement('span');
        classes(badge, 'badge');
        classes(badge, 'badge-warning');
        badge.innerText = 'Pendiente';
        col0.appendChild(badge);
        row.appendChild(col0);
      }

      let col1 = document.createElement('div');
      classes(col1, 'col-auto');
      classes(col1, 'p-0');
      classes(col1, 'ml-auto');
      let drp = document.createElement('div');
      classes(drp, 'dropdown');
      let btndrp = document.createElement('button');
      classes(btndrp, 'btn');
      classes(btndrp, 'btn-light');
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
      classes(drpmenu, 'dropdown-menu');
      classes(drpmenu, 'dropdown-menu-right');
      drpmenu.setAttribute('id', "drpMenu" + doc.id);
      let drpitm0 = document.createElement('button');
      classes(drpitm0, 'dropdown-item');

      drpitm0.onclick = function () {
        if (lang = "es") {
          window.location.href = '../editar-calendario?id=' + doc.id;
        } else if (lang = "en") {
          window.location.href = '../edit-calendar?id=' + doc.id;
        }
      };

      drpitm0.innerHTML = 'Editar <i class="fas fa-edit"></i>';
      drpmenu.appendChild(drpitm0);
      let drpitm1 = document.createElement('button');
      classes(drpitm1, 'dropdown-item');

      drpitm1.onclick = function () {
        window.open('../vista-email-calendario/' + doc.id, '_blank').focus();
      };

      drpitm1.innerHTML = 'Vista correo <i class="fas fa-envelope"></i>';
      drpmenu.appendChild(drpitm1);
      let drpitm2 = document.createElement('button');

      if (dat.public) {
        classes(drpitm2, 'dropdown-item');

        drpitm2.onclick = function () {
          window.open(dat.url, '_blank').focus();
        };

        drpitm2.innerHTML = 'Ver calendario <i class="fas fa-eye"></i>';
        drpmenu.appendChild(drpitm2);
      }

      drp.appendChild(drpmenu);
      col1.appendChild(drp);
      row.appendChild(col1);
      h.appendChild(row);
      card.appendChild(h);
      let noImgTxt;

      if (lang = "es") {
        noImgTxt = "No hay imagen";
      } else if (lang = "en") {
        noImgTxt = "No image";
      }

      let a = document.createElement('a');

      if (lang = "es") {
        a.href = '../editar-calendario?id=' + doc.id;
      } else if (lang = "en") {
        a.href = '../edit-calendar?id=' + doc.id;
      }

      classes(a, 'text-decoration-none');
      classes(a, 'text-dark');
      let img = document.createElement('img');
      img.src = dat.picUrl;
      classes(img, 'card-img-top');
      img.alt = noImgTxt;
      a.appendChild(img);
      let cbody = document.createElement('div');
      classes(cbody, 'card-body');
      cbody.innerHTML = '<h3 class="card-title">' + dat.title + '</h3>\n<p class="card-text">' + dat.description + '</p>\n';
      a.appendChild(cbody);
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
},{}]},{},["../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/draftsCal.js"], null)
//# sourceMappingURL=/draftsCal.87ac004f.js.map