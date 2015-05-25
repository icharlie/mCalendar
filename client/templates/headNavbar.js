// navbar
Template.headerNavbar.helpers({
  userEmail: function() {
    return Meteor.user().emails[0].address;
  },
  isNotCalendarView: function() {
    return (Meteor.userId() && Session.get('currentView') !== 'calendar');
  }
})

Template.headerNavbar.events({
  'click a#logout': function() {
    Meteor.logout(function() {
      Router.go('/');
    });
  },
  'click a#profile': function (e) {
    Router.go('/profile/' + Meteor.userId());
  }
});


