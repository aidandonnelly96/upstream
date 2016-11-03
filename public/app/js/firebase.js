// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBT0u-U-mS5G68PdUc6YgzqsuIrsy271-8",
    authDomain: "muhub-28d0a.firebaseapp.com",
    databaseURL: "https://muhub-28d0a.firebaseio.com",
    storageBucket: "muhub-28d0a.appspot.com",
    messagingSenderId: "814875035414"
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

function login() {
  alert("what");
  var email = "aidandonnelly96@hotmail.com";
  var password = "aidand96";

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
        chat.setUser(user.uid, user.displayName);
}

auth.onAuthStateChanged(function(user){
  if(user) {
	document.getElementById("input_3").value=user.uid;
	//initChat(user);
	alert("x");
	document.getElementById("login_email").value=user.uid;
	var currentuser=user;
    // window.location.href = "https://bolbole-3a52b.firebaseapp.com/#";
    document.getElementById('login_email').visibility=hidden;
	document.getElementById('uIcons').style.display=block;
  } else {
	document.getElementById("input_3").value=user.uid;
	document.getElementById('i1').src="http://thinkingonthesethings.com/wp-content/uploads/2015/05/A-FONT.png";
    // window.location.href = "https://bolbole-3a52b.firebaseapp.com/#/user_auth";
	document.getElementById('uIcons').style.visibility=hidden;
    document.getElementById('body').classList.add('inactive');
    document.getElementById('auth_splash').classList.remove('hide');
  }
});


