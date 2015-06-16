Meteor.methods({
  getenv: function() {
    return process.env.NODE_ENV || 'development';
  }
})
