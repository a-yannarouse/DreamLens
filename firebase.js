// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage } from "firebase/storage"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);

// Function to add a dream to Firestore
async function addDream(dreamDescription, mood, intensity) {
  try {
    const docRef = await addDoc(collection(firestore, 'dreams'), {
      dreamDescription,
      mood,
      intensity,
      timestamp: new Date(),
    });
    console.log('Dream added with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding dream: ', error);
    throw new Error('Failed to add dream');
  }
}

export { firestore, storage, addDream };