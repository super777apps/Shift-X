import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getFirestore }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDl3attI4f36AmPCe8-yFaSRC8vC_Quivc",
  authDomain: "shift-x-dad04.firebaseapp.com",
  projectId: "shift-x-dad04",
  storageBucket: "shift-x-dad04.firebasestorage.app",
  messagingSenderId: "447782361568",
  appId: "1:447782361568:web:c6e2d694bd36ceff8cb385"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);