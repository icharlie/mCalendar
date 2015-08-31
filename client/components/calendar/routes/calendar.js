Router.route('calendar', {
  waitOn () {
    return Meteor.subscribe('events');
  },

  action () {
    if (this.ready()) {
      if (Meteor.user()) {
        Session.set('isLeftSidebarOpen', true);
        this.render('calendar');
      } else {
        Router.go('atSignIn');
      }
    } else {
      this.render('loading');
    }
  }
});
