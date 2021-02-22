const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

const express = require('express');
const engines = require('consolidate');
const app = express();

app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

app.get('/calendario-astronomico/:year', (req, res) => {
    res.redirect('http://sciencecookies.net/404');
    return
    //@#
    res.set('Cache-Control', 'public, max-age=600, s-maxage=1200');
    let year = req.params.year;
    if (!/^[0-9]{4}$/.test(year)) {
        console.log('badUrl');
        res.redirect('http://sciencecookies.net/404');
    } else {
        let bDate = admin.firestore.Timestamp.fromDate(new Date(Date.parse(year + 'Jan 1')));
        let eDate = admin.firestore.Timestamp.fromDate(new Date(Date.parse(year + 'Dec 31')));
        db.collection('calendarios').where('public', '==', true).where('date', '>=', bDate).where('date', '<=', eDate).orderBy('date').get().then(snap => {
            if (snap.empty) {
                console.log('snap.empty');
                res.redirect('http://sciencecookies.net/404');
                return;
            }
            let months = [], mString = "";
            let month = -1;
            snap.forEach(doc => {
                let dat = doc.data();
                if (month != -1) {
                    mString += '<div class="dropdown-divider d-md-none"></div>\n';
                    months.push(mString);
                }
                mString = '<a href="' + dat.url + '" class="text-decoration-none text-light"><div class="media mb-3">\n';
                mString += '<img src="' + dat.picUrl + '" class="align-self-center mr-3" alt="' + dat.title + '" width="64px" height="64px">\n';
                mString += '<div class="media-body">\n';
                mString += '<h5 class="mt-0">' + dat.title + '</h5>\n';
                mString += '<p>' + dat.descriptionShort + '</p>\n';
                mString += '</div></div></a>\n';
                months.push(mString);
            });

            res.render('allCalsM', {
                year: year,
                months: months
            });
            return;
        }).catch(err => console.log(err));
    }
});

app.get('/calendario-astronomico', (req, res) => {
    res.redirect('http://sciencecookies.net/404');
    return
    //@#
    function getY(url) {
        return url.substring(50, 54);
    }
    res.set('Cache-Control', 'public, max-age=600, s-maxage=1200');
    db.collection('sitemap').doc('1').get().then(snap => {
        let urls = snap.data().calendars, nUrls = [];
        urls.splice(0, 1);
        urls.forEach(url => {
            if (!url.image) nUrls.push(getY(url.loc));
        });
        let years = [];
        nUrls.forEach(year => {
            years.push(`<li><a href="calendario-astronomico/${year}" class="btn-link-scckie text-light" style="font-size:larger">${year}</a></li>\n`);
        });
        res.render('allCalsY', { years: years });
        return;
    }).catch(err => console.log(err));
});

exports.showAllCal = functions.region('us-central1').https.onRequest(app);