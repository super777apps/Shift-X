import { db, auth } from './firebase.js';

import {
  collection,
  query,
  where,
  onSnapshot
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  onAuthStateChanged
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

onAuthStateChanged(
  auth,
  (user) => {

  if (!user) {

    window.location.href =
      "login.html";

    return;

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

          } else if (
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