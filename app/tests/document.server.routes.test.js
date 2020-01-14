'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Document = mongoose.model('Document'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, document;

/**
 * Document routes tests
 */
describe('Document CRUD tests', function() {
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

		// Save a user to the test db and create new Document
		user.save(function() {
			document = {
				name: 'Document Name'
			};

			done();
		});
	});

	it('should be able to save Document instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Document
				agent.post('/documents')
					.send(document)
					.expect(200)
					.end(function(documentSaveErr, documentSaveRes) {
						// Handle Document save error
						if (documentSaveErr) done(documentSaveErr);

						// Get a list of Documents
						agent.get('/documents')
							.end(function(documentsGetErr, documentsGetRes) {
								// Handle Document save error
								if (documentsGetErr) done(documentsGetErr);

								// Get Documents list
								var documents = documentsGetRes.body;

								// Set assertions
								(documents[0].user._id).should.equal(userId);
								(documents[0].name).should.match('Document Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Document instance if not logged in', function(done) {
		agent.post('/documents')
			.send(document)
			.expect(401)
			.end(function(documentSaveErr, documentSaveRes) {
				// Call the assertion callback
				done(documentSaveErr);
			});
	});

	it('should not be able to save Document instance if no name is provided', function(done) {
		// Invalidate name field
		document.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Document
				agent.post('/documents')
					.send(document)
					.expect(400)
					.end(function(documentSaveErr, documentSaveRes) {
						// Set message assertion
						(documentSaveRes.body.message).should.match('Please fill Document name');
						
						// Handle Document save error
						done(documentSaveErr);
					});
			});
	});

	it('should be able to update Document instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Document
				agent.post('/documents')
					.send(document)
					.expect(200)
					.end(function(documentSaveErr, documentSaveRes) {
						// Handle Document save error
						if (documentSaveErr) done(documentSaveErr);

						// Update Document name
						document.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Document
						agent.put('/documents/' + documentSaveRes.body._id)
							.send(document)
							.expect(200)
							.end(function(documentUpdateErr, documentUpdateRes) {
								// Handle Document update error
								if (documentUpdateErr) done(documentUpdateErr);

								// Set assertions
								(documentUpdateRes.body._id).should.equal(documentSaveRes.body._id);
								(documentUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Documents if not signed in', function(done) {
		// Create new Document model instance
		var documentObj = new Document(document);

		// Save the Document
		documentObj.save(function() {
			// Request Documents
			request(app).get('/documents')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Document if not signed in', function(done) {
		// Create new Document model instance
		var documentObj = new Document(document);

		// Save the Document
		documentObj.save(function() {
			request(app).get('/documents/' + documentObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', document.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Document instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Document
				agent.post('/documents')
					.send(document)
					.expect(200)
					.end(function(documentSaveErr, documentSaveRes) {
						// Handle Document save error
						if (documentSaveErr) done(documentSaveErr);

						// Delete existing Document
						agent.delete('/documents/' + documentSaveRes.body._id)
							.send(document)
							.expect(200)
							.end(function(documentDeleteErr, documentDeleteRes) {
								// Handle Document error error
								if (documentDeleteErr) done(documentDeleteErr);

								// Set assertions
								(documentDeleteRes.body._id).should.equal(documentSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Document instance if not signed in', function(done) {
		// Set Document user 
		document.user = user;

		// Create new Document model instance
		var documentObj = new Document(document);

		// Save the Document
		documentObj.save(function() {
			// Try deleting Document
			request(app).delete('/documents/' + documentObj._id)
			.expect(401)
			.end(function(documentDeleteErr, documentDeleteRes) {
				// Set message assertion
				(documentDeleteRes.body.message).should.match('User is not logged in');

				// Handle Document error error
				done(documentDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Document.remove().exec();
		done();
	});
});