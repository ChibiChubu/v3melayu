// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFzCb1qZoM3Up25VTopNeh7-qEW4HqSeY",
  authDomain: "promptenhancerveo3.firebaseapp.com",
  projectId: "promptenhancerveo3",
  storageBucket: "promptenhancerveo3.firebasestorage.app",
  messagingSenderId: "873932851824",
  appId: "1:873932851824:web:64b82ad6512985650a82b5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth }; // Kita export `auth` untuk digunakan di tempat lain