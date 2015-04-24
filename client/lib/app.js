angular.module('cloudnote',['angular-meteor', 'ui.router', 'angularUtils.directives.dirPagination']);

function onReady() {
  angular.bootstrap(document, ['cloudnote']);
}

if (Meteor.isCordova)
  angular.element(document).on("deviceready", onReady);
else
  angular.element(document).ready(onReady);