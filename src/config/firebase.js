import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyDqhBhLHYthEYyXIdhkPgBi-jvvq4PRqa8",
  authDomain: "water-c492d.firebaseapp.com",
  databaseURL: "https://water-c492d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "water-c492d",
  storageBucket: "water-c492d.firebasestorage.app",
  messagingSenderId: "920828005428",
  appId: "1:920828005428:web:605086ba4f7dc845714e61"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Firebase Realtime Database and get a reference to the service
export const database = getDatabase(app)

export default app
