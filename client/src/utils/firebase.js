// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "suviai-9548.firebaseapp.com",
  projectId: "suviai-9548",
  storageBucket: "suviai-9548.firebasestorage.app",
  messagingSenderId: "1042103532753",
  appId: "1:1042103532753:web:097227d0b61be0d25d59f0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app) 
const provider = new GoogleAuthProvider()

export {auth,provider}