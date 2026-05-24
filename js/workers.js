import { db, auth } from './firebase.js';

import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const workerList =
  document.getElementById('workerList');

let editingWorkerId = null;

window.addWorker =
async function () {

  const user =
    auth.currentUser;

  if (!user) {

    alert("Please login first");
    return;

  }

  const name =
    document.getElementById('workerName').value;

  const phone =
    document.getElementById('workerPhone').value;

  const skills =
    document.getElementById('workerSkills').value;

  const availability =
    document.getElementById('availability').value;

  if (!name || !phone) {

    alert(
      "Please enter worker name and phone"
    );

    return;

  }

  try {

    if (editingWorkerId) {

      await updateDoc(
        doc(
          db,
          "workers",
          editingWorkerId
        ),
        {
          name: name,
          phone: phone,
          skills: skills,
          availability: availability
        }
      );

      alert(
        "Worker Updated"
      );

      editingWorkerId = null;

      document.getElementById(
        "saveBtn"
      ).innerText =
        "Add Worker";

    } else {

      await addDoc(
        collection(
          db,
          'workers'
        ),
        {
          providerId: user.uid,
          name: name,
          phone: phone,
          skills: skills,
          availability: availability,
          createdAt: new Date()
        }
      );

      alert(
        "Worker Added"
      );

    }

    clearForm();

  } catch (error) {

    alert(error.message);

  }

};

window.editWorker =
function(
  workerId,
  name,
  phone,
  skills,
  availability
) {

  editingWorkerId =
    workerId;

  document.getElementById(
    'workerName'
  ).value = name;

  document.getElementById(
    'workerPhone'
  ).value = phone;

  document.getElementById(
    'workerSkills'
  ).value = skills;

  document.getElementById(
    'availability'
  ).value = availability;

  document.getElementById(
    'saveBtn'
  ).innerText =
    "Update Worker";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

};

window.deleteWorker =
async function(workerId) {

  const confirmDelete =
    confirm(
      "Delete this worker?"
    );

  if (!confirmDelete) {
    return;
  }

  try {

    await deleteDoc(
      doc(
        db,
        "workers",
        workerId
      )
    );

  } catch (error) {

    alert(error.message);

  }

};

function clearForm() {

  document.getElementById(
    'workerName'
  ).value = "";

  document.getElementById(
    'workerPhone'
  ).value = "";

  document.getElementById(
    'workerSkills'
  ).value = "";

  document.getElementById(
    'availability'
  ).value =
    "Available Now";

}

onAuthStateChanged(
  auth,
  (user) => {

  if (!user) {

    window.location.href =
      "login.html";

    return;

  }

  const q =
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

  onSnapshot(
    q,
    (snapshot) => {

    workerList.innerHTML =
      "";

    if (
      snapshot.empty
    ) {

      workerList.innerHTML =
        "<p>No workers added yet.</p>";

      return;

    }

    snapshot.forEach(
      (docSnap) => {

      const worker =
        docSnap.data();

      const workerId =
        docSnap.id;

      let availabilityIcon =
        "🟢";

      if (
        worker.availability ===
        "Unavailable"
      ) {

        availabilityIcon =
          "🔴";

      }

      workerList.innerHTML +=
        `
        <div class="list-item">

          <h3>${worker.name}</h3>

          <p>
            📞 ${worker.phone}
          </p>

          <p>
            🛠 ${worker.skills}
          </p>

          <p>
            ${availabilityIcon}
            ${worker.availability}
          </p>

          <button
            class="btn"
            onclick="editWorker(
              '${workerId}',
              '${worker.name}',
              '${worker.phone}',
              '${worker.skills}',
              '${worker.availability}'
            )">

            Edit

          </button>

          <button
            class="btn"
            onclick="deleteWorker('${workerId}')">

            Delete

          </button>

        </div>
        `;

    });

  });

});