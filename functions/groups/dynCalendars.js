const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

const express = require('express');
const engines = require('consolidate');
const app = express();

app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

app.get('/calendario-astronomico/:year/:month', (req, res) => {
    res.set('Cache-Control', 'public, max-age=600, s-maxage=1200');
    if (!/^[0-9]{4}$/.test(req.params.year)) {
        console.log('badUrl');
        res.redirect('http://sciencecookies.net/404');
        return;
    } else {
        let monthNum;
        switch (req.params.month) {
            case "enero":
                monthNum = "01";
                break;
            case "febrero":
                monthNum = "02";
                break;
            case "marzo":
                monthNum = "03";
                break;
            case "abril":
                monthNum = "04";
                break;
            case "mayo":
                monthNum = "05";
                break;
            case "junio":
                monthNum = "06";
                break;
            case "julio":
                monthNum = "07";
                break;
            case "agosto":
                monthNum = "08";
                break;
            case "septiembre":
                monthNum = "09";
                break;
            case "octubre":
                monthNum = "10";
                break;
            case "noviembre":
                monthNum = "11";
                break;
            case "diciembre":
                monthNum = "12";
            default:
                monthNum = "00";
                break;
        }
        db.collection('calendarios').doc(req.params.year + monthNum).get().then(doc => {
            if (!doc.exists) {
                console.log('doc', req.params.year + monthNum, '--', req.params.year, monthNum, '!.exists');
                res.redirect('https://sciencecookies.net/404');
                return;
            }
            let dat = doc.data();
            if (!dat.public && (!dat.timePrev || dat.timePrev < admin.firestore.Timestamp.now())) {
                console.log('private');
                res.redirect('https://sciencecookies.net/404');
                return;
            }
            let weeks = [];
            const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
            dat.weeks.forEach((week, wIdx) => {
                let sect = '<tr style="height:10rem;">\n';
                for (let i = 0; i < 7; i++) {
                    let day = week[daysOfWeek[i]]
                    sect += '<td class="p-0">\n';

                    if (day) {
                        sect += '<p class="m-0 p-1" style="font-size:x-large;"><b>' + day.date + '</b></p>\n';
                        sect += '<div class="autoOverflow" style="max-height: 8rem;">\n';
                        day.events.forEach((event, idx) => {
                            sect += '<button class="btn text-left p-1 mb-1" style="background-color: #c3e6cb; border-color:#8fd19e;" onclick="eventToShow=\'' + wIdx + daysOfWeek[i] + idx + '\';showEvent();" data-toggle="modal" data-target="#mdlEventInfo"><small>' + event.name + '</small></button>\n';
                        });
                        sect += '</div>\n';
                    }
                    sect += '</td>\n';
                }
                sect += '</tr>\n';
                weeks.push(sect);
            });

            let events = [];
            for (const [key, event] of Object.entries(dat.events)) {
                let sect = '<div id="' + key + '" class="d-none overflow-auto">\n';
                sect += '<div class="modal-body">\n';
                sect += '<h3>' + event.name + '</h3>\n';
                sect += '<p>' + event.description + '</p>\n';
                sect += '<p>Visibilidad: ' + event.visibilidad + '</p>\n';
                sect += '<p class="mb-0">Horario: </p>\n<ul>\n';
                event.horario.forEach(time => {
                    sect += '<li>' + time + '</li>\n';
                });
                sect += '</ul>\n</div></div>\n';
                events.push(sect);
            }

            let java = 'var eventKeys=["' + Object.keys(dat.events)[0];
            for (i = 1; i < Object.keys(dat.events).length; i++) {
                java += '","' + Object.keys(dat.events)[i];
            }
            java += '"];';
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
                "weeks": weeks,
                "events": events,
                "nextCal": dat.nextCal,
                "priorCal": dat.priorCal,
                "java": java
            });
        }).catch(err => console.log(err));
    }
});

app.get('/vista-email-calendario/:file', (req, res) => {
    res.set('Cache-Control', 'public, max-age=600, s-maxage=1200');
    db.collection('calendarios').doc(req.params.file).get().then(doc => {
        if (!doc.exists) {
            res.redirect('http://sciencecookies.net/404');
            return;
        }
        let dat = doc.data();
        if (dat.timePrev < admin.firestore.Timestamp.now() || !dat.timePrev) {
            console.log('private');
            res.redirect('https://sciencecookies.net/404');
            return;
        }

        res.render('calMailPrev', {
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