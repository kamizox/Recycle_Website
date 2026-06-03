const admin = require("firebase-admin");

// Firebase Admin initialize — service account ki zaroorat nahi
// sirf projectId se token verify hoga
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

module.exports = admin;
