/*
 * Layout entry
 */

Template.layoutEntry.helpers({
  getLayout: function() {
    var user = Meteor.user()

    var layout = App.layout ? App.layout : 'defaultLayout';

    return layout;
  }
});
