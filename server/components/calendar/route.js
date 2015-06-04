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
