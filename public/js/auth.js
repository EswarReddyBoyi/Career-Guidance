// auth.js
import { auth, db } from "./firebaseConfig.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { logAction } from "./utils.js";

const path = window.location.pathname.split("/").pop();

if (path === "signup.html") {
  document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const uid = res.user.uid;
      await setDoc(doc(db, "users", uid), {
        name, email, role: "student", createdAt: serverTimestamp()
      });
      logAction(uid, "signup", { role: "student" });
      window.location = "dashboard.html";
    } catch (err) {
      alert("Signup error: " + err.message);
    }
  });
}

if (path === "college-signup.html") {
  document.getElementById('collegeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const name = document.getElementById('cname').value.trim();
      const email = document.getElementById('cemail').value.trim();
      const password = document.getElementById('cpassword').value;
      const details = document.getElementById('details').value;
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const uid = res.user.uid;
      await setDoc(doc(db, "users", uid), {
        name, email, role: "college", createdAt: serverTimestamp()
      });
      // create a colleges doc
      await setDoc(doc(db, "colleges", uid), {
        name, details, createdBy: uid, createdAt: serverTimestamp()
      });
      logAction(uid, "college-signup", { collegeName: name });
      window.location = "dashboard.html";
    } catch(err) {
      alert("Error: " + err.message);
    }
  });
}

if (path === "index.html") {
  const loginForm = document.getElementById('loginForm');
  const forgotLink = document.getElementById('forgotPassword');
  const msg = document.getElementById('loginMsg');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const psw = document.getElementById('password').value;
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, psw);
      logAction(userCred.user.uid, "login", { email });
      window.location = "dashboard.html";
    } catch (err) {
      msg.style.color = "red";
      msg.textContent = "Login failed: " + err.message;
    }
  });

  forgotLink.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    if (!email) {
      msg.style.color = "red";
      msg.textContent = "Please enter your email to reset password.";
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      msg.style.color = "green";
      msg.textContent = "Password reset email sent. Check your inbox(spam).";
    } catch (err) {
      msg.style.color = "red";
      msg.textContent = "Error: " + err.message;
    }
  });
}

