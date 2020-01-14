'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var documents = require('../../app/controllers/documents.server.controller');

	// Documents Routes
	app.route('/documents')
		.get(documents.list)
		.post(users.requiresLogin, documents.create);

	app.route('/documents/:documentId')
		.get(documents.read)
		.put(users.requiresLogin, documents.hasAuthorization, documents.update)
		.delete(users.requiresLogin, documents.hasAuthorization, documents.delete);

	app.route('/api/docPatients')
	   .post(documents.docPatientsList);
	// Finish by binding the Document middleware
	app.param('documentId', documents.documentByID);
};
