/**
 * Firebase Admin SDK initialization.
 * Used for server-side verification of phone OTP tokens.
 */

const admin = require("firebase-admin");
const logger = require("../utils/logger");

const serviceAccount = require("../../firebase-service-account.json");

let firebaseApp = null;
let firebaseAuth = null;

function initializeFirebase() {
  try {
    if (admin.apps.length > 0) {
      firebaseApp = admin.apps[0];
    } else {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      logger.info("✅ Firebase Admin SDK initialized");
    }

    firebaseAuth = admin.auth();
    return firebaseAuth;
  } catch (error) {
    logger.error(`❌ Firebase initialization failed: ${error.message}`);
    return null;
  }
}

async function verifyFirebaseToken(idToken) {
  if (!firebaseAuth) {
    logger.warn(
      "Firebase not configured – using placeholder token verification",
    );

    return {
      uid: `placeholder_${Date.now()}`,
      phone_number: "+910000000000",
    };
  }

  return firebaseAuth.verifyIdToken(idToken);
}

async function getOrCreateFirebaseUser(phone) {
  if (!firebaseAuth) {
    return {
      uid: `placeholder_${Date.now()}`,
      phoneNumber: phone,
    };
  }

  try {
    const user = await firebaseAuth.getUserByPhoneNumber(phone);
    return user;
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      const newUser = await firebaseAuth.createUser({
        phoneNumber: phone,
      });

      return newUser;
    }

    throw error;
  }
}

module.exports = {
  initializeFirebase,
  verifyFirebaseToken,
  getOrCreateFirebaseUser,
};
