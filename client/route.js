Router.map(function() {
  this.route('home', {
    path: '/',
    action: function() {
      Session.set('currentView', 'home');
      this.render('home');
    }
  });

  this.route('about', {
    path: '/about',
    action: function() {
      Session.set('currentView', 'about');
      this.render('about');
    }
  });

  this.route('calendar', {
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
    },

    onData: function() {
      App.generateCalendar();
    }
  });

  this.route('/eventNew', {
    path: '/eventNew',
    waitOn: function() {
      return Meteor.subscribe('events');
    },
    action: function() {
      if (this.ready()) {
        Session.set('currentView', 'eventNew');
        this.render('eventNew')
      } else {
        this.render('loading');
      }
    }
  });

  this.route('notFound', {
    path: '*',
    layoutTemplate: ''
  }); // 404
});

// page title
Router.onAfterAction(function() {
  document.title = [App.name, ' - ', this.route.getName()].join('');
});
