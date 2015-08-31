var generateEvent = function(data) {
  var event = $.extend({}, data);
  event.allDay = event.allDay || true;
  event.partnerIds = [];
  event.ownerId = Meteor.userId();
  event.date = event.date ? moment.utc(event.date) : moment.utc();
  if (event.allDay) {
    if (event.date) {
      event.start = event.date.toString();
      event.end = event.date.toString();
    }
  } else {
    var start = event.start.split(':');
    var  end = event.end.split(':');
    var  startHours = parseInt(start[0], 10);
    var  startSeconds = parseInt(start[1], 10);
    var  endHours = parseInt(end[0], 10);
    var  endSeconds = parseInt(end[1], 10);

    event.start = moment.utc(event.date).add(startHours, 'hours').add(startSeconds, 'seconds').toString();
    event.end = moment.utc(event.date).add(endHours, 'hours').add(endSeconds, 'seconds').toString();
  }
  return event;
};
