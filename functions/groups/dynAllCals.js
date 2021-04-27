const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

const express = require('express');
const app = express();

app.set('views', './views');
app.set('view engine', 'pug');

function renderAllCalsM(req, res, lang) {
    res.set('Cache-Control', 'public, max-age=600, s-maxage=1200');
    let year = req.params.year;
    if (!/^[0-9]{4}$/.test(year)) {
        console.log('badUrl');
        res.redirect('http://sciencecookies.net/404');
    } else {
        let bDate = admin.firestore.Timestamp.fromDate(new Date(Date.parse(year + 'Jan 1')));
        let eDate = admin.firestore.Timestamp.fromDate(new Date(Date.parse(year + 'Dec 31')));
        db.collection('calendars/langs/'+lang).where('public', '==', true).where('published', '>=', bDate).where('published', '<=', eDate).orderBy('published').get().then(snap => {
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
                months: months,
                setLang: lang
            });
            return;
        }).catch(err => console.log(err));
    }
}
app.get('/calendario-astronomico/:year', (req, res) => {
    renderAllCalsM(req, res, "es");
});
app.get('/astronomic-calendar/:year', (req, res) => {
    renderAllCalsM(req, res, "en");
});

function renderAllCalsY(req, res, lang) {
    function getY(url) {
        if(lang=="es")return url.substring(50, 54);
        else if(lang=="en")return url.substring(47, 51);
    }
    res.set('Cache-Control', 'public, max-age=600, s-maxage=1200');
    db.collection('sitemap').doc('2').get().then(snap => {
        let urls = snap.data().calendars[lang], years = [];
        urls.splice(0, 1);
        urls.forEach(url => {
            if (!url.image) years.push(getY(url.loc));
        });
        res.render('allCalsY', { years: years, setLang: lang });
        return;
    }).catch(err => console.log(err));
}
app.get('/calendario-astronomico', (req, res) => {
    renderAllCalsY(req, res, "es");
});
app.get('/astronomic-calendar', (req, res) => {
    renderAllCalsY(req, res, "en");
});

exports.showAllCal = functions.region('us-central1').https.onRequest(app);