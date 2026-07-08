import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJr4jsFwP4gTKs0RjvBYAVMU4VOebcB1A",
  authDomain: "student-work-9e396.firebaseapp.com",
  projectId: "student-work-9e396",
  storageBucket: "student-work-9e396.firebasestorage.app",
  messagingSenderId: "280943423001",
  appId: "1:280943423001:web:8a5c570ba3af7479554488",
  measurementId: "G-KZHDKYG5TM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

// Export services for use in other files
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export { analytics };
