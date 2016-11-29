(function(){
	angular
	.module('main')
	.controller('map_controller', [map_controller]);

	function map_controller() {
		var self = this;
		self.map = map;
		//self.chat = chat;
		
		function map($scope, NgMap, $firebaseArray, Data, Auth, $timeout) {
		

			// add map to scope
			NgMap.getMap().then(function(map) {
				$scope.map = map;
			});
			// pull location data from firebase
			$scope.locations = $firebaseArray(Data.child('locations'));
			
			
			$scope.rooms = $firebaseArray(Data.child('users'));
			var d = new Date();
			var n = d.getDate();
			$scope.posts = $firebaseArray(Data.child('posts'));
			$scope.subjects = ('Computer Science,Biology,Chemistry,History,Psychology,Anthropology,Engineering,Experimental Physics,Mathematics,Mathematical Pysics ').split(',').map(function(subject) {
				return {abbrev: subject};
			});
			var uid = Auth.$getAuth().uid;
			Data.child('users').child(uid).once('value', function(snap) {
				$timeout(function() {
					var item = snap.val();
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
			$scope.openChat=function(item){
				var newChatKey=firebase.database().ref().child('rooms').push().key;
				$scope.uid=item.id;
				console.log($scope.uid);
				$chatroom=Data.child('users').child(Auth.$getAuth().uid).child('chatwith').child($scope.uid).child('roomid').set(newChatKey);
			}

		};
		
		function forum($scope, firebaseUser, $firebaseObject, $firebaseArray, Data) {
			
		};		

	}
	
})();