const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

const express = require('express');
const app = express();

app.set('views', './views');
app.set('view engine', 'pug');

function renderCal(req, res, lang) {
    res.set('Cache-Control', 'public, max-age=600, s-maxage=1200');
    if (!/^[0-9]{4}$/.test(req.params.year)) {
        console.log('badUrl');
        res.redirect('http://sciencecookies.net/404');
        return;
    } else {
        let monthNum;
        if (req.params.month == "enero" || req.params.month == "january") {
            monthNum = "01";
        } else if (req.params.month == "febrero" || req.params.month == "february") {
            monthNum = "02";
        } else if (req.params.month == "marzo" || req.params.month == "march") {
            monthNum = "03";
        } else if (req.params.month == "abril" || req.params.month == "april") {
            monthNum = "04";
        } else if (req.params.month == "mayo" || req.params.month == "may") {
            monthNum = "05";
        } else if (req.params.month == "junio" || req.params.month == "june") {
            monthNum = "06";
        } else if (req.params.month == "julio" || req.params.month == "july") {
            monthNum = "07";
        } else if (req.params.month == "agosto" || req.params.month == "august") {
            monthNum = "08";
        } else if (req.params.month == "septiembre" || req.params.month == "september") {
            monthNum = "09";
        } else if (req.params.month == "octubre" || req.params.month == "october") {
            monthNum = "10";
        } else if (req.params.month == "noviembre" || req.params.month == "november") {
            monthNum = "11";
        } else if (req.params.month == "diciembre" || req.params.month == "december") {
            monthNum = "11";
        } else {
            monthNum = "00";
        }
        db.collection('calendars/langs/' + lang).doc(req.params.year + monthNum).get().then(doc => {
            if (!doc.exists) {
                console.log('doc', req.params.year + monthNum, '--', req.params.year, monthNum, ' !.exists');
                res.redirect('https://sciencecookies.net/404');
                return;
            }
            let dat = doc.data();
            if (!dat.public && (!dat.timePrev || dat.timePrev < admin.firestore.Timestamp.now())) {
                console.log('private');
                res.redirect('https://sciencecookies.net/404');
                return;
            }

            let orderedKeys = Object.keys(dat.events).slice().sort((a, b) => {
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
                            if (b.substring(1, 4) == "sun" || b.substring(1, 4) == "mon") return 1
                            return -1;
                        case "wed":
                            if (b.substring(1, 4) == "sun" || b.substring(1, 4) == "mon" || b.substring(1, 4) == "tue") return 1
                            return -1;
                        case "thu":
                            if (b.substring(1, 4) == "sun" || b.substring(1, 4) == "mon" || b.substring(1, 4) == "tue" || b.substring(1, 4) == "wed") return 1
                            return -1;
                        case "fri":
                            if (b.substring(1, 4) == "sun" || b.substring(1, 4) == "mon" || b.substring(1, 4) == "tue" || b.substring(1, 4) == "wed" || b.substring(1, 4) == "thu") return 1
                            return -1;
                        case "sat":
                            return 1;
                    }
                }
                return Number(a[0]) - Number(b[0]);
            });
            let java = 'var eventKeys=["' + orderedKeys[0];
            for (i = 1; i < orderedKeys.length; i++) {
                java += '","' + orderedKeys[i];
            }
            java += '"];\n';
            java += 'var eventTitles={"' + Object.keys(dat.events)[0] + '":"' + Object.values(dat.events)[0].date + '"';
            for (i = 1; i < Object.keys(dat.events).length; i++) {
                java += ',' + '"' + Object.keys(dat.events)[i] + '":"' + Object.values(dat.events)[i].date + '"';
            }
            java += '};\n';
            java += `window.globID="${doc.id}"\n`;

            res.render('calendario', {
                "descriptionShort": dat.descriptionShort,
                "description": dat.description,
                "year": req.params.year,
                "month": req.params.month,
                "monthNum": monthNum,
                "title": dat.title,
                "picUrl": dat.picUrl,
                "picAlt": dat.picAlt,
                "picCapt": dat.picCapt,
                "weeks": dat.weeks,
                "events": Object.entries(dat.events),
                "nextCal": dat.nextCal,
                "priorCal": dat.priorCal,
                "java": java,
                "setLang": lang
            });
        }).catch(err => console.log(err));
    }
}
app.get('/calendario-astronomico/:year/:month', (req, res) => {
    return renderCal(req, res, "es");
});
app.get('/astronomic-calendar/:year/:month', (req, res) => {
    return renderCal(req, res, "en");
});

app.get('/vista-email-calendario/:file', (req, res) => {
    res.set('Cache-Control', 'public, max-age=600, s-maxage=1200');
    db.collection('calendarios').doc(req.params.file).get().then(doc => {
        if (!doc.exists) {
            console.log('!doc.exists');
            res.redirect('http://sciencecookies.net/404');
            return;
        }
        let dat = doc.data();
        if (dat.timePrev < admin.firestore.Timestamp.now() || !dat.timePrev) {
            console.log('private');
            res.redirect('https://sciencecookies.net/404');
            return;
        }

        res.render('mailPrevCal', {
            "url": dat.url,
            "description": dat.descriptionShort,
            "picUrl": dat.picUrl,
            "title": dat.title,
            "picAlt": dat.picAlt
        });
        return;
    }).catch(err => console.log(err));
});

exports.showCalendar = functions.region('us-central1').https.onRequest(app);