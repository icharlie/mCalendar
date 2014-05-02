
"use strict";

var ifViewing, login;

ifViewing = function(viewName) {
  return Session.get('currentView') === viewName;
};

Template.navBar.userEmail = function() {
  return Meteor.user().emails[0].address;
};

Template.navBar.isNotCalendarView = function() {
  return ! (Session.get('currentView') === 'calendar')
};

Template.navBar.events({
  'click a#logout': function() {
     Meteor.logout(function() {
       Router.go('/');
    });
  }
});

Template.calendar.rendered = function() {App.generateCalendar();
  $('#myModal').on('show', function() {
    $('#myModal').removeClass('hidden');
  });
  $('#myModal').on('hdie', function() {
    $('#myModal').addClass('hidden');
  });
};

Template.calendar.events({
  'click .fc-button-agendaWeek': function(e, t) {
    Meteor.users.update({_id:Meteor.userId()}, {$set:{"profile.calendarView":"agendaWeek"}});
  },
  'click .fc-button-month': function() {
    Meteor.users.update({_id:Meteor.userId()}, {$set:{"profile.calendarView":"month"}});
  }
});

Template.modal.events({
  'click #saveEvent': function(e, t) {
      var action = $("#current_evt_action").html();
      var event = void 0;
      var id = void 0;
      event = {};
      if (action === "edit") {
        event = JSON.parse($("#current_evt_data").html());
        event.title = $("#title").val();
        event.desc = $("#desc").val();
      } else {
        event.start = $("#eventStart").val();
        event.end = $("#eventEnd").val();
        event.allDay = $("#eventAllDay").val();
        event.title = $("#title").val();
        event.desc = $("#desc").val();
      }
      var url = '/event/' + action + '?' + serialize(event);
      Router.go(url);
      $("#myModal").modal("hide");
  },
  'click #deleteEvent': function(e, t) {
    event = JSON.parse($("#current_evt_data").html());
    if (event.ownerId === Meteor.userId()) {
      Events.remove({_id: event._id});
    } else {
      Events.update({_id: event._id}, {$pull: {partnerIds: Meteor.userId()}});
    }

    $("#myModal").modal("hide");
  },
  'click #shareEvent': function(e, t) {
    e.preventDefault();
    $("#myModal").modal("hide");
    $("#myEmailModal").modal("show");
  }
});

Template.emailModal.events({
  'click #sendEmail': function(e, t) {
    e.preventDefault();
    var event = JSON.parse($("#current_evt_data").html());
    var to = $('#email').val();
    var url = '/share/'+ event._id + '?' + 'to=' + to;
    console.log(url);
    Router.go(url);
    $("#myEmailModal").modal("hide");
  },
  'click #backEvent': function(e, t) {
    e.preventDefault();
    $("#myModal").modal("show");
    $("#myEmailModal").modal("hide");
  }
});

Template.loginForm.events({
  'submit': function(e, t) {
    e.preventDefault();
    App.login({email: t.find('#userEmail').value, password: t.find('#userPassword').value});
  },
  'click a#login': function(e, t) {
    e.preventDefault();
    App.login({email: t.find('#userEmail').value, password: t.find('#userPassword').value});
  },
  'click a#creatingAccount': function(e, t) {
    e.preventDefault();
    Session.set('creatingAccount', false);
    Accounts.createUser({
      username: t.find('#userName') ? t.find('#userName').value : '',
      email: t.find('#userEmail').value,
      password: t.find('#userPassword').value,
      profile: {
        name: t.find('#userName') ? t.find('#userName').value : ''
      }
    });
  },
  'click a#goLogin': function(e, t) {
    e.preventDefault();
    Session.set('creatingAccount', false);
  },
  'click a#goCreate': function(e, t) {
    e.preventDefault();
    Session.set('creatingAccount', true);
  }
});

Template.loginForm.creatingAccount = function() {
  return Session.get('creatingAccount');
};

var serialize = function(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
    return str.join("&");
};

