var checkEmpty = function(id) {
  if ($('#'+id).val() === '') {
    $('#'+id).parent().addClass('has-error');
  }
};

