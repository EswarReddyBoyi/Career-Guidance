import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyBK88tVE-wZ9Wr2eaTxg0JpJ7PH8Zqse68",
  authDomain: "careerguidance-66688.firebaseapp.com",
  projectId: "careerguidance-66688",
  storageBucket: "careerguidance-66688.appspot.com",
  messagingSenderId: "465373265576",
  appId: "1:465373265576:web:0569aae27bddd883a84c9d",
  measurementId: "G-0Y23WR4SGV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ✅ Only initialize analytics if measurementId exists
let analytics = null;
if (firebaseConfig.measurementId) {
  analytics = getAnalytics(app);
}

export { app, analytics };
