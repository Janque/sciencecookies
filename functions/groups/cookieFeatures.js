const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

exports.formatDB = functions.region('us-central1').https.onRequest((req, res) => {
    return db.collection('galletas').get().then(snap => {
        const promises = [];
        snap.forEach(doc => {
            promises.push(db.collection('galletasCont').doc(doc.id).get().then(doc2 => {
                return db.collection('cookies/langs/es').doc(doc.id).set({
                    authors: doc2.data().authors,
                    cont: doc2.data().authors,
                    media: doc2.data().media,
                    picUrl: doc2.data().picUrl,
                    title: doc.data().title,
                    description: doc2.data().description,
                    file: doc2.data().file,
                    owner: doc2.data().owner,
                    java: doc2.data().java,
                    revised: [],
                    notify: false,
                    public: doc2.data().public,
                    beenPublic: doc2.data().beenPublic,
                    dledit: false,
                    created: doc2.data().created,
                    ledit: doc2.data().ledit,
                    published: doc2.data().published,
                    pop: doc.data().pop,
                    likes: doc.data().likes,
                    favs: doc.data().favs,
                    url: doc.data().url + '/',
                    cats: doc.data().cats,
                    translations: {},
                    old: true
                }).then(() => {
                    return db.collection('cookies/langs/en').doc(doc.id).set({
                        authors: doc2.data().authors,
                        cont: [
                            {
                                type: "head",
                                title: doc2.data().title,
                                author: doc2.data().authors
                            },
                            {
                                type: "ref",
                                ref: []
                            }
                        ],
                        media: doc2.data().media,
                        picUrl: doc2.data().picUrl,
                        title: doc.data().title,
                        description: doc2.data().description,
                        file: doc2.data().file,
                        owner: doc2.data().owner,
                        java: doc2.data().java,
                        revised: [],
                        notify: false,
                        public: doc2.data().public,
                        beenPublic: doc2.data().beenPublic,
                        dledit: false,
                        created: doc2.data().created,
                        ledit: doc2.data().ledit,
                        published: doc2.data().published,
                        pop: doc.data().pop,
                        likes: doc.data().likes,
                        favs: doc.data().favs,
                        url: doc.data().url + '/',
                        cats: doc.data().cats,
                        translations: {},
                        old: true
                    });
                });
            }));
        });
        return Promise.all(promises);
    }).then(() => {
        console.log("exito");
        return null;
    }).catch(err => console.log(err));
});
exports.formatDBC = functions.region('us-central1').https.onRequest((req, res) => {
    return db.collection('calendarios').get().then(snap => {
        const promises = [];
        snap.forEach(doc => {
            promises.push(db.collection('calendars/langs/es').doc(doc.id).set({
                events: doc.data().events,
                published: doc.data().date,
                description: doc.data().description,
                descriptionShort: doc.data().descriptionShort,
                finished: doc.data().finished,
                pastDue: doc.data().pastDue,
                picUrl: doc.data().picUrl,
                picAlt: doc.data().picAlt,
                picCapt: doc.data().picCapt,
                public: doc.data().public,
                sentMail: doc.data().sentMail,
                revised: doc.data().revised,
                title: doc.data().title,
                url: doc.data().url + '/',
                nextCal: doc.data().nextCal + '/',
                priorCal: doc.data().priorCal + '/',
                old: true
            }).then(() => {
                return db.collection('calendars/langs/en').doc(doc.id).set({
                    events: doc.data().events,
                    published: doc.data().date,
                    description: doc.data().description,
                    descriptionShort: doc.data().descriptionShort,
                    finished: doc.data().finished,
                    pastDue: doc.data().pastDue,
                    picUrl: doc.data().picUrl,
                    picAlt: doc.data().picAlt,
                    picCapt: doc.data().picCapt,
                    public: doc.data().public,
                    sentMail: doc.data().sentMail,
                    revised: doc.data().revised,
                    title: doc.data().title,
                    url: doc.data().url + '/',
                    nextCal: doc.data().nextCal + '/',
                    priorCal: doc.data().priorCal + '/',
                    old: true
                });
            }));
        });
        return Promise.all(promises);
    }).then(() => {
        console.log("exito");
        return null;
    }).catch(err => console.log(err));
});

//Comment in a Cookie
exports.addComment = functions.region('us-east1').https.onCall((data) => {
    let comCount, comList, comFrm;
    return db.collection('usersPublic').doc(data.authKey).get().then(doc => {
        let block = doc.data().block;
        if (block - admin.firestore.Timestamp.now() > 0) {
            return {
                res: -2,
                blc: block,
            };
        }
        else {
            return db.collection('galletas').doc(data.id).collection('coms').doc('1').get();
        }
    }).then(doc => {
        if (doc.res == -2) return doc;
        console.log(doc);
        if (doc.exists) {
            comList = doc.data().coms;
            comCount = doc.data().comCount;
        } else {
            comCount = 0;
            comList = [];
        }
        comFrm = {
            from: data.from,
            pic: data.pic,
            authKey: data.authKey,
            id: 0,
            likes: 0,
            text: data.text,
        };
        if (data.to == -1) {
            comFrm.reps = [];
            comFrm.id = comList.length;
            comList.push(comFrm);
        } else {
            comFrm.id = comList[data.to].reps.length;
            comList[data.to].reps.push(comFrm);
        }
        comCount++;
        return db.collection('galletas').doc(data.id).collection('coms').doc('1').set({
            coms: comList,
            comCount: comCount,
        });
    }).then(some => {
        console.log(some);
        if (some != null && some.res == -2) return some;
        if (data.to == -1) {
            return {
                res: 0,
                pos: comList.length - 1,
                com: comFrm,
            };
        } else {
            return {
                res: 1,
                pos: data.to,
                com: comFrm,
            };
        }
    }).catch(err => {
        console.log(err);
        return { res: -1 };
    });
});