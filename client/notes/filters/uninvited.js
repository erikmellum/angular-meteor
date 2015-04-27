angular.module("cloudnote").filter('uninvited', function () {
  return function (users, note) {
    if (!note)
      return false;

    return _.filter(users, function (user) {
      if (user._id == note.owner ||
          _.contains(note.invited, user._id))
        return false;
      else
        return true;
    });
  }
});