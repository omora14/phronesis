import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0EiBLuigjrsNXH0V7XGnwd0F6t9wUvnA",
  authDomain: "phronesis-ae1e7.firebaseapp.com",
  projectId: "phronesis-ae1e7",
  storageBucket: "phronesis-ae1e7.firebasestorage.app",
  messagingSenderId: "410759864859",
  appId: "1:410759864859:web:5e11d0ea06d37a6de08ebe",
  measurementId: "G-Q0Q621C18S",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
