import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

window.login = async function() {

  const email =
    document.getElementById("email").value;

  const password =
    document.getElementById("password").value;

  try {

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    alert("Login Successful");

    window.location.href =
      "dashboard.html";

  } catch(error) {

    alert(error.message);

  }

};


document
  .getElementById("forgotPasswordLink")
  .addEventListener("click", async (e) => {

    e.preventDefault();

    const email =
      document.getElementById("email").value.trim();

    if (!email) {

      alert(
        "Please enter your email address first."
      );

      return;
    }

    try {

      await sendPasswordResetEmail(
        auth,
        email
      );

      alert(
        "Password reset email sent. Please check your inbox."
      );

    } catch(error) {

      alert(error.message);

    }

  });