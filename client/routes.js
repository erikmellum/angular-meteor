angular.module("cloudnote").config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
  function($urlRouterProvider, $stateProvider, $locationProvider){

    $locationProvider.html5Mode(true);

    $stateProvider
      .state('notes', {
        url: '/notes',
        templateUrl: 'client/notes/views/notes-list.ng.html',
        controller: 'NoteListController'
      })
      .state('noteDetails', {
        url: '/notes/:noteId',
        templateUrl: 'client/notes/views/note-details.ng.html',
        controller: 'NoteDetailsController'
      });

      $urlRouterProvider.otherwise("/notes");
  }]);