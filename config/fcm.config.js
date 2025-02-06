const admin = require("firebase-admin");
const serviceAccount = require("../fcmServiceAccount.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

module.exports = admin