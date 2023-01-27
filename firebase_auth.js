// Import the functions you need from the SDKs you need
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const auth = getAuth(app);

//identify auth action forms
let signUpForm = $('[signup-form]');
let signInForm = $('[signin-form]');
let signOutButton = $('[signout-button]');


//assign event listeners, if the elements exist
if(typeof(signUpForm) !== null) {
  signUpForm.on('submit', handleSignUp);
}
  
if(typeof(signInForm) !== null) {
  signInForm.on('submit', handleSignIn);
}
  
if(typeof signOutButton !== null) {
  signOutButton.on('click', handleSignOut);
}

//handle signUp
function handleSignUp(e) {
  e.preventDefault();
  e.stopPropagation();
    
  const email = $('#signup-email').val();
  const password = $('#signup-password').val();
  
  console.log("email is " + email);
  console.log("password is " + password + ". Now sending to firebase.");
  
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    console.log('user successfully created: ' + user.email)
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    $('#signup-error-message').text(errorMessage);
    console.log(errorMessage);
  });
};

//handle signIn

function handleSignIn(e) {
  e.preventDefault();
  e.stopPropagation();
  
  const email = $('#signin-email').val();
  const password = $('#signin-password').val();
  
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log('user logged in: ' + user.email);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    $('#signin-error-message').text(errorMessage);
    console.log(errorMessage);
  });
}

function handleSignOut() {
  signOut(auth).then(() => {
    console.log('user signed out')
    // Sign-out successful.
  }).catch((error) => {
    const errorMessage = error.message;
    console.log(errorMessage);
    // An error happened.
  });
}


onAuthStateChanged(auth, (user) => {
  let publicElements = $("[data-onlogin='hide']");
  let privateElements = $("[data-onlogin='show']");
  
  if (user) {
  // User is signed in, see docs for a list of available properties			
  const uid = user.uid;
  privateElements.each(function(elem) {
    elem.css("display", "initial");
  });
  
  publicElements.forEach(function(elem) {
    elem.css("display", "none");
  });
  
  console.log(`The current user's UID is equal to ${uid}`);
  // ...
} else {
  // User is signed out
  publicElements.forEach(function(elem) {
    elem.css("display", "initial");
  });
  
  privateElements.forEach(function(elem) {
    elem.css("display", "none");
  });
  // ...
}
});