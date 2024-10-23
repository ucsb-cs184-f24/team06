// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDeMZRZfaNCa2IsG7s_pNS_NzHIr1fVi7Y",
  authDomain: "hello-auth-7469d.firebaseapp.com",
  projectId: "hello-auth-7469d",
  storageBucket: "hello-auth-7469d.appspot.com",
  messagingSenderId: "228408940466",
  appId: "1:228408940466:web:485d1c8c11e0b371a036ab"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
