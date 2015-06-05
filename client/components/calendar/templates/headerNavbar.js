// navbar
Template.headerNavbar.helpers({
  userEmail: function() {
    return Meteor.user().emails[0].address;
	},

	userId: function() {
		return Meteor.userId();
	},

  isNotCalendarView: function() {
    return Meteor.userId();
  }
})

Template.headerNavbar.events({
  'click a#logout': function() {
    Meteor.logout();
  },
});
