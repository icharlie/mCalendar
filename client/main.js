
this.App = {};

this.App.getEventsData = function() {
  var userId;
  userId = (Meteor.userId() === null ? "" : Meteor.userId());
  return Events.find({$or: [{partnerIds: userId}, {ownerId: userId}]}).fetch();
};

this.App.generateCalendar = function() {
  if(!$('#calendar').children().length) {
    $("#calendar").fullCalendar({
      header: {
        left: "prev,next today",
        center: "title",
        right: "month,agendaWeek"
      },
      selectable: true,
      selectHelper: true,
      select: function (start, end, allDay) {
        $("#current_evt_data").html();
        $("#current_evt_action").html("add");
        $('.modal-title').html('New Event');
        $('#saveEvent').html('Add');
        $('#deleteEvent').hide();
        $('#shareEvent').hide();
        $("#title").val("");
        $("#desc").val("");
        $("#eventStart").val(start);
        $("#eventEnd").val(end);
        $("#eventAllDay").val(allDay);
        $("#myModal").modal();
      },
      editable: true,
      events: App.getEventsData(),
      eventClick: function(evt, jsEvt, view) {
        var cacheSource = evt.source;
        delete evt.source;
        $("#title").val(evt.title);
        $("#desc").val(evt.desc);
        $('.modal-title').html('Edti Event');
        $('#saveEvent').html('Edit');
        $('#deleteEvent').show();
        $('#shareEvent').show();
        $("#current_evt_data").html(JSON.stringify(evt));
        $("#current_evt_action").html("edit");
        $("#myModal").modal();
      },
      //dayDblClick: function(date, allDay, jsEvt, view) {
        //$("#current_evt_data").html();
        //$("#current_evt_action").html("add");
        //$('.modal-title').html('New Event');
        //$('#saveEvent').html('Add');
        //$('#deleteEvent').hide();
        //$('#shareEvent').hide();
        //$("#title").val("");
        //$("#desc").val("");
        //$("#eventDate").val(date);
        //$("#myModal").modal();
      //},
      eventDrop: function( event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view ){
        console.log(event);
        Events.update({_id: event._id}, {$set: { title: event.title, desc: event.desc, start: event.start, end: event.end, allDay: JSON.parse(event.allDay)}});
      }

      //eventragStart: function (evt, jsEvt, ui, view) {
        //console.log('start');
        //console.log(evt);
      //},
      //eventDragStop: function (evt, jsEvt, ui, view) {
        //console.log('stop');
        //console.log(evt.source);
        //console.log(jsEvt);
      //}
    });
  } else {
    $("#calendar").fullCalendar("removeEvents");
    $("#calendar").fullCalendar("addEventSource", App.getEventsData());
    $("#calendar").fullCalendar("refetchEvents");
  }
  var viewName = Meteor.user().profile.calendarView || 'month';
  $('#calendar').fullCalendar('changeView', viewName);
};

this.App.parseQueryString = function(queryString) {
  var aux, ele, o, params, _i, _len, _ref;
  if (queryString) {
    params = {};
    _ref = decodeURI(queryString).split("&");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      ele = _ref[_i];
      aux = ele.split('=');
      o = {};
      if (aux.length >= 1) {
        o[aux[0]] = aux[1];
        _.extend(params, o);
      }
    }
    return params;
  }
};

this.App.login = function(params) {
  return Meteor.loginWithPassword(params.email, params.password, function(err) {
    if (err) {
      Session.set('err', err);
      return Router.go('login');
    } else {
      Session.set('err', null);
      return Router.go('calendar');
    }
  });
};
