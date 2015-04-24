angular.module("cloudnote").controller("NoteDetailsController", ['$scope', '$stateParams', '$meteor',
  function($scope, $stateParams, $meteor){

    $scope.note = $meteor.object(Notes, $stateParams.noteId);
    $scope.users = $meteor.collection(Meteor.users, false).subscribe('users');
    
    var subscriptionHandle;

    $meteor.subscribe('notes').then(function(handle) {
      subscriptionHandle = handle;
    });

    $scope.$on('$destroy', function() {
      subscriptionHandle.stop();
    });

    $scope.save = function() {
      $scope.note.save().then(function(numberOfDocs){
        console.log('save success doc affected ', numberOfDocs);
      }, function(error){
        console.log('save error', error);
      });
    };

    $scope.reset = function() {
      $scope.note.reset();
    };

  }]);