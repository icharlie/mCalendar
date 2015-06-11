Template.fullCalendarEventSidebar.helpers({
  type: function() {
    var type = Session.get('eventType');

    type = type ? type : 'add';

    return type.toUpperCase();
  },

  title: function() {
    var title = Session.get('eventTitle');

    return title ? title : '';
  },

  description: function() {
    var description = Session.get('eventDescription');

    return description ? description : '';
  },

  date: function() {
    var start = Session.get('eventStart');
    var end = Session.get('eventEnd');
    if (start && end) {
      start = moment.utc(start);
      end = moment.utc(end);
      var ONE_DAY = 86400000;
      var diff = end.diff(start);
      var date;
      if ( diff === ONE_DAY) {
        date = start.format('MMM-DD');
      } else if (diff < ONE_DAY){
        date = start.format('MMM-DD HH:mm:ss') + '-' + end.format('HH:mm:ss');
      } else {
        date = start.format('MMM-DD') + '-' + end.format('MMM-DD');
      }
    } else {
      date = moment().format('MMM-DD');
    }
    return date;
  }
});


Template.fullCalendarEventSidebar.events({
  'keyup [name=title]': function(e) {
    Session.set('eventTitle', e.currentTarget.value);
  },

  'keyup [name=description]': function(e) {
     var value = $(event.target).val();

     Session.set('eventDescription', e.currentTarget.value);   
  },

  'click #saveEvent': function(e) {
    e.preventDefault();
    var eventType = Session.get('eventType');
    var event = {};
    _.each(App.eventVars, function(e) {
      var key = e.replace('event', '').toLowerCase();
      event[key] = Session.get(e);
    });

    if (! event.allDay) event.allDay = true;

    event.ownerId = Meteor.userId();

    if (eventType === 'add') {
      Events.insert(event)
      $("#calendar").fullCalendar("removeEvents");
      $("#calendar").fullCalendar("addEventSource", App.getEventsData());
      $("#calendar").fullCalendar("refetchEvents");
      Sidebar.stack.fullCalendarEvent.toggle()
    } 
  }
});