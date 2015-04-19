angular.module("cloudnote").run(["$rootScope", "$state", function($rootScope, $state) {
  $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
    // We can catch the error thrown when the $requireUser promise is rejected
    // and redirect the user back to the main page
    if (error === "AUTH_REQUIRED") {
      $state.go('notes');
    }
  });
}]);

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
        controller: 'NoteDetailsController',
        resolve: {
          "currentUser": ["$meteor", function($meteor){
            return $meteor.requireUser();
          }]
        }
      });

      $urlRouterProvider.otherwise("/notes");
  }]);