import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// Helper function to update text in DB
export const saveTextToDB = async (key, htmlContent) => {
  try {
    await set(ref(db, 'content/' + key), htmlContent);
  } catch (error) {
    console.error("Error saving to Firebase:", error);
  }
};

// Helper function to listen for text changes
export const listenToText = (key, callback) => {
  const contentRef = ref(db, 'content/' + key);
  onValue(contentRef, (snapshot) => {
    const data = snapshot.val();
    callback(data); // data can be null if not set yet
  });
};
