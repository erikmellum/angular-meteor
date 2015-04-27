Meteor.publish("notes", function (options, searchString) {
  if (searchString == null)
    searchString = '';

  Counts.publish(this, 'numberOfNotes', Notes.find({
    'name' : { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' },
    $or:[
      {$and:[
        {"public": true},
        {"public": {$exists: true}}
      ]},
      {$and:[
        {owner: this.userId},
        {owner: {$exists: true}}
      ]}
  ]}), { noReady: true });
  return Notes.find({
    'name' : { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' },
    $or:[
      {$and:[
        {"public": true},
        {"public": {$exists: true}}
      ]},
      {$and:[
        {owner: this.userId},
        {owner: {$exists: true}}
      ]},
      {$and:[
        {invited: this.userId},
        {invited: {$exists: true}}
      ]}
    ]}, options);
});

Meteor.methods({
    invite: function (noteId, userId) {
      check(noteId, String);
      check(userId, String);
      var note = Notes.findOne(noteId);
        if (!note)
          throw new Meteor.Error(404, "No such note");
        if (note.owner !== this.userId)
          throw new Meteor.Error(404, "No such note");
        if (note.public)
          throw new Meteor.Error(400,
            "That note is public. No need to invite people.");

      if (userId !== note.owner && ! _.contains(note.invited, userId)) {
        Notes.update(noteId, { $addToSet: { invited: userId } });

        var from = contactEmail(Meteor.users.findOne(this.userId));
        var to = contactEmail(Meteor.users.findOne(userId));

        if (Meteor.isServer && to) {
          // This code only runs on the server. If you didn't want clients
          // to be able to see it, you could move it to a separate file.
          Email.send({
            from: "noreply@cloudnote.us",
            to: to,
            replyTo: from || undefined,
            subject: "NOTE: " + note.title,
            text:
              "Hey, I just invited you to '" + note.title + "' on Cloudnote." +
              "\n\nCome check it out: " + Meteor.absoluteUrl() + "\n"
          });
        }
      }
    }
  });

  var contactEmail = function (user) {
    if (user.emails && user.emails.length)
      return user.emails[0].address;
    if (user.services && user.services.facebook && user.services.facebook.email)
      return user.services.facebook.email;
    return null;
  };