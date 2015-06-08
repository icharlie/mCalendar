Template.clndr.onRendered(function () {
  App.clndr = this.$('#full-clndr').clndr({
    template: this.$('#full-clndr-template').text(),
    clickEvents: {
      click: function(event) {
      }
    }
  });
});

Template.clndr.events({
  'click #addNewEvent': function() {
  },
  'click .days .day': function(e, t) {
     t.findAll('.days .day.selected').map(function(e) {$(e).removeClass('selected');});
    $(e.target).addClass('selected');
  }
});
