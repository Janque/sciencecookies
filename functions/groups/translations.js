const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

exports.translateFullCookie = functions.region('us-east1').https.onCall(data => {
    const doc = await db.collection('cookies/langs/'+data.from).doc(data.docId).get();
    let translation={
        cont: [
            {
                type: "head",
                title: title,
                author: [author]
            },
            {
                type: "ref",
                ref: []
            }
        ],
        title: title,
        description: "",
        file: file,
        fixedCats: [],
    };
    
    
    return db.collection('cookies/langs/'+data.target).doc(data.docId).update(translation);
});