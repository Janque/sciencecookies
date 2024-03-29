const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

//Comment in a Cookie
exports.addComment = functions.region('us-east1').https.onCall((data) => {
    let comCount, comList, comFrm;
    return db.collection('users').doc(data.shortID).get().then(doc => {
        let block = doc.data().block;
        if (block - admin.firestore.Timestamp.now() > 0) {
            return {
                res: -2,
                blc: block,
            };
        }
        else {
            return db.collection('cookies/comments/'+data.id).doc('1').get();
        }
    }).then(doc => {
        if (doc.res == -2) return doc;
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
            shortID: data.shortID,
            id: 0,
            likes: 0,
            text: data.text
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
        return db.collection('cookies/comments/'+data.id).doc('1').set({
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