const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

const express = require('express');
const engines = require('consolidate');
const app = express();

app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

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
            let months = [], mString = "";
            let month = -1;
            snap.forEach(doc => {
                let dat = doc.data();
                let date = dat.date.toDate();
                if (month != date.getMonth()) {
                    if (month != -1) {
                        mString += '<div class="dropdown-divider d-md-none"></div><br>\n';
                        months.push(mString);
                    }
                    month = date.getMonth();
                    switch (month) {
                        case 0:
                            mString = '<h2>Enero</h2><br>\n';
                            break;
                        case 1:
                            mString = '<h2>Febrero</h2><br>\n';
                            break;
                        case 2:
                            mString = '<h2>Marzo</h2><br>\n';
                            break;
                        case 3:
                            mString = '<h2>Abril</h2><br>\n';
                            break;
                        case 4:
                            mString = '<h2>Mayo</h2><br>\n';
                            break;
                        case 5:
                            mString = '<h2>Junio</h2><br>\n';
                            break;
                        case 6:
                            mString = '<h2>Julio</h2><br>\n';
                            break;
                        case 7:
                            mString = '<h2>Agosto</h2><br>\n';
                            break;
                        case 8:
                            mString = '<h2>Septiembre</h2><br>\n';
                            break;
                        case 9:
                            mString = '<h2>Octubre</h2><br>\n';
                            break;
                        case 10:
                            mString = '<h2>Noviembre</h2><br>\n';
                            break;
                        case 11:
                            mString = '<h2>Diciembre</h2><br>\n';
                            break;
                    }
                }
                mString += '<a href="' + dat.url + '" class="text-decoration-none text-light"><div class="media mb-3">\n';
                mString += '<img src="' + dat.picUrl + '" class="align-self-center mr-3" alt="' + dat.title + '" width="64px" height="64px">\n';
                mString += '<div class="media-body">\n';
                mString += '<h5 class="mt-0">' + dat.title + '</h5>\n';
                mString += '<p>' + dat.descrip + '</p>\n';
                if (doc.data().dledit) {
                    let dl = doc.data().ledit.toDate();
                    mString += '<p class="my-0">Actualizado: ' + dl.getDate() + '/' + (dl.getMonth() + 1) + '/' + dl.getFullYear() + '</p>';
                } else {
                    let d = doc.data().date.toDate();
                    mString += '<p class="my-0">Publicado: ' + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + '</p>';
                }
                mString += '<p class="mt-0">Autor(es): ' + doc.data().authrs + '</p></div>';
                mString += '</div></a><div class="dropdown-divider d-md-none"></div>';
            });
            if (month != -1) {
                mString += '<div class="dropdown-divider d-md-none"></div><br>\n';
                months.push(mString);
            }
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
        let years = [], sect = "";
        let year = '2019', tri = 'abr-jun';
        nUrls.forEach(url => {
            let lyear = url.year, ltri = url.tri;
            if (lyear != year) {
                if (sect != "") {
                    sect += "</ul>\n";
                    years.push(sect);
                }
                sect = "<h2>" + lyear + "</h2>\n";
                sect += "<ul>\n";
                sect += '<li><a href="archivo/' + lyear + '/' + ltri + '" class="btn-link-scckie text-light"><h6>' + longTri(ltri) + '</h6></a></li>\n';
            } else if (ltri != tri) {
                sect += '<li><a href="archivo/' + lyear + '/' + ltri + '" class="btn-link-scckie text-light"><h6>' + longTri(ltri) + '</h6></a></li>\n';
            }
            tri = ltri;
            year = lyear;
        });
        if (sect != "") {
            sect += "</ul>\n";
            years.push(sect);
        }
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