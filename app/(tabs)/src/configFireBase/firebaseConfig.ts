import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCWPwFMrE0ldM01ca0PJIczlwLPFGtG83M",
  authDomain: "taskhive-bc387.firebaseapp.com",
  projectId: "taskhive-bc387",
  storageBucket: "taskhive-bc387.firebasestorage.app",
  messagingSenderId: "1068394600063",
  appId: "1:1068394600063:web:bf8711c86d56a3e6c7d14a"
};

const app = initializeApp(firebaseConfig);

export default app;