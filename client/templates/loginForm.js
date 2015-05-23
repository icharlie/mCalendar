Template.loginForm.err = function () {
  return Session.get('err');
};

Template.loginForm.isPasswordError = function () {
  if (Session.get('err')) {
    return Session.get('err').reason.match(/password/ig);
  }
};

Template.loginForm.isUserError = function () {
  if (Session.get('err')) {
    return Session.get('err').reason.match(/user/ig);
  }
};

Template.loginForm.events({
  'submit': function(e, t) {
    e.preventDefault();
    if(t.find('input#creatingAccount')) {
      Session.set('creatingAccount', false);
      Accounts.createUser({
        username: t.find('#userName') ? t.find('#userName').value : '',
        email: t.find('#userEmail').value,
        password: t.find('#userPassword').value,
        profile: {
          name: t.find('#userName') ? t.find('#userName').value : ''
        }
      });
    } else {
      App.login({email: t.find('#userEmail').value, password: t.find('#userPassword').value});
    }
  },
  'click a#goLogin': function(e, t) {
    e.preventDefault();
    Session.set('creatingAccount', false);
  },
  'click a#goCreate': function(e, t) {
    e.preventDefault();
    Session.set('creatingAccount', true);
  }
});

Template.loginForm.creatingAccount = function() {
  return Session.get('creatingAccount');
};


