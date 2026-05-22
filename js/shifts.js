import { db } from './firebase.js';

import {
  collection,
  addDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const shiftList = document.getElementById('shiftList');

window.addShift = async function () {

  const title = document.getElementById('title').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const suburb = document.getElementById('suburb').value;
  const notes = document.getElementById('notes').value;

  await addDoc(collection(db, 'shifts'), {
    title,
    date,
    time,
    suburb,
    notes,
    status: 'Open'
  });

  alert('Shift Added');
};

onSnapshot(collection(db, 'shifts'), (snapshot) => {

  shiftList.innerHTML = '';

  snapshot.forEach((doc) => {

    const shift = doc.data();

    shiftList.innerHTML += `
      <div class="list-item">
        <h3>${shift.title}</h3>
        <p>${shift.date} ${shift.time}</p>
        <p>${shift.suburb}</p>
        <p>Status: ${shift.status}</p>
      </div>
    `;
  });
});