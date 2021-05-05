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
})({"../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)?\/[^/]+(?:\?.*)?$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"styles/index.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/css-loader.js"}],"js/index.js":[function(require,module,exports) {
"use strict";

require("../styles/index.scss");

var catnmb;
const previewLim = 20; //Get search params

var cats = [],
    kywords,
    srtOrd,
    desc,
    srchRef;
var nxtp = false,
    paglast = [null],
    page = 1;
var allChk = false;

function initSrch(stAf) {
  cats = allCats.slice();
  kywords = [''];

  if (urlSrch.get('c') != null) {
    cats = urlSrch.get('c').split('+');
    cats = cats[0].split(' ');
  }

  if (urlSrch.get('k') != null) {
    kywords = urlSrch.get('k').split('+');
    document.getElementById('srcBox').value = urlSrch.get('k').replace('+', ' ');
  }

  ;
  kywords = cats.concat(kywords);
  kywords.forEach(function (itm, idx) {
    let str = itm.toLowerCase();
    str = rmDiacs(str);
    kywords.splice(idx, 1, str);
  });
  let all = true;

  for (let i = 0; i < catnmb; i++) {
    if (kywords.indexOf(document.getElementById('cat' + i).value) != -1) {
      document.getElementById('cat' + i).checked = true;
    } else all = false;
  }

  if (all) {
    allChk = true;
    document.getElementById('catA').checked = true;
  }

  document.getElementById("inSrchOrd1").selected = false;
  document.getElementById("inSrchOrd2").selected = false;
  document.getElementById("inSrchOrd3").selected = false;
  srtOrd = urlSrch.get('o');

  if (srtOrd != null) {
    if (srtOrd == 'new') {
      srtOrd = 'ledit';
      desc = true;
      document.getElementById("inSrchOrd1").selected = true;
    }

    if (srtOrd == 'old') {
      srtOrd = 'ledit';
      desc = false;
      document.getElementById("inSrchOrd2").selected = true;
    }

    if (srtOrd == 'pop') {
      desc = true;
      document.getElementById("inSrchOrd3").selected = true;
    }
  } else {
    srtOrd = 'ledit';
    desc = true;
  }

  if (page > 1 && stAf && paglast[page - 1] != null && paglast[page - 1] != undefined) {
    if (!desc) {
      srchRef = cookiesFSRef.where('public', '==', true).where('cats', 'array-contains-any', kywords).orderBy(srtOrd).startAfter(paglast[page - 1]).limit(previewLim);
    } else {
      srchRef = cookiesFSRef.where('public', '==', true).where('cats', 'array-contains-any', kywords).orderBy(srtOrd, 'desc').startAfter(paglast[page - 1]).limit(previewLim);
    }
  } else {
    if (!desc) {
      srchRef = cookiesFSRef.where('public', '==', true).where('cats', 'array-contains-any', kywords).orderBy(srtOrd).limit(previewLim);
    } else {
      srchRef = cookiesFSRef.where('public', '==', true).where('cats', 'array-contains-any', kywords).orderBy(srtOrd, 'desc').limit(previewLim);
    }
  }

  shwSrch();
  const promises = [];
  let notSrchd = [],
      allP = null;

  for (let i = 0; i < kywords.length; i++) {
    let itm = kywords[i];
    if (itm == '' || itm == ' ') continue;
    const p = firebase.database().ref('searchQs/' + itm).transaction(search => {
      if (search) {
        notSrchd.splice(notSrchd.indexOf(itm), 1);
        search.count++;
      } else {
        notSrchd.push(itm);
      }

      return search;
    });
    promises.push(p);
  }

  allP = Promise.all(promises);
  allP.then(() => {
    notSrchd.forEach(itm => {
      firebase.database().ref('searchQs/' + itm).set({
        count: 1
      });
    });
  }).catch(err => {
    console.log('err');
  });
}

function shwSrch() {
  document.getElementById('cookiesCont').innerHTML = "";
  srchRef.get().then(snap => {
    let docs = snap.docs;
    nxtp = false;

    if (docs.length == 0) {
      let a = document.createElement('a');
      classes(a, "text-decoration-none text-light");
      let med = document.createElement('div');
      classes(med, "media mb-3");
      let bod = document.createElement('div');
      classes(bod, "media-body");
      bod.innerHTML = '<h5 class="mt-0 text-center">No se han encontrado resultados</h5>';
      a.appendChild(med);
      med.appendChild(bod);
      document.getElementById('cookiesCont').appendChild(a);
    }

    docs.forEach((doc, idx) => {
      if (idx != 0) {
        let divi = document.createElement('div');
        classes(divi, "dropdown-divider d-md-none");
        document.getElementById('cookiesCont').appendChild(divi);
      }

      let a = document.createElement('a');
      classes(a, "text-decoration-none text-light");
      a.href = doc.data().url;
      let med = document.createElement('div');
      classes(med, "media mb-3");
      let img = document.createElement('img');
      classes(img, "align-self-center mr-3");
      img.style.width = "64px";
      img.style.height = "64px";
      img.src = doc.data().picUrl;
      let bod = document.createElement('div');
      classes(bod, "media-body");
      let tit = document.createElement('h5');
      classes(tit, "mt-0");
      tit.innerHTML = doc.data().title;
      bod.appendChild(tit);
      let descr = document.createElement('p');
      descr.innerHTML = doc.data().description;
      bod.appendChild(descr);
      let dates = document.createElement('p');
      classes(dates, "my-0");

      if (doc.data().dledit) {
        let dl = doc.data().ledit.toDate();
        dates.innerText = 'Actualizado: ' + dl.getDate() + '/' + (dl.getMonth() + 1) + '/' + dl.getFullYear();
      } else {
        let d = doc.data().published.toDate();
        dates.innerText = 'Publicado: ' + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
      }

      bod.appendChild(dates);
      let auhtTxt = document.createElement('p');
      classes(auhtTxt, "mt-0");
      auhtTxt.innerText = ' Autor(es):' + doc.data().authors;
      bod.appendChild(auhtTxt);
      a.appendChild(med);
      med.appendChild(img);
      med.appendChild(bod);
      document.getElementById('cookiesCont').appendChild(a);

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

function prepCatBtns() {
  //Submit search
  document.getElementById('catA').onclick = function () {
    if (!allChk) {
      for (let i = 0; i < catnmb; i++) {
        document.getElementById('cat' + i).checked = true;
      }
    } else {
      for (let i = 0; i < catnmb; i++) {
        document.getElementById('cat' + i).checked = false;
      }
    }

    allChk = !allChk;
  };

  for (let i = 0; i < catnmb; i++) {
    document.getElementById('cat' + i).onclick = function () {
      if (allChk) {
        document.getElementById('catA').checked = false;
        allChk = false;
      } else {
        let all = true;

        for (let i = 0; i < catnmb; i++) {
          if (document.getElementById('cat' + i).checked == false) {
            all = false;
            break;
          }
        }

        if (all) {
          allChk = true;
          document.getElementById('catA').checked = true;
        }
      }
    };
  }
}

function shwCalMain() {
  calendarsFSRef.where("public", "==", true).orderBy('published', 'desc').limit(1).get().then(snap => {
    let docs = snap.docs;
    docs.forEach(doc => {
      let a = document.createElement('a');
      classes(a, "text-decoration-none text-light");
      a.href = doc.data().url;
      let med = document.createElement('div');
      classes(med, "media mb-3");
      let img = document.createElement('img');
      classes(img, "align-self-center mr-3");
      img.style.width = "64px";
      img.style.height = "64px";
      img.src = doc.data().picUrl;
      let bod = document.createElement('div');
      classes(bod, "media-body");
      let tit = document.createElement('h5');
      classes(tit, "mt-0");
      tit.innerHTML = doc.data().title;
      bod.appendChild(tit);
      let descr = document.createElement('p');
      descr.innerHTML = doc.data().descriptionShort;
      bod.appendChild(descr);
      let dates = document.createElement('p');
      classes(dates, "my-0");
      a.appendChild(med);
      med.appendChild(img);
      med.appendChild(bod);
      document.getElementById('calMain').appendChild(a);
      showEl(document.getElementById('calMain'));
    });
  }).catch(err => {
    console.log(err);
  });
}

window.loaded = function loaded() {
  catnmb = allCats.length;
  prepCatBtns();
  initSrch(false);
  shwCalMain();

  function send() {
    let srchStr = '?c=';
    if (document.getElementById('cat0').checked) srchStr = srchStr + document.getElementById('cat0').value;

    for (let i = 1; i < catnmb; i++) {
      if (document.getElementById('cat' + i).checked) {
        srchStr = srchStr + '+' + document.getElementById('cat' + i).value;
      }
    }

    srchStr = srchStr + '&k=';
    let wordArr = document.getElementById('srcBox').value.split(' ');
    srchStr = srchStr + wordArr[0];

    for (let i = 1; i < wordArr.length; i++) {
      srchStr = srchStr + '+' + wordArr[i];
    }

    srchStr = srchStr + '&o=' + document.getElementById('inOrd').value;
    window.location.href = srchStr;
  }

  document.getElementById("frmSrch").addEventListener("submit", function (event) {
    event.preventDefault();
    send();
  });
};
},{"../styles/index.scss":"styles/index.scss"}],"../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
},{}]},{},["../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/index.js"], null)
//# sourceMappingURL=/js.00a46daa.js.map