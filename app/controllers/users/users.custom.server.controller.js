'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');

/**
 * User middleware
 */
exports.userList = function(req, res) {
	User.find().select({ name: 1, 
	occupation: 1,
    firstName: 1, 
	lastName: 1,
	displayName: 1,
	jobtitle: 1,
	emrUserId: 1,
	email: 1,
	username: 1,
	roles: 1,
    userCI: 1,
    userTelefono: 1, 
    userEmail: 1,
    sexo: 1,
    isActive: 1,
    userPhones : 1,
    userDireccion: 1,
    deparment: 1,
    especialidad: 1, 
    pais: 1,
	ciudad: 1,
	sector: 1,
	createDate: 1, 
	createUser: 1
	 }).exec(function(err, user) {
		if (err) { return res.status(401).send({
			message: "Huvo un error trate mas tarde"
		});
	     }
		if (!user){
		  return res.status(401).send({
			message: "Huvo un error trate mas tarde"
		});	
		} 
		res.jsonp(user);
	});
};


   