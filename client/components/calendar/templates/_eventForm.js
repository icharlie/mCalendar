var allDay = new ReactiveVar(true);
Template._eventForm.helpers({
  today: function() {
    return moment().format("MM-DD-YYYY");
  },

  allDay: function() {
    return allDay.get();
  }
});

Template._eventForm.events({
  'click #allDay': function(e, t) {
    allDay.set(! allDay.get());
  },

  'click #calender-btn': function (e, t) {
    $('#date').datepicker('show');
  },

  'keypress input#address': function(e, t) {
    if (e.charCode == 13) {
      if (e.target.value === '')
        $(event.target.parentNode).addClass('has-error');
      else
        $(event.target.parentNode).removeClass('has-error');
      if (!App.currentEvent)
        App.currentEvent = {};
      App.currentEvent.address = e.target.value;
      App.geocoder.query(App.currentEvent.address, App.showMap);
      e.stopPropagation();
      return false;
    }
  },

  'click #saveEvent': function(e, t) {
    e.preventDefault();
    ["title","msg"].map(removeHasError);
    ["title","msg"].map(checkEmpty);
    if (!$('.form-group.has-error').length) {
      var lat, lng;
      if (App.currentEvent) {
        lat = App.currentEvent.lat;
        lat = App.currentEvent.lng;
      } else {
        App.currentEvent = {};
      }
      [].reduce.call($('input.form-control, textarea.form-control, input:checkbox'), function(preEle, curEle, index, array){
        if ($(preEle).attr('name'))
          App.currentEvent[$(preEle).attr('name')] = $(preEle).val();
        if ($(curEle).attr('name'))
          App.currentEvent[$(curEle).attr('name')] = $(curEle).val();
      });
      App.currentEvent.allDay = allDay.get();
      Events.insert(generateEvent(App.currentEvent));
      Router.go('/calendar');
    }
  }
});
