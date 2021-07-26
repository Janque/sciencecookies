const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

//Update sitemap
exports.updateSitemap = functions.region('us-east1').firestore.document('cookies/lang/es/{cookie}').onUpdate((change, context) => {
//exports.updateSitemap = functions.region('us-central1').https.onRequest((req, res) => {
    if (!change.after.data().public || change.before.data().public) return;
    function getTri(m, l) {
        if (l == "es") {
            if (m <= 2) return 'ene-mar';
            if (m <= 5) return 'abr-jun';
            if (m <= 8) return 'jul-sep';
            return 'oct-dic';
        } else if (l == "en") {
            if (m <= 2) return 'jan-mar';
            if (m <= 5) return 'apr-jun';
            if (m <= 8) return 'jul-sep';
            return 'oct-dec';
        }
    }
    let urlsEs = [];
    let urlsEn = [];
    let archUrlsEs = [{
        loc: 'https://sciencecookies.net/archivo/',
        alternate: {
            "es": "https://sciencecookies.net/archivo/",
            "en": "https://sciencecookies.net/archive/"
        },
        priority: '0.7',
        lastmod: admin.firestore.Timestamp.now().toDate().toISOString()
    }];
    let archUrlsEn = [{
        loc: 'https://sciencecookies.net/archive/',
        alternate: {
            "es": "https://sciencecookies.net/archivo/",
            "en": "https://sciencecookies.net/archive/"
        },
        priority: '0.7',
        lastmod: admin.firestore.Timestamp.now().toDate().toISOString()
    }];
    return db.collection('cookies/langs/es').where('public', '==', true).orderBy('published').get().then(snap => {
        let year = 2020, tri = 'abr-jun';
        snap.forEach(doc => {
            let dat = doc.data();
            urlsEs.push({
                loc: dat.url,
                priority: '0.8',
                alternate: dat.translations,
                lastmod: dat.ledit.toDate().toISOString(),
                image: {
                    loc: dat.picUrl,
                    title: dat.title
                }
            });
            let lyear = dat.published.toDate().getFullYear(), ltri = getTri(dat.published.toDate().getMonth(), "es");
            if (lyear != year || ltri != tri) {
                tri = ltri;
                year = lyear;
                archUrlsEs.push({
                    loc: 'https://sciencecookies.net/archivo/' + year + '/' + tri + '/',
                    alternate: {
                        "es": "https://sciencecookies.net/archivo/" + year + "/" + tri + "/",
                        "en": "https://sciencecookies.net/archive/" + year + "/" + getTri(dat.published.toDate().getMonth(), "en") + "/"
                    },
                    priority: '0.6'
                });
            }
        });
        return db.collection('cookies/langs/en').where('public', '==', true).orderBy('published').get();
    }).then(snap => {
        let year = 2020, tri = 'apr-jun';
        snap.forEach(doc => {
            let dat = doc.data();
            urlsEn.push({
                loc: dat.url,
                priority: '0.8',
                alternate: dat.translations,
                lastmod: dat.ledit.toDate().toISOString(),
                image: {
                    loc: dat.picUrl,
                    title: dat.title
                }
            });
            let lyear = dat.published.toDate().getFullYear(), ltri = getTri(dat.published.toDate().getMonth(), "en");
            if (lyear != year || ltri != tri) {
                tri = ltri;
                year = lyear;
                archUrlsEn.push({
                    loc: 'https://sciencecookies.net/archive/' + year + '/' + tri + '/',
                    alternate: {
                        "es": "https://sciencecookies.net/archivo/" + year + "/" + tri + "/",
                        "en": "https://sciencecookies.net/archive/" + year + "/" + getTri(dat.published.toDate().getMonth(), "es") + "/"
                    },
                    priority: '0.6'
                });
            }
        });
        return db.collection('sitemap').doc('2').update({
            archive: {
                es: archUrlsEs,
                en: archUrlsEn
            },
            cookies: {
                es: urlsEs,
                en: urlsEn
            }
        });
    }).then(() => {
        console.log('Sitemap updated');
        //res.send('Successful');
        return;
    }).catch(err => {
        console.log('Failed to update sitemap: ', err);
        return;
    });
});

//Update sitemap
exports.updateCalSitemap = functions.region('us-east1').firestore.document('calendars/langs/es').onUpdate((change, context) => {
//exports.updateCalSitemap = functions.region('us-central1').https.onRequest((req, res) => {
    if (!change.after.data().public || change.before.data().public) return;
    let urlsEs = [{
        loc: 'https://sciencecookies.net/calendario-astronomico/',
        alternate: {
            "es": "https://sciencecookies.net/calendario-astronomico/",
            "en": "https://sciencecookies.net/astronomic-calendar/"
        },
        priority: '0.8',
        lastmod: admin.firestore.Timestamp.now().toDate().toISOString()
    }];
    let urlsEn = [{
        loc: 'https://sciencecookies.net/astronomic-calendar/',
        alternate: {
            "es": "https://sciencecookies.net/calendario-astronomico/",
            "en": "https://sciencecookies.net/astronomic-calendar/"
        },
        priority: '0.8',
        lastmod: admin.firestore.Timestamp.now().toDate().toISOString()
    }];
    return db.collection('calendars/langs/es').where('public', '==', true).orderBy('published').get().then(snap => {
        let year, yUrl;
        snap.forEach(doc => {
            let dat = doc.data();
            year = dat.published.toDate().getFullYear();
            let url = {
                loc: dat.url,
                alternate: dat.translations,
                priority: '0.8',
                image: {
                    loc: dat.picUrl,
                    title: dat.title
                }
            };
            if (dat.published < admin.firestore.Timestamp.now()) {
                url.lastmod = dat.published.toDate().toISOString();
                if (dat.published.toDate().getMonth() == 11) {
                    yUrl = {
                        loc: `https://sciencecookies.net/calendario-astronomico/${year}/`,
                        alternate: {
                            "es": `https://sciencecookies.net/calendario-astronomico/${year}/`,
                            "en": `https://sciencecookies.net/astronomic-calendar/${year}/`
                        },
                        priority: '0.6',
                        lastmod: dat.published.toDate().toISOString()
                    };
                }
            } else {
                url.lastmod = admin.firestore.Timestamp.now().toDate().toISOString();
                if (dat.published.toDate().getMonth() == 11) {
                    yUrl = {
                        loc: `https://sciencecookies.net/calendario-astronomico/${year}/`,
                        alternate: {
                            "es": `https://sciencecookies.net/calendario-astronomico/${year}/`,
                            "en": `https://sciencecookies.net/astronomic-calendar/${year}/`
                        },
                        priority: '0.6',
                        lastmod: admin.firestore.Timestamp.now().toDate().toISOString()
                    };
                }
            }
            urlsEs.push(url);
            if (dat.published.toDate().getMonth() == 11) urlsEs.push(yUrl);
        });
        if (snap.docs.length && snap.docs[snap.docs.length - 1].data().published.toDate().getMonth() != 11) {
            yUrl = {
                loc: `https://sciencecookies.net/calendario-astronomico/${year}/`,
                alternate: {
                    "es": `https://sciencecookies.net/calendario-astronomico/${year}/`,
                    "en": `https://sciencecookies.net/astronomic-calendar/${year}/`
                },
                priority: '0.6',
                lastmod: admin.firestore.Timestamp.now().toDate().toISOString()
            };
            urlsEs.push(yUrl);
        }
        return db.collection('calendars/langs/en').where('public', '==', true).orderBy('published').get();
    }).then(snap => {
        let year, yUrl;
        snap.forEach(doc => {
            let dat = doc.data();
            year = dat.published.toDate().getFullYear();
            let url = {
                loc: dat.url,
                alternate: dat.translations,
                priority: '0.8',
                image: {
                    loc: dat.picUrl,
                    title: dat.title
                }
            };
            if (dat.published < admin.firestore.Timestamp.now()) {
                url.lastmod = dat.published.toDate().toISOString();
                if (dat.published.toDate().getMonth() == 11) {
                    yUrl = {
                        loc: `https://sciencecookies.net/astronomic-calendar/${year}/`,
                        alternate: {
                            "es": `https://sciencecookies.net/calendario-astronomico/${year}/`,
                            "en": `https://sciencecookies.net/astronomic-calendar/${year}/`
                        },
                        priority: '0.6',
                        lastmod: dat.published.toDate().toISOString()
                    };
                }
            } else {
                url.lastmod = admin.firestore.Timestamp.now().toDate().toISOString();
                if (dat.published.toDate().getMonth() == 11) {
                    yUrl = {
                        loc: `https://sciencecookies.net/astronomic-calendar/${year}/`,
                        alternate: {
                            "es": `https://sciencecookies.net/calendario-astronomico/${year}/`,
                            "en": `https://sciencecookies.net/astronomic-calendar/${year}/`
                        },
                        priority: '0.6',
                        lastmod: admin.firestore.Timestamp.now().toDate().toISOString()
                    };
                }
            }
            urlsEn.push(url);
            if (dat.published.toDate().getMonth() == 11) urlsEn.push(yUrl);
        });
        if (snap.docs.length && snap.docs[snap.docs.length - 1].data().published.toDate().getMonth() != 11) {
            yUrl = {
                loc: `https://sciencecookies.net/astronomic-calendar/${year}/`,
                alternate: {
                    "es": `https://sciencecookies.net/calendario-astronomico/${year}/`,
                    "en": `https://sciencecookies.net/astronomic-calendar/${year}/`
                },
                priority: '0.6',
                lastmod: admin.firestore.Timestamp.now().toDate().toISOString()
            };
            urlsEn.push(yUrl);
        }
        return db.collection('sitemap').doc('2').update({
            calendars: {
                es: urlsEs,
                en: urlsEn
            }
        });
    }).then(() => {
        console.log('Sitemap updated');
        //res.send('Successful');
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
        /*if (url.alternate) {
            for (const [lang, link] of Object.entries(url.alternate)) {
                urlStr += `<xhtml:link rel="alternate" hreflang="${lang}" href="${link}"/>`;
            }
        }*/
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
    const doc = await db.collection('sitemap').doc('2').get();
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">';
    doc.data().static["es"].forEach(url => {
        sitemap += makeUrl(url);
    });
    doc.data().static["en"].forEach(url => {
        sitemap += makeUrl(url);
    });
    doc.data().archive["es"].forEach(url => {
        sitemap += makeUrl(url);
    });
    doc.data().archive["en"].forEach(url => {
        sitemap += makeUrl(url);
    });
    doc.data().cookies["es"].forEach(url => {
        sitemap += makeUrl(url);
    });
    doc.data().cookies["en"].forEach(url => {
        sitemap += makeUrl(url);
    });
    doc.data().calendars["es"].forEach(url => {
        sitemap += makeUrl(url);
    });
    doc.data().calendars["en"].forEach(url => {
        sitemap += makeUrl(url);
    });
    sitemap += "</urlset>"
    res.set('Content-Type', 'text/xml');
    res.status(200).send(sitemap);
    return;
});