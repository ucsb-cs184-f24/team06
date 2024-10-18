// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAn9T0jTY66lJDIxbNsHYfHUUd_fD6tXSY",
  authDomain: "oauth-164fa.firebaseapp.com",
  projectId: "oauth-164fa",
  storageBucket: "oauth-164fa.appspot.com",
  messagingSenderId: "525844416273",
  appId: "1:525844416273:web:857653fbf4bce7cea32eb0"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP)
export const FIRESTORE_DB = getFirestore(FIREBASE_APP)