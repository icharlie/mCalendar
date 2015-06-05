Template.clndr.onRendered(function () {
  this.$('#full-clndr').clndr({
    template: this.$('#full-clndr-template').text()
  });
});
