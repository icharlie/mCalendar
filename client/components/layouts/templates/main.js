/*
 * Layout entry
 */

Template.main.helpers({
	getLayout: function() {
		var user = Meteor.user()

		var layout = 'defaultLayout';

		// if (user && user.settings) {
		// 	layout = user.settings.layout ? user.settings.layout : layout;
		// }
    //
		return layout;
	}
});
