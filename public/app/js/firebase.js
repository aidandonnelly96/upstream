// Initialize Firebase
var config = {
    apiKey: "AIzaSyBe8TpLgjQ6rDJoSoYkrtwOvJ8yGUe_ZOA",
    authDomain: "cs353-project.firebaseapp.com",
    databaseURL: "https://cs353-project.firebaseio.com",
    storageBucket: "",
    messagingSenderId: "480455815960"
};
firebase.initializeApp(config);
var auth = firebase.auth();
var database = firebase.database();
var storage = firebase.storage();

function saveAnalogData(value) {
	firebase.database().ref('data/').push({
		data: value
	});
}
function signup() {
  var email = document.getElementById('login_email').value;
  var password = document.getElementById('login_password').value;
  if (email.length < 5) {
    alert("Enter a valid email!");
    return;
  }
  if (password.length < 4) {
    alert("this password is too weak!");
    return;
  }
  auth.createUserWithEmailAndPassword(email, password).then(function () {
    alert("registration successful!");
  }).catch(function (error) {
    tries += 1;
    if (tries < 4) {
      signup();
    } else {
      alert("Oops! there was an error!!! take a look at this: \n " + error.message);
    }
  });
}
function GsignIn() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  this.auth.signInWithPopup(provider);
}
function login() {
  alert("what");
  var email=document.getElementById("email").value;
  var password=document.getElementById("pw").value;

  if (email.length < 5) {
    alert("Enter a valid email!");
    return;
  }
  if (password.length < 4) {
    alert("this password is too weak!");
    return;
  }

  auth.signInWithEmailAndPassword(email,password).then(function(){
    alert("sucessful login");
  }, function(error){
    alert('ther was an error logging you in \n Reasonx: ' + error.message);
  });
  return false;
}

function logout(){
  auth.signOut().then(function(){
    alert("its not bye bye but see you again!!!");
  }, function(error){
    alert("It's like we have an unfinished bussiness \n" + error.message);
  });
}

function reset_pass(){
  var email = document.getElementById('login_email').value;

  auth.sendPasswordResetEmail(email).then(function(){
    alert("password reset sent");
  }, function(error){
    alert("password reset failed! \n" + error.message);
  });
}
function initChat(user) {
        // Get a Firebase Database ref
        var chatRef = firebase.database().ref();
        // Create a Firechat instance
        var chat = new FirechatUI(chatRef, document.getElementById("firechat-wrapper"));
        // Set the Firechat user
        chat.setUser(user.uid, "Anon"+user.uid);
		chat._bindForRoomList();
}
auth.onAuthStateChanged(function(user){
  if(user) {
	alert("x");
	initChat(user);
	var currentuser=user;
    // window.location.href = "https://bolbole-3a52b.firebaseapp.com/#";
  } else {
    // window.location.href = "https://bolbole-3a52b.firebaseapp.com/#/user_auth";
    document.getElementById('auth_splash').classList.remove('hide');
  }
});

