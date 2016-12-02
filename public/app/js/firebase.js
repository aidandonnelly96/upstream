// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBe8TpLgjQ6rDJoSoYkrtwOvJ8yGUe_ZOA",
    authDomain: "cs353-project.firebaseapp.com",
    databaseURL: "https://cs353-project.firebaseio.com",
    storageBucket: "cs353-project.appspot.com",
    messagingSenderId: "480455815960"
  };
firebase.initializeApp(config);
var auth = firebase.auth();
var database = firebase.database();
var storage = firebase.storage();
var func=function(){
	console.log("Hey");
}
function initChat(user) {
        // Get a Firebase Database ref
        //var chatRef = firebase.database().ref();
        // Create a Firechat instance
        //var chat = new FirechatUI(chatRef, document.getElementById("firechat-wrapper"));
        // Set the Firechat user
        //chat.setUser(user.uid, user.first_name);
}
auth.onAuthStateChanged(function(user){
  if(user) {
	initChat(user);
    // window.location.href = "https://bolbole-3a52b.firebaseapp.com/#";
  } else {
    // window.location.href = "https://bolbole-3a52b.firebaseapp.com/#/user_auth";
    document.getElementById('auth_splash').classList.remove('hide');
  }
});

