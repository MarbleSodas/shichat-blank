import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDBU8F0i16F51_qYdqn9n7HPa7k5THN_n4",
    authDomain: "shichat-e7a30.firebaseapp.com",
    projectId: "shichat-e7a30",
    storageBucket: "shichat-e7a30.appspot.com",
    messagingSenderId: "949170425841",
    appId: "1:949170425841:web:1b32e1a013f1498ffafe50",
    measurementId: "G-B86QW7R53H"
  };

  let app;

  if (firebase.apps.length === 0){
    app = firebase.initializeApp(firebaseConfig)
  } else {
    app = firebase.app();
  }

  const db = app.firestore();
  const auth = firebase.auth();

  export { db, auth };