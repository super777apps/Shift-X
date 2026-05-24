import { db, auth } from './firebase.js';

import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc
}


from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const shiftList =
  document.getElementById('shiftList');

window.addShift =
async function () {

  const user =
    auth.currentUser;

  if (!user) {
    alert("Please login first");
    return;
  }

  const userDoc =
    await getDoc(
      doc(
        db,
        "users",
        user.uid
      )
    );

  const companyName =
    userDoc.data()?.companyName || "";

const phone = userDoc.data()?.phone || "";
const email = userDoc.data()?.email || "";



  const title =
    document.getElementById('title').value;

  const date =
    document.getElementById('date').value;

  const startTime =
    document.getElementById('startTime').value;

  const endTime =
    document.getElementById('endTime').value;

  const suburb =
    document.getElementById('suburb').value;

  const skills =
    document.getElementById('skills').value;

  const notes =
    document.getElementById('notes').value;

  if (
    !title ||
    !date ||
    !startTime ||
    !endTime
  ) {

    alert(
      "Please complete all required fields"
    );

    return;

  }

  try {

  const editId =
    document.getElementById(
      "editShiftId"
    ).value;

  if (editId) {

    await updateDoc(
      doc(
        db,
        "shifts",
        editId
      ),
      {
        title,
        date,
        startTime,
        endTime,
        suburb,
        skills,
        notes,
        broadcast:
          document.getElementById(
            "broadcast"
          ).checked
      }
    );

    alert(
      "Shift Updated"
    );

    document.getElementById(
      "editShiftId"
    ).value = "";

    document.getElementById(
      "saveShiftBtn"
    ).innerText =
      "Create Shift";

  } else {

    await addDoc(
      collection(db, 'shifts'),
      {
        providerId: user.uid,

        companyName:
          companyName,
          
          phone: phone,
email: email,
          

        title: title,

        date: date,

        startTime: startTime,

        endTime: endTime,

        suburb: suburb,

        skills: skills,

        notes: notes,

        status: "Open",

        assignedWorker: "",

        broadcast:
          document.getElementById(
            "broadcast"
          ).checked,

        createdAt:
          new Date()
      }
    );

    document.getElementById('title').value = "";
    document.getElementById('date').value = "";
    document.getElementById('startTime').value = "";
    document.getElementById('endTime').value = "";
    document.getElementById('suburb').value = "";
    document.getElementById('skills').value = "";
    document.getElementById('notes').value = "";

    alert("Shift Created");
  }
    
    

  } catch (error) {

    alert(error.message);

  }

};

window.assignWorker =
async function (
  shiftId
) {

  const dropdown =
    document.getElementById(
      `worker-${shiftId}`
    );

  const workerName =
    dropdown.value;

  if (!workerName) {

    alert(
      "Please select a worker"
    );

    return;

  }

  try {

    await updateDoc(
      doc(
        db,
        "shifts",
        shiftId
      ),
      {
        assignedWorker:
          workerName,
        status:
          "Assigned"
      }
    );

    alert(
      "Worker Assigned"
    );

  } catch (error) {

    alert(error.message);

  }

};


window.editShift = function (
  shiftId,
  title,
  date,
  startTime,
  endTime,
  suburb,
  skills,
  notes,
  broadcast
) {

  document.getElementById(
    "editShiftId"
  ).value = shiftId;

  document.getElementById(
    "title"
  ).value = title;

  document.getElementById(
    "date"
  ).value = date;

  document.getElementById(
    "startTime"
  ).value = startTime;

  document.getElementById(
    "endTime"
  ).value = endTime;

  document.getElementById(
    "suburb"
  ).value = suburb;

  document.getElementById(
    "skills"
  ).value = skills;

  document.getElementById(
    "notes"
  ).value = notes;

  document.getElementById(
    "broadcast"
  ).checked = broadcast;

  document.getElementById(
    "saveShiftBtn"
  ).innerText =
    "Update Shift";

};

window.deleteShift =
async function (
  shiftId
) {

  if (
    !confirm(
      "Delete this shift?"
    )
  ) return;

  try {

    await deleteDoc(
      doc(
        db,
        "shifts",
        shiftId
      )
    );

    alert(
      "Shift Deleted"
    );

  } catch (error) {

    alert(
      error.message
    );

  }

};


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

  let workerOptions =
    '<option value="">Select Worker</option>';

  workersSnapshot.forEach(
    (docSnap) => {

      const worker =
        docSnap.data();

      workerOptions += `
        <option value="${worker.name}">
          ${worker.name}
        </option>
      `;

    });

  const shiftsQuery =
    query(
      collection(
        db,
        "shifts"
      ),
      where(
        "providerId",
        "==",
        user.uid
      )
    );

  onSnapshot(
    shiftsQuery,
    (snapshot) => {

      shiftList.innerHTML =
        "";

      if (
        snapshot.empty
      ) {

        shiftList.innerHTML =
          "<p>No shifts created yet.</p>";

        return;

      }

      snapshot.forEach(
        (docSnap) => {

          const shift =
            docSnap.data();

          const shiftId =
            docSnap.id;

          shiftList.innerHTML +=
            `
            <div class="list-item">

              <h3>
                ${shift.title}
              </h3>

              <p>
                🏢
                ${shift.companyName || ""}
              </p>

              <p>
                📅 ${shift.date}
              </p>

              <p>
                ⏰ ${shift.startTime}
                -
                ${shift.endTime}
              </p>

              <p>
                📍 ${shift.suburb}
              </p>

              <p>
                🛠 ${shift.skills}
              </p>

              <p>
                ${shift.notes}
              </p>

              <p>
                Status:
                ${shift.status}
              </p>

              <p>
                Assigned Worker:
                ${shift.assignedWorker || "None"}
              </p>

              <select
                id="worker-${shiftId}">

                ${workerOptions}

              </select>

              <br><br>

            <button
  class="btn"
  onclick="assignWorker('${shiftId}')">

  Assign Worker

</button>

<br><br>

<button
  class="btn"
  onclick="editShift(
    '${shiftId}',
    '${shift.title || ""}',
    '${shift.date || ""}',
    '${shift.startTime || ""}',
    '${shift.endTime || ""}',
    '${shift.suburb || ""}',
    '${shift.skills || ""}',
    '${shift.notes || ""}',
    ${shift.broadcast || false}
  )">

  Edit

</button>

<button
  class="btn"
  onclick="deleteShift('${shiftId}')">

  Delete

</button>

            </div>
            `;

        });

    });

});