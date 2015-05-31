Template.sidebar.helpers({
  profileImage: function() {
		if (Meteor.user()) {
			var photoId = Meteor.user().profile.photoId;
			if (photoId) {
				var img = Images.findOne({_id: photoId});
				return img ? img.url() : App.defaultProfileImage;
			}
		}
    return App.defaultProfileImage;
  },

  getViewSidebarLinksTemplate: function () {
		var routeName = Session.get('currentView');
    console.log(moment().toString(), ': visit ', routeName);
    return routeName + 'SidebarLinks';
  }
});
