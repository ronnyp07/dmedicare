'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Cita = mongoose.model('Cita'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, cita;

/**
 * Cita routes tests
 */
describe('Cita CRUD tests', function() {
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

		// Save a user to the test db and create new Cita
		user.save(function() {
			cita = {
				name: 'Cita Name'
			};

			done();
		});
	});

	it('should be able to save Cita instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Cita
				agent.post('/citas')
					.send(cita)
					.expect(200)
					.end(function(citaSaveErr, citaSaveRes) {
						// Handle Cita save error
						if (citaSaveErr) done(citaSaveErr);

						// Get a list of Citas
						agent.get('/citas')
							.end(function(citasGetErr, citasGetRes) {
								// Handle Cita save error
								if (citasGetErr) done(citasGetErr);

								// Get Citas list
								var citas = citasGetRes.body;

								// Set assertions
								(citas[0].user._id).should.equal(userId);
								(citas[0].name).should.match('Cita Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Cita instance if not logged in', function(done) {
		agent.post('/citas')
			.send(cita)
			.expect(401)
			.end(function(citaSaveErr, citaSaveRes) {
				// Call the assertion callback
				done(citaSaveErr);
			});
	});

	it('should not be able to save Cita instance if no name is provided', function(done) {
		// Invalidate name field
		cita.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Cita
				agent.post('/citas')
					.send(cita)
					.expect(400)
					.end(function(citaSaveErr, citaSaveRes) {
						// Set message assertion
						(citaSaveRes.body.message).should.match('Please fill Cita name');
						
						// Handle Cita save error
						done(citaSaveErr);
					});
			});
	});

	it('should be able to update Cita instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Cita
				agent.post('/citas')
					.send(cita)
					.expect(200)
					.end(function(citaSaveErr, citaSaveRes) {
						// Handle Cita save error
						if (citaSaveErr) done(citaSaveErr);

						// Update Cita name
						cita.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Cita
						agent.put('/citas/' + citaSaveRes.body._id)
							.send(cita)
							.expect(200)
							.end(function(citaUpdateErr, citaUpdateRes) {
								// Handle Cita update error
								if (citaUpdateErr) done(citaUpdateErr);

								// Set assertions
								(citaUpdateRes.body._id).should.equal(citaSaveRes.body._id);
								(citaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Citas if not signed in', function(done) {
		// Create new Cita model instance
		var citaObj = new Cita(cita);

		// Save the Cita
		citaObj.save(function() {
			// Request Citas
			request(app).get('/citas')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Cita if not signed in', function(done) {
		// Create new Cita model instance
		var citaObj = new Cita(cita);

		// Save the Cita
		citaObj.save(function() {
			request(app).get('/citas/' + citaObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', cita.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Cita instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Cita
				agent.post('/citas')
					.send(cita)
					.expect(200)
					.end(function(citaSaveErr, citaSaveRes) {
						// Handle Cita save error
						if (citaSaveErr) done(citaSaveErr);

						// Delete existing Cita
						agent.delete('/citas/' + citaSaveRes.body._id)
							.send(cita)
							.expect(200)
							.end(function(citaDeleteErr, citaDeleteRes) {
								// Handle Cita error error
								if (citaDeleteErr) done(citaDeleteErr);

								// Set assertions
								(citaDeleteRes.body._id).should.equal(citaSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Cita instance if not signed in', function(done) {
		// Set Cita user 
		cita.user = user;

		// Create new Cita model instance
		var citaObj = new Cita(cita);

		// Save the Cita
		citaObj.save(function() {
			// Try deleting Cita
			request(app).delete('/citas/' + citaObj._id)
			.expect(401)
			.end(function(citaDeleteErr, citaDeleteRes) {
				// Set message assertion
				(citaDeleteRes.body.message).should.match('User is not logged in');

				// Handle Cita error error
				done(citaDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Cita.remove().exec();
		done();
	});
});