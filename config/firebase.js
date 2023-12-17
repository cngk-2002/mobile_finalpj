// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth} from 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGHA7hXUZO11kqUNXXKOHdxQzD2wJG1Tg",
  authDomain: "ie307-ea69a.firebaseapp.com",
  projectId: "ie307-ea69a",
  storageBucket: "ie307-ea69a.appspot.com",
  messagingSenderId: "372654643784",
  appId: "1:372654643784:web:6bbea183d4e8e2443e967d"
};
// these keys won't work because i've removed the app from firebase
// add your app on firebase, copy firebaseConfig here, enable email/password auth
// and test the app ;)

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);