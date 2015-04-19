angular.module("cloudnote").controller("NoteListController", ['$scope', '$meteor',
    function($scope, $meteor){

      $scope.notes = $meteor.collection(Notes);

      $scope.remove = function(note){
        $scope.notes.remove(note);
      };

      $scope.removeAll = function(){
        $scope.notes.remove();
      };
    }
  ]);