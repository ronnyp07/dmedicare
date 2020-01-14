'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Maintain = mongoose.model('Maintain'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, maintain;

/**
 * Maintain routes tests
 */
describe('Maintain CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Maintain
		user.save(function() {
			maintain = {
				name: 'Maintain Name'
			};

			done();
		});
	});

	it('should be able to save Maintain instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Maintain
				agent.post('/maintains')
					.send(maintain)
					.expect(200)
					.end(function(maintainSaveErr, maintainSaveRes) {
						// Handle Maintain save error
						if (maintainSaveErr) done(maintainSaveErr);

						// Get a list of Maintains
						agent.get('/maintains')
							.end(function(maintainsGetErr, maintainsGetRes) {
								// Handle Maintain save error
								if (maintainsGetErr) done(maintainsGetErr);

								// Get Maintains list
								var maintains = maintainsGetRes.body;

								// Set assertions
								(maintains[0].user._id).should.equal(userId);
								(maintains[0].name).should.match('Maintain Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Maintain instance if not logged in', function(done) {
		agent.post('/maintains')
			.send(maintain)
			.expect(401)
			.end(function(maintainSaveErr, maintainSaveRes) {
				// Call the assertion callback
				done(maintainSaveErr);
			});
	});

	it('should not be able to save Maintain instance if no name is provided', function(done) {
		// Invalidate name field
		maintain.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Maintain
				agent.post('/maintains')
					.send(maintain)
					.expect(400)
					.end(function(maintainSaveErr, maintainSaveRes) {
						// Set message assertion
						(maintainSaveRes.body.message).should.match('Please fill Maintain name');
						
						// Handle Maintain save error
						done(maintainSaveErr);
					});
			});
	});

	it('should be able to update Maintain instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Maintain
				agent.post('/maintains')
					.send(maintain)
					.expect(200)
					.end(function(maintainSaveErr, maintainSaveRes) {
						// Handle Maintain save error
						if (maintainSaveErr) done(maintainSaveErr);

						// Update Maintain name
						maintain.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Maintain
						agent.put('/maintains/' + maintainSaveRes.body._id)
							.send(maintain)
							.expect(200)
							.end(function(maintainUpdateErr, maintainUpdateRes) {
								// Handle Maintain update error
								if (maintainUpdateErr) done(maintainUpdateErr);

								// Set assertions
								(maintainUpdateRes.body._id).should.equal(maintainSaveRes.body._id);
								(maintainUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Maintains if not signed in', function(done) {
		// Create new Maintain model instance
		var maintainObj = new Maintain(maintain);

		// Save the Maintain
		maintainObj.save(function() {
			// Request Maintains
			request(app).get('/maintains')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Maintain if not signed in', function(done) {
		// Create new Maintain model instance
		var maintainObj = new Maintain(maintain);

		// Save the Maintain
		maintainObj.save(function() {
			request(app).get('/maintains/' + maintainObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', maintain.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Maintain instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Maintain
				agent.post('/maintains')
					.send(maintain)
					.expect(200)
					.end(function(maintainSaveErr, maintainSaveRes) {
						// Handle Maintain save error
						if (maintainSaveErr) done(maintainSaveErr);

						// Delete existing Maintain
						agent.delete('/maintains/' + maintainSaveRes.body._id)
							.send(maintain)
							.expect(200)
							.end(function(maintainDeleteErr, maintainDeleteRes) {
								// Handle Maintain error error
								if (maintainDeleteErr) done(maintainDeleteErr);

								// Set assertions
								(maintainDeleteRes.body._id).should.equal(maintainSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Maintain instance if not signed in', function(done) {
		// Set Maintain user 
		maintain.user = user;

		// Create new Maintain model instance
		var maintainObj = new Maintain(maintain);

		// Save the Maintain
		maintainObj.save(function() {
			// Try deleting Maintain
			request(app).delete('/maintains/' + maintainObj._id)
			.expect(401)
			.end(function(maintainDeleteErr, maintainDeleteRes) {
				// Set message assertion
				(maintainDeleteRes.body.message).should.match('User is not logged in');

				// Handle Maintain error error
				done(maintainDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Maintain.remove().exec();
		done();
	});
});