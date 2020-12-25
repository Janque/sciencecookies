const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

//Create user data
exports.createDBDoc = functions.region('us-east1').auth.user().onCreate((user) => {
    let nname = user.displayName;
    if (nname == null) {
        nname = user.email.slice(0, user.email.indexOf('@'));
        admin.auth().updateUser(user.uid, {
            displayName: nname,
        }).then(() => { console.log(nname) }).catch(err => { console.log(err) });
    }
    return db.collection('usersPublic').add({
        visible: true,
        name: nname,
        pic: user.photoURL,
        email: user.email,
        vmail: false,
        favn: [],
        favl: [],
        likedn: [],
        likedl: [],
        vfl: true,
        points: 0,
        rank: '',
        block: admin.firestore.Timestamp.now(),
    }).then(res => {
        return db.collection('users').doc(user.uid).set({
            fav: [],
            liked: [],
            favn: [],
            favl: [],
            likedn: [],
            likedl: [],
            points: 0,
            rank: '',
            publicID: res.id,
            visible: true,
            vemail: false,
            vfl: true,
            rNews: true,
        });
    }).then(() => {
        return db.collection('newsletters').doc('base').update({
            emails: admin.firestore.FieldValue.arrayUnion(user.email),
        });
    }).then(() => { console.log('User with uid ', user.uid, ' created') })
        .catch(err => { console.log('User with uid ', user.uid, ' not created: ', err) });
});

//Delete user data
exports.delDBDoc = functions.region('us-east1').auth.user().onDelete((user) => {
    return db.collection('users').doc(user.uid).get().then(doc => {
        let publicID = doc.data().publicID;
        return db.collection('usersPublic').doc(publicID).delete();
    }).then(() => {
        return db.collection('users').doc(user.uid).delete();
    }).then(() => {
        return db.collection('newsletters').doc('base').update({
            emails: admin.firestore.FieldValue.arrayRemove(user.email),
        });
    }).then(() => { console.log('User with uid ', user.uid, ' deleted') })
        .catch(err => { console.log('User with uid ', user.uid, ' not deleted: ', err) });
});

//Get user public info when view-profile.html
exports.getUserPublic = functions.region('us-east1').https.onCall((data) => {
    return db.collection('usersPublic').doc(data).get().then(doc => {
        if (!doc.exists) return null;
        let userPublic = {
            favn: doc.data().favn,
            favl: doc.data().favl,
            likedn: doc.data().likedn,
            likedl: doc.data().likedl,
            points: doc.data().points,
            rank: doc.data().rank,
            visible: doc.data().visible,
            vemail: doc.data().vemail,
            vfl: doc.data().vfl,
            ppic: doc.data().pic,
            pemail: doc.data().email,
            pname: doc.data().name,
        };
        if (!doc.data().visible) return null;
        if (!doc.data().vemail) userPublic.pemail = null;
        if (!doc.data().vfl) {
            userPublic.favn = null;
            userPublic.favl = null;
            userPublic.likedn = null;
            userPublic.likedl = null;
        }
        return userPublic;
    }).catch(err => { console.log(err) });
});