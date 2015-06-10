Template.fullCalendarEventSidebar.helpers({
  date: function() {
    var start = Session.get('currentStart');
    var end = Session.get('currentEnd');
    if (start && end) {
      start = moment(start);
      end = moment(end);
      var ONE_DAY = '8640000';
      var diff = end.diff(start);
      var date;
      if ( diff === ONE_DAY) {
        date = start.format('MMM-DD');
      } else if (diff < ONE_DAY){
        date = start.format('MMM-DD HH:mm:ss') + '-' + end.format('HH:mm:ss');
      } else {
        date = start.format('MMM-DD') + '-' + end.format('MMM-DD');
      }
    } else {
      date = moment().format('MMM-DD');
    }
    return date;
  }
});
