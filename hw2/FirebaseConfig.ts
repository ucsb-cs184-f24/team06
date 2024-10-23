// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyByNC5bwN37MgvQfbYetlS5GCPpBjx4qJY",
  authDomain: "rn-auth-d2b11.firebaseapp.com",
  projectId: "rn-auth-d2b11",
  storageBucket: "rn-auth-d2b11.appspot.com",
  messagingSenderId: "472531740019",
  appId: "1:472531740019:web:c7038b473d949221bb5106",
  measurementId: "G-SHB5PZV9XL"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);