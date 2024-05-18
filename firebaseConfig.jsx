// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyChezNdFbVsWlMDSpKuPANvJkQMP6_uAQU",
  authDomain: "final-year-project-a8584.firebaseapp.com",
  projectId: "final-year-project-a8584",
  storageBucket: "final-year-project-a8584.appspot.com",
  messagingSenderId: "82404193530",
  appId: "1:82404193530:web:5dafdcfc878c2ce1b40543",
  measurementId: "G-30P2YJ4EX0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics();