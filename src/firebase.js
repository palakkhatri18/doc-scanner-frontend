import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBP7aGfyUXuvVMqKLQ_-LCZ2akDhXprv20",
  authDomain: "doc-scanner-app-19a02.firebaseapp.com",
  projectId: "doc-scanner-app-19a02",
  storageBucket: "doc-scanner-app-19a02.firebasestorage.app",
  messagingSenderId: "785502644470",
  appId: "1:785502644470:web:6fce22eaf6141294a124d7"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
