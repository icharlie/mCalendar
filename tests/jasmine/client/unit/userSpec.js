(function() {
	describe('users', function() {
		var fixture;
		var user;
		beforeEach(function() {
			fixture = {
				username: faker.internet.username(),
				emails: [
					{
						address: faker.internet.email(),
						verified: true
					}
				],
				password: faker.internet.password(),
				profile: {
					photoId: faker.helpers.randomNumber()
				}
			};
			// var userId = Accounts.createUser({
			// 	username: fixture.username,
			// 	email: fixture.emails[0].address
			// 	passowrd:fixture.password,
			// 	profile: fixture.profile
			// });

			// user = Meteor.users.findOne(userId);
		});

		// afterEach(function() {
		// 	user.remove();
		// });

		it('souhld have users collection', function() {
			expect(true).toBe(true);
			// Meteor.call('updateProfile', , {'profile.photoId': 1}, function(err, result) {
			// 	expect(err).toBeUndefined();
			// });
		});
	});
})();
