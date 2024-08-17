import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUZnvBf7g7wQVAvh5vKgXAu3ZZh5N97oA",
  authDomain: "aiflashcards-28783.firebaseapp.com",
  projectId: "aiflashcards-28783",
  storageBucket: "aiflashcards-28783.appspot.com",
  messagingSenderId: "1008181829367",
  appId: "1:1008181829367:web:fb9e5ae48b9d0aaf7cfdf2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore and get a reference to it

// Function to update user's subscription status in Firestore
export async function updateUserSubscriptionStatus(userId, status) {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, { subscriptionStatus: status });
    console.log(`User ${userId} subscription status updated to: ${status}`);
  } catch (error) {
    console.error("Error updating subscription status:", error);
  }
}

export { db }; // Export the db object for use in other files
