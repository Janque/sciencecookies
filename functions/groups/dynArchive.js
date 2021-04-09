const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

const express = require('express');
const app = express();

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/archivo/:year/:tri', (req, res) => {
    res.set('Cache-Control', 'public, max-age=600, s-maxage=1200');
    let year = req.params.year, tri = req.params.tri;
    if (!/^[0-9]{4}$/.test(year) || !(tri == 'ene-mar' || tri == 'abr-jun' || tri == 'jul-sep' || tri == 'oct-dic')) {
        console.log('badUrl');
        res.redirect('http://sciencecookies.net/404');
    } else {
        let bMonth, eMonth, eDay;
        switch (tri) {
            case 'ene-mar':
                bMonth = 'Jan';
                eMonth = 'Mar';
                eDay = '31';
                break;
            case 'abr-jun':
                bMonth = 'Apr';
                eMonth = 'Jun';
                eDay = '30';
                break;
            case 'jul-sep':
                bMonth = 'Jul';
                eMonth = 'Sep';
                eDay = '30';
                break;
            case 'oct-dic':
                bMonth = 'Oct';
                eMonth = 'Dec';
                eDay = '31';
                break;
        }
        let bDate = admin.firestore.Timestamp.fromDate(new Date(Date.parse(year + bMonth + '1')));
        let eDate = admin.firestore.Timestamp.fromDate(new Date(Date.parse(year + eMonth + eDay)));
        db.collection('galletas').where('public', '==', true).where('date', '>=', bDate).where('date', '<=', eDate).orderBy('date').get().then(snap => {
            if (snap.empty) {
                console.log('snap.empty');
                res.redirect('http://sciencecookies.net/404');
                return;
            }
            let months = {}, month, monthn;
            snap.forEach(doc => {
                let dat = doc.data();
                let date = dat.date.toDate();
                if (monthn != date.getMonth()) {
                    monthn = date.getMonth();
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
                    months[month] = [];
                }
                let newMonth = {
                    url: dat.url,
                    picUrl: dat.picUrl,
                    title: dat.title,
                    descrip: dat.descrip,
                    dledit: dat.dledit,
                    ledit: "",
                    pub: "",
                    authrs: dat.authrs
                }
                if (dat.dledit) {
                    let dl = dat.ledit.toDate();
                    newMonth.ledit = dl.getDate() + '/' + (dl.getMonth() + 1) + '/' + dl.getFullYear();
                } else {
                    let d = dat.date.toDate();
                    newMonth.pub = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
                }
                months[month].push(newMonth);
            });
            res.render('archTrim', {
                year: year,
                tri: longTri(tri),
                triLC: longTri(tri).toLowerCase(),
                months: months
            });
            return;
        }).catch(err => console.log(err));
    }
});

app.get('/archivo', (req, res) => {
    function getYT(url) {
        return {
            year: url.substring(35, 39),
            tri: url.substring(40, 48)
        };
    }
    res.set('Cache-Control', 'public, max-age=600, s-maxage=1200');
    db.collection('sitemap').doc('1').get().then(snap => {
        let urls = snap.data().archive, nUrls = [];
        urls.splice(0, 1);
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
                years[lyear][ltri] = longTri(ltri);
            }
            tri = ltri;
            year = lyear;
        });
        res.render('archivo', { years: years });
        return;
    }).catch(err => console.log(err));
});


function longTri(tri) {
    if (tri == 'ene-mar') return 'Enero - Marzo';
    if (tri == 'abr-jun') return 'Abril - Junio';
    if (tri == 'jul-sep') return 'Julio - Septiembre';
    return 'Octubre - Noviembre';
}


exports.showArchive = functions.region('us-central1').https.onRequest(app);