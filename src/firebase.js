// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Gantikan dengan konfigurasi Firebase anda sendiri!
const firebaseConfig = {
  apiKey: "AIzaSyALaPNtAol6uICuySOam3N3ho69F_g_-Zc",
  authDomain: "v3otiga.firebaseapp.com",
  projectId: "v3otiga",
  storageBucket: "v3otiga.firebasestorage.app",
  messagingSenderId: "157406728952",
  appId: "1:157406728952:web:be2bbc251f3737a6c9210d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Untuk Authentication (Log masuk/daftar)
export const db = getFirestore(app); // Untuk Firestore Database (Simpan data sesi)