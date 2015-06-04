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
      event.allDay = EJSON.parse($("#eventAllDay").val());
      event.title = $("#title").val();
      event.desc = $("#msg").val();
      event.ownerId = Meteor.userId();
      Events.insert(event);
    }
    $("#myModal").modal("hide");
    $("#calendar").fullCalendar("removeEvents");
    $("#calendar").fullCalendar("addEventSource", App.getEventsData());
    $("#calendar").fullCalendar("refetchEvents");
  },
  'click #deleteEvent': function(e, t) {
    event = EJSON.parse($("#current_evt_data").html());
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


