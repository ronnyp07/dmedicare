'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var patients = require('../../app/controllers/patients.server.controller');

	// Patients Routes
	app.route('/api/patients')
		.get(patients.list)
		.post(users.requiresLogin, patients.create);

	app.route('/api/patients/:patientId')
		.get(patients.read)
		.put(patients.update)
		.delete(patients.delete);

     app.route('/patient/getList').
	   post(patients.getList);
	// Finish bdy binding the Patient middleware
	app.param('patientId', patients.patientByID);
};
