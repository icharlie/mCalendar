Template.homeSidebar.helpers({
  isLeftSidebarOpen: function() {
    return Session.get('isLeftSidebarOpen');
  },

  profileImage: function() {
    var user = Meteor.user();
    if (user && user.profile) {
      var photoId = user.profile.photoId;
      if (photoId) {
        var img = Images.findOne({_id: photoId});
        return img ? img.url() : App.defaultProfileImage;
      }
    }
    return App.defaultProfileImage;
  },

  getViewSidebarLinksTemplate: function () {
    // TODO: dynamic sidebar
    // var routeName = Session.get('currentView');
    // return routeName + 'SidebarLinks';
    return 'calendarSidebarLinks';
  }
});


Template.homeSidebar.events({
  'click .js-toogle-sidebar': function(e, t) {
    var i = t.find('i');
    var klass =$(i).attr('class');
  }
});
