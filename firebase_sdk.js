const initFirebaseWeb = (firebaseConfig) => {
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";

  const app = initializeApp(firebaseConfig);
}

const firebaseConfig = {
    apiKey: "AIzaSyCZFzUh8qzDJcwoGX5OplmvrGWmPcl23XA",
    authDomain: "hr-corpar-f61cb.firebaseapp.com",
    projectId: "hr-corpar-f61cb",
    storageBucket: "hr-corpar-f61cb.appspot.com",
    messagingSenderId: "762816674322",
    appId: "1:762816674322:web:c57f5c443491f561beb6cb",
    measurementId: "G-5DFSRBYCG2"
};

initFirebaseWeb(firebaseConfig);