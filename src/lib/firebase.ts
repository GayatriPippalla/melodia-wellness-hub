import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDNn9NyG3XXWzTMcbdpRKIXgkcUb-m7B6M",
  authDomain: "melodiawellness-3043f.firebaseapp.com",
  projectId: "melodiawellness-3043f",
  storageBucket: "melodiawellness-3043f.firebasestorage.app",
  messagingSenderId: "74022725152",
  appId: "1:74022725152:web:f83063ae5de5a680a93e45",
  measurementId: "G-SP8RH8K4J7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
