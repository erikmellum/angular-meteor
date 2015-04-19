Notes = new Mongo.Collection("notes");

if (Meteor.isClient) {
  angular.module('cloudnote',['angular-meteor', 'ui.router']);
  angular.module("cloudnote").config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
  function($urlRouterProvider, $stateProvider, $locationProvider){

    $locationProvider.html5Mode(true);

    $stateProvider
      .state('notes', {
        url: '/notes',
        templateUrl: 'notes-list.ng.html',
        controller: 'NoteListController'
      })
      .state('noteDetails', {
        url: '/notes/:noteId',
        templateUrl: 'note-details.ng.html',
        controller: 'NoteDetailsController'
      });

      $urlRouterProvider.otherwise("/notes");
  }]);
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
  angular.module("cloudnote").controller("NoteDetailsController", ['$scope', '$stateParams', '$meteor',
  function($scope, $stateParams, $meteor){

    $scope.note = $meteor.object(Notes, $stateParams.noteId, false);

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
  
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Notes.find().count() === 0) {
      var notes = [
        {'name' : 'Super Note #1', 'content' : 'lorem shit bro'},
        {'name' : 'Super Note #2', 'content' : 'shit lorem bro'}
      ];

      for (var i = 0; i < notes.length; i++)
        Notes.insert({name: notes[i].name, content: notes[i].content});

    }
  });
}