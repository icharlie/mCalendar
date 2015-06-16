Router.route('clndr', {
  waitOn: function() {
    return Meteor.subscribe('events');
  },

  action: function() {
    if (this.ready()) {
      if (Meteor.user()) {
        this.render('clndr');
      } else {
        Router.go('atSignIn');
      }
    } else {
      this.render('loading');
    }
  }
});
