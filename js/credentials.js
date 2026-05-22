import { db } from './firebase.js';

import {
  collection,
  addDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const credentialList = document.getElementById('credentialList');

window.addCredential = async function () {

  const worker = document.getElementById('worker').value;
  const type = document.getElementById('credentialType').value;
  const expiryDate = document.getElementById('expiryDate').value;

  await addDoc(collection(db, 'credentials'), {
    worker,
    type,
    expiryDate
  });

  alert('Credential Saved');
};

onSnapshot(collection(db, 'credentials'), (snapshot) => {

  credentialList.innerHTML = '';

  snapshot.forEach((doc) => {

    const credential = doc.data();

    credentialList.innerHTML += `
      <div class="list-item">
        <h3>${credential.worker}</h3>
        <p>${credential.type}</p>
        <p>Expiry: ${credential.expiryDate}</p>
      </div>
    `;
  });
});