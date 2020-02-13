import * as firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyCTzFLdgow1VtCTFnBRLQXjSG5MoEmozZk",
  authDomain: "mattribution.firebaseapp.com",
  databaseURL: "https://mattribution.firebaseio.com",
  projectId: "mattribution",
  storageBucket: "mattribution.appspot.com",
  messagingSenderId: "438000899734",
  appId: "1:438000899734:web:22ef449927259c278154b7",
  measurementId: "G-NJXC7NDBFW"
};

try {
  firebase.initializeApp(firebaseConfig);
} catch (err) {
  if (!/already exists/.test(err.message)) {
    console.error("Firebase initialization error", err.stack);
  }
}
