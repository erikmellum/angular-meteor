angular.module("cloudnote").controller("NoteListController", ['$scope', '$meteor', '$rootScope',
    function($scope, $meteor, $rootScope){

      $meteor.subscribe('users');

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

      $scope.getUserById = function(userId){
        return Meteor.users.findOne(userId);
      };

      $scope.pageChanged = function(newPage) {
        $scope.page = newPage;
      };

      $scope.remove = function(note){
        $scope.notes.remove(note);
      };

      $scope.removeAll = function(){
        $scope.notes.remove();
      };

      $scope.creator = function(note){
        if (!note)
          return;
        var owner = $scope.getUserById(note.owner);
        if (!owner)
          return "nobody";

        if ($rootScope.currentUser)
          if ($rootScope.currentUser._id)
            if (owner._id === $rootScope.currentUser._id)
              return "me";

        return owner;
      };

      $scope.invite = function(user){
        $meteor.call('invite', $scope.note._id, user._id).then(
          function(data){
            console.log('success inviting', data);
          },
          function(err){
            console.log('failed', err);
          }
        );
      };
    }


  ]);