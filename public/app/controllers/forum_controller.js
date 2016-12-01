(function(){
	angular
	.module('main')
	.controller('forum_controller', [forum_controller]);

	function forum_controller() {
		var self = this;
		self.forum = forum;
		
		function forum($scope, $firebaseArray, Data, Auth, $timeout) {
			var d = new Date();
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
		};	
	}
	
})();