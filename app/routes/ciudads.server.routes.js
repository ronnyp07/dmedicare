'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var ciudads = require('../../app/controllers/ciudads.server.controller');

	// Ciudads Routes
	app.route('/ciudads')
		.get(ciudads.list)
		.post(users.requiresLogin, ciudads.create);

	app.route('/ciudads/:ciudadId')
		.get(ciudads.read)
		.put(users.requiresLogin, ciudads.hasAuthorization, ciudads.update)
		.delete(users.requiresLogin, ciudads.hasAuthorization, ciudads.delete);

	// Finish by binding the Ciudad middleware
	app.param('ciudadId', ciudads.ciudadByID);
};
