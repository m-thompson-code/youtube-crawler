import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

import { crawlerLog } from '../util/debug';
// import { getFirestore, collection, getDocs } from 'firebase/firestore';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWRLeIfbmEMeB3xtiJe5Ypxop9rRHOCb4",
  authDomain: "moo--crawler.firebaseapp.com",
  projectId: "moo--crawler",
  storageBucket: "moo--crawler.appspot.com",
  messagingSenderId: "1078054203761",
  appId: "1:1078054203761:web:ed99c5bf6c13b1ff05c6d0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

crawlerLog('Initalized Firebase');
