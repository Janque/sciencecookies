const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp({
    databaseURL: "https://science-cookies.firebaseio.com"
});

exports.cookieFeatures = require('./groups/cookieFeatures');
exports.dynCookies = require('./groups/dynCookies');
exports.maintenance = require('./groups/maintenance');
exports.publish = require('./groups/publish');
exports.users = require('./groups/users');