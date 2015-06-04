// generate api key
Accounts.onCreateUser(function(options, user) {
  var token = Accounts._generateStampedLoginToken().token;
  user.token = token;
  user.profile = {};

  Api.insert({
    userId: user._id,
    token: token,
    amount: 0
  });
  return user;
});
