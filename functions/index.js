const admin = require('firebase-admin');
admin.initializeApp({
    databaseURL: "https://science-cookies.firebaseio.com",
    storageBucket: "science-cookies.appspot.com"
});

exports.cookieFeatures = require('./groups/cookieFeatures');
exports.dynCookies = require('./groups/dynCookies');
exports.dynCalendars = require('./groups/dynCalendars');
exports.dynArchive = require('./groups/dynArchive');
exports.maintenance = require('./groups/maintenance');
exports.publish = require('./groups/publish');
exports.users = require('./groups/users');
exports.sitemap = require('./groups/sitemap');