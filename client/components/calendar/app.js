if (!this.App) this.App = {};

App.eventVars = ['eventStart', 'eventEnd', 'eventType', 'eventTitle',
  'eventDescription'];

var eventsDep = new Tracker.Dependency;

App.reloadEvents = function() {
  eventsDep.depend();
  $("#calendar").fullCalendar("removeEvents");
  $("#calendar").fullCalendar("addEventSource", App.getEventsData());
  $("#calendar").fullCalendar("refetchEvents");
};


var clearEventSessionVars = function() {
  _.each(App.eventVars, function(e) {
    Session.set(e, null);
  });
};

Meteor.call('getenv', function(err, env) {
  this.App.env = env;
}.bind(this))

this.App.getEventsData = function() {
  var userId;
  userId = (Meteor.userId() === null ? "" : Meteor.userId());
  var events = Events.find({$or: [{partnerIds: userId}, {ownerId: userId}]}).fetch();
  events = events.map(function(event) {
    event.start = moment.utc(event.start);
    event.end = moment.utc(event.end);
    return event;
  });
  return events;
};

this.App.generateCalendar = function() {
  if(!$('#calendar').children().length) {
    $("#calendar").fullCalendar({
      theme: false,
      header: {
        left: "prev,next today",
        center: "title",
        right: "month,agendaWeek,agendaDay"
      },
      selectable: true,
      selectHelper: true,
      select: function (start, end, jsEvent, view) {
        clearEventSessionVars();
        Session.set('eventId', null);
        Session.set('eventStart', start.toISOString());
        Session.set('eventEnd', end.toISOString());
        Session.set('eventType', 'add');
        Sidebar.stack.fullCalendarEvent.open();
      },
      editable: true,
      events: App.getEventsData(),
      eventClick: function(evt, jsEvt, view) {
        clearEventSessionVars();
        Session.set('eventId', evt._id);
        Session.set('eventStart', evt.start.toString());
        Session.set('eventEnd', evt.end.toString());
        Session.set('eventTitle', evt.title);
        Session.set('eventDescription', evt.description);
        Session.set('eventType', 'edit');
        var cacheSource = evt.source;
        delete evt.source;
        Sidebar.stack.fullCalendarEvent.open();
      },
      eventDrop: function( event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
        event.end = event.start.clone().add('hours', 2);
        Events.update({_id: event._id}, {$set: { title: event.title, desc: event.desc, start: event.start.format('ddd MMM DD YYYY HH:mm:ss zZZ'), end: event.end.format('ddd MMM DD YYYY HH:mm:ss zZZ'), allDay: event.allDay}});
      },
      eventResize: function( event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view)  {
        Events.update({_id: event._id}, {$set: { title: event.title, desc: event.desc, start: event.start.format('ddd MMM DD YYYY HH:mm:ss zZZ'), end: event.end.format('ddd MMM DD YYYY HH:mm:ss zZZ'), allDay: event.allDay}});
      }
    });

    Events.find().observeChanges({
      added: function(id, event) {
        eventsDep.changed();
      },

      changed: function() {
        eventsDep.changed();
      },

      removed: function() {
        eventsDep.changed();
      }
    });

    App.eventsReloadHandle = Tracker.autorun(function(){
      App.reloadEvents();
    });
  } else {
    App.reloadEvents();
  }

  var viewName = Meteor.user().profile.calendarView || 'month';
  $('#calendar').fullCalendar('changeView', viewName);
};

this.App.showMap = function(err, data) {
    if (data.lbounds) {
        App.map.fitBounds(data.lbounds);
    } else if (data.latlng) {
      if (App.mark) App.map.removeLayer(App.mark);
      App.currentEvent.lat = data.latlng[0];
      App.currentEvent.lng = data.latlng[1];
      App.map.setView([data.latlng[0], data.latlng[1]], 13);
      App.mark = L.marker([data.latlng[0], data.latlng[1]]).addTo(App.map);
      App.mark.bindPopup(App.currentEvent.address);
    }
}

var prepareModal = function(status, evt) {
  if (status === 'add') {
    $('#myModal .modal-title').html('New Event');
    $('#saveEvent').html('Add');
     $("#current_evt_data").html();
    $("#current_evt_action").html("add");
  } else {
    $('#myModal .modal-title').html('Edti Event');
    $('#saveEvent').html('Update');
    $("#current_evt_data").html(JSON.stringify(evt));
    $("#current_evt_action").html("edit");
  }
  $("#title").val(evt.title);
  $("#msg").val(evt.desc);
  $("#eventStart").val(evt.start);
  $("#eventEnd").val(evt.end);
  $("#eventAllDay").val(evt.allDay);
};