describe('Api service', function() {
  'use strict';
  beforeEach(function() {
    MeteorStubs.install();
  });

  afterEach(function() {
    MeteorStubs.uninstall();
  });

  describe('token', function() {
    it('should ask for token', function() {
      var userId = 1;
      var result = {_id: userId};
      spyOn(Meteor.users, 'findOne').and.returnValue(result);


      expect(Meteor.users.findOne(userId)).toBe(result);
      expect(Meteor.users.findOne.calls.argsFor(0)).toEqual([userId]);
    });
  });
});
