const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

const { TranslationServiceClient } = require('@google-cloud/translate');
const translationClient = new TranslationServiceClient({ keyFilename: 'firebaseKey.json' });

async function translateString(text, from, to, type = 'html') {
    if (!text) return "";
    const [response] = await translationClient.translateText({
        parent: `projects/science-cookies`,
        contents: [text],
        mimeType: 'text/' + type, // mime types: text/plain, text/html
        sourceLanguageCode: from,
        targetLanguageCode: to,
    });
    for (const translation of response.translations) {
        return translation.translatedText
    }
}

exports.translateSimple = functions.region('us-east1').https.onCall(async req => {
    return translateString(req.text, req.from, req.target);
});

exports.translateFullCookie = functions.region('us-east1').https.onCall(async req => {
    const doc = await db.collection('cookies/langs/' + req.from).doc(req.docId).get();
    const data = doc.data();
    let title = await translateString(data.title, req.from, req.target);
    let file = await translateString(data.file, req.from, req.target);
    file = file.toLowerCase().replace(/ /g, '-');
    let translation = {
        cont: [],
        title: title,
        description: await translateString(data.description, req.from, req.target),
        file: file
    };

    //MUST BE A NORMAL FOR
    for (let i = 0; i < data.cont.length; i++) {
        let sect = data.cont[i];
        if (sect.type == 'head') {
            sect.title = title;
        } else if (sect.type == 'html') {
            sect.html = await translateString(sect.html, req.from, req.target);
        } else if (sect.type == 'parra') {
            sect.text = await translateString(sect.text, req.from, req.target);
            if (sect.title != "0") {
                sect.titleTxt = await translateString(sect.titleTxt, req.from, req.target);
            }
        } else if (sect.type == 'medSimple') {
            sect.alt = await translateString(sect.alt, req.from, req.target);
            sect.caption = await translateString(sect.caption, req.from, req.target);
        }
        //Add more@#
        translation.cont.push(sect);
    }

    return db.collection('cookies/langs/' + req.target).doc(req.docId).update(translation).then(() => {
        console.log('doc updated');
        return 1;
    }).catch(err => {
        console.log(err);
        return 0;
    });
});

exports.translateFullCalendar = functions.region('us-east1').https.onCall(async req => {
    const calConfDoc = await db.collection('config').doc('calTypes').get();
    const calConfig = calConfDoc.data();

    const postTransDoc = await db.collection('config').doc('postTrans').get();
    const postTrans = postTransDoc.data();
    function postTranslate(str) {
        for (const [word, rep] of Object.entries(postTrans.words)) {
            const reg = new RegExp(word, 'g')
            str = str.replace(reg, rep);
        };
        return str;
    }

    const doc = await db.collection('calendars/langs/' + req.from).doc(req.docId).get();
    const data = doc.data();
    let translation = {
        events: {},
        description: await translateString(data.description, req.from, req.target),
        descriptionShort: await translateString(data.descriptionShort, req.from, req.target),
        picUrl: data.picUrl,
        picAlt: await translateString(data.picAlt, req.from, req.target),
        picCapt: await translateString(data.picCapt, req.from, req.target),
        weeks: data.weeks.slice()
    };
    translation = {
        description: postTranslate(translation.description),
        descriptionShort: postTranslate(translation.descriptionShort),
        picAlt: postTranslate(translation.picAlt),
        picCapt: postTranslate(translation.picCapt)
    };

    for (const [key, event] of Object.entries(data.events)) {
        for (let i = 0; i < calConfig[req.target][event.typeIdx].options.length; i++) {
            const option = calConfig[req.target][event.typeIdx].options[i];
            if (option.type == "select") {
                event.vals[i] = option.options[
                    calConfig[req.from][event.typeIdx].options[i].options
                        .map(function (e) {
                            return e.val;
                        })
                        .indexOf(event.vals[i].val)
                ];
            } else {
                if (option.translatable) {
                    event.vals[i].val = await translateString(event.vals[i].val, req.from, req.target)
                    event.vals[i].val = postTranslate(event.vals[i].val);
                }
                event.vals[i].label = option.label;
            }
            if (event.vals[i].val == option.valForSub) {
                for (let j = 0; j < calConfig[req.target][event.typeIdx].options[i].sub.length; j++) {
                    const opt = calConfig[req.target][event.typeIdx].options[i].sub[j];
                    if (opt.type == "select") {
                        event.vals[i + "-" + j] = opt.options[
                            calConfig[req.from][event.typeIdx].options[i].sub[j].options
                                .map(function (e) {
                                    return e.val;
                                })
                                .indexOf(event.vals[i + "-" + j].val)
                        ];
                    } else {
                        if (opt.translatable) {
                            event.vals[i + "-" + j].val = await translateString(event.vals[i + "-" + j].val, req.from, req.target)
                            event.vals[i + "-" + j].val = postTranslate(event.vals[i].val);
                        }
                        event.vals[i + "-" + j].label = opt.label;
                    }
                }
            }
        }

        event.visibilidad = calConfig.visOpts[req.target][calConfig.visOpts[req.from].indexOf(event.visibilidad)];
        for (let i = 0; i < event.horario.length; i++) {
            let newStr = await translateString(event.horario[i], req.from, req.target);
            newStr = postTranslate(newStr);
            event.horario.splice(i, 1, newStr);
        }

        if (calConfig[req.target][event.typeIdx].multipleTxt) {
            event.description = parseInt(event.vals["0"].val.charAt(0));
            event.name = parseInt(event.vals["0"].val.charAt(1));
        } else {
            event.description = event.name = 0;
        }

        event.description = calConfig[req.target][event.typeIdx].text[event.description];
        event.name = calConfig[req.target][event.typeIdx].titleTxt[event.name];
        for (const [vKey, vVal] of Object.entries(event.vals)) {
            const rlab = new RegExp("\\\$" + vKey + "L\\\$", 'g')
            const rval = new RegExp("\\\$" + vKey + "\\\$", 'g')
            const rg1 = new RegExp("\\\$g-year\\\$", 'g')
            event.description = event.description.replace(rlab, vVal.label);
            event.description = event.description.replace(rval, vVal.val);
            event.description = event.description.replace(rg1, Math.floor(req.docId / 100));
            event.name = event.name.replace(rlab, vVal.label);
            event.name = event.name.replace(rval, vVal.val);
            event.name = event.name.replace(rg1, Math.floor(req.docId / 100));
        }

        translation.events[key] = event;
        translation.weeks[Number(key[0])][key.substr(1, 3)].events[key[4]].name = event.name;
    }

    return db.collection('calendars/langs/' + req.target).doc(req.docId).update(translation).then(() => {
        console.log('doc updated');
        return 1;
    }).catch(err => {
        console.log(err);
        return 0;
    });
});