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