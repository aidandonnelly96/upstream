(function(){
	angular
	.module('main')
	.controller('dashboard_controller', [dashboard_controller]);

	function dashboard_controller() {
		var self = this;
		self.weather = weather;
		self.map = map;
		self.forum = forum;
		self.chat = chat;
		self.bot = bot;

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
			  var postData = {
				author: $scope.name,
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
				star['users/'+uid+'/starred-posts/'+item.id]=starData;
				
				return firebase.database().ref().update(star);
			}
		};
		
		function chat($scope, $firebaseArray, Data, Auth, $timeout){
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
				window.document.getElementById("chattext").value="";
				var user = firebase.auth().currentUser;
				Data.child('users').child($scope.uid).child('chatwith').child(id).once('value',function(snapshot){
					var receiverid=snapshot.val();
					var newMessageKey=firebase.database().ref().child('room-metadata').push().key;
					var messageData={
						sent: d,
						messageid: newMessageKey,
						body: message,
					}
					var messageupdates={};
					messageupdates['room-metadata/'+receiverid.id+'/messages/'+newMessageKey]=messageData;
					messageupdates['room-metadata/'+receiverid.id+'/lastmessage']=d;
					return firebase.database().ref().update(messageupdates);
				});
				
			}
			$scope.openChat=function(item){
					var d=new Date();
					$scope.receiver=item.id;
					var x=roomNotExist($scope.uid, item.id);
					x.$loaded().then(function(){
						if(x.length==1){
							Data.child('users').child($scope.uid).child('chatwith').child(item.id).once('value',function(snapshot){
								var room=snapshot.val();
								$scope.messages = $firebaseArray(Data.child('room-metadata').child(room.id).child('messages'));
								tabs.push({ title: item.first_name+" "+item.last_name, content: messages, id: item.id, disabled: false});
							});
						}
						else{
							var newChatKey = firebase.database().ref().child('rooms').push().key;
							var messages="";
							var chatData={
								created: d,
								roomid: newChatKey,
								lastmessage: d,
							};
							var chatupdates={};
							tabs.push({ title: item.first_name+" "+item.last_name, content: messages, id: item.id, disabled: false});	
							chatupdates['/users/'+ $scope.uid + '/chatwith/' + item.id + '/id'] = newChatKey;
							chatupdates['/users/'+ item.id + '/chatwith/' + $scope.uid + '/id'] = newChatKey;
							chatupdates['/room-metadata/' + newChatKey] = chatData;
							return firebase.database().ref().update(chatupdates);
					}
					});
				
				var messages=$firebaseArray(Data.child('users').child($scope.uid).child('chatwith').child(item.id).child('roomid'));
			}
			$scope.setChat=function(item){
				Data.child('users').child($scope.uid).child('chatwith').child(item).once('value',function(snapshot){
					var room=snapshot.val();
					$scope.messages = $firebaseArray(Data.child('room-metadata').child(room.id).child('messages'));
				});
			}
			var roomNotExist=function(id1, id2){
				var id=$firebaseArray(Data.child('users').child(id1).child('chatwith').child(id2));
				return id;
			}
			$scope.removeTab = function (tab) {
			  var index = tabs.indexOf(tab);
			  tabs.splice(index, 1);
			};
		};
		
		function bot($scope, $firebaseArray, Data, Auth, $timeout){
			var uid=Auth.$getAuth().uid;
			var d=new Date();
			$scope.find=function(input){
				window.document.getElementById("botquery").value="";
				$scope.input=input;
				$scope.response=findanswer(input);
				if($scope.response=="undefined"){
					$scope.response="Unfortunately, I don't have an answer for that";
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