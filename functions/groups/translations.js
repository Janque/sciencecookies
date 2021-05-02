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