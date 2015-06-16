describe('Routes', function() {
	  beforeEach(waitForRouter);

		it('should visit calendar', function() {
			Router.go('calendar');
		});
});
