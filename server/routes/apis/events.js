
Router.route('/api/events',
  function() {
    if (!this.user) {
      return {isLoggedIn: false};
    }

    return {
      isLoggedIn: true,
      events: Events.find({$or: [{partnerIds: this.user._id}, {ownerId: this.user._id}]}).fetch()
    };
  },

  {
    where: 'server'
  }
);

var event = Router.route('/api/events/new')
event.post(function() {
  if (!this.user) {
    return {isLoggedIn: false};
  }

  if (checkRequireField(this.params)) {
    // TODO: HTTP status code and more description.
    return {
      isLoggedIn: true,
      err: 'Please provide enough event information. We need title, desc, start, end, allDay',
      data: this.params
    };
  }

  var evt = {};
  var keys = ['title', 'desc', 'start', 'end', 'date', 'allDay', 'ownerId', 'address', 'lat', 'lng'];

  keys.forEach(function(key) {
    evt[key] = this.params[key];
  });

  if (evt.allDay) {
    evt.allDay = EJSON.parse(allDay);
  } else {
    evt.allDay = false;
  }

  if (allDay) {
    evt.start = moment(evt.date).toDate();
    evt.end = moment(evt.date).toDate();
  } else {
    evt.start = moment(evt.start).toDate();
    evt.end = moment(evt.start).toDate();
  }

  var eventId = Events.insert(evt);

  return {
    isLoggedIn: true,
    eventId: eventId
  };
});
