// aptitude.js
import { db, auth } from "./firebaseConfig.js";
import { collection, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { logAction } from "./utils.js";

let currentTest = null;
let currentIndex = 0;
let answers = [];

// Load first available test
async function loadDefaultTest() {
  const snapshot = await getDocs(collection(db, 'tests'));
  if (snapshot.empty) {
    document.getElementById('testContainer').innerText = 'No tests available';
    return;
  }
  const docSnap = snapshot.docs[0];
  currentTest = docSnap.data();
  currentTest.id = docSnap.id;
  renderQuestion();
}

// Render the current question
function renderQuestion() {
  const container = document.getElementById('testContainer');
  const q = currentTest.questions[currentIndex];
  container.innerHTML = `
    <h3>Q${currentIndex + 1}. ${q.questionText}</h3>
    <div id="options"></div>
    <p id="hint" style="display:none"><b>Hint:</b> ${q.hint || 'No hint provided'}</p>
  `;
  
  const optionsDiv = document.getElementById('options');
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.innerText = opt;
    btn.addEventListener('click', () => {
      answers[currentIndex] = i;
      nextQuestion();
    });
    optionsDiv.appendChild(btn);
  });

  document.getElementById('controls').innerHTML = `
    <button id="prev">${currentIndex > 0 ? 'Previous' : ''}</button>
    <button id="finish">Finish Test</button>
    <button id="showHint">Show Hint</button>
  `;

  document.getElementById('prev').addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      renderQuestion();
    }
  });
  document.getElementById('finish').addEventListener('click', finishTest);
  document.getElementById('showHint').addEventListener('click', () => {
    document.getElementById('hint').style.display = 'block';
  });
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex < currentTest.questions.length) renderQuestion();
  else finishTest();
}

// Finish test and submit result
async function finishTest() {
  if (!auth.currentUser) {
    alert("Please login to submit your test.");
    return;
  }

  // Calculate score
  let score = 0;
  currentTest.questions.forEach((q, i) => {
    if (answers[i] === q.correctOptionIndex) score++;
  });

  const data = {
    userId: auth.currentUser.uid,
    userEmail: auth.currentUser.email,
    testId: currentTest.id,
    testTitle: currentTest.title,
    score,
    total: currentTest.questions.length,
    answers: answers.map((sel, idx) => ({
      qid: currentTest.questions[idx].qid,
      selected: sel
    })),
    takenAt: serverTimestamp()
  };

  try {
    await addDoc(collection(db, 'results'), data);
    logAction(auth.currentUser.uid, 'test_completed', { testId: currentTest.id, score });
    localStorage.setItem('lastResult', JSON.stringify(data));
    window.location = 'result.html';
  } catch (err) {
    console.error("Error submitting test:", err);
    alert("Failed to submit test. Please try again.");
  }
}

// Only load test if user is logged in
onAuthStateChanged(auth, user => {
  if (!user) {
    document.getElementById('testContainer').innerHTML = `<p>Please login to take the test.</p>`;
    return;
  }
  loadDefaultTest();
});
