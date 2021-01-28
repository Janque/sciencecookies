const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

//Update popularity from RTDB to FSDB
exports.uptPop = functions.region('us-east1').pubsub.schedule('0 0 * * *').onRun((context) => {
    return admin.database().ref('uptCook').once('value', data => {
        if(!data)return null;
        Object.keys(data.val()).forEach(itm => {
            admin.database().ref('galletas/' + itm).once('value', cook => {
                db.collection('galletas').doc(itm).update({
                    pop: cook.val().pop,
                    likes: cook.val().likes,
                    favs: cook.val().favs
                });
                db.collection('galletasCont').doc(itm).update({
                    pop: cook.val().pop
                });
            });
        });
        admin.database().ref('uptCook').remove();
        return null;
    });
});

//Update today's CookieID's
exports.uptIDs = functions.region('us-east1').pubsub.schedule('0 0 * * *').onRun((context) => {
    let t = admin.firestore.Timestamp.now().toDate();
    today = (t.getFullYear() % 100).toString();
    if (t.getMonth() < 9) today += '0';
    today += (t.getMonth() + 1);
    if (t.getDate() < 10) today += '0';
    today += t.getDate();
    return admin.database().ref('tdaysID').set({
        "today": today,
        "last": 0
    }, err => {
        if (err) {
            console.log("Data could not be saved." + err);
        } else {
            console.log("Data saved successfully.");
            return null;
        }
    });
});
