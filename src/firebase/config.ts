import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyB4Ld8-p3z-rwDfJpuIxfPASsC2DshAM10",
  authDomain: "greaclos-one.firebaseapp.com",
  projectId: "greaclos-one",
  storageBucket: "greaclos-one.appspot.com",
  messagingSenderId: "331401141584",
  appId: "1:331401141584:web:cf7211ea4fdb64b0c9a055",
  databaseURL:
    "https://greaclos-one-default-rtdb.europe-west1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

export default app;
