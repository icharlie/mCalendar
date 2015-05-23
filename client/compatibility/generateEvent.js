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
