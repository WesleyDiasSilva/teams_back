import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();

const serviceAccount: ServiceAccount = {
  projectId: process.env.PROJECT_ID_FIREBASE,
  privateKey: process.env.PRIVATE_KEY_FIREBASE.replace(/\\n/g, '\n'),
  clientEmail: process.env.CLIENT_EMAIL_FIREBASE,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
