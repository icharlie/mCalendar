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

Router.route('events', function() {
  if (!this.user) {
    return {isLoggedIn: false};
  }

  return {
    isLoggedIn: true,
    events: Events.find({$or: [{partnerIds: this.user._id}, {ownerId: this.user._id}]}).fetch()
  };
});

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
    return {
      isLoggedIn: true,
      err: 'Please provide enough event information. We need title, desc, start, end, allDay',
      data: this.params
    };
  }

  var title = this.params.title;
  var desc = this.params.desc;
  var start = this.params.start ? new Date(this.params.start) : new Data();
  var end = this.params.end ? new Date(this.params.end) : new Data();
  var allDay = this.params.allDay;
  var ownerId = this.params.userId;

  // advanced event fileds
  var address = this.params.address;
  var lat = this.params.lat;
  var lng = this.params.lng;
  if (allDay) {
    if (start || end) {
      start = this.params.date;
      start = this.params.date;
    }
  } else {
    start = this.params.date + ' ' + start;
    end = this.params.date + ' ' + end;
  }

  var evt = {
    title: title,
    desc: desc,
    date: date,
    start: start,
    end: end,
    allDay: JSON.parse(allDay),
    partnerIds: [],
    ownerId: ownerId,
    address: address,
    lat: lat,
    lng: lng
  };
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

  if (params.allDay && params.date) {
    return false;
  }

  return true;
};
