'use strict';
Meteor.publish('user', function(id) {
  return Meteor.users.find(id);
});
