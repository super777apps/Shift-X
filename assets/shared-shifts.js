import { db, auth } from './firebase.js';

import {
  collection,
  query,
  where,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const sharedShiftList =
  document.getElementById("sharedShiftList");

onAuthStateChanged(auth, (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const q = query(
    collection(db, "shifts"),
    where("broadcast", "==", true)
  );

  onSnapshot(q, (snapshot) => {

    sharedShiftList.innerHTML = "";

    if (snapshot.empty) {
      sharedShiftList.innerHTML =
        "<p>No broadcast shifts available.</p>";
      return;
    }

    snapshot.forEach((docSnap) => {

      const shift = docSnap.data();

      const phone = shift.phone || "";
      const email = shift.email || "";

      const whatsappLink = phone
        ? `https://wa.me/${phone.replace("+", "")}`
        : "#";

      sharedShiftList.innerHTML += `
        <div class="list-item">

          <h3>${shift.title}</h3>

          <p>🏢 ${shift.companyName || "Provider"}</p>

          <p>📅 ${shift.date}</p>

          <p>⏰ ${shift.startTime} - ${shift.endTime}</p>

          <p>📍 ${shift.suburb}</p>

          <p>🛠 ${shift.skills}</p>

          <p>${shift.notes}</p>

          <p>Status: ${shift.status}</p>

          <hr>

          <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">

            <a class="btn" href="tel:${phone}">
              📞 Call
            </a>

            <a class="btn" href="${whatsappLink}" target="_blank">
              💬 WhatsApp
            </a>

            <a class="btn" href="mailto:${email}">
              ✉️ Email
            </a>

          </div>

        </div>
      `;
    });

  });

});