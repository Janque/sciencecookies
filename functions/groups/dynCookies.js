const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

const express = require('express');
const engines = require('consolidate');
const app = express();

app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

app.get('/galletas/:month/:file', (req, res) => {
    res.set('Cache-Control', 'public, max-age=600, s-maxage=1200');
    if (!/^\d{6}$/.test(req.params.month)) {
        res.redirect('http://sciencecookies.net/404');
    } else {
        db.collection('galletasCont').where('file', '==', req.params.file).limit(1).get().then(snap => {
            if (snap.empty) {
                res.redirect('http://sciencecookies.net/404');
                return;
            }
            snap.forEach(doc => {
                let dat = doc.data();
                if (!dat.public) {
                    res.redirect('http://sciencecookies.net/404');
                    return;
                }
                let content = [];
                dat.cont.forEach(item => {
                    let sect = "";
                    switch (item.type) {
                        case 'head':
                            sect = '<h1 class="text-center">' + dat.cont[0].title + '</h1>\n';
                            let d = dat.published.toDate();
                            sect += '<p>Publicado: ' + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + '</p>\n';
                            if (dat.dledit) {
                                let ld = dat.ledit.toDate();
                                sect += '<p>Ultima actualización: ' + ld.getDate() + '/' + (ld.getMonth() + 1) + '/' + ld.getFullYear() + '</p>\n';
                            }
                            sect += '<p>Autor(es):' + dat.cont[0].author + '</p>\n';
                            break;
                        case 'ref':
                            sect = '<h3>Referencias</h3>\n';
                            item.ref.forEach(link => {
                                sect += '<p><a href="' + link + '" target="_blank" class="text-warning text-break" rel="nofollow">' + link + ' <i class="fas fa-external-link-alt"></i></a></p>\n'
                            });
                            break;
                        case 'parra':
                            if (item.title > 0) {
                                sect = '<h' + item.title + '>' + item.titleTxt + '</h' + item.title + '>\n';
                            }
                            sect += '<p>' + item.text + '</p>\n';
                            if (item.br) {
                                sect += '<br>\n';
                            }
                            break;
                        case 'html':
                            sect = item.html;
                            break;
                        //Add more@#
                    }
                    content.push(sect);
                });

                let d = dat.published.toDate();
                let month = d.getFullYear().toString();
                if (d.getMonth() < 9) {
                    month += '0';
                }
                month += (d.getMonth() + 1);
                res.render('galleta', {
                    "description": dat.description,
                    "month": month,
                    "file": dat.file,
                    "title": dat.title,
                    "titleInf": dat.title,
                    "cookieID": doc.id,
                    "content": content,
                    "java": dat.js
                });
                return;
            });
        }).catch(err => console.log(err));
    }
});

app.get('/vista-email/:file', (req, res) => {
    res.set('Cache-Control', 'public, max-age=600, s-maxage=1200');
    db.collection('drafts').where('file', '==', req.params.file).limit(1).get().then(snap => {
        if (snap.empty) {
            res.redirect('http://sciencecookies.net/404');
            return;
        }
        snap.forEach(doc => {
            let dat = doc.data();

            let d = dat.published.toDate();
            let month = d.getFullYear().toString();
            if (d.getMonth() < 9) {
                month += '0';
            }
            month += (d.getMonth() + 1);

            let toRender={
                "authors": dat.authors,
                "description": dat.description,
                "month": month,
                "file": dat.file,
                "title": dat.title,
                "estado":""
            };
            if(dat.beenPublic)toRender.estado="actualizado una";
            else toRender.estado="cocinado una nueva";
            res.render('mailPreview', toRender);
            return;
        });
    }).catch(err => console.log(err));
});

exports.showCookie = functions.region('us-central1').https.onRequest(app);