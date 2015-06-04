Meteor.methods({
  updateProfile: function(userId, profile) {
		Meteor._debug('Account update profile');
    if (profile.username) {
      var userByUsername = Meteor.users.findOne({username: profile.username});
      if (userByUsername && userId !== userByUsername._id) {
        throw new Meteor.Error(409, 'Duplicated username');
      }
    }
    Meteor.users.update(userId, {$set: profile});
  }
});
