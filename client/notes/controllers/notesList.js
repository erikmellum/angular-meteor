angular.module("cloudnote").controller("NoteListController", ['$scope', '$meteor',
    function($scope, $meteor){

      $scope.page = 1;
      $scope.perPage = 3;
      $scope.sort = { name: 1 };
      $scope.orderProperty = '1';

      $scope.notes = $meteor.collection(function() {
        return Notes.find({}, {
          sort : $scope.getReactively('sort')
        });
      });
      
      $meteor.autorun($scope, function() {
        $meteor.subscribe('notes', {
          limit: parseInt($scope.getReactively('perPage')),
          skip: (parseInt($scope.getReactively('page')) - 1) * 
          parseInt($scope.getReactively('perPage')),
          sort: $scope.getReactively('sort')
        }, $scope.getReactively('search')).then(function(){
          $scope.notesCount = $meteor.object(Counts ,'numberOfNotes', false);
        });
      });

      $scope.$watch('orderProperty', function(){
        if ($scope.orderProperty)
          $scope.sort = {name: parseInt($scope.orderProperty)};
      });

      $scope.pageChanged = function(newPage) {
        $scope.page = newPage;
      };

      $scope.remove = function(note){
        $scope.notes.remove(note);
      };

      $scope.removeAll = function(){
        $scope.notes.remove();
      };
    }
  ]);