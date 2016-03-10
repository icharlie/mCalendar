const generateEvent = function(data) {
  let event = $.extend({}, data);
  event.allDay = event.allDay || true;
  event.partnerIds = [];
  event.ownerId = Meteor.userId();
  if (!event.date && !event.start && !event.end) {
    event.date = event.date ? moment.utc(event.date) : moment.utc();  
  }
  
  if (event.allDay) {
    if (event.date) {
      event.start = event.date.toString();
      event.end = event.date.toString();
    }
  } else {
    const  start = event.start.split(':');
    const  end = event.end.split(':');
    const  startHours = parseInt(start[0], 10);
    const  startSeconds = parseInt(start[1], 10);
    const  endHours = parseInt(end[0], 10);
    const  endSeconds = parseInt(end[1], 10);

    event.start = moment.utc(event.date).add(startHours, 'hours').add(startSeconds, 'seconds').toString();
    event.end = moment.utc(event.date).add(endHours, 'hours').add(endSeconds, 'seconds').toString();
  }
  return event;
};
