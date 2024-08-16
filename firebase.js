// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDiJYoYPjaALzQYTV2nVe_dPaN94cFRPYE",
  authDomain: "ai-flashcards-4812d.firebaseapp.com",
  projectId: "ai-flashcards-4812d",
  storageBucket: "ai-flashcards-4812d.appspot.com",
  messagingSenderId: "714172926736",
  appId: "1:714172926736:web:858857ea7a97112f3df395",
  measurementId: "G-ZEGBD2H4CQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);