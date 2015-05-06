angular.module("cloudnote").controller("NoteListController", ['$scope', '$meteor', '$rootScope', '$log',
    function($scope, $meteor, $rootScope, $log){

      $meteor.subscribe('users');
      $scope.noteFormVisible = false;
      $scope.page = 1;
      $scope.perPage = 3;
      $scope.sort = { name: 1 };
      $scope.orderProperty = '1';
      $scope.noteContent = '';
      $scope.noteVisible=false;
      $scope.smallScreen;
      $scope.noteListVisible=true;

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

      $scope.submitNote = function() {
        $scope.newNote.owner=$root.currentUser._id; 
        $scope.notes.push(newNote); 
        $scope.showNoteForm=false;
      }

      $scope.setContents = function(contents) {
        $scope.noteContent=contents;
        $scope.noteVisible=true;
        $scope.hideNoteList();
      }

      $scope.showNote = function() {
        if($scope.noteVisible)
          return true;
        return false;
      }



      $scope.hideNoteList = function () {
        if($scope.smallScreen && $scope.noteVisible){
          $scope.noteListVisible= false;
          console.log("Note List Should be Hiding");
        }
        else {
          console.log("Note List Should be Visible");
          $scope.noteListVisible= true;
        }
      }

      $scope.checkWindowSize = function() {
        if ( $(window).innerWidth() < 768 ) {
          $scope.smallScreen = true;
          console.log("Window size is small");
          $scope.hideNoteList();
        }
        else {
          $scope.smallScreen = false;
          console.log("Window size is not small");
          $scope.hideNoteList();
        }
      }
      $(window).load($scope.checkWindowSize);
      $(window).resize($scope.checkWindowSize);

      $scope.hideNote = function() {
        $scope.noteVisible=false;
        $scope.hideNoteList();
      }

      $scope.showNoteForm = function() {
        $scope.noteFormVisible=true;
      };

      $scope.hideNoteForm = function() {
        $scope.noteFormVisible=false;
      };

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