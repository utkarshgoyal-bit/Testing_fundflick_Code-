import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import safeJson from '../util/safeJsonParse';

import { default as Logger } from '../lib/logger';

dotenv.config();

const serviceAccount = safeJson(process.env.FIREBASE_SERVICE_ACCOUNT);

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (error) {
  Logger.error('Firebase', error);
}

export const firebaseMessaging = admin.messaging();
