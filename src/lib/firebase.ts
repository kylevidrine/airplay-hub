import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// TODO: Replace with your Firebase project configuration
// Get these from Firebase Console > Project Settings > General > Your apps
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAk876uD9FA1POf0GtXDmSf_NwrQs61UwM",
  authDomain: "kyle-n8n.firebaseapp.com",
  projectId: "kyle-n8n",
  storageBucket: "kyle-n8n.firebasestorage.app",
  messagingSenderId: "312070949651",
  appId: "1:312070949651:web:ad55b50c948d48bb2628e6",
  measurementId: "G-95G9LQ9PYG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
