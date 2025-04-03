// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore' 
const {
    VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET,
    VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID,
} = import.meta.env
const firebaseConfig = {
    apiKey: "AIzaSyB06IzAT_ADI94qzYUZIjpQ2g0YiIYN7nI",
    authDomain: "flickflare-302ca.firebaseapp.com",
    projectId: "flickflare-302ca",
    storageBucket: "flickflare-302ca.firebasestorage.app",
    messagingSenderId: "752079326095",
    appId: "1:752079326095:web:5650c0d57b07ca4c3019fa",
    measurementId: "G-BYT23JGMGW"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const db=getFirestore(app);