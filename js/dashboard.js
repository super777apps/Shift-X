import { db, auth } from './firebase.js';

import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  onAuthStateChanged,
  signOut
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const workerCount =
  document.getElementById("workerCount");

const credentialCount =
  document.getElementById("credentialCount");

const shiftCount =
  document.getElementById("shiftCount");

const expiringCount =
  document.getElementById("expiringCount");

const expiredCount =
  document.getElementById("expiredCount");

const companyNameDisplay =
  document.getElementById("companyNameDisplay");




window.logout = async function () {

  try {

    await signOut(auth);

    alert("Logged out");

    window.location.href = "index.html";

  } catch (error) {

    alert(error.message);

  }

};


onAuthStateChanged(
  auth,
  async (user) => {

  if (!user) {

    window.location.href =
      "index.html";

    return;

  }

  try {

    const userDoc =
      await getDoc(
        doc(
          db,
          "users",
          user.uid
        )
      );

    if (userDoc.exists()) {

      companyNameDisplay.textContent =
        userDoc.data().companyName || "";

    }

  } catch (error) {

    console.log(error);

  }

  onSnapshot(
    query(
      collection(db, "workers"),
      where(
        "providerId",
        "==",
        user.uid
      )
    ),
    (snapshot) => {

      workerCount.textContent =
        snapshot.size;

    }
  );

  onSnapshot(
    query(
      collection(db, "shifts"),
      where(
        "providerId",
        "==",
        user.uid
      )
    ),
    (snapshot) => {

      shiftCount.textContent =
        snapshot.size;

    }
  );

  onSnapshot(
    query(
      collection(db, "credentials"),
      where(
        "providerId",
        "==",
        user.uid
      )
    ),
    (snapshot) => {

      credentialCount.textContent =
        snapshot.size;

      let expiring = 0;
      let expired = 0;

      const today =
        new Date();

      snapshot.forEach(
        (docSnap) => {

          const credential =
            docSnap.data();

          const expiry =
            new Date(
              credential.expiryDate
            );

          const days =
            Math.ceil(
              (
                expiry - today
              ) /
              (
                1000 *
                60 *
                60 *
                24
              )
            );

          if (days < 0) {

            expired++;

          }
          else if (
            days <= 30
          ) {

            expiring++;

          }

        });

      expiringCount.textContent =
        expiring;

      expiredCount.textContent =
        expired;

    }
  );

});