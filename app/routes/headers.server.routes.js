'use strict';

module.exports = function(app) {
	//var users = require('../../app/controllers/user.server.controller');
	var doctors = require('../../app/controllers/doctor.server.controller');

	app.route('/doctor/getList').
	   post(doctors.getList);



};