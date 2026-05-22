import { db } from './firebase.js';

import {
  collection,
  addDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const workerList = document.getElementById('workerList');

window.addWorker = async function () {

  const name = document.getElementById('workerName').value;
  const phone = document.getElementById('workerPhone').value;
  const skills = document.getElementById('workerSkills').value;

  await addDoc(collection(db, 'workers'), {
    name,
    phone,
    skills
  });

  alert('Worker Added');
};

onSnapshot(collection(db, 'workers'), (snapshot) => {

  workerList.innerHTML = '';

  snapshot.forEach((doc) => {

    const worker = doc.data();

    workerList.innerHTML += `
      <div class="list-item">
        <h3>${worker.name}</h3>
        <p>${worker.phone}</p>
        <p>${worker.skills}</p>
      </div>
    `;
  });
});