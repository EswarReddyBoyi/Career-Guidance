// utils.js
import { db } from "./firebaseConfig.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

export async function logAction(uid, action, details = {}) {
  try {
    await addDoc(collection(db, "logs"), {
      uid: uid || "anonymous",
      action,
      details,
      timestamp: serverTimestamp()
    });
    console.log("Logged:", action, details);
  } catch(e) {
    console.error("Logging failed:", e);
  }
}
