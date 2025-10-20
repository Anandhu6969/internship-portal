// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD-uEYAvM09iDLeyGzq-dQ5EdNt3UMsO2I",
  authDomain: "internship-portal-52d7f.firebaseapp.com",
  projectId: "internship-portal-52d7f",
  storageBucket: "internship-portal-52d7f.firebasestorage.app",
  messagingSenderId: "205811478449",
  appId: "1:205811478449:web:9f8fb96e523ac794401790"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const db = getFirestore(app);
export const auth = getAuth(app);
