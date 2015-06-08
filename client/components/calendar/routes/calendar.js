Router.route('calendar', {
  waitOn: function() {
    return Meteor.subscribe('events');
  },

  action: function() {
    if (this.ready()) {
      if (Meteor.user()) {
        Session.set('isLeftSidebarOpen', true);
        Session.set('isRightSidebarOpen', true);
        this.render('calendar');
      } else {
        Router.go('atSignIn');
      }
    } else {
      this.render('loading');
    }
  }
});
