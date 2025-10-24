// auth.js
import { auth, db } from "./firebaseConfig.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { logAction } from "./utils.js";

const path = window.location.pathname.split("/").pop();
// student signup
if (path === "signup.html") {
  const form = document.getElementById('signupForm');
  const msg = document.getElementById('signupMsg');

  form.addEventListener('submit', async (e) => {
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
      msg.style.color = "green";
      msg.textContent = "Signup successful! Redirecting...";
      setTimeout(() => window.location = "dashboard.html", 1500);
    } catch (err) {
      msg.style.color = "red";
      msg.textContent = "Signup error: " + err.message;
    }
  });
}

// college signup
if (path === "college-signup.html") {
  const form = document.getElementById('collegeForm');
  const msg = document.getElementById('collegeMsg');

  form.addEventListener('submit', async (e) => {
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

      await setDoc(doc(db, "colleges", uid), {
        name, details, createdBy: uid, createdAt: serverTimestamp()
      });

      logAction(uid, "college-signup", { collegeName: name });
      msg.style.color = "green";
      msg.textContent = "College registered successfully! Redirecting...";
      setTimeout(() => window.location = "college-dashboard.html", 1500);
    } catch (err) {
      msg.style.color = "red";
      msg.textContent = "Error: " + err.message;
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
      localStorage.setItem('userEmail', userCred.user.email);
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

