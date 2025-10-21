// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBblnw7n6iGLBEq88A41bmj6hj2bRVA9Xk",
  authDomain: "raze-e0182.firebaseapp.com",
  projectId: "raze-e0182",
  storageBucket: "raze-e0182.firebasestorage.app",
  messagingSenderId: "28918634771",
  appId: "1:28918634771:web:ad2386e1f999ba199122e6",
  measurementId: "G-TDCWS3MGQ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// firebase deploy --only hosting:honi-organizer