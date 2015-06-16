Images = new FS.Collection("Images", {
  stores: [new FS.Store.FileSystem("images")]
});


Images.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  },
  download: function () {
    return true;
  }
});

