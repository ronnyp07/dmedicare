'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var pais = require('../../app/controllers/pais.server.controller');

	// Pais Routes
	app.route('/pais')
		.get(pais.list)
		.post(users.requiresLogin, pais.create);

	app.route('/pais/:paiId')
		.get(pais.read)
		.put(users.requiresLogin, pais.hasAuthorization, pais.update)
		.delete(users.requiresLogin, pais.hasAuthorization, pais.delete);
	

	// Finish by binding the Pai middleware
	app.param('paiId', pais.paiByID);
};
