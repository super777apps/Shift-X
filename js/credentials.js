import { db, auth } from './firebase.js';

import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  getDocs
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const credentialList =
  document.getElementById('credentialList');

const workerDropdown =
  document.getElementById('worker');

window.addCredential =
async function () {

  const user =
    auth.currentUser;

  if (!user) {

    alert("Please login first");
    return;

  }

  const worker =
    document.getElementById('worker').value;

  const type =
    document.getElementById('credentialType').value;

  const expiryDate =
    document.getElementById('expiryDate').value;

  if (
    !worker ||
    !type ||
    !expiryDate
  ) {

    alert(
      "Please complete all fields"
    );

    return;

  }

  try {

    await addDoc(
      collection(db, 'credentials'),
      {
        providerId: user.uid,
        worker: worker,
        type: type,
        expiryDate: expiryDate,
        createdAt: new Date()
      }
    );

    document.getElementById(
      'credentialType'
    ).value = "";

    document.getElementById(
      'expiryDate'
    ).value = "";

    alert(
      "Credential Saved"
    );

  } catch (error) {

    alert(error.message);

  }

};

function getStatus(
  expiryDate
) {

  const today =
    new Date();

  const expiry =
    new Date(expiryDate);

  const daysRemaining =
    Math.ceil(
      (expiry - today) /
      (1000 * 60 * 60 * 24)
    );

  if (
    daysRemaining < 0
  ) {

    return "🔴 Expired";

  }

  if (
    daysRemaining <= 30
  ) {

    return "🟠 Expiring Soon";

  }

  return "🟢 Valid";

}

onAuthStateChanged(
  auth,
  async (user) => {

  if (!user) {

    window.location.href =
      "login.html";

    return;

  }

  const workersQuery =
    query(
      collection(
        db,
        "workers"
      ),
      where(
        "providerId",
        "==",
        user.uid
      )
    );

  const workersSnapshot =
    await getDocs(
      workersQuery
    );

  workerDropdown.innerHTML =
    `
    <option value="">
      Select Worker
    </option>
    `;

  workersSnapshot.forEach(
    (docSnap) => {

    const worker =
      docSnap.data();

    workerDropdown.innerHTML +=
      `
      <option value="${worker.name}">
        ${worker.name}
      </option>
      `;

  });

  const credentialsQuery =
    query(
      collection(
        db,
        "credentials"
      ),
      where(
        "providerId",
        "==",
        user.uid
      )
    );

  onSnapshot(
    credentialsQuery,
    (snapshot) => {

    credentialList.innerHTML =
      "";

    if (
      snapshot.empty
    ) {

      credentialList.innerHTML =
        `
        <p>
          No credentials added yet.
        </p>
        `;

      return;

    }

    snapshot.forEach(
      (docSnap) => {

      const credential =
        docSnap.data();

      const status =
        getStatus(
          credential.expiryDate
        );

      credentialList.innerHTML +=
        `
        <div class="list-item">

          <h3>
            ${credential.worker}
          </h3>

          <p>
            ${credential.type}
          </p>

          <p>
            Expiry:
            ${credential.expiryDate}
          </p>

          <p>
            ${status}
          </p>

        </div>
        `;

    });

  });

});