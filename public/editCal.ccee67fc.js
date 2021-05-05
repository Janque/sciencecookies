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
},{"./bundle-url":"../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"styles/editCal.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/css-loader.js"}],"js/editCal.js":[function(require,module,exports) {
"use strict";

require("../styles/editCal.scss");

var store = firebase.storage();
var rtDb = firebase.database();
let docDat, docId, docRef;
let lastSave = Date.now(),
    saved = false;
let newMedia = null;
let newMedSrc = null;
let eventToShow = null;
const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
      longDay = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado'];

function fullMonth(n, l) {
  if (l == "es") {
    switch (n) {
      case 1:
        return "Enero";

      case 2:
        return "Febrero";

      case 3:
        return "Marzo";

      case 4:
        return "Abril";

      case 5:
        return "Mayo";

      case 6:
        return "Junio";

      case 7:
        return "Julio";

      case 8:
        return "Agosto";

      case 9:
        return "Septiembre";

      case 10:
        return "Octubre";

      case 11:
        return "Noviembre";

      case 12:
        return "Diciembre";

      case 0:
        return "Diciembre";

      case 13:
        return "Enero";
    }
  } else if (l == "en") {
    switch (n) {
      case 1:
        return "January";

      case 2:
        return "February";

      case 3:
        return "March";

      case 4:
        return "April";

      case 5:
        return "May";

      case 6:
        return "June";

      case 7:
        return "July";

      case 8:
        return "August";

      case 9:
        return "September";

      case 10:
        return "October";

      case 11:
        return "November";

      case 12:
        return "December";

      case 0:
        return "December";

      case 13:
        return "January";
    }
  }
}

window.loaded = function loaded() {
  docRef = calendarsFSRef.doc(urlSrch.get('id'));
  calendarsFSRef.doc(urlSrch.get('id')).onSnapshot(doc => {
    if (!doc.exists) {
      window.location.href = '../404';
      return;
    }

    docDat = doc.data();
    docId = doc.id;
    document.getElementById('title').innerHTML = docDat.title;
    document.getElementById('prevMed').src = docDat.picUrl;
    document.getElementById('inPicCapt').value = docDat.picCapt;
    document.getElementById('inPicAlt').value = docDat.picAlt;
    document.getElementById('inDesc').value = docDat.description;
    document.getElementById('inDescShort').value = docDat.descriptionShort;
    render();

    if (docDat.public) {
      hideEl(document.getElementById('btnAprove'));
      hideEl(document.getElementById('btnPub'));
    } else {
      showEl(document.getElementById('btnAprove'));
      if (docDat.pastDue) showEl(document.getElementById('btnPub'));
    }

    if (docDat.revised.includes(uid)) {
      document.getElementById('btnAprove').innerHTML = '<i class="fas fa-check-square"></i>';
    } else {
      document.getElementById('btnAprove').innerHTML = '<i class="far fa-check-square"></i>';
    }

    document.getElementById('btnPrevCal').href = docDat.url;
    document.getElementById('btnPrevMail').href = '/vista-email-calendario/' + docId;
    document.getElementById('btnSrcCal').href = `https://in-the-sky.org/newscal.php?month=${urlSrch.get('id').substr(5, 6)}&year=${urlSrch.get('id').substr(0, 4)}&maxdiff=7&country=1484&reg1=3527646&reg2=8379372&town=3530597`;
    document.getElementById('btnSrcCal2').href = `https://in-the-sky.org/newscal.php?month=${urlSrch.get('id').substr(5, 6)}&year=${urlSrch.get('id').substr(0, 4)}&maxdiff=7&country=1170&reg1=3688685&reg2=9609540&town=3688689`;
    document.getElementById('btnSrcCal3').href = `https://in-the-sky.org/newscal.php?month=${urlSrch.get('id').substr(5, 6)}&year=${urlSrch.get('id').substr(0, 4)}&maxdiff=7&country=1724&reg1=3117732&reg2=6355233&town=3117735`;
  }, err => console.log(err));

  function descFrm() {
    docDat.description = document.getElementById('inDesc').value.trim();
    docDat.descriptionShort = document.getElementById('inDescShort').value.trim();
    normSave();
  }

  document.getElementById("frmText").addEventListener("submit", function (event) {
    event.preventDefault();
    descFrm();
  });

  document.getElementById('btnFileTrans').onclick = function () {
    let ori = document.getElementById('selFileTrans').value;
    db.collection('calendars/langs/' + ori).doc(docId).get().then(async function (doc) {
      docDat.picCapt = document.getElementById('inPicCapt').value = await translateSimple(doc.data().picCapt, ori, lang);
      docDat.picAlt = document.getElementById('inPicAlt').value = await translateSimple(doc.data().picAlt, ori, lang);
      docDat.description = document.getElementById('inDesc').value = await translateSimple(doc.data().description, ori, lang);
      docDat.descriptionShort = document.getElementById('inDescShort').value = await translateSimple(doc.data().descriptionShort, ori, lang);
      descFrm();
    }).catch(err => console.log(err));
  };

  function addMed() {
    let ref = store.ref('calendarMedia/' + docId + '/pic');
    ref.put(newMedia).on('state_changed', function progress(snap) {
      setprog(document.getElementById('barChgImg'), snap.bytesTransferred / snap.totalBytes * 100);
    }, function error(err) {
      if (lang = "es") {
        alertTop("<strong>¡Ha ocurrido un error!</strong> " + err.code, 0);
      } else if (lang = "en") {
        alertTop("<strong>¡There has been an error!</strong> " + err.code, 0);
      }

      console.log(err);
      $('#mdlAddMed').modal('hide');
    }, function complete() {
      ref.getDownloadURL().then(medUrl => {
        docDat.picUrl = medUrl;
        normSave();
        resetChgImg(true);
        hideEl(document.getElementById("frmChgImg"));
      }).catch(err => {
        console.log(err);
      });
    });
  }

  function addExtMed() {
    docDat.picUrl = document.getElementById('inChgImgUrl').value;
    normSave();
    resetChgImg(true);
    hideEl(document.getElementById("frmChgImg"));
  }

  document.getElementById("frmChgImg").addEventListener("submit", function (event) {
    event.preventDefault();
    setprog(document.getElementById('barChgImg'), 0);
    showEl(document.getElementById("barChgImgCont"));
    hideEl(document.getElementById("frmChgImg"));
    document.getElementById("btnCnfChgImg").setAttribute('disabled', 'true');
    document.getElementById("btnCanChgImg").setAttribute('disabled', 'true');
    if (newMedSrc == "home") addMed();else addExtMed();
  });
};

document.getElementById('inPicCapt').oninput = () => {
  docDat.picCapt = document.getElementById('inPicCapt').value.trim();
};

document.getElementById('inPicAlt').oninput = () => {
  docDat.picAlt = document.getElementById('inPicAlt').value.trim();
};

document.getElementById('inDesc').oninput = () => {
  docDat.picDesc = document.getElementById('inDesc').value.trim();
};

document.getElementById('inDescShort').oninput = () => {
  docDat.picDescShort = document.getElementById('inDescShort').value.trim();
};

let savedInterval;

function saveDoc() {
  console.log('Saving...');
  const promises = [];
  langs.forEach(l => {
    if (l != lang) {
      let syncUpt = {
        published: docDat.published,
        finished: docDat.finished,
        pastDue: docDat.pastDue,
        public: docDat.public,
        sentMail: docDat.sentMail,
        revised: docDat.revised,
        translations: docDat.translations
      };
      syncUpt.translations[lang] = docDat.url;
      promises.push(db.collection('calendars/langs/' + l).doc(docId).update(syncUpt));
    }
  });
  return Promise.all(promises).then(() => {
    return docRef.update(docDat);
  });
}

function normSave() {
  saveDoc().then(() => {
    if (eventToShow) showEvent(); //IMPORTANT

    if (saved) clearInterval(savedInterval);
    saved = true;
    savedInterval = setInterval(() => {
      let minutes = Math.floor((Date.now() - lastSave) / 60000);
      if (minutes < 60) document.getElementById('tagLstSave').innerText = "Guardado hace " + minutes + " minutos";else document.getElementById('tagLstSave').innerText = "Guardado hace " + Math.floor(minutes / 60) + " horas";
    }, 300010);
    document.getElementById('tagLstSave').innerText = "Se han guardado los cambios";
    lastSave = Date.now();
    console.log('Saved!');
  }).catch(err => {
    document.getElementById('tagLstSave').innerText = "Error, no se han guardado todos los cambios: " + err.code;
    console.log(err);
  });
}

function setprog(bar, n) {
  n = Math.floor(n);
  bar.setAttribute('aria-valuenow', n);
  bar.style.width = n + '%';
  bar.innerText = n + '%';
}

function showEvent() {
  Object.keys(docDat.events).forEach(key => {
    hideEl(document.getElementById(key));
  });
  document.getElementById('mdlEventInfoL').innerHTML = docDat.events[eventToShow].date;
  showEl(document.getElementById(eventToShow));
  enable(document.getElementById('btnPriorEve'));
  enable(document.getElementById('btnNextEve'));
}

document.getElementById('btnPriorEve').onclick = () => {
  let orderedKeys = Object.keys(docDat.events).slice().sort((a, b) => {
    if (Number(a[0]) == Number(b[0])) {
      if (a.substring(1, 4) == b.substring(1, 4)) {
        return Number(a[4]) - Number(b[4]);
      }

      switch (a.substring(1, 4)) {
        case "sun":
          return -1;

        case "mon":
          if (b.substring(1, 4) == "sun") return 1;
          return -1;

        case "tue":
          if (b.substring(1, 4) == "sun" || b.substring(1, 4) == "mon") return 1;
          return -1;

        case "wed":
          if (b.substring(1, 4) == "sun" || b.substring(1, 4) == "mon" || b.substring(1, 4) == "tue") return 1;
          return -1;

        case "thu":
          if (b.substring(1, 4) == "sun" || b.substring(1, 4) == "mon" || b.substring(1, 4) == "tue" || b.substring(1, 4) == "wed") return 1;
          return -1;

        case "fri":
          if (b.substring(1, 4) == "sun" || b.substring(1, 4) == "mon" || b.substring(1, 4) == "tue" || b.substring(1, 4) == "wed" || b.substring(1, 4) == "thu") return 1;
          return -1;

        case "sat":
          return 1;
      }
    }

    return Number(a[0]) - Number(b[0]);
  });
  let n = orderedKeys.indexOf(eventToShow) - 1;

  if (n >= 0) {
    eventToShow = orderedKeys[n];
    showEvent();
  } else {
    disable(document.getElementById('btnPriorEve'));
  }
};

document.getElementById('btnNextEve').onclick = () => {
  let orderedKeys = Object.keys(docDat.events).slice().sort((a, b) => {
    if (Number(a[0]) == Number(b[0])) {
      if (a.substring(1, 4) == b.substring(1, 4)) {
        return Number(a[4]) - Number(b[4]);
      }

      switch (a.substring(1, 4)) {
        case "sun":
          return -1;

        case "mon":
          if (b.substring(1, 4) == "sun") return 1;
          return -1;

        case "tue":
          if (b.substring(1, 4) == "sun" || b.substring(1, 4) == "mon") return 1;
          return -1;

        case "wed":
          if (b.substring(1, 4) == "sun" || b.substring(1, 4) == "mon" || b.substring(1, 4) == "tue") return 1;
          return -1;

        case "thu":
          if (b.substring(1, 4) == "sun" || b.substring(1, 4) == "mon" || b.substring(1, 4) == "tue" || b.substring(1, 4) == "wed") return 1;
          return -1;

        case "fri":
          if (b.substring(1, 4) == "sun" || b.substring(1, 4) == "mon" || b.substring(1, 4) == "tue" || b.substring(1, 4) == "wed" || b.substring(1, 4) == "thu") return 1;
          return -1;

        case "sat":
          return 1;
      }
    }

    return Number(a[0]) - Number(b[0]);
  });
  let n = orderedKeys.indexOf(eventToShow) + 1;

  if (n < orderedKeys.length) {
    eventToShow = orderedKeys[n];
    showEvent();
  } else {
    disable(document.getElementById('btnNextEve'));
  }
};

function render() {
  document.getElementById('weeksCont').innerHTML = "";
  docDat.weeks.forEach((week, wIdx) => {
    let weekRow = document.createElement('tr');
    weekRow.style.height = '10rem';
    document.getElementById('weeksCont').appendChild(weekRow);

    for (let i = 0; i < 7; i++) {
      let day = week[daysOfWeek[i]];
      let dayCell = document.createElement('td');
      classes(dayCell, "p-0");
      weekRow.appendChild(dayCell);

      if (day) {
        let num = document.createElement('p');
        classes(num, "m-0 p-1");
        num.style.fontSize = 'x-large';
        num.innerHTML = '<b>' + day.date + '</b>';
        dayCell.appendChild(num);
        let events = document.createElement('div');
        classes(events, "autoOverflow");
        events.style.maxHeight = '7rem';
        day.events.forEach((event, idx) => {
          let btnEvent = document.createElement('button');
          btnEvent.setAttribute("data-toggle", "modal");
          btnEvent.setAttribute("data-target", "#mdlEventInfo");
          classes(btnEvent, "btn text-left p-1 mb-1 w-100");
          btnEvent.style.backgroundColor = "#c3e6cb";
          btnEvent.style.borderColor = "#8fd19e";
          btnEvent.innerHTML = '<small>' + event.name + '</small>';

          btnEvent.onclick = () => {
            eventToShow = wIdx + daysOfWeek[i] + idx;
            showEvent();
          };

          events.appendChild(btnEvent);
        });
        let btnPlusEvent = document.createElement('button');
        classes(btnPlusEvent, "btn btn-scckie btn-block btn-sm");
        btnPlusEvent.innerHTML = '<i class="fas fa-plus"></i>';

        btnPlusEvent.onclick = () => {
          docDat.events[wIdx + daysOfWeek[i] + day.events.length] = {
            date: longDay[i] + " " + day.date + " de " + fullMonth(docId % 100),
            name: "Evento sin nombre",
            description: "Sin descripción",
            visibilidad: "Visible a simple vista",
            horario: ["Ciudad de México:", "Bogotá:", "Madrid:"]
          };
          day.events.push({
            name: "Evento sin nombre"
          });
          normSave();
        };

        events.appendChild(btnPlusEvent);
        dayCell.appendChild(events);
      }
    }
  });
  document.getElementById('eventInfoCont').innerHTML = "";

  for (const [key, event] of Object.entries(docDat.events)) {
    let changed = false;
    let form = document.createElement('div');
    form.id = key;
    classes(form, "d-none overflow-auto");
    let bod = document.createElement('div');
    classes(bod, "modal-body");
    form.appendChild(bod);
    let fsec = document.createElement('div');
    classes(fsec, "d-none");
    bod.appendChild(fsec);
    let fg0 = document.createElement('div');
    classes(fg0, "form-group");
    fsec.appendChild(fg0);
    fg0.innerHTML = '<label>Nombre del evento</label>';
    let in0 = document.createElement('input');
    in0.id = "inEveTitle" + key;
    in0.setAttribute("type", "text");
    classes(in0, "form-control");
    fg0.appendChild(in0);
    let fg1 = document.createElement('div');
    classes(fg1, "form-group");
    fsec.appendChild(fg1);
    fg1.innerHTML = '<label>Descripción</label>';
    let in1 = document.createElement('textarea');
    classes(in1, "form-control");
    in1.id = "inEveDesc" + key;
    in1.setAttribute("rows", "3");
    fg1.appendChild(in1);
    let fg2 = document.createElement('div');
    classes(fg2, "form-group");
    fsec.appendChild(fg2);
    fg2.innerHTML = '<label>Visiblidad</label>';
    let in2 = document.createElement('select');
    in2.id = "inVis" + key;
    classes(in2, "form-control");
    let visOpts = ["Visible a simple vista", "Visible con binoculares", "Visible con un telescopio pequeño", "Visible con un telescopio de 4 pulgadas", "Visible con un telescopio grande", "No observable"];
    visOpts.forEach((itm, idx) => {
      let opt = document.createElement('option');
      opt.value = idx;
      opt.innerHTML = itm;
      if (itm == event.visibilidad) opt.setAttribute('selected', "true");
      in2.appendChild(opt);
    });
    fg2.appendChild(in2);
    let fg3 = document.createElement('div');
    classes(fg3, "form-group");
    fsec.appendChild(fg3);
    fg3.innerHTML = '<label>Horario</label>';
    let in3 = document.createElement('textarea');
    classes(in3, "form-control");
    in3.id = "inTime" + key;
    in3.setAttribute("rows", "4");
    fg3.appendChild(in3);
    if (in2.value == 5) hideEl(fg3);else showEl(fg3);

    in0.oninput = () => {
      enable(reverBtn);
      changed = true;
    };

    in1.oninput = () => {
      enable(reverBtn);
      changed = true;
    };

    in2.oninput = () => {
      enable(reverBtn);
      changed = true;
      if (in2.value == 5) hideEl(fg3);else showEl(fg3);
    };

    in3.oninput = () => {
      enable(reverBtn);
      changed = true;
    };

    let selLangCC = document.createElement('div');
    classes(selLangCC, "row");
    let selLangC = document.createElement('div');
    classes(selLangC, "col-auto");
    selLangCC.appendChild(selLangC);
    let selLang = document.createElement('select');
    classes(selLang, "form-control ml-auto h-100");
    selLang.setAttribute("name", "selTransLang");
    selLangC.appendChild(selLang);
    let btnTrans = document.createElement('button');
    classes(btnTrans, 'btn btn-scckie mx-2');
    btnTrans.innerHTML = '<i class="fas fa-language"></i>';

    btnTrans.onclick = function () {
      db.collection('cookies/langs/' + selLang.value).doc(docId).get().then(async function (doc) {
        let sect = doc.data().cont[idx];
        if (item.type != sect.type) return;

        if (sect.type == 'head') {
          docDat.cont[idx].title = await translateSimple(sect.title, selLang.value, lang);
        } else if (sect.type == 'html') {
          docDat.cont[idx].html = await translateSimple(sect.html, selLang.value, lang);
        } else if (sect.type == 'parra') {
          docDat.cont[idx].text = await translateSimple(sect.text, selLang.value, lang);

          if (sect.title != "0") {
            docDat.cont[idx].titleTxt = await translateSimple(sect.titleTxt, selLang.value, lang);
          }
        } else if (sect.type == 'medSimple') {
          docDat.cont[idx].alt = await translateSimple(sect.alt, selLang.value, lang);
          docDat.cont[idx].caption = await translateSimple(sect.caption, selLang.value, lang);
        }

        console.log(docDat.cont[idx]);
        normSave();
      }).catch(err => console.log(err));
    };

    selLangCC.appendChild(btnTrans);
    fsec.appendChild(selLangCC);
    let tsec = document.createElement('div');
    bod.appendChild(tsec);
    let eveTit = document.createElement('h3');
    eveTit.innerHTML = event.name;
    tsec.appendChild(eveTit);
    let eveDesc = document.createElement('p');
    eveDesc.innerHTML = event.description;
    tsec.appendChild(eveDesc);
    let eveVis = document.createElement('p');
    eveVis.innerHTML = "Visibilidad: " + event.visibilidad;
    tsec.appendChild(eveVis);
    let eveTime = document.createElement('p');
    classes(eveTime, "mb-0");
    eveTime.innerHTML = "Horario: ";
    tsec.appendChild(eveTime);
    let eveTimeLst = document.createElement('ul');
    tsec.appendChild(eveTimeLst);
    event.horario.forEach(time => {
      let li = document.createElement('li');
      li.innerHTML = time;
      eveTimeLst.appendChild(li);
    });

    if (event.visibilidad == "No observable") {
      hideEl(eveTime);
      hideEl(eveTimeLst);
    } else {
      showEl(eveTime);
      showEl(eveTimeLst);
    }

    let foot = document.createElement('div');
    classes(foot, "modal-footer");
    form.appendChild(foot);
    let delBtn = document.createElement('button');
    classes(delBtn, "btn btn-danger mr-auto");
    delBtn.setAttribute("type", "button");
    delBtn.innerText = "Borrar";

    delBtn.onclick = () => {
      for (let i = Number(key.substr(4)) + 1; i < docDat.weeks[Number(key[0])][key.substr(1, 3)].events.length; i++) {
        docDat.events[key.substr(0, 4) + (i - 1)] = docDat.events[key.substr(0, 4) + i];
      }

      delete docDat.events[key.substr(0, 4) + (docDat.weeks[Number(key[0])][key.substr(1, 3)].events.length - 1)];
      docDat.weeks[Number(key[0])][key.substr(1, 3)].events.splice(Number(key.substr(4)), 1);
      $('#mdlEventInfo').modal('hide');
      eventToShow = null;
      normSave();
    };

    foot.appendChild(delBtn);
    let editBtn = document.createElement('button');
    classes(editBtn, "btn btn-info");
    editBtn.setAttribute("type", "button");
    editBtn.innerText = "Editar";

    editBtn.onclick = () => {
      in0.value = event.name;
      in1.innerHTML = event.description;
      in2.value = visOpts.indexOf(event.visibilidad);
      if (in2.value == 5) hideEl(fg3);else showEl(fg3);
      in3.innerHTML = "";
      event.horario.forEach(time => {
        in3.innerHTML += time + "\n";
      });
      hideEl(tsec);
      showEl(fsec);
      showEl(reverBtn);
      showEl(saveBtn);
      enable(saveBtn);
      hideEl(editBtn);
    };

    foot.appendChild(editBtn);
    let reverBtn = document.createElement('button');
    classes(reverBtn, "btn btn-secondary mr-1 d-none");
    reverBtn.setAttribute("type", "button");
    disable(reverBtn);
    reverBtn.innerText = "Revertir";

    reverBtn.onclick = () => {
      changed = false;
      disable(reverBtn);
      in0.value = event.name;
      in1.innerHTML = event.description;
      in2.value = visOpts.indexOf(event.visibilidad);
      if (in2.value == 5) hideEl(fg3);else showEl(fg3);
      in3.innerHTML = "";
      event.horario.forEach(time => {
        in3.innerHTML += time.trim() + "\n";
      });
    };

    foot.appendChild(reverBtn);
    let saveBtn = document.createElement('button');
    classes(saveBtn, "btn btn-scckie d-none");
    saveBtn.setAttribute("type", "button");
    disable(saveBtn);
    saveBtn.innerText = "Guardar";

    saveBtn.onclick = () => {
      disable(reverBtn);
      disable(saveBtn);

      if (changed) {
        docDat.weeks[Number(key[0])][key.substr(1, 3)].events[key[4]].name = event.name = in0.value;
        event.description = in1.value.trim();
        event.visibilidad = visOpts[in2.value];
        event.horario = [];
        in3.value.trim().split('\n').forEach(time => {
          if (time != "" && time != " ") event.horario.push(time);
        });
        normSave();
      } else {
        hideEl(fsec);
        showEl(tsec);
        hideEl(reverBtn);
        hideEl(saveBtn);
        showEl(editBtn);
      }
    };

    foot.appendChild(saveBtn);
    document.getElementById('eventInfoCont').appendChild(form);
  }

  document.getElementsByName('selTransLang').forEach(itm => {
    itm.innerHTML = '';
  });
  langs.forEach((l, i) => {
    if (l != lang) {
      let opt = document.createElement('option');

      if (i == 0) {
        opt.setAttribute('selected', 'true');
      }

      opt.value = opt.innerText = l;
      document.getElementsByName('selTransLang').forEach(itm => {
        console.log(itm);
        itm.appendChild(opt.cloneNode(true));
      });
    }
  });
}

function resetChgImg(uncheck) {
  document.getElementById('prevMed').src = docDat.picUrl;

  if (uncheck) {
    document.getElementById('inMedSrc0').checked = false;
    document.getElementById('inMedSrc1').checked = false;
  }

  document.getElementById('inChgImg').value = "";
  document.getElementById('inChgImgUrl').value = "";
  document.getElementById('inChgImg').removeAttribute('required');
  document.getElementById('inChgImgUrl').removeAttribute('required');
  hideEl(document.getElementById("barChgImgCont"));
  hideEl(document.getElementById("inChgImgFileCont"));
  hideEl(document.getElementById("inChgImgUrlCont"));
  document.getElementById("btnCnfChgImg").removeAttribute('disabled');
  document.getElementById("btnCanChgImg").removeAttribute('disabled');
}

document.getElementById('btnChgImg').onclick = () => {
  resetChgImg(true);
  toggleEl(document.getElementById("frmChgImg"));
};

document.getElementById('inChgImg').addEventListener('change', e => {
  newMedia = e.target.files[0];

  function prevMed() {
    var read = new FileReader();
    read.readAsDataURL(newMedia);

    read.onload = function (e2) {
      document.getElementById("prevMed").src = e2.target.result;
    };
  }

  ;
  newMedia.name = ultraClean(newMedia.name, '');
  document.getElementById('inChgImgL').innerHTML = newMedia.name;
  prevMed(newMedia);
});

document.getElementById('inChgImgUrl').onchange = function () {
  document.getElementById("prevMed").src = document.getElementById('inChgImgUrl').value;
};

document.getElementById('inMedSrc0').onclick = function () {
  newMedSrc = "home";
  resetChgImg(false);
  document.getElementById('inChgImg').setAttribute('required', 'true');
  showEl(document.getElementById("inChgImgFileCont"));
};

document.getElementById('inMedSrc1').onclick = function () {
  newMedSrc = "out";
  resetChgImg(false);
  document.getElementById('inChgImgUrl').setAttribute('required', 'true');
  showEl(document.getElementById("inChgImgUrlCont"));
};

document.getElementById('btnPrevCal').onclick = function () {
  docDat.timePrev = new firebase.firestore.Timestamp.fromMillis(new Date(Date.now()).getTime() + 900000);
  normSave();
};

document.getElementById('btnPrevMail').onclick = function () {
  docDat.timePrev = new firebase.firestore.Timestamp.fromMillis(new Date(Date.now()).getTime() + 900000);
  normSave();
};

function validateRevision() {
  let revLangs = 0;
  langs.forEach(l => {
    let rev = docDat.revised[l] ? docDat.revised[l].length : 0;
    if (docDat.revised[l] && !docDat.revised[l].includes(uid)) rev++;
    if (rev >= 2) revLangs++;
  });
  return revLangs == langs.length;
}

document.getElementById('btnAprove').onclick = function () {
  if (docDat.revised[lang] && docDat.revised[lang].includes(uid)) {
    docDat.revised[lang].splice(docDat.revised[lang].indexOf(uid), 1);
    document.getElementById('btnAprove').innerHTML = '<i class="far fa-check-square"></i>';
  } else {
    if (!docDat.revised[lang]) docDat.revised[lang] = [];
    docDat.revised[lang].push(uid);
    document.getElementById('btnAprove').innerHTML = '<i class="fas fa-check-square"></i>';
  }

  if (validateRevision()) {
    docDat.finished = true;
    newCal();
  } else {
    docDat.finished = false;
  }

  normSave();
};

function newCal() {
  let nextCalID;
  rtDb.ref('nextCal').transaction(nCal => {
    if (nCal) {
      nextCalID = nCal;
      nCal++;

      if (nCal % 100 == 13) {
        nCal -= 12;
        nCal += 100;
      }
    }

    return nCal;
  }, error => {
    if (error) {
      console.log(error);
    } else {
      let date = new Date((nextCalID - nextCalID % 100) / 100 + ' ' + nextCalID % 100 + ' ' + '00:00');
      let weeks = [];
      let days;

      if (date.getMonth() == 1) {
        if (date.getFullYear() % 4 == 0) {
          days = 29;
        } else {
          days = 28;
        }
      } else if (date.getMonth() % 2 == 0) {
        if (date.getMonth() <= 6) days = 31;else days = 30;
      } else {
        if (date.getMonth() <= 6) days = 30;else days = 31;
      }

      let bDay = date.getDay();

      for (let i = 1; i <= days; i = i) {
        let week = {};

        for (let j = bDay; j < daysOfWeek.length; j++) {
          if (i > days) break;
          week[daysOfWeek[j]] = {
            date: i,
            events: []
          };
          i++;
        }

        weeks.push(week);
        bDay = 0;
      }

      const promises = [];
      langs.forEach(l => {
        if (l != lang) {
          let newC = {
            events: {},
            published: firebase.firestore.Timestamp.fromDate(date),
            description: "",
            descriptionShort: "",
            finished: false,
            pastDue: false,
            picUrl: "",
            picAlt: "",
            picCapt: "",
            public: false,
            sentMail: false,
            revised: {},
            title: "",
            url: "",
            nextCal: "",
            priorCal: "",
            weeks: weeks,
            translations: {}
          };
          let intId = parseInt(nextCalID);
          let year = (intId - intId % 100) / 100;
          let nYear = (intId - intId % 100) / 100;
          let pYear = (intId - intId % 100) / 100;
          if (intId % 100 == 12) nYear++;
          if (intId % 100 == 1) pYear--;
          let month = fullMonth(intId % 100);
          let nMonth = fullMonth(intId % 100 + 1).toLowerCase();
          let pMonth = fullMonth(intId % 100 - 1).toLowerCase();
          let calsText = "";

          switch (l) {
            case "es":
              calsText = "calendario-astronomico";
              newC.title = "Calendario Astronómico de " + month + " " + year;
              break;

            case "en":
              calsText = "astronomic-calendar";
              newC.title = "Astronomic Calendar of " + month + " " + year;
              break;
          }

          newC.url = "https://sciencecookies.net/" + calsText + "/" + year + "/" + month.toLowerCase() + "/";
          newC.nextCal = "https://sciencecookies.net/" + calsText + "/" + nYear + "/" + nMonth + "/";
          newC.priorCal = "https://sciencecookies.net/" + calsText + "/" + pYear + "/" + pMonth + "/";
          promises.push(db.collection('calendars/langs/' + l).doc(Math.abs(nextCalID).toString()).set(newC));
        }
      });
      return Promise.all(promises).then(() => {
        console.log('exito');
      }).catch(err => console.log(err));
    }
  });
}

$('#mdlPublish').on('show.bs.modal', e => {
  if (validateRevision()) {
    showEl(document.getElementById('btnCnfPublish'));
    document.getElementById('mdlPublishTxt').innerText = "El calendario está listo para publicar";
  } else {
    hideEl(document.getElementById('btnCnfPublish'));
    document.getElementById('mdlPublishTxt').innerText = "Para publicar es necesario que lo hayan aprovado al menos dos personas.";
  }
});

document.getElementById('btnCnfPublish').onclick = function () {
  if (docDat.public) return;
  setprog(document.getElementById('barPublish'), 0);
  showEl(document.getElementById('barPublishCont'));
  docDat.public = true;
  setprog(document.getElementById('barPublish'), 25);
  saveDoc().then(() => {
    setprog(document.getElementById('barPublish'), 58);
    admin.database().ref('calendarios/' + docId).set({
      pop: 0
    }, err => {
      if (err) {
        if (lang = "es") {
          alertTop("<strong>¡Ha ocurrido un error!</strong> " + err.code, 0);
        } else if (lang = "en") {
          alertTop("<strong>¡There has been an error!</strong> " + err.code, 0);
        }

        console.log(err);
      } else {
        setprog(document.getElementById('barPublish'), 100);
        classes(document.getElementById('barPublish'), 'bg-success');

        if (lang = "es") {
          alertTop("Publicado correctamente", 1);
        } else if (lang = "en") {
          alertTop("Published successfully", 1);
        }

        setTimeout(function () {
          window.open(docDat.url, '_blank').focus();
        }, 2500);
        $('#mdlPublish').modal('hide');
        console.log('Published ' + docId + ' calendar');
        return null;
      }
    });
  }).catch(err => {
    if (lang = "es") {
      alertTop("<strong>¡Ha ocurrido un error!</strong> " + err.code, 0);
    } else if (lang = "en") {
      alertTop("<strong>¡There has been an error!</strong> " + err.code, 0);
    }

    console.log(err);
  });
};
},{"../styles/editCal.scss":"styles/editCal.scss"}],"../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
},{}]},{},["../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/editCal.js"], null)
//# sourceMappingURL=/editCal.ccee67fc.js.map