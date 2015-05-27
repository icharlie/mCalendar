Meteor.publish('user', function(id) {
  check(id, String);
  return Meteor.users.find(id);
});
