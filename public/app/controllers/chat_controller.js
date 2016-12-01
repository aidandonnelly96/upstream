(function(){
	angular
	.module('main')
	.controller('chat_controller', [chat_controller]);

	function chat_controller() {
		var self = this;
		self.chat = chat;
		
		function chat($scope, $firebaseArray, Data, Auth, $timeout) {
			$scope.rooms = $firebaseArray(Data.child('users'));
			var d = new Date();
			var uid = Auth.$getAuth().uid;
			Data.child('users').child(uid).once('value', function(snap) {
				$timeout(function() {
					var item = snap.val();
					$scope.name = item.first_name + " " + item.last_name;
				});
			});

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
				Data.child('users').child(uid).child('chatwith').child(id).once('value',function(snapshot){
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
					if(!roomNotExist(uid, item.id)){
						Data.child('users').child(uid).child('chatwith').child(item.id).once('value',function(snapshot){
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
						chatupdates['/users/'+ uid + '/chatwith/' + item.id + '/id'] = newChatKey;
						chatupdates['/users/'+ item.id + '/chatwith/' + Auth.$getAuth().uid + '/id'] = newChatKey;
						chatupdates['/room-metadata/' + newChatKey] = chatData;
						return firebase.database().ref().update(chatupdates);
					}
				
				var messages=$firebaseArray(Data.child('users').child(uid).child('chatwith').child(item.id).child('roomid'));
				//$scope.room=$firebaseArray(Data.child('room-metadata').child(messages));
			}
			$scope.setChat=function(item){
				Data.child('users').child(uid).child('chatwith').child(item).once('value',function(snapshot){
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