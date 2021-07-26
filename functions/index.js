const admin = require('firebase-admin');
admin.initializeApp({
    databaseURL: "https://science-cookies.firebaseio.com",
    storageBucket: "science-cookies.appspot.com"
});

exports.cookieFeatures = require('./groups/cookieFeatures');
exports.dynCookies = require('./groups/dynCookies');
exports.dynCalendars = require('./groups/dynCalendars');
exports.dynAllCals = require('./groups/dynAllCals');
exports.dynArchive = require('./groups/dynArchive');
exports.maintenance = require('./groups/maintenance');
//exports.manual = require('./groups/manual');//Dev
exports.publish = require('./groups/publish');
exports.sitemap = require('./groups/sitemap');
exports.translations = require('./groups/translations');
exports.users = require('./groups/users');