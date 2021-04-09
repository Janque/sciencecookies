const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

const express = require('express');
const app = express();

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/calendario-astronomico/:year', (req, res) => {
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
            let months = [];
            snap.forEach(doc => {
                let dat = doc.data();
                months.push({
                    url: dat.url,
                    picUrl: dat.picUrl,
                    title: dat.title,
                    descriptionShort: dat.descriptionShort
                });
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
    function getY(url) {
        return url.substring(50, 54);
    }
    res.set('Cache-Control', 'public, max-age=600, s-maxage=1200');
    db.collection('sitemap').doc('1').get().then(snap => {
        let urls = snap.data().calendars, years = [];
        urls.splice(0, 1);
        urls.forEach(url => {
            if (!url.image) years.push(getY(url.loc));
        });
        res.render('allCalsY', { years: years });
        return;
    }).catch(err => console.log(err));
});

exports.showAllCal = functions.region('us-central1').https.onRequest(app);