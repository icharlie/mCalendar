var assert = require('assert');

suite('Events', function() {
    test('in the server', function(done, server) {
        server.eval(function() {
            Events.insert({title: 'Test event', desc: 'this is created from test.'});
            var events = Events.find().fetch();
            emit('events', events);
        });
        server.once('events', function(events) {
          assert.equal(events.length, 1);
          done();
        });
    });
});