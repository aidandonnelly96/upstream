(function(){
	angular
	.module('main')
	.controller('dashboard_controller', [dashboard_controller]);

	function dashboard_controller() {
		var self = this;
		self.weather = weather;
		self.map = map;
		self.forum = forum;
		self.messaging = messaging;
		//self.bot = bot;
		self.timetable=timetable;
		
		function timetable($scope, $firebaseArray, Data, Auth, $timeout){
			//$scope.tabs
			$scope.timetable=$firebaseArray(Data.child('users').child(Auth.$getAuth().uid).child('timetable'))
			$scope.d=new Date();
			$scope.numbers=[0,1,2,3,4,5,6,7,8,9];
			$scope.n=$scope.d.getDay();
			$scope.days = [
				  { title: 'Monday', content: $firebaseArray(Data.child('users').child(Auth.$getAuth().uid).child('timetable').child("Monday"))},
				  { title: 'Tuesday', content: $firebaseArray(Data.child('users').child(Auth.$getAuth().uid).child('timetable').child("Tuesday"))},
				  { title: 'Wednesday', content: $firebaseArray(Data.child('users').child(Auth.$getAuth().uid).child('timetable').child("Wednesday"))},
				  { title: 'Thursday', content: $firebaseArray(Data.child('users').child(Auth.$getAuth().uid).child('timetable').child("Thursday"))},
				  { title: 'Friday', content: $firebaseArray(Data.child('users').child(Auth.$getAuth().uid).child('timetable').child("Friday"))},
				],
				previous = null;
				if($scope.n==6 || $scope.n==0){
					$scope.n=1;
				}
				$scope.selected=$scope.n-1;
		}

		function weather($scope) {

			$scope.day = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][(new Date()).getDay()];

			$.getJSON("http://api.openweathermap.org/data/2.5/forecast?q=Maynooth,ie&units=metric&APPID=22d446acf6fed1e84d9fa2f7eb4a89ac").then(function(wd) {
				$scope.location = (wd.city.name).toString();
				$scope.weather = (wd.list[0].weather[0].main).toString();
				$scope.temp = (wd.list[0].main.temp).toString() + "°C";

				switch ($scope.weather) {
					case "Rain":
					$scope.img = "/app/imgs/rain.svg";
					break;
					case "Drizzle":
					$scope.img = "/app/imgs/rain.svg";
					break;
					case "Clouds":
					$scope.img = "/app/imgs/clouds.svg";
					case "Clear":
					$scope.img = "/app/imgs/clear.svg";
					break;
					case "Snow":
					$scope.img = "/app/imgs/snow.svg";
					break;
					case "Thunderstorm":
					$scope.img = "/app/imgs/thunderstorm.svg";
					break;
					default:
					$scope.img = "/app/imgs/error.svg";
				}
			});
		};

		function map($scope, NgMap, $firebaseArray, Data) {

			// add map to scope
			NgMap.getMap().then(function(map) {
				$scope.map = map;
			});

			// pull location data from firebase
			$scope.locations = $firebaseArray(Data.child('locations'));

			$scope.addMarker = function(item) {
				
				// display marker and info window
				$scope.location = item;
				$scope.map.showInfoWindow('info', 'marker');

				// dynamic map re-centering
				var coords = new google.maps.LatLng(item.coords.lat, item.coords.lng);
				$scope.map.panTo(coords);

			}
		};
//<<<<<<< HEAD
		
		function forum($scope, $firebaseArray, Data, Auth, $timeout){
			var uid=Auth.$getAuth().uid;
			$scope.posts = $firebaseArray(Data.child('posts'));
			$scope.subjects = ('All, Computer Science,Biology,Chemistry,History,Psychology,Anthropology,Engineering,Experimental Physics,Mathematics,Mathematical Pysics ').split(',').map(function(subject) {
				return {abbrev: subject};
			});
			$scope.writeNewPost=function(title, subject, body) {
			  window.document.getElementById("postSubject").selectedIndex=0;
			  window.document.getElementById("postTitle").value="";
			  window.document.getElementById("postBody").value="";
			  // A post entry.
			  var user = firebase.auth().currentUser;
			  
			  // Get a key for a new Post.
			  var newPostKey = firebase.database().ref().child('posts').push().key;
			  var d=new Date();
			  Data.child('users').child(uid).child('first_name').once('value',function(snapshot){
				  $scope.first_name=snapshot.val();
			  });
			  Data.child('users').child(uid).child('last_name').once('value',function(snapshot){
				  $scope.last_name=snapshot.val();
			  });
			  var postData = {
				author: $scope.first_name+" "+$scope.last_name,
				date: d,
				uid: user.uid,
				body: body,
				subject: subject,
				title: title,
				id: newPostKey,
			  };
			  // Write the new post's data simultaneously in the posts list and the user's post list.
			  var updates = {};
			  updates['/posts/' + newPostKey] = postData;

			  return firebase.database().ref().update(updates);
			}
			$scope.viewAll=function(){
				$scope.posts=$firebaseArray(Data.child('posts'));
			}
			$scope.viewStarred=function(){
				$scope.posts=$firebaseArray(Data.child('users').child(uid).child('starred-posts'));
			}
			$scope.star=function(item){
				console.log(item.id)
				var starData={
					author: item.author,
					date: item.date,
					posterId: item.uid,
					body: item.body,
					subject: item.subject,
					title: item.title,
					id: item.id,
				}
				var star={};
				star['users/'+Auth.$getAuth().uid+'/starred-posts/'+item.id]=starData;
				
				return firebase.database().ref().update(star);
			}
		};
		
		/*function chat($scope, $firebaseArray, Data, Auth, $timeout){
			$scope.uid=Auth.$getAuth().uid;
			$scope.rooms = $firebaseArray(Data.child('users'));
			var d = new Date();
			var n = d.getDate();
			var tabs = [
				  { title: 'Chat', content: $scope.rooms}
				],
				selected = null,
				previous = null;
				$scope.chattab=tabs[0];
				$scope.tabs = tabs;
				$scope.selectedIndex = 0;
				$scope.$watch('selectedIndex', function(current, old){
				previous = selected;
				selected = tabs[current];
				//if ( old + 1 && (old != current)) $log.debug('Goodbye ' + previous.title + '!');
				//if ( current + 1 )                $log.debug('Hello ' + selected.title + '!');
			});
			$scope.sendMessage=function(id, message){
				Data.child('users').child($scope.uid).child('first_name').once('value',function(snapshot){
					$scope.first_name=snapshot.val();
				})
				window.document.getElementById("chattext").value="";
				var user = firebase.auth().currentUser;
				Data.child('users').child($scope.uid).child('chatwith').child(id).once('value',function(snapshot){
					var receiverid=snapshot.val();
					var newMessageKey=firebase.database().ref().child('room-metadata').push().key;
					var messageData={
						sent: d,
						messageid: newMessageKey,
						body: message,
						sentBy: $scope.first_name,
=======

		/* Messaging Display Function */

		function messaging($scope, $firebaseArray, $firebaseObject, $timeout, Data, Auth) {

			$scope.current_user_id = Auth.$getAuth().uid;

			var room_list = $firebaseArray(Data.child('users'));
			$scope.users = [];

			// remove current user from list; for display purposes only
			room_list.$loaded()
			.then(function(){
				angular.forEach(room_list, function(user, uid) {
					uid = $scope.current_user_id;
					if (user.id != uid) {
						$scope.users.push(user);
					}
				});
			});

			// set up tab configurations
			var tabs = [{ title: 'Contacts', content: $scope.users}];
			selected = 0,
			previous = null;
			$scope.tabs = tabs;
			$scope.contacts=tabs[0];
			$scope.tab_state = false;
			$scope.contact_tab_state = false;
			$scope.bot_tab_state = false;

			// change tab state for ng-show in DOM
			$scope.changeTabState = function(bool) { $scope.tab_state = bool; $scope.bot_tab_state = false; $scope.contact_tab_state = false;  }
			$scope.changeBotState = function(bool) { $scope.bot_tab_state = bool; $scope.tab_state=false; $scope.contact_tab_state=false;}
			$scope.changeContactState = function(bool) { $scope.contact_tab_state = bool; $scope.tab_state=false; $scope.bot_tab_state=false;}

			$scope.openMessaging = function(item) { 

				//capture recipient when message tab opened
				$scope.recipient = item.first_name + " " + item.last_name;
				$scope.recipient_id = item.id;

				// create rooms node in firebase
				var rooms = $firebaseArray(Data.child("rooms"));
				
				// check whether room previously created; if not, create
				rooms.$loaded().then(function(){
					var bool = false;
					Data.child('rooms').once('value', function(snapshot) {
						snapshot.forEach(function(itemSnapshot) {
							var data = itemSnapshot.val();
							// FALSE IFF (current user OR recipient) is (initiator OR recipient)
							if (($scope.current_user_id == data.initiator && $scope.recipient_id == data.recipient)) { 
								bool = true;
							}
							else if (($scope.recipient_id == data.initiator) && ($scope.current_user_id == data.recipient)) {
								bool = true;
							}
						});
						// add room to firebase if conditions satisfied
						if (!bool) {
							rooms.$add({
								initiator: $scope.current_user_id,
								recipient: $scope.recipient_id
							});
						}
					});
				}).catch(function(error) {
					console.error("Error:", error);
				});	

				function sendMessage(message) {

					// create room_metadata in firebase
					var room_metadata = $firebaseArray(Data.child("room_metadata"));

					room_metadata.$loaded().then(function(){

						Data.child('users').child($scope.current_user_id).once('value', function(snap) {
							$scope.current_user_name = snap.val().first_name + " " + snap.val().last_name;

							Data.once('value', function() {
								room_metadata.$add({
									sender: $scope.current_user_name,
									receiver: $scope.recipient,
									message: message
								}).then(function(ref) {
									// push latest message to message_objs
									$scope.message_objs.push({message :message, sender: $scope.current_user_name});
								})
							});
						});

					}).catch(function(error) {
						console.error("Error:", error);
					});	

				}

				$scope.message = { text: null };

				// validation done in DOM - submit() posts message to firebase & clears input
				$scope.submit = function(form) {
					console.log(form);
					if ($scope.message.text) {
						console.log($scope.message.text);
						sendMessage($scope.message.text);

						$scope.message.text = '';
						form.$setPristine();
						form.$setUntouched();
					}
				};

				var messages = $firebaseObject(Data.child('room_metadata'));
				$scope.message_objs = [];

				messages.$loaded()
				.then(function() {
					Data.child('users').child($scope.current_user_id).once('value', function(item) {
						$scope.current_user_name = item.val().first_name + " " + item.val().last_name;

						// only display messages with current_user and recipient members
						Data.child('room_metadata').once('value', function(data) {
							data.forEach(function(itemSnapshot) {
								if (($scope.current_user_name == itemSnapshot.val().sender) && ($scope.recipient == itemSnapshot.val().receiver)) {
									$scope.message_objs.push({message :itemSnapshot.val().message, sender: itemSnapshot.val().sender});
								}
								else if (($scope.recipient === itemSnapshot.val().sender) && ($scope.current_user_name === itemSnapshot.val().receiver)) {
									$scope.message_objs.push({message :itemSnapshot.val().message, sender: itemSnapshot.val().sender});
								}
							});

						}).catch(function(error) {
							console.error("Error:", error);
						});	
					});
				});
				
				// dynamic user chat tab
				if ($scope.tabs.length == 1) {
					$scope.tabs.push({ title: $scope.recipient, content: $scope.message_objs, disabled: false});
				}
				// check if tab is already open and if the tab has a different title
				else if ($scope.tabs.length == 2 && $scope.tabs[1].title != $scope.recipient) {
					$scope.tabs.splice(1);
					$scope.tabs.push({ title: $scope.recipient, content: $scope.message_objs, disabled: false});
				}
			};
			var uid=Auth.$getAuth().uid;
			var d=new Date();
			$scope.botmessages=$firebaseArray(Data.child('users').child(uid).child('chatbot'));
			$scope.find=function(input){
				console.log("xxx"+input);
				//window.document.getElementById("botquery").value="";
				$scope.input=input;
				$scope.response=findanswer(input);
				if($scope.response=="undefined"){
					$scope.response="Unfortunately, I don't have an answer for that";
				}
				else if($scope.response=="Hi"){
					Data.child('users').child(uid).child('first_name').once('value',function(snapshot){
						$scope.first_name=snapshot.val();
					})
					$scope.response="Hi "+$scope.first_name;
				}
				var chatBotKey=firebase.database().ref().child('users').push().key;
				var inputData={
					userInput: $scope.input, 
					response: $scope.response, 
					date: d,
					sentBy: "You",
				}
				$scope.input="You: "+input;
				$scope.response="MUBot: "+$scope.response;
				$scope.botmessages=$firebaseArray(Data.child('users').child(uid).child('chatbot'));
				var chatbotupdates = {};
				chatbotupdates['/users/' + uid + '/chatbot/' + chatBotKey] = inputData;
				return firebase.database().ref().update(chatbotupdates);
			}
		$scope.setBot=function(){
			$scope.botmessages=$firebaseArray(Data.child('users').child(uid).child('chatbot'));
		 }
		}
	}
	
})();