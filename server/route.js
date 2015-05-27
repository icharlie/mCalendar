// authenticate
Router.onBeforeAction(
  function(req, res, next) {
    if (!req.headers.token) {
      res.statusCode = 403;
      res.end(EJSON.stringify({msg: 'Authenticate failed'}));
      return;
    }

    next();
  },

  {
    where: 'server',
    except: ['api.token']
  }
);

Router.route('api/events',
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

var user = Router.route('/user/:userId', {where: 'server'});

user.get(function() {
  return this.response.end(
    JSON.stringify(
      Meteor.users.findOne(this.params.userId)
      )
    );
});

user.put(function() {
  var userId = this.params.userId;
  var body = this.request.body;
  var newObj = {};
  if (body.email) {
    newObj.emails = [
      {
        address: body.email
      }
    ];
    delete body.email;
  }

  for (var ele in body) {
    newObj[ele] = body[ele];
  }

  var user = Meteor.users.update({_id: userId}, {$set: newObj});
  if (user) {
    return this.response.end(JSON.stringify({msg: 'update success'}));
  } else {
    this.response.statusCode = 404;
    return this.response.end(JSON.stringify({msg: 'update failed. Can\'t find matched user'}));
  }
});

var event = Router.route('/event/create')
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

var checkRequireField = function(params) {
  if (!params.title || !params.desc) {
    return false;
  }

  if (!params.allDay && (!params.start || !params.end)) {
    return false;
  }

  if (params.allDay && !params.date) {
    return false;
  }

  return true;
};
