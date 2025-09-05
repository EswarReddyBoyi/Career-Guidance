// js/admin.js
import { db } from "./firebaseConfig.js";
import { collection, getDocs, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

export async function viewLogs(outputElement){
    const snap = await getDocs(collection(db,'logs'));
    outputElement.innerHTML = `<pre>${JSON.stringify(snap.docs.map(d=>d.data()),null,2)}</pre>`;
}

export function setupCreateTest(outputElement){
    outputElement.innerHTML = `
        <h2>Create New Test</h2>
        <label>Title: <input id="testTitle" placeholder="Test Title"></label><br>
        <label>Description: <input id="testDesc" placeholder="Description"></label><br>
        <label>Duration (seconds): <input id="testDuration" type="number" value="900"></label><br>
        <div id="questionsContainer"></div>
        <button id="addQuestionBtn">Add Question</button>
        <button id="saveTestBtn">Save Test</button>
    `;

    const questionsContainer = document.getElementById('questionsContainer');
    const questions = [];

    document.getElementById('addQuestionBtn').addEventListener('click', ()=>{
        const qDiv = document.createElement('div');
        qDiv.innerHTML = `
            <h4>Question ${questions.length+1}</h4>
            <input placeholder="Question Text" class="qText"><br>
            <input placeholder="Option 1" class="opt"><br>
            <input placeholder="Option 2" class="opt"><br>
            <input placeholder="Option 3" class="opt"><br>
            <input placeholder="Option 4" class="opt"><br>
            <label>Correct Option Index (0-3): <input type="number" class="correctOpt" min="0" max="3"></label><br>
            <input placeholder="Hint (optional)" class="hint"><hr>
        `;
        questionsContainer.appendChild(qDiv);
        questions.push(qDiv);
    });

    document.getElementById('saveTestBtn').addEventListener('click', async ()=>{
        const testTitle = document.getElementById('testTitle').value;
        const testDesc = document.getElementById('testDesc').value;
        const testDuration = parseInt(document.getElementById('testDuration').value);

        const testQuestions = questions.map(qDiv => {
            const qText = qDiv.querySelector('.qText').value;
            const opts = Array.from(qDiv.querySelectorAll('.opt')).map(o=>o.value);
            const correct = parseInt(qDiv.querySelector('.correctOpt').value);
            const hint = qDiv.querySelector('.hint').value || 'No hint';
            return { qid:'q'+Math.random().toString(36).substr(2,5), questionText:qText, options:opts, correctOptionIndex:correct, hint };
        });

        await addDoc(collection(db,'tests'),{
            title:testTitle,
            description:testDesc,
            durationSeconds:testDuration,
            questions:testQuestions,
            createdBy:'admin',
            createdAt:new Date()
        });
        alert('Test Created Successfully!');
    });
}
