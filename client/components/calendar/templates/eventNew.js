// advanced new event
Template.locationEvent.onRendered(function() {
  $.material.init();
  App.geocoder = L.mapbox.geocoder('mapbox.places', {
    accessToken: App.mapboxApiKey
  });
  const acceptGeo = (p) => {
    App.map = L.mapbox.map('map');
    L.mapbox.tileLayer(App.mapboxMapId, {
      accessToken: App.mapboxApiKey
    })
    .on('ready', () => {
      $('#floatingBarsG').remove();
    }).addTo(App.map);
    App.map.setView([p.coords.latitude, p.coords.longitude],13);
  };
  const defaultMapView = () => {
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
});

Template.locationEvent.loadingMap = function() {
  return Session.set('loadingMap', true);
};
