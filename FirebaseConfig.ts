// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7JySMLGe7HJzc6Ab_LyQJH3zTSR8VoyA",
  authDomain: "ispmedia-79115.firebaseapp.com",
  projectId: "ispmedia-79115",
  storageBucket: "ispmedia-79115.appspot.com",
  messagingSenderId: "472886453357",
  appId: "1:472886453357:web:5abf20f7c777e20741cb64"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);