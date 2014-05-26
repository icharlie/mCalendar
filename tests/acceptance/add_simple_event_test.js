/**
 * Test Account:
 * email: mcalendar@mailinator.com
 * pass: 123456
 */

casper.options.viewportSize = {width: 1440, height: 600};

casper.test.begin('mCalendar', function suite(test) {
    // start from home page
    casper.start('http://localhost:3000').then(function() {
        test.assertTitle('mCalendar', 'mCalendar homepage title is the one expected');
        if (this.exists('a#logout'))
            this.click('a#logout');
        test.assertDoesntExist('a[href="/calendar"]',"You should't see calendar link");
        test.assertExist('a[href="/login"]', 'Should see login link');
    });
    // click login link
    casper.then(function() {
        this.click('a[href="/login"]')
    });
    // fill login form
    casper.then(function() {
        test.assertUrlMatch('/login', 'visit login page');
        this.fill('form#loginForm', {
            'user_email': 'mcalendar@mailinator.com',
            'user_password': '123456'
        }, true);
        this.click('input#login');
    });
    // redirect to calendar after login success
    casper.waitForUrl('/calendar').then(function() {
        test.assertUrlMatch('/calendar', 'Visit calendar page');
        test.assertExists('.fc-day', 'Should veiw calendar cells');
        this.click('td.fc-today');
    });
    // open modal to create a new event.
    casper.waitUntilVisible('#myModal[aria-hidden="false"]', function () {
        this.echo('see the modal!', 'INFO');
        test.assertExists('input#title', 'Should see title input field')
        test.assertExists('textarea#msg', 'Should see message textarea')
    });
    // fill modal form
    casper.then(function() {
        this.sendKeys('input#title', 'test event title');
        this.sendKeys('textarea#msg', 'test event cotent');
        this.click('button#saveEvent');
    });
    // wait to hidden modal
    casper.waitForSelector('#myModal[aria-hidden="true"]', function() {
        test.assertTextExists('test event title');
    });
    // logout when finished test
    casper.then(function() {
        if (this.exists('a#logout'))
            this.click('a#logout');
    });
    casper.run(function() {
        test.done();
    });
});