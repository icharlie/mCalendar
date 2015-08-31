/*
 * Layout entry
 */

Template.layoutEntry.helpers({
  getLayout () {
    var user = Meteor.user()

    var layout = Session.get('layout');
    layout = layout ? layout : 'defaultAdminLayout';

    return layout;
  }
});
