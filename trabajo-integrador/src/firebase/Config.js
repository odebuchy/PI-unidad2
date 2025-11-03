// Import the functions you need from the SDKs you need
import app from 'firebase/app';
import firebase from 'firebase';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxZxTt2xbYJil9zx-yUMUinTj6UmLQZ88",
  authDomain: "pi-database-7c57f.firebaseapp.com",
  projectId: "pi-database-7c57f",
  storageBucket: "pi-database-7c57f.firebasestorage.app",
  messagingSenderId: "197480498944",
  appId: "1:197480498944:web:f9901c5b804dad5ad6d5e5"
};

// Initialize Firebase

app.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const storage = app.storage();
export const db = app.firestore();