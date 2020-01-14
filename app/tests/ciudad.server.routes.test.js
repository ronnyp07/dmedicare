'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Ciudad = mongoose.model('Ciudad'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, ciudad;

/**
 * Ciudad routes tests
 */
describe('Ciudad CRUD tests', function() {
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

		// Save a user to the test db and create new Ciudad
		user.save(function() {
			ciudad = {
				name: 'Ciudad Name'
			};

			done();
		});
	});

	it('should be able to save Ciudad instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ciudad
				agent.post('/ciudads')
					.send(ciudad)
					.expect(200)
					.end(function(ciudadSaveErr, ciudadSaveRes) {
						// Handle Ciudad save error
						if (ciudadSaveErr) done(ciudadSaveErr);

						// Get a list of Ciudads
						agent.get('/ciudads')
							.end(function(ciudadsGetErr, ciudadsGetRes) {
								// Handle Ciudad save error
								if (ciudadsGetErr) done(ciudadsGetErr);

								// Get Ciudads list
								var ciudads = ciudadsGetRes.body;

								// Set assertions
								(ciudads[0].user._id).should.equal(userId);
								(ciudads[0].name).should.match('Ciudad Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Ciudad instance if not logged in', function(done) {
		agent.post('/ciudads')
			.send(ciudad)
			.expect(401)
			.end(function(ciudadSaveErr, ciudadSaveRes) {
				// Call the assertion callback
				done(ciudadSaveErr);
			});
	});

	it('should not be able to save Ciudad instance if no name is provided', function(done) {
		// Invalidate name field
		ciudad.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ciudad
				agent.post('/ciudads')
					.send(ciudad)
					.expect(400)
					.end(function(ciudadSaveErr, ciudadSaveRes) {
						// Set message assertion
						(ciudadSaveRes.body.message).should.match('Please fill Ciudad name');
						
						// Handle Ciudad save error
						done(ciudadSaveErr);
					});
			});
	});

	it('should be able to update Ciudad instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ciudad
				agent.post('/ciudads')
					.send(ciudad)
					.expect(200)
					.end(function(ciudadSaveErr, ciudadSaveRes) {
						// Handle Ciudad save error
						if (ciudadSaveErr) done(ciudadSaveErr);

						// Update Ciudad name
						ciudad.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Ciudad
						agent.put('/ciudads/' + ciudadSaveRes.body._id)
							.send(ciudad)
							.expect(200)
							.end(function(ciudadUpdateErr, ciudadUpdateRes) {
								// Handle Ciudad update error
								if (ciudadUpdateErr) done(ciudadUpdateErr);

								// Set assertions
								(ciudadUpdateRes.body._id).should.equal(ciudadSaveRes.body._id);
								(ciudadUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Ciudads if not signed in', function(done) {
		// Create new Ciudad model instance
		var ciudadObj = new Ciudad(ciudad);

		// Save the Ciudad
		ciudadObj.save(function() {
			// Request Ciudads
			request(app).get('/ciudads')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Ciudad if not signed in', function(done) {
		// Create new Ciudad model instance
		var ciudadObj = new Ciudad(ciudad);

		// Save the Ciudad
		ciudadObj.save(function() {
			request(app).get('/ciudads/' + ciudadObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', ciudad.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Ciudad instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ciudad
				agent.post('/ciudads')
					.send(ciudad)
					.expect(200)
					.end(function(ciudadSaveErr, ciudadSaveRes) {
						// Handle Ciudad save error
						if (ciudadSaveErr) done(ciudadSaveErr);

						// Delete existing Ciudad
						agent.delete('/ciudads/' + ciudadSaveRes.body._id)
							.send(ciudad)
							.expect(200)
							.end(function(ciudadDeleteErr, ciudadDeleteRes) {
								// Handle Ciudad error error
								if (ciudadDeleteErr) done(ciudadDeleteErr);

								// Set assertions
								(ciudadDeleteRes.body._id).should.equal(ciudadSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Ciudad instance if not signed in', function(done) {
		// Set Ciudad user 
		ciudad.user = user;

		// Create new Ciudad model instance
		var ciudadObj = new Ciudad(ciudad);

		// Save the Ciudad
		ciudadObj.save(function() {
			// Try deleting Ciudad
			request(app).delete('/ciudads/' + ciudadObj._id)
			.expect(401)
			.end(function(ciudadDeleteErr, ciudadDeleteRes) {
				// Set message assertion
				(ciudadDeleteRes.body.message).should.match('User is not logged in');

				// Handle Ciudad error error
				done(ciudadDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Ciudad.remove().exec();
		done();
	});
});