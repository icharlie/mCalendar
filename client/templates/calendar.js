Template.calendar.rendered = function() {
  if (Meteor.userId()) {
    App.generateCalendar();
    $('#myModal').on('show', function() {
      $('#myModal').removeClass('hidden');
    });

    $('#myModal').on('hdie', function() {
      $('#myModal').addClass('hidden');
    });
  }
};

Template.calendar.helpers({
  profileImage: function() {
    var photoId = Meteor.user().profile.photoId;
    if (photoId) {
      var img = Images.findOne({_id: photoId});
      return img.url();
    }
    return App.defaultProfileImage;
  }
});

Template.calendar.events({
  'click .fc-button-agendaDay': function() {
    Meteor.users.update({_id:Meteor.userId()}, {$set:{'profile.calendarView': 'agendaDay'}});
  },

  'click .fc-button-agendaWeek': function(e, t) {
    Meteor.users.update({_id:Meteor.userId()}, {$set:{'profile.calendarView':'agendaWeek'}});
  },

  'click .fc-button-month': function() {
    Meteor.users.update({_id:Meteor.userId()}, {$set:{'profile.calendarView':'month'}});
  }
});
