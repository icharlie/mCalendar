'use strict';
var userId = Meteor.userId();

Template.profile.helpers({
  isDisplayUploadImageButton: function() {
    return Images.find({owner: Meteor.userId()}).fetch().length < 2;
  },

  user: function() {
    return Meteor.user();
  },

  profileImage: function() {
    var user = Meteor.user();
    var photoId = Session.get('photoId') || user.profile.photoId;
    if (photoId) {
      var photo = Images.findOne({_id: photoId});
      return photo.url();
    }

    return App.defaultProfileImage;
  },

  profileImages: function() {
    return Images.find({owner: Meteor.userId()});
  }
});

Template.profile.events({
  'click .profile-photos': function(e, t) {
    var userId = Meteor.userId();
    var photoId = $(e.target).data('id');
    Session.set('photoId', photoId);
  },

  'change #image': function(e, t) {
    var photo = new FS.File(e.target.files[0]);
    photo.owner = Meteor.userId();
    var fileObj = Images.insert(photo);
    var userId = Meteor.userId();
    Meteor.users.update({_id: userId}, {$set: {'profile.photo': fileObj._id}});
  },

  'click #update-btn': function(e) {
    e.preventDefault();
    var userId = Meteor.userId();
    var username = $('#name').val();
    var email = $('#email').val();
    var photoId = Session.get('photoId');
    var newProfile = {
      username: username,
      emails: [
        {
          address: email
        }
      ]
    };

    if (photoId) {
      newProfile.profile = {
        photoId: photoId
      };
    }
    Meteor.call('updateProfile', userId, newProfile, function(error, result) {
      // TODO: handle error(highlight error field)
      if (error) {
        console.log(error);
      }

      // TODO: success updaet info
    });

    Session.set('photoId', null);
  },

  'click #delete-image-btn': function(e, t) {
    e.preventDefault();
    var user = Meteor.user();
    var photoId = Session.get('photoId') || user.profile.photoId;
    if (photoId) {
      var photo = Images.findOne({_id: photoId});
      photo.remove();
      user.profile.photoId = null;
      Session.set('photoId', null)
    }
  }
});
