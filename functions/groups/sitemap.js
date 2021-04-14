const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

//Update sitemap
exports.updateSitemap = functions.region('us-east1').firestore.document('galletas/{galleta}').onWrite((change, context) => {
    //exports.updateSitemap = functions.region('us-central1').https.onRequest((change, context) => {
    function getTri(m) {
        if (m <= 2) return 'ene-mar';
        if (m <= 5) return 'abr-jun';
        if (m <= 8) return 'jul-sep';
        return 'oct-dic';
    }
    return db.collection('galletas').where('public', '==', true).orderBy('date').get().then(snap => {
        let urls = [];
        let archUrls = [{
            loc: 'https://sciencecookies.net/archivo/',
            priority: '0.7',
            lastmod: admin.firestore.Timestamp.now().toDate().toISOString()
        }];
        let year = 2020, tri = 'abr-jun';
        snap.forEach(doc => {
            let dat = doc.data();
            urls.push({
                loc: dat.url,
                priority: '0.8',
                lastmod: dat.ledit.toDate().toISOString(),
                image: {
                    loc: dat.picUrl,
                    title: dat.title
                }
            });
            let lyear = dat.date.toDate().getFullYear(), ltri = getTri(dat.date.toDate().getMonth());
            if (lyear != year || ltri != tri) {
                tri = ltri;
                year = lyear;
                archUrls.push({
                    loc: 'https://sciencecookies.net/archivo/' + year + '/' + tri+'/',
                    priority: '0.6'
                });
            }
        });
        return db.collection('sitemap').doc('1').update({
            archive: archUrls,
            cookies: urls
        });
    }).then(() => {
        console.log('Sitemap updated');
        return;
    }).catch(err => {
        console.log('Failed to update sitemap: ', err);
        return;
    });
});

//Update sitemap
exports.updateCalSitemap = functions.region('us-east1').firestore.document('calendarios/{calendario}').onUpdate((change, context) => {
    //exports.updateCalSitemap = functions.region('us-central1').https.onRequest((change, context) => {
    if (!change.after.data().public) return;
    return db.collection('calendarios').where('public', '==', true).orderBy('date').get().then(snap => {
        let urls = [{
            loc: 'https://sciencecookies.net/calendario-astronomico/',
            priority: '0.8',
            lastmod: admin.firestore.Timestamp.now().toDate().toISOString()
        }];
        let year, yUrl;
        snap.forEach(doc => {
            let dat = doc.data();
            year = dat.date.toDate().getFullYear();
            let url = {
                loc: dat.url,
                priority: '0.8',
                image: {
                    loc: dat.picUrl,
                    title: dat.title
                }
            };
            if (dat.date < admin.firestore.Timestamp.now()) {
                url.lastmod = dat.date.toDate().toISOString();
                if (dat.date.toDate().getMonth() == 11) {
                    yUrl = {
                        loc: `https://sciencecookies.net/calendario-astronomico/${year}/`,
                        priority: '0.6',
                        lastmod: dat.date.toDate().toISOString()
                    };
                }
            } else {
                url.lastmod = admin.firestore.Timestamp.now().toDate().toISOString();
                if (dat.date.toDate().getMonth() == 11) {
                    yUrl = {
                        loc: `https://sciencecookies.net/calendario-astronomico/${year}/`,
                        priority: '0.6',
                        lastmod: admin.firestore.Timestamp.now().toDate().toISOString()
                    };
                }
            }
            urls.push(url);
            if (dat.date.toDate().getMonth() == 11) urls.push(yUrl);
        });
        if (snap.docs.length && snap.docs[snap.docs.length - 1].data().date.toDate().getMonth() != 11) {
            yUrl = {
                loc: `https://sciencecookies.net/calendario-astronomico/${year}/`,
                priority: '0.6',
                lastmod: admin.firestore.Timestamp.now().toDate().toISOString()
            };
            urls.push(yUrl);
        }
        return db.collection('sitemap').doc('1').update({
            calendars: urls
        });
    }).then(() => {
        console.log('Sitemap updated');
        return null;
    }).catch(err => {
        console.log('Failed to update sitemap: ', err);
        return null;
    });
});

//Download & serve sitemap
exports.serveSitemap = functions.region('us-central1').https.onRequest(async (req, res) => {
    function makeUrl(url) {
        let urlStr = "<url><loc>";
        urlStr += url.loc;
        urlStr += "</loc>";
        if (url.priority) {
            urlStr += "<priority>";
            urlStr += url.priority;
            urlStr += "</priority>";
        }
        if (url.changefreq) {
            urlStr += "<changefreq>";
            urlStr += url.changefreq;
            urlStr += "</changefreq>";
        }
        if (url.lastmod) {
            urlStr += "<lastmod>";
            urlStr += url.lastmod;
            urlStr += "</lastmod>";
        }
        if (url.image) {
            urlStr += "<image:image>";
            urlStr += "<image:loc>";
            urlStr += url.image.loc.replace('&', '&amp;');
            urlStr += "</image:loc>";
            if (url.image.title) {
                urlStr += "<image:title>";
                urlStr += url.image.title;
                urlStr += "</image:title>";
            }
            if (url.image.caption) {
                urlStr += "<image:caption>";
                urlStr += url.image.caption;
                urlStr += "</image:caption>";
            }
            urlStr += "</image:image>";
        }
        urlStr += "</url>";
        return urlStr;
    }
    const doc = await db.collection('sitemap').doc('1').get();
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">';
    doc.data().static.forEach(url => {
        sitemap += makeUrl(url);
    });
    doc.data().archive.forEach(url => {
        sitemap += makeUrl(url);
    });
    doc.data().cookies.forEach(url => {
        sitemap += makeUrl(url);
    });
    doc.data().calendars.forEach(url => {
        sitemap += makeUrl(url);
    });
    sitemap += "</urlset>"
    res.set('Content-Type', 'text/xml');
    res.status(200).send(sitemap);
    return;
});