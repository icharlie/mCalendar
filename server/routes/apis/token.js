var token = Router.route('/api/token', {
  name: 'api.token',
  where: 'server'
});

token.get(function() {
  var url = Npm.require('url');
  var params = url.parse(this.request.url, true).query;

  if (!params.email || !params.password) {
    throw new Meteor.Error('Username and password have to be provided');
  }

  // check email exist
  var user = Meteor.users.findOne({emails: {$elemMatch: {address: params.email}}});
  if (!user) {
    this.response.statusCode = 403;
    this.response.end(EJSON.stringify({msg: 'Incorrect email'}));
    return;
  }

  // check password
  var resultOfInvocation = Accounts._checkPassword(user, params.password);
  if (resultOfInvocation.error) {
    this.response.statusCode = resultOfInvocation.error.error; // http status code
    this.response.end(EJSON.stringify({msg: resultOfInvocation.error.reason}));
  }

  // generate temp auth token
  var userApi = Api.findOne({userId: resultOfInvocation.userId});
  var token;
  var start;
  var expired;
  if (userApi) {
    var expectedExpired = moment(userApi.expired);
    var total = (userApi.total ? userApi.total : 1) + 1;
    if (expectedExpired.isAfter(moment())) {
      token = userApi.token
      period = userApi.period + 1;
      Api.update(
        {
          userId: resultOfInvocation.userId
        },
        {
          $set: {
            period: period,
            total: total
          }
        },
        {
          validate: false
        }
      );
    } else {
      token = Accounts._generateStampedLoginToken().token;
      start = moment();
      expired = moment().add(10, 'm');

      Api.update(
        {
          userId: resultOfInvocation.userId
        },
        {
          $set: {
            token: token,
            start: start.toDate(),
            expired: expired.toDate(),
            period: 1,
            total: total
          }
        },
        {
          validate: false
        }
      );
    }
  } else {
    token = Accounts._generateStampedLoginToken().token;
    start = moment();
    expired = moment().add(10, 'm');

    Api.update(
      {
        userId: resultOfInvocation.userId
      },
      {
        $set: {
          userId: resultOfInvocation.userId,
          token: token,
          start: start,
          expired: expired,
          period: 1
        }
      },
      {
        upsert: true,
        validate: false
      }
    );
  }

  resultOfInvocation.token = token;

  this.response.end(EJSON.stringify(resultOfInvocation));
});
