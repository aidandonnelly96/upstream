(function(){
	angular
	.module('main')
	.controller('map_controller', [map_controller]);

	function map_controller() {
		var self = this;
		self.map = map;
		//self.chat = chat;
		
		function map($scope, NgMap, $firebaseArray, Data, Auth, $timeout) {
		
			$scope.botmessages="";
			// add map to scope
			NgMap.getMap().then(function(map) {
				$scope.map = map;
			});
			// pull location data from firebase
			$scope.locations = $firebaseArray(Data.child('locations'));
			$scope.find=function(input){
				$scope.input="You: "+input;
				$scope.response="Mubot: "+findanswer(input);
				if($scope.response=="Mubot: undefined"){
					$scope.response="Mubot: Unfortunately, I don't have an answer for that";
				}
				if($scope.response=="Mubot: Hi"){
					$scope.response="Mubot: Hi "+$scope.first_name+"!";
				}
				$scope.botmessages+=$scope.input;
				$scope.botmessages+=$scope.response;
				console.log($scope.botmessages);
			}
			$scope.rooms = $firebaseArray(Data.child('users'));
			var d = new Date();
			var n = d.getDate();
			$scope.posts = $firebaseArray(Data.child('posts'));
			$scope.subjects = ('Computer Science,Biology,Chemistry,History,Psychology,Anthropology,Engineering,Experimental Physics,Mathematics,Mathematical Pysics ').split(',').map(function(subject) {
				return {abbrev: subject};
			});
			$scope.uid = Auth.$getAuth().uid;
			var uid = Auth.$getAuth().uid;
			Data.child('users').child(uid).once('value', function(snap) {
				$timeout(function() {
					var item = snap.val();
					$scope.first_name=item.first_name;
					$scope.name = item.first_name + " " + item.last_name;
				});
			});
			$scope.writeNewPost=function(title, subject, body) {
			  // A post entry.
			  var user = firebase.auth().currentUser;
			  var postData = {
				author: $scope.name,
				date: d,
				uid: user.uid,
				body: body,
				subject: subject,
				title: title,
				starCount: 0,
			  };
			  // Get a key for a new Post.
			  var newPostKey = firebase.database().ref().child('posts').push().key;

			  // Write the new post's data simultaneously in the posts list and the user's post list.
			  var updates = {};
			  updates['/posts/' + newPostKey] = postData;
			  updates['/user-posts/' + user.uid + '/' + newPostKey] = postData;

			  return firebase.database().ref().update(updates);
			}
			
			$scope.addMarker = function(item) {
				
				// display marker and info window
				$scope.location = item;
				$scope.map.showInfoWindow('info', 'marker');

				// dynamic map re-centering
				var coords = new google.maps.LatLng(item.coords.lat, item.coords.lng);
				$scope.map.panTo(coords);

			}

			var tabs = [
				  { title: 'Chat', content: $scope.rooms}
				],
				selected = null,
				previous = null;
				$scope.chattab=tabs[0];
				$scope.tabs = tabs;
				$scope.selectedIndex = 2;
				$scope.$watch('selectedIndex', function(current, old){
				previous = selected;
				selected = tabs[current];
				//if ( old + 1 && (old != current)) $log.debug('Goodbye ' + previous.title + '!');
				//if ( current + 1 )                $log.debug('Hello ' + selected.title + '!');
			});
			$scope.sendMessage=function(id, message){
				var user = firebase.auth().currentUser;
				Data.child('users').child(Auth.$getAuth().uid).child('chatwith').child(id).once('value',function(snapshot){
					var receiverid=snapshot.val();
					console.log(receiverid.id);
					var newMessageKey=firebase.database().ref().child('room-metadata').push().key;
					var messageData={
						sent: d,
						messageid: newMessageKey,
						body: message,
						//sentBy: firebase.database().ref().child('users').child(Auth.$getAuth().uid).child('first_name')
					}
					console.log(newMessageKey);
					var messageupdates={};
					messageupdates['room-metadata/'+receiverid.id+'/messages/'+newMessageKey]=messageData;
					messageupdates['room-metadata/lastmessage']=d;
					return firebase.database().ref().update(messageupdates);
				});
				
			}
			$scope.openChat=function(item){
					var d=new Date();
					$scope.uid=item.id;
					if(!roomNotExist(Auth.$getAuth().uid, item.id)){
						Data.child('users').child(Auth.$getAuth().uid).child('chatwith').child(item.id).once('value',function(snapshot){
							var room=snapshot.val();
							$scope.messages = $firebaseArray(Data.child('room-metadata').child(room.id).child('messages'));
							console.log($scope.messages);
							tabs.push({ title: item.first_name+" "+item.last_name, content: messages, id: item.id, disabled: false});
						});
					}
					//$chatroom=Data.child('users').child(Auth.$getAuth().uid).child('chatwith').child($scope.uid).child('roomid').set(newChatKey);
					else if(roomNotExist(Auth.$getAuth().uid, item.id)){
						var newChatKey = firebase.database().ref().child('rooms').push().key;
						var messages="";
						var chatData={
							created: d.getDate(),
							roomid: newChatKey,
							lastmessage: d.getDate(),
						};
						var chatupdates={};
						tabs.push({ title: item.first_name+" "+item.last_name, content: messages, id: item.id, disabled: false});	
						chatupdates['/users/'+ Auth.$getAuth().uid + '/chatwith/' + item.id + '/id'] = newChatKey;
						chatupdates['/users/'+ item.id + '/chatwith/' + Auth.$getAuth().uid + '/id'] = newChatKey;
						chatupdates['/room-metadata/' + newChatKey] = chatData;
						return firebase.database().ref().update(chatupdates);
					}
				
				var messages=$firebaseArray(Data.child('users').child(Auth.$getAuth().uid).child('chatwith').child(item.id).child('roomid'));
				//$scope.room=$firebaseArray(Data.child('room-metadata').child(messages));
			}
			$scope.setChat=function(item){
				Data.child('users').child(Auth.$getAuth().uid).child('chatwith').child(item).once('value',function(snapshot){
					var room=snapshot.val();
					$scope.messages = $firebaseArray(Data.child('room-metadata').child(room.id).child('messages'));
				});
			}
			var roomNotExist=function(id1, id2){
				Data.child('users').child(id1).child('chatwith').child(id2).once('value',function(snapshot){
					var exists=(snapshot.val()!=null)
					return exists;
				})
			}
			$scope.removeTab = function (tab) {
			  var index = tabs.indexOf(tab);
			  tabs.splice(index, 1);
			};	
		};	
	}
	
})();