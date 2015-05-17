Events = new Meteor.Collection('events');
Events.allow({
  insert: function (userId, event) {
    return true;
  },
  update: function (userId, event) {
    var email = Meteor.users.find({_id: userId}).fetch()[0].emails[0].address;
    return event.ownerId === userId || event.partnerIds.indexOf(userId) !== -1 || event.pendingEmail.indexOf(email) !== -1;
  },
  remove: function (userId, event) {
    return event.ownerId === userId;
  }
});

