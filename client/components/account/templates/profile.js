/*jshint esnext: true*/
/*global Template, Meteor*/
const userId = Meteor.userId();

Template.profile.helpers({
  user () {
    return Meteor.user();
  },

  profileImage () {
    'use strict';
    const user = Meteor.user();
    if (user && user.profile.photoId) {
      const photo = Images.findOne({_id: user.profile.photoId});
      return photo ?  photo.url() : App.defaultProfileImage;
    }
    return App.defaultProfileImage;
  },

  displayDeleteButton () {
    return Meteor.user() && Meteor.user().profile.photoId;
  }
});

Template.profile.events({
  'change #image' (e, t) {
    const user = Meteor.user();
    const photo = new FS.File(e.target.files[0]);
    photo.owner = user._id;
    const fileObj = Images.insert(photo);
    // clean old image
    const oldPhoto = Images.findOne({_id: user.profile.photoId});
    if (oldPhoto) {
      oldPhoto.remove();
    }
    Meteor.call('updateProfile', userId, {'profile.photoId': fileObj._id});
  },

  'click #update-btn' (e) {
    e.preventDefault();
    const userId = Meteor.userId();
    const username = $('#name').val();
    const email = $('#email').val();
    const newProfile = {
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

  'click #delete-image-btn' (e, t) {
    e.preventDefault();
    const user = Meteor.user();
    const photoId = user.profile.photoId;
    if (photoId) {
      const photo = Images.findOne({_id: photoId});
      photo.remove();
      user.profile.photoId = null;
			Meteor.call('updateProfile', user);
    }
  }
});
