// client
'use srtict';

var deserialize = function(str) {
  var data = {};
  var params = str.split('&');
  var _p;
  for(var p in params) {
    _p = params[p].split('=');
    data[_p[0]] = _p[1];
  }
  return data;
};

var emailTempate = function(event) {
  return '<html>'+
    '<head>'+
    '<title>Email From TOM</title>'+
    '</head>'+
    '<body>'+
    'Click <a href="'+Meteor.absoluteUrl('event') +'/add/'+ event._id +'">'+ event.title +'</a> to add this event into your calendar.'+
    '</body>'+
    '</html>';
};

var putPendingEvents = function(eventId) {
  var pendingEvents = Session.get('pendingEvents');
  if (!pendingEvents)
    pendingEvents = [];
  else
    pendingEvents = JSON.parse(pendingEvents);
  pendingEvents.push(eventId);
  Session.set('pendingEvents', JSON.stringify(pendingEvents));
};


Router.configure({
  layoutTemplate: 'main',
  notFoundTemplate: 'notFound'
});

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
      return Meteor.subscribe("events");
    },
    action: function() {
      if (this.ready()) {
        if (Meteor.user()) {
          Session.set('currentView', 'calendar');
          this.render('calendar');
        } else {
          Router.go('login');
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
    path: '/eventNew'
  });

  this.route('/login', {
    layoutTemplate: 'main',
    template: 'loginForm',
    action: function() {
      if (Meteor.userId()) {
        return Router.go('calendar');
      } else {
        Session.set('currentView', 'login');
        return this.render('loginForm');
      }
    }
  });


  this.route('/profile/:_id',{
    template: 'profile',
    waitOn: function() {
      return Meteor.subscribe('user', this.params._id);
    },
    action: function () {
      if (this.ready()) {
        if (Meteor.user()) {
          Session.set('currentView', 'profile');
          this.render('profile');
        } else {
          Router.go('login');
        }
      } else {
        this.render('loading');
      }
    },
    onData: function(){
      debugger;
      return Meteor.users.find()
    }
  });

  this.route('notFound', {
    path: '*',
    layoutTemplate: ''
  }); // 404
});