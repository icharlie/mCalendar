Router.route('events', function(){
    if (! this.user) {
        return {is_loggedin: false};
    }
    return {
        is_loggedin: true,
        events: Events.find({$or: [{partnerIds: this.user._id}, {ownerId: this.user._id}]}).fetch()
    };
});


Router.route('/api/token', {where: 'server'}).get(function() {
  var url = Npm.require('url');
  var params = url.parse(this.request.url, true).query;
  if (!params.email || !params.password) {
    throw new Meteor.Error('Username and password have to be provided');
  }

  var user = Meteor.users.findOne({});
  if (!user) {
    throw new Error('User ' + username + ' not found');
  }

  var resultOfInvocation = Accounts._checkPassword(user, password);

  return Meteor.loginWithPassword(params.email, params.password, function(err) {
    if (err) {
      this.response.statusCode = 401;
      this.response.setHeader('WWW-Authenticate', 'Basic realm="mCalendar"');
    return  this.response.end();
    }
    return  this.response.end(JSON.stringify(queryData));
  });
});

Router.route('/user/:user_id', {where: 'server'})
  .get(function() {
    return this.response.end(JSON.stringify(Meteor.users.findOne(this.params.user_id)));
  })
  .put(function() {
    var userId = this.params.user_id;
    var body = this.request.body;
    var newObj = {};
    if (body.email) {
      newObj['emails'] = [{address: body.email}];
      delete body.email;
    }
    for(var ele in body) {
      newObj[ele] = body[ele];
    }
    try {
      var user = Meteor.users.update({_id: userId}, {$set: newObj});
      if (user) {
        return this.response.end(EJSON.stringify({msg: 'update success'}));
      } else {
        this.response.statusCode = 404;
        return this.response.end(EJSON.stringify({msg: 'update failed. Can\'t find matched user'}));
      }
    } catch (e) {
      this.response.statusCode = 400;
      console.log(e);
      if (e.message.match(/duplicate.+username.*/ig)) {
        this.response.end(EJSON.stringify({msg: 'duplicated username'}));
      }
      if (e.message.match(/duplicate.+email.*/ig)) {
        this.response.end(EJSON.stringify({msg: 'duplicated email'}));
      }
      this.response.end(EJSON.stringify({msg: e.message}));
    }
  });




Router.route('/event/create').post(function(){
    if (! this.user) {
        return {is_loggedin: false};
    }
    if (checkRequireField(this.params)) {
        return {
            is_loggedin: true,
            err: "Please provide enough event information. We need title, desc, start, end, allDay",
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
        start = this.params.date + ' '+start;
        end = this.params.date + ' '+end;
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
        is_loggedin: true,
        eventId: eventId
    };
});

var checkRequireField = function (params) {
    if (! params.title || ! params.desc)
        return false;
    if (!params.allDay && (! params.start || ! params.end))
        return false;
    if (params.allDay && params.date)
        return false;
};