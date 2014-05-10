// client
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
  this.route('login', {
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
  this.route('event', {
    path: '/event/add/:id',
    waitOn: function() {
      return Meteor.subscribe("events");
    },
    action: function() {
      if (!Meteor.userId()) {
        putPendingEvents(this.params.id)
        return Router.go('login');
      }
      if (this.ready()) {
        putPendingEvents(this.params.id)
        App.putPendingEventsIntoAccount();
        Router.go('/calendar');
      } else {
        this.render('loading');
      }
    }
  });
  this.route('event', {
    path: '/event/:_action',
    data: function() {
      if (!Meteor.userId()) {
        return this.reidrect('login');
      }
      var event = $.extend({}, this.params);
      event.allDay = JSON.parse(event.allDay);
      if (this.params._action === 'add') {
        delete(event._action);
        event.partnerIds = [];
        event.ownerId = Meteor.userId();
        Events.insert(event);
      }
      if (this.params._action === 'edit') {
        delete(event._action);
        Events.update({_id: event._id}, {$set: { title: event.title, desc: event.desc}});
      }
      Router.go('/calendar');
    }
  });
  this.route('share', {
    path: '/share/:eventId',
    action: function() {
      if (!Meteor.user()) {
        Router.go('/login');
      }

      Events.update({_id: this.params.eventId},{$addToSet: {pendingEmail: this.params.to}});
      var event = Events.find({"_id":this.params.eventId}).fetch()[0];
      if (event) {
        var from = Meteor.user().emails[0].address;
        Meteor.call('sendShareEmail', {
          from: from,
          to: this.params.to,
          subject: 'Someone shares an event',
          html: emailTempate(event)
        });
      }
      Router.go('/calendar');
    }
  });
  this.route('notFound', {
    path: '*',
    layoutTemplate: ''
  }); // 404
});
