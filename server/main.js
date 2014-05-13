Meteor.startup(function() {
  return Meteor.publish("events", function() {
    var users =  Meteor.users.find().fetch();
    if (users.length) {
    	var email = users[0].emails[0].address;
      return Events.find({$or: [{partnerIds: this.userId}, {pendingEmail: email},{ownerId: this.userId}]});
    }
    return [];
  });
});

Meteor.methods({
  sendShareEmail: function(options) {
    Email.send(options);
  }
});
