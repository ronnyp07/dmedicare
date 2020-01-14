'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Headermaster = mongoose.model('Headermaster'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, headermaster;

/**
 * Headermaster routes tests
 */
describe('Headermaster CRUD tests', function() {
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

		// Save a user to the test db and create new Headermaster
		user.save(function() {
			headermaster = {
				name: 'Headermaster Name'
			};

			done();
		});
	});

	it('should be able to save Headermaster instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Headermaster
				agent.post('/headermasters')
					.send(headermaster)
					.expect(200)
					.end(function(headermasterSaveErr, headermasterSaveRes) {
						// Handle Headermaster save error
						if (headermasterSaveErr) done(headermasterSaveErr);

						// Get a list of Headermasters
						agent.get('/headermasters')
							.end(function(headermastersGetErr, headermastersGetRes) {
								// Handle Headermaster save error
								if (headermastersGetErr) done(headermastersGetErr);

								// Get Headermasters list
								var headermasters = headermastersGetRes.body;

								// Set assertions
								(headermasters[0].user._id).should.equal(userId);
								(headermasters[0].name).should.match('Headermaster Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Headermaster instance if not logged in', function(done) {
		agent.post('/headermasters')
			.send(headermaster)
			.expect(401)
			.end(function(headermasterSaveErr, headermasterSaveRes) {
				// Call the assertion callback
				done(headermasterSaveErr);
			});
	});

	it('should not be able to save Headermaster instance if no name is provided', function(done) {
		// Invalidate name field
		headermaster.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Headermaster
				agent.post('/headermasters')
					.send(headermaster)
					.expect(400)
					.end(function(headermasterSaveErr, headermasterSaveRes) {
						// Set message assertion
						(headermasterSaveRes.body.message).should.match('Please fill Headermaster name');
						
						// Handle Headermaster save error
						done(headermasterSaveErr);
					});
			});
	});

	it('should be able to update Headermaster instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Headermaster
				agent.post('/headermasters')
					.send(headermaster)
					.expect(200)
					.end(function(headermasterSaveErr, headermasterSaveRes) {
						// Handle Headermaster save error
						if (headermasterSaveErr) done(headermasterSaveErr);

						// Update Headermaster name
						headermaster.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Headermaster
						agent.put('/headermasters/' + headermasterSaveRes.body._id)
							.send(headermaster)
							.expect(200)
							.end(function(headermasterUpdateErr, headermasterUpdateRes) {
								// Handle Headermaster update error
								if (headermasterUpdateErr) done(headermasterUpdateErr);

								// Set assertions
								(headermasterUpdateRes.body._id).should.equal(headermasterSaveRes.body._id);
								(headermasterUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Headermasters if not signed in', function(done) {
		// Create new Headermaster model instance
		var headermasterObj = new Headermaster(headermaster);

		// Save the Headermaster
		headermasterObj.save(function() {
			// Request Headermasters
			request(app).get('/headermasters')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Headermaster if not signed in', function(done) {
		// Create new Headermaster model instance
		var headermasterObj = new Headermaster(headermaster);

		// Save the Headermaster
		headermasterObj.save(function() {
			request(app).get('/headermasters/' + headermasterObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', headermaster.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Headermaster instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Headermaster
				agent.post('/headermasters')
					.send(headermaster)
					.expect(200)
					.end(function(headermasterSaveErr, headermasterSaveRes) {
						// Handle Headermaster save error
						if (headermasterSaveErr) done(headermasterSaveErr);

						// Delete existing Headermaster
						agent.delete('/headermasters/' + headermasterSaveRes.body._id)
							.send(headermaster)
							.expect(200)
							.end(function(headermasterDeleteErr, headermasterDeleteRes) {
								// Handle Headermaster error error
								if (headermasterDeleteErr) done(headermasterDeleteErr);

								// Set assertions
								(headermasterDeleteRes.body._id).should.equal(headermasterSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Headermaster instance if not signed in', function(done) {
		// Set Headermaster user 
		headermaster.user = user;

		// Create new Headermaster model instance
		var headermasterObj = new Headermaster(headermaster);

		// Save the Headermaster
		headermasterObj.save(function() {
			// Try deleting Headermaster
			request(app).delete('/headermasters/' + headermasterObj._id)
			.expect(401)
			.end(function(headermasterDeleteErr, headermasterDeleteRes) {
				// Set message assertion
				(headermasterDeleteRes.body.message).should.match('User is not logged in');

				// Handle Headermaster error error
				done(headermasterDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Headermaster.remove().exec();
		done();
	});
});