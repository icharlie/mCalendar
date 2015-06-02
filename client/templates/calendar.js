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

Template.calendar.events({
  'click .fc-agendaDay-button': function() {
		Meteor.call('updateProfile', Meteor.userId(), {'profile.calendarView': 'agendaDay'});
  },

  'click .fc-agendaWeek-button': function(e, t) {
		Meteor.call('updateProfile', Meteor.userId(), {'profile.calendarView': 'agendaWeek'})
  },

  'click .fc-month-button': function() {
		Meteor.call('updateProfile', Meteor.userId(), {'profile.calendarView': 'month'});
  }
});
