Sidebar = BlazeComponent.extendComponent({
  template: function () {
    return 'sidebarComponent';
  },

  onCreated: function () {
    var position = this.data().position ? this.data().position : 'left';
    var key = 'is' + Utils.capitalize(position) + 'SidebarOpen';
    this._isOpen = new ReactiveVar(Session.get(key))
  },

  isOpen: function () {
    return this._isOpen.get();
  },

  open: function () {
    if (! this._isOpen.get()) {
      this._isOpen.set(true);
    }
  },

  hide: function () {
    if (this._isOpen.get()) {
      this._isOpen.set(false);
    }
  },

  toggle: function () {
    this._isOpen.set(! this._isOpen.get());
  },

  events: function () {
    return [{
      'click .js-toogle-sidebar': this.toggle
    }];
  },

  getViewTemplate: function () {
    // TODO: dynamic
    return 'homeSidebar';
  }
}).register('sidebarComponent');
