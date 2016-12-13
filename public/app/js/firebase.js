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

