export const environment = {
  production: true,
  firebaseConfig: {
    appId: process.env['FIREBASE_APP_ID'],
    apiKey: process.env['FIREBASE_API_KEY'],
    projectId: process.env['FIREBASE_PROJECT_ID'],
    authDomain: process.env['FIREBASE_AUTH_DOMAIN'],
    measurementId: process.env['FIREBASE_MEASUREMENT_ID'],
    storageBucket: process.env['FIREBASE_STORAGE_BUCKET'],
    messagingSenderId: process.env['FIREBASE_MESSAGING_SENDER_ID'],
  },
};
