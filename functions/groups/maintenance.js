const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

//Update popularity from RTDB to FSDB
exports.uptPop = functions.region('us-east1').pubsub.schedule('every 24 hours').onRun((context) => {
    return admin.database().ref('uptCook').once('value', data => {
        Object.keys(data.val()).forEach(itm => {
            admin.database().ref('galletas/' + itm).once('value', cook => {
                db.collection('galletas').doc(itm).update({
                    pop: cook.val().pop,
                    likes: cook.val().likes,
                    favs: cook.val().favs
                });
            });
        });
        admin.database().ref('uptCook').remove();
        return null;
    });
});