const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId({ length: 8 });

//Create user data
exports.createDBDoc = functions.region('us-east1').auth.user().onCreate((user) => {
    let nname = user.displayName;
    if (nname == null) {
        nname = user.email.slice(0, user.email.indexOf('@'));
        admin.auth().updateUser(user.uid, {
            displayName: nname,
        }).then(() => { console.log(nname) }).catch(err => { console.log(err) });
    }
    return db.collection('users').doc(user.uid).set({
        block: admin.firestore.Timestamp.now(),
        fav: [],
        liked: [],
        favn: [],
        favl: [],
        likedn: [],
        likedl: [],
        points: 0,
        rank: '',
        shortID: uid(),
        visible: true,
        vemail: false,
        vfl: true,
        rNews: true,
        name: nname,
        pic: user.photoURL,
        email: user.email,
    }).then(() => {
        return db.collection('newsletters').doc('base').update({
            emails: admin.firestore.FieldValue.arrayUnion(user.email),
        });
    }).then(() => {
        console.log('User with uid ', user.uid, ' created');
    }).catch(err => {
        console.log('User with uid ', user.uid, ' not created: ', err);
    });
});

//Delete user data
exports.delDBDoc = functions.region('us-east1').auth.user().onDelete((user) => {
    return db.collection('users').doc(user.uid).delete().then(() => {
        return db.collection('newsletters').doc('base').update({
            emails: admin.firestore.FieldValue.arrayRemove(user.email)
        });
    }).then(() => {
        console.log('User with uid ', user.uid, ' deleted');
    }).catch(err => {
        console.log('User with uid ', user.uid, ' not deleted: ', err);
    });
});

//Get user public info when view-profile.html
exports.getUserPublic = functions.region('us-east1').https.onCall(async (data) => {
    const snap = await db.collection('users').where('shortID', '==', data).limit(1).get();
    if (snap.empty) return null;
    let doc = snap.docs[0];
    const dat = doc.data();
    let userPublic = {
        favn: dat.favn,
        favl: dat.favl,
        likedn: dat.likedn,
        likedl: dat.likedl,
        points: dat.points,
        rank: dat.rank,
        visible: dat.visible,
        vemail: dat.vemail,
        vfl: dat.vfl,
        ppic: dat.pic,
        pemail: dat.email,
        pname: dat.name,
    };
    if (!dat.visible) return null;
    if (!dat.vemail) userPublic.pemail = null;
    if (!dat.vfl) {
        userPublic.favn = null;
        userPublic.favl = null;
        userPublic.likedn = null;
        userPublic.likedl = null;
    }
    return userPublic;
});