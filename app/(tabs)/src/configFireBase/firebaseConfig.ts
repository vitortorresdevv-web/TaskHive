import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWPwFMrE0ldM01ca0PJIczlwLPFGtG83M",
  authDomain: "taskhive-bc387.firebaseapp.com",
  projectId: "taskhive-bc387",
  storageBucket: "taskhive-bc387.firebasestorage.app",
  messagingSenderId: "1068394600063",
  appId: "1:1068394600063:web:bf8711c86d56a3e6c7d14a"
};

import { getApps } from "firebase/app";

const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

export default app;

export const auth = getAuth(app);
export const db = getFirestore(app, "taskhive-bc387");