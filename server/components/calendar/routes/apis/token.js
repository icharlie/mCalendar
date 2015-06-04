var token = Router.route('/api/token', {
  name: 'api.token',
  where: 'server'
});

token.get(function() {
  var url = Npm.require('url');

  var params = url.parse(this.request.url, true).query;

  var required = ['email', 'password'];

  _.each(required, function(field) {
    if (! params[field]) {
      throw new Meteor.Error( Utils.capitalize(field) + ' has to be provided');
    }
  });

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

  var token = user.token;

  if (! token) {
    // generate api token
    var token = Accounts._generateStampedLoginToken().token;
    user.token = token

    // update user with new token
    Users.update({_id: user._id}, {$set: user});

    Api.update(
      {
        userId: user._id
      },
      {
        $set: {
          userId: user._id,
          token: token,
          amount: 0
        }
      },
      {
        upsert: true,
        validate: false
      }
    );

  }


  this.response.end(EJSON.stringify({token: token}));
});
