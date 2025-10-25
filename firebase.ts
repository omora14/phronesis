import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
 
const firebaseConfig = {
  apiKey: "AIzaSyAtmCSA_f5tV_Zu_gIO1IX1HEoXpehhZ7g",
  authDomain: "phronesis-e5608.firebaseapp.com",
  projectId: "phronesis-e5608",
  storageBucket: "phronesis-e5608.firebasestorage.app",
  messagingSenderId: "645433004337",
  appId: "1:645433004337:web:2c21ddacbcabbd30b22010",
  measurementId: "G-5NHJX34KR8"
};
 
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default { auth, db };
