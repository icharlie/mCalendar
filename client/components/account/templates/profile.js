'use strict';
var userId = Meteor.userId();

Template.profile.helpers({
  user: function() {
    return Meteor.user();
  },

  profileImage: function() {
    var user = Meteor.user();
    if (user && user.profile.photoId) {
      var photo = Images.findOne({_id: user.profile.photoId});
      return photo ?  photo.url() : App.defaultProfileImage;
    }
    return App.defaultProfileImage;
  },

  displayDeleteButton: function() {
    return Meteor.user() && Meteor.user().profile.photoId;
  }
});

Template.profile.events({
  'change #image': function(e, t) {
    var user = Meteor.user();
    var photo = new FS.File(e.target.files[0]);
    photo.owner = user._id;
    var fileObj = Images.insert(photo);
    // clean old image
    var oldPhoto = Images.findOne({_id: user.profile.photoId});
    if (oldPhoto) {
      oldPhoto.remove();
    }
    Meteor.call('updateProfile', userId, {'profile.photoId': fileObj._id});
  },

  'click #update-btn': function(e) {
    e.preventDefault();
    var userId = Meteor.userId();
    var username = $('#name').val();
    var email = $('#email').val();
    var newProfile = {
      username: username,
      emails: [
        {
          address: email
        }
      ]
    };

    Meteor.call('updateProfile', userId, newProfile, function(error, result) {
      // TODO: handle error(highlight error field)
      if (error) {
        console.log(error);
      }
      // TODO: success updaet info
    });
  },

  'click #delete-image-btn': function(e, t) {
    e.preventDefault();
    var user = Meteor.user();
    var photoId = user.profile.photoId;
    if (photoId) {
      var photo = Images.findOne({_id: photoId});
      photo.remove();
      user.profile.photoId = null;
			Meteor.call('updateProfile', user);
    }
  }
});