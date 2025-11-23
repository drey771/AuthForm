// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDzzjjqFTvz2Z9vpptVNOn7xaoHOBan9IE",
  authDomain: "form-auth-fa959.firebaseapp.com",
  projectId: "form-auth-fa959",
  storageBucket: "form-auth-fa959.firebasestorage.app",
  messagingSenderId: "211746447854",
  appId: "1:211746447854:web:99411570a8112c79fdeeff",
  measurementId: "G-STDQ23EEW1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
