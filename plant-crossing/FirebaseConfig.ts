// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCQh_8HbVKb-gtmEtHij3GrLhCEPx0ddVs",
    authDomain: "plant-crossing.firebaseapp.com",
    projectId: "plant-crossing",
    storageBucket: "plant-crossing.appspot.com",
    messagingSenderId: "476006085986",
    appId: "1:476006085986:web:941004a088a0ed511ea83b"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);