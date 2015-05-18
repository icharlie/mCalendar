var ifViewing, login;

ifViewing = function(viewName) {
  return Session.get('currentView') === viewName;
};

Template.eventEdit.rendered = function() {
  $('#date').datepicker({dateFormat: 'mm-dd-yy', showOn: "button"});
  $('.ui-datepicker-trigger').addClass('btn btn-default');
};

Template._eventForm.rendered = function () {
  var inputs = $('input.dateTime');
};

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


var serialize = function(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
    return str.join("&");
};


var generateEvent = function(data) {
  var event = $.extend({}, data);
  if (event.allDay)
    event.allDay = JSON.parse(event.allDay);
  event.partnerIds = [];
  event.ownerId = Meteor.userId();
  event.date = event.date ? new Date(event.date) : new Date();
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
  return event;
};
