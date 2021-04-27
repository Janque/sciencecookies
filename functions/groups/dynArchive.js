const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

const express = require('express');
const app = express();

app.set('views', './views');
app.set('view engine', 'pug');

function renderTri(req, res, lang) {
    res.set('Cache-Control', 'public, max-age=600, s-maxage=1200');
    let year = req.params.year, tri = req.params.tri;
    if (!/^[0-9]{4}$/.test(year) || !(tri == 'ene-mar' || tri == 'abr-jun' || tri == 'jul-sep' || tri == 'oct-dic' || tri == 'jan-mar' || tri == 'apr-jun' || tri == 'oct-dec')) {
        console.log('badUrl');
        res.redirect('http://sciencecookies.net/404');
    } else {
        let bMonth, eMonth, eDay;
        if (tri == 'ene-mar' || tri == 'jan-mar') {
            bMonth = 'Jan';
            eMonth = 'Mar';
            eDay = '31';
        } else if (tri == 'abr-jun' || tri == 'apr-jun') {
            bMonth = 'Apr';
            eMonth = 'Jun';
            eDay = '30';
        } else if (tri == 'jul-sep') {
            bMonth = 'Jul';
            eMonth = 'Sep';
            eDay = '30';
        } else if (tri == 'oct-dic' || tri == 'oct-dec') {
            bMonth = 'Oct';
            eMonth = 'Dec';
            eDay = '31';
        }
        let bDate = admin.firestore.Timestamp.fromDate(new Date(Date.parse(year + bMonth + '1')));
        let eDate = admin.firestore.Timestamp.fromDate(new Date(Date.parse(year + eMonth + eDay)));
        db.collection('cookies/langs/' + lang).where('public', '==', true).where('published', '>=', bDate).where('published', '<=', eDate).orderBy('published').get().then(snap => {
            if (snap.empty) {
                console.log('snap.empty');
                res.redirect('http://sciencecookies.net/404');
                return;
            }
            let months = {}, month, monthn;
            snap.forEach(doc => {
                let dat = doc.data();
                let date = dat.published.toDate();
                if (monthn != date.getMonth()) {
                    monthn = date.getMonth();
                    if (lang == "es") {
                        switch (monthn) {
                            case 0:
                                month = "Enero";
                                break;
                            case 1:
                                month = "Febrero";
                                break;
                            case 2:
                                month = "Marzo";
                                break;
                            case 3:
                                month = "Abril";
                                break;
                            case 4:
                                month = "Mayo";
                                break;
                            case 5:
                                month = "Junio";
                                break;
                            case 6:
                                month = "Julio";
                                break;
                            case 7:
                                month = "Agosto";
                                break;
                            case 8:
                                month = "Septiembre";
                                break;
                            case 9:
                                month = "Octubre";
                                break;
                            case 10:
                                month = "Noviembre";
                                break;
                            case 11:
                                month = "Diciembre";
                                break;
                        }
                    } else if (lang == "en") {
                        switch (monthn) {
                            case 0:
                                month = "January";
                                break;
                            case 1:
                                month = "February";
                                break;
                            case 2:
                                month = "March";
                                break;
                            case 3:
                                month = "April";
                                break;
                            case 4:
                                month = "May";
                                break;
                            case 5:
                                month = "June";
                                break;
                            case 6:
                                month = "July";
                                break;
                            case 7:
                                month = "August";
                                break;
                            case 8:
                                month = "September";
                                break;
                            case 9:
                                month = "October";
                                break;
                            case 10:
                                month = "November";
                                break;
                            case 11:
                                month = "December";
                                break;
                        }
                    }
                    months[month] = [];
                }
                let cook = {
                    url: dat.url,
                    picUrl: dat.picUrl,
                    title: dat.title,
                    descrip: dat.description,
                    dledit: dat.dledit,
                    ledit: "",
                    pub: "",
                    authors: dat.authors
                }
                if (dat.dledit) {
                    let dl = dat.ledit.toDate();
                    cook.ledit = dl.getDate() + '/' + (dl.getMonth() + 1) + '/' + dl.getFullYear();
                } else {
                    let d = dat.published.toDate();
                    cook.pub = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
                }
                months[month].push(cook);
            });
            console.log(lang);
            res.render('archTrim', {
                year: year,
                sTri: tri,
                tri: longTri(tri, lang),
                triLC: longTri(tri, lang).toLowerCase(),
                months: months,
                setLang: lang
            });
            return;
        }).catch(err => console.log(err));
    }
}
app.get('/galletas/:year/:tri', (req, res) => {
    return renderTri(req, res, "es");
});
app.get('/cookies/:year/:tri', (req, res) => {
    return renderTri(req, res, "en");
});

function renderArch(req, res, lang) {
    function getYT(url) {
        return {
            year: url.substring(35, 39),
            tri: url.substring(40, 48)
        };
    }
    res.set('Cache-Control', 'public, max-age=600, s-maxage=1200');
    db.collection('sitemap').doc('2').get().then(snap => {
        let urls = snap.data().archive[lang], nUrls = [];
        urls.splice(0, 2);
        urls.forEach(url => {
            nUrls.push(getYT(url.loc));
        });
        let years = {
            "2020": {}
        }
        let year = '2020', tri = 'abr-jun';
        nUrls.forEach(url => {
            let lyear = url.year, ltri = url.tri;
            if (lyear != year || ltri != tri) {
                if (!years[lyear]) years[lyear] = {};
                years[lyear][ltri] = longTri(ltri, lang);
            }
            tri = ltri;
            year = lyear;
        });
        res.render('archivo', { years: years, setLang: lang });
        return;
    }).catch(err => console.log(err));
}
app.get('/galletas', (req, res) => {
    return renderArch(req, res, "es");
});
app.get('/cookies', (req, res) => {
    return renderArch(req, res, "en");
});


function longTri(tri, lang) {
    if (lang = "es") {
        if (tri == 'ene-mar') return 'Enero - Marzo';
        if (tri == 'abr-jun') return 'Abril - Junio';
        if (tri == 'jul-sep') return 'Julio - Septiembre';
        return 'Octubre - Noviembre';
    } else if (lang == 'en') {
        if (tri == 'jan-mar') return 'January - March';
        if (tri == 'apr-jun') return 'April - June';
        if (tri == 'jul-sep') return 'July - September';
        return 'October - November';
    }
}


exports.showArchive = functions.region('us-central1').https.onRequest(app);