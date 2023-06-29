
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBJRgHKuE8CI66kUCvqnJwKMIVlyYQe138",
  authDomain: "notsocial-62e33.firebaseapp.com",
  projectId: "notsocial-62e33",
  storageBucket: "notsocial-62e33.appspot.com",
  messagingSenderId: "852061278149",
  appId: "1:852061278149:web:e4e87ab6d17f25bbd645ac"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider(app);
const db = getFirestore(app);
const storage = getStorage();

export { auth, provider, db, storage};
