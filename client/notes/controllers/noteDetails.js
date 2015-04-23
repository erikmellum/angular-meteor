angular.module("cloudnote").controller("NoteDetailsController", ['$scope', '$stateParams', '$meteor',
  function($scope, $stateParams, $meteor){

    $scope.note = $meteor.object(Notes, $stateParams.noteId, false).subscribe('notes');;
    $scope.users = $meteor.collection(Meteor.users, false).subscribe('users');
    
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