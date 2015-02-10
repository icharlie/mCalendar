Router.route('events', function(){
    if (! this.user) {
        return {is_loggedin: false};
    }
    return {
        is_loggedin: true,
        events: Events.find({$or: [{partnerIds: this.user._id}, {ownerId: this.user._id}]}).fetch()
    };
});


Router.route('/event/create').post(function(){
    console.log('create');
    if (! this.user) {
        return {is_loggedin: false};
    }
    if (checkRequireField(this.params)) {
        return {
            is_loggedin: true,
            err: "Please provide enough event information. We need title, desc, start, end, allDay",
            data: this.params
        };
    }
    var title = this.params.title;
    var desc = this.params.desc;
    var start = this.params.start ? new Date(this.params.start) : new Data();
    var end = this.params.end ? new Date(this.params.end) : new Data();
    var allDay = this.params.allDay;
    var ownerId = this.params.userId;
    // advanced event fileds
    var address = this.params.address;
    var lat = this.params.lat;
    var lng = this.params.lng;
    if (allDay) {
        if (start || end) {
            start = this.params.date;
            start = this.params.date;
        }
    } else {
        start = this.params.date + ' '+start;
        end = this.params.date + ' '+end;
    }
    var evt = {
        title: title,
        desc: desc,
        date: date,
        start: start,
        end: end,
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

var checkRequireField = function (params) {
    if (! params.title || ! params.desc)
        return false;
    if (!params.allDay && (! params.start || ! params.end))
        return false;
    if (params.allDay && params.date)
        return false;
};