// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "dimora-55e52.firebaseapp.com",
  projectId: "dimora-55e52",
  storageBucket: "dimora-55e52.firebasestorage.app",
  messagingSenderId: "1069659225426",
  appId: "1:1069659225426:web:1ec863f1b33df957210e8b",
  measurementId: "G-HCBFJRHKY4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);