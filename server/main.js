Meteor.startup(function() {
  return Meteor.publish("events", function() {
  	var email = Meteor.users.find().fetch()[0].emails[0].address;
    return Events.find({$or: [{partnerIds: this.userId}, {pendingEmail: email},{ownerId: this.userId}]});
  });
});

Meteor.methods({
  sendShareEmail: function(options) {
    Email.send(options);
  }
});