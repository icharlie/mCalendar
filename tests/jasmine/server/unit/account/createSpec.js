describe('Accounts', function() {
  it('should create a new user with api token', function() {
    Accounts.createUser({username: username, email: faker.internet.email, password: '123456');
  });
});