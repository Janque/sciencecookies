const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

exports.translateFullCookie = functions.region('us-east1').https.onCall(data => {
    
    return data;
});