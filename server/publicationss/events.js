Meteor.publish("events", function() {

  if (! Match.test(this.userId, String)) {
    return [];
  }
  var user = Users.findOne(this.userId);

  var email = user.emails[0].address;
  return Events.find({
    $or: [
      {partnerIds: this.userId},
      {pendingEmail: email},
      {ownerId: this.userId}
    ]
  });
});
