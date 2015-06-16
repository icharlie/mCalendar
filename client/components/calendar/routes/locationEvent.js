Router.route('/locationEvent', {
  path: '/locationEvent',
  waitOn: function() {
    return Meteor.subscribe('events');
  },
  action: function() {
    if (this.ready()) {
      this.render('locationEvent');
    } else {
      this.render('loading');
    }
  }
});
