describe('Events', function() {
  beforeEach(function() {
    MeteorStubs.install();
    mock(global, 'Events');
  });

  afterEach(function() {
    MeteorStubs.uninstall();
  });

  it('should add a new event', function() {
    spyOn(Events, 'insert');
    Events.insert({title: 'Test event', desc: 'this is created from test.'});
    expect(Events.insert.calls.argsFor(0)).toEqual([{title: 'Test event', desc: 'this is created from test.'}]);
  });


});
