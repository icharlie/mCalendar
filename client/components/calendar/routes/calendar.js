Router.route('calendar', {
  waitOn: function() {
    return Meteor.subscribe('events');
  },

  action: function() {
    if (this.ready()) {
      if (Meteor.user()) {
        Session.set('currentView', 'calendar');
        this.render('calendar');
      } else {
        Router.go('atSignIn');
      }
    } else {
      this.render('loading');
    }
  }
});


