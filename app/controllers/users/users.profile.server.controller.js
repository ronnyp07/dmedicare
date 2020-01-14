'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;
		user.userEC = req.body.userEC;
		user.userDOB = req.body.userDOB;
		user.firstName = req.body.firstName;
		user.lastName = req.body.lastName;
		user.userCI = req.body.userCI;
		user.department = req.body.department;
		user.jobtitle = req.body.jobtitle;
		user.userDireccion = req.body.userDireccion;
		user.pais = req.body.pais;
		user.ciudad = req.body.ciudad;
		user.sector = req.body.sector;
		user.userPhonesResult = req.body.userPhonesResult;
		user.userEContact = req.body.userEContact;
		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.json(req.user || null);
};