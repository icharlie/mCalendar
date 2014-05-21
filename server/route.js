RESTstop.configure({
  use_auth: true
});

RESTstop.add('events', function(){
  if (! this.user) {
    return {is_loggedin: false};
  }
  return {
    is_loggedin: true,
    events: Events.find({$or: [{partnerIds: this.user._id}, {ownerId: this.user._id}]}).fetch()
  };
});


RESTstop.add('event/add', {method: 'POST'}, function(){
  if (! this.user) {
    return {is_loggedin: false};
  }
  var title = this.params.title;
  var desc = this.params.desc;
  var start = this.params.start;
  var end = this.params.end;
  var allDay = this.params.allDay;
  var ownerId = this.params.userId;
  // advanced event fileds
  var address = this.params.address;
  var lat = this.params.lat;
  var lng = this.params.lng;
  if (! title || ! desc || ! start || ! end || ! allDay) {
	  return {
	    is_loggedin: true,
	    err: "Please provide enough event information. We need title, desc, start, end, allDay",
	    data: this.params
	  };
  }
  // TODO: check date format
  var evt = {
  	title: title,
  	desc: desc,
  	start: new Date(start),
  	end: new Date(end),
  	allDay: JSON.parse(allDay),
  	partnerIds: [],
  	ownerId: ownerId,
    address: address,
    lat: lat,
    lng: lng
  };
  var eventId = Events.insert(evt);

  return {
    is_loggedin: true,
    eventId: eventId
  };
});