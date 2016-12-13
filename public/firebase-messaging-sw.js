importScripts('https://www.gstatic.com/firebasejs/3.4.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.4.0/firebase-messaging.js');

var config = {
	apiKey: "AIzaSyBe8TpLgjQ6rDJoSoYkrtwOvJ8yGUe_ZOA",
	authDomain: "cs353-project.firebaseapp.com",
	databaseURL: "https://cs353-project.firebaseio.com",
	storageBucket: "cs353-project.appspot.com",
	messagingSenderId: "480455815960"
};
firebase.initializeApp(config);
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload){
	const title="Hello world";
	const options={
		body: payload.data.status
	};
	return self.registration.showNotification(title,options);
});