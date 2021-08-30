const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

const express = require('express');
const app = express();

app.set('views', './views');
app.set('view engine', 'pug');

function renderCookie(req, res, lang) {
    res.set('Cache-Control', 'public, max-age=600, s-maxage=1200');
    if (!/^[0-9]{6}$/.test(req.params.month)) {
        console.log('badUrl');
        res.redirect('http://sciencecookies.net/404');
        return;
    } else {
        db.collection('cookies/langs/' + lang).where('file', '==', req.params.file).limit(1).get().then(snap => {
            if (snap.empty) {
                console.log('snap.empty');
                res.redirect('https://sciencecookies.net/404');
                return;
            }
            snap.forEach(doc => {
                let dat = doc.data();
                if (!dat.public && (!dat.timePrev || dat.timePrev < admin.firestore.Timestamp.now())) {
                    console.log('private');
                    res.redirect('https://sciencecookies.net/404');
                    return;
                }
                let d = dat.published.toDate();
                let month = d.getFullYear().toString();
                if (d.getMonth() < 9) {
                    month += '0';
                }
                month += (d.getMonth() + 1);

                let java = dat.java;
                java += `window.id = '${doc.id}';\n`;
                java += `window.cTitle = '${dat.title}';\n`;
                java += `window.cRef = '${doc.id}/${dat.file}/';\n`;

                let otlang = 'es';
                if (lang == 'es') otlang = 'en';
                return res.render('galleta', {
                    "published": dat.published.toDate(),
                    "dledit": dat.dledit,
                    "ledit": dat.ledit.toDate(),
                    "description": dat.description,
                    "month": month,
                    "file": dat.file,
                    "title": dat.title,
                    "picUrl": dat.picUrl,
                    "content": dat.cont,
                    "java": java,
                    "setLang": lang,
                    "transLink": dat.translations[otlang]
                });
            });
        }).catch(err => console.log(err));
    }
}
app.get('/galletas/:month/:file', (req, res) => {
    return renderCookie(req, res, "es");
});
app.get('/cookies/:month/:file', (req, res) => {
    return renderCookie(req, res, "en");
});

app.get('/vista-email/:file', (req, res) => {
    res.set('Cache-Control', 'public, max-age=600, s-maxage=1200');
    db.collection('cookies/langs/es').where('file', '==', req.params.file).limit(1).get().then(snap => {
        if (snap.empty) {
            res.redirect('http://sciencecookies.net/404');
            return;
        }
        snap.forEach(doc => {
            let dat = doc.data();
            if (dat.timePrev < admin.firestore.Timestamp.now() || !dat.timePrev) {
                console.log('private');
                res.redirect('https://sciencecookies.net/404');
                return;
            }

            let d = dat.published.toDate();
            let month = d.getFullYear().toString();
            if (d.getMonth() < 9) {
                month += '0';
            }
            month += (d.getMonth() + 1);

            let toRender = {
                "authors": dat.authors,
                "description": dat.description,
                "month": month,
                "picUrl": dat.picUrl,
                "file": dat.file,
                "title": dat.title,
                "estado": ""
            };
            if (dat.beenPublic) toRender.estado = "actualizado una";
            else toRender.estado = "cocinado una nueva";
            res.render('mailPrev', toRender);
            return;
        });
    }).catch(err => console.log(err));
});

exports.showCookie = functions.region('us-central1').https.onRequest(app);