// advanced new event
Template.eventNew.rendered = function() {
  App.geocoder = L.mapbox.geocoder('mapbox.places', {
    accessToken: App.mapboxApiKey
  });
  var acceptGeo = function(p){
    App.map = L.mapbox.map('map');
    L.mapbox.tileLayer(App.mapboxMapId, {
      accessToken: App.mapboxApiKey
    })
    .on('ready', function () {
      $('#floatingBarsG').remove();
    }).addTo(App.map);
    App.map.setView([p.coords.latitude, p.coords.longitude],13);
  };
  var defaultMapView = function() {
    App.map = L.mapbox.map('map');
    L.mapbox.tileLayer(App.mapboxApiKey)
    .on('ready', function () {
      $('#floatingBarsG').remove();
    }).addTo(App.map);
  };
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(acceptGeo, defaultMapView);
  } else {
    defaultMapView();
  }
  $('#date').datepicker({dateFormat: 'mm-dd-yy'});
};

Template.eventNew.loadingMap = function() {
  return Session.set('loadingMap', true);
};

Template.eventNew.events({
  'click #calender-btn': function (e, t) {
    $('#date').datepicker('show');
  },
  'click #share': function(e, t) {
    if(e.target.checked) {
      $('#sharedEmail').prop('disabled', false);
    } else {
      $('#sharedEmail').prop('disabled', true);
    }
  },
  'click #allDay': function(e, t) {
    if(e.target.checked) {
      $('#eventStart').prop('disabled', true);
      $('#eventEnd').prop('disabled', true);
      e.target.value = 'true';
    } else {
      $('#eventStart').prop('disabled', false);
      $('#eventEnd').prop('disabled', false);
      e.target.value = 'false';
    }
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
      Events.insert(generateEvent(App.currentEvent));
      Router.go('/calendar');
    }
    e.preventDefault();
  }
});

