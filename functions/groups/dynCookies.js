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
                    "content": content
                });
                return;
            });
        }).catch(err => console.log(err));
    }
});

app.get('/editar/:file', (req, res) => {
    db.collection('galletasCont').where('file', '==', req.params.file).limit(1).get().then(snap => {
        if (snap.empty) {
            res.redirect('http://sciencecookies.net/404');
            return;
        }
        snap.forEach(doc => {
            let dat = doc.data();
            let content = [];
            dat.cont.forEach((item, idx) => {
                let sect = "";
                switch (item.type) {
                    case 'head':
                        let d = dat.published.toDate();
                        d = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
                        let ld = dat.ledit.toDate();
                        ld = ld.getDate() + '/' + (ld.getMonth() + 1) + '/' + ld.getFullYear();
                        sect = '<div id="sect'+idx+'">\n';
                        sect += '<div class="row mb-2 justify-content-end px-2">\n';
                        sect += '<button class="btn btn-light btn-link-scckie" id="toggle' + idx + '"><i class="fas fa-edit"></i></button>\n';
                        sect += '</div>\n';
                        sect += '<div id="sect' + idx + 't">\n';
                        sect += '<h1 class="text-center">' + dat.cont[0].title + '</h1>\n';
                        sect += '<p>Publicado: ' + d + '</p>\n';
                        if (dat.dledit) sect += '<p>Ultima actualización: ' + ld + '</p>\n';
                        sect += '<p>Autor(es):' + dat.cont[0].author + '</p>\n';
                        sect += '</div>\n';
                        sect += '<div id="sect' + idx + 'f">\n';
                        sect+='<div class="row my-4">\n';
                        sect+='<label class="col-sm-2 col-lg-4 col-form-label">Nombre del archivo</label><div class="col">\n';
                        sect+='<input required id="inFile" type="text" class="form-control" value="'+dat.file+'" placeholder="titulo-galleta">\n';
                        sect+='</div></div>\n';
                        sect += '<div class="row justify-content-center mb-2"><div class="col col-lg-6">\n';
                        sect += '<input required id="inTitle" type="text" class="form-control form-control-lg text-center" placeholder="Título" value="' + dat.cont[0].title + '">\n';
                        sect += '</div></div>\n';
                        sect += '<div class="row mb-2"><label class="col-sm-2 col-form-label">Publicado: </label><div class="col">\n';
                        sect += '<input required type="text" class="form-control" readonly value="' + d + '">\n';
                        sect += '</div></div>\n';
                        if (dat.dledit) {
                            sect += '<div class="row mb-2"><label class="col-sm-2 col-form-label">Ultima actualización: </label><div class="col">\n';
                            sect += '<input required type="text" class="form-control" readonly value="' + ld + '">\n';
                            sect += '</div></div>\n';
                        }
                        sect += '<div class="row mb-2"><label class="col-sm-2 col-form-label">Autor(es): </label><div class="form-row justify-content-around pt-2">\n';
                        sect += '<div class="form-group col-auto mr-2"><div class="form-check">\n';
                        sect += '<input class="form-check-input" type="checkbox" id="authr0" value=" Andrea Garma"';
                        if (dat.cont[0].author.includes(' Andrea Garma')) sect += ' checked';
                        sect += '>\n';
                        sect += '<label class="form-check-label" for="authr0">Andrea Garma</label>\n';
                        sect += '</div></div>\n';
                        sect += '<div class="form-group col-auto mr-2"><div class="form-check">\n';
                        sect += '<input class="form-check-input" type="checkbox" id="authr1" value=" Javier Pantoja"';
                        if (dat.cont[0].author.includes(' Javier Pantoja')) sect += ' checked';
                        sect += '>\n';
                        sect += '<label class="form-check-label" for="authr1">Javier Pantoja</label>\n';
                        sect += '</div></div>\n';
                        sect += '<div class="form-group col-auto mr-2"><div class="form-check">\n';
                        sect += '<input class="form-check-input" type="checkbox" id="authr2" value=" Paulina Vargas"';
                        if (dat.cont[0].author.includes(' Paulina Vargas')) sect += ' checked';
                        sect += '>\n';
                        sect += '<label class="form-check-label" for="authr2">Paulina Vargas</label>\n';
                        sect += '</div></div>\n';
                        sect += '</div></div>\n';
                        sect += '</div>\n';
                        sect += '</div>\n';
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
            res.render('edit', {
                "content": content
            });
            return;
        });
    }).catch(err => console.log(err));
});

exports.showCookie = functions.region('us-central1').https.onRequest(app);