import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAuth, Auth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAfsUPF5zpCo5IO_K6XDlbiBvFJhLwCsbY",
  authDomain: "indian-unique-medical-card.firebaseapp.com",
  projectId: "indian-unique-medical-card",
  storageBucket: "indian-unique-medical-card.appspot.com",
  messagingSenderId: "609961268520",
  appId: "1:609961268520:web:97a27c4446f9dc493b6c1d",
  measurementId: "G-GHTHZR4RQ1",
};

// if (!getApps().length) {
const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);
// const analytics: Analytics = getAnalytics(firebaseApp);
// } else {
//   getApp(); // if already initialized, use that one
// }

const db: Firestore = getFirestore(firebaseApp);
const storage: FirebaseStorage = getStorage();
const auth: Auth = getAuth();

export { db, storage, auth };
