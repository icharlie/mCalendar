Template.defaultLayout.helpers({
  isLeftSidebarOpen: function() {
    return Session.get('isLeftSidebarOpen');
  },

  isRightSidebarOpen: function() {
    return Session.get('isRightSidebarOpen');
  }
})
