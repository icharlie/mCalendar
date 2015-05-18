var ifViewing, login;

ifViewing = function(viewName) {
  return Session.get('currentView') === viewName;
};

Template.eventEdit.rendered = function() {
  $('#date').datepicker({dateFormat: 'mm-dd-yy', showOn: "button"});
  $('.ui-datepicker-trigger').addClass('btn btn-default');
};

Template._eventForm.rendered = function () {
  var inputs = $('input.dateTime');
};

Template.emailModal.events({
  'click #sendEmail': function(e, t) {
    e.preventDefault();
    var event = JSON.parse($("#current_evt_data").html());
    var to = $('#email').val();
    var url = '/share/'+ event._id + '?' + 'to=' + to;
    console.log(url);
    Router.go(url);
    $("#myEmailModal").modal("hide");
  },
  'click #backEvent': function(e, t) {
    e.preventDefault();
    $("#myModal").modal("show");
    $("#myEmailModal").modal("hide");
  }
});


var serialize = function(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
    return str.join("&");
};



