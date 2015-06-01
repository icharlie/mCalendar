Template.sidebar.helpers({
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
		var routeName = Session.get('currentView');
    console.log(moment().toString(), ': visit ', routeName);
    return routeName + 'SidebarLinks';
  }
});
