'use strict';

module.exports = function(app) {
	//var users = require('../../app/controllers/users.server.controller');
	var citas = require('../../app/controllers/citas.server.controller');

	// Citas Routes
	app.route('/citas')
		.get(citas.list)
		.post(citas.create);

	app.route('/citas/:citaId')
		.get(citas.read)
		.put(citas.update)
		.delete(citas.hasAuthorization, citas.delete);

	app.route('/citas/getList')
	  .post(citas.getList);

	app.route('/citas/getAppDoc')
	  .post(citas.getAppByDoc);
	// Finish by binding the Cita middleware
	app.param('citaId', citas.citaByID);
};
