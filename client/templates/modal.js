var removeHasError = function (id) {
  $('#'+id).parent().removeClass('has-error');
};

var checkEmpty = function(id) {
  if ($('#'+id).val() === '') {
    $('#'+id).parent().addClass('has-error');
  }
};

Template.modal.events({
  'click #saveEvent': function(e, t) {
    ["title","msg"].map(removeHasError);
    ["title","msg"].map(checkEmpty);
    if ($('.form-group.has-error').length){
      e.preventDefault();
      return;
    }
    var action = $("#current_evt_action").html();
    var event = void 0;
    var id = void 0;
    var url;
    event = {};
    if (action === "edit") {
      event = JSON.parse($("#current_evt_data").html());
      event.title = $("#title").val();
      event.desc = $("#msg").val();
      Events.update({_id: event._id}, {$set: { title: event.title, desc: event.desc}});
    } else {
      event.start = $("#eventStart").val();
      event.end = $("#eventEnd").val();
      event.allDay = $("#eventAllDay").val();
      event.title = $("#title").val();
      event.desc = $("#msg").val();
      event.ownerId = Meteor.userId();
      if (event.allDay) {
        if (event.date) {
          event.start = event.date;
          event.end = event.date;
        }
      } else {
        var start = event.start.split(':'),
          end = event.end.split(':'),
          startHours = parseInt(start[0], 10),
          startSeconds = parseInt(start[1], 10),
          endHours = parseInt(end[0], 10),
          endSeconds = parseInt(end[1], 10);

        event.start = moment(event.date).add('hours', startHours).add('seconds', startSeconds).format('MM-DD-YYYY HH:ss');
        event.end = moment(event.date).add('hours', endHours).add('seconds', endSeconds).format('MM-DD-YYYY HH:ss');
      }
      Events.insert(event);
    }
    $("#myModal").modal("hide");
    $("#calendar").fullCalendar("removeEvents");
    $("#calendar").fullCalendar("addEventSource", App.getEventsData());
    $("#calendar").fullCalendar("refetchEvents");
  },
  'click #deleteEvent': function(e, t) {
    event = JSON.parse($("#current_evt_data").html());
    if (event.ownerId === Meteor.userId()) {
      Events.remove({_id: event._id});
    } else {
      Events.update({_id: event._id}, {$pull: {partnerIds: Meteor.userId()}});
    }

    $("#myModal").modal("hide");
    $("#calendar").fullCalendar("removeEvents");
    $("#calendar").fullCalendar("addEventSource", App.getEventsData());
    $("#calendar").fullCalendar("refetchEvents");
  },
  'click #shareEvent': function(e, t) {
    e.preventDefault();
    $("#myModal").modal("hide");
    $("#myEmailModal").modal("show");
  }
});


