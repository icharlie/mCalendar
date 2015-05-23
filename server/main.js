'use strict';
Meteor.methods({
  sendShareEmail: function(options) {
    Email.send(options);
  }
});
