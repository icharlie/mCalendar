Sidebar = BlazeComponent.extendComponent({
  template: function () {
    return 'sidebarComponent';
  },

  onCreated: function () {
    var location = this.data().location ? this.data().location : 'left';
    var key = 'is' + Utils.capitalize(location) + 'SidebarOpen';
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

  getPosition: function() {
    var position = this.data().position ? this.data().position : 'fixed';
    return 'position-' + position;
  },

  getViewTemplate: function () {
    var viewTemplate = 'home';
    var _viewTemplate = this.data().view;
    if (_.isString(_viewTemplate)) {
      viewTemplate  = _viewTemplate;
    }
    return viewTemplate + 'Sidebar';
  }
}).register('sidebarComponent');
