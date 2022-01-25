const admin = require("firebase-admin");

const serviceAccount = require('./marshmallow-config').data;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin.firestore()