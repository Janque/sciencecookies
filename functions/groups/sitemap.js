const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

//Update sitemap
exports.updateSitemap = functions.region('us-east1').firestore.document('galletas/{galleta}').onWrite((change, context) => {
    let urls = [];
    return db.collection('galletas').get().then(snap => {
        snap.forEach(doc => {
            let dat = doc.data();
            if (dat.public) {
                let urlObj = {
                    loc: dat.url,
                    priority: 0.8,
                    lastmod: dat.ledit.toDate().toISOString(),
                    image: {
                        loc: dat.picUrl,
                        title: dat.title
                    }
                }
                urls.push(urlObj);
            }
        });
        return db.collection('sitemap').doc('1').update({
            cookies: urls
        });
    }).then(() => {
        console.log('Sitemap updated');
        return;
    }).catch(err => {
        console.log('Failed to update sitemap: ', err.code);
        return;
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
    sitemap += "</urlset>"
    res.set('Content-Type', 'text/xml');
    res.status(200).send(sitemap);
    return;
});