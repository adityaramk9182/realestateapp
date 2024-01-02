// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "realestate-mern-a457c.firebaseapp.com",
  projectId: "realestate-mern-a457c",
  storageBucket: "realestate-mern-a457c.appspot.com",
  messagingSenderId: "293661765180",
  appId: "1:293661765180:web:ea64fd495a5c42d1739d39",
  measurementId: "G-4VY2G8Z037"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);