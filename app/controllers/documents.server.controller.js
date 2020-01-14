'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Document = mongoose.model('Document'),
	_ = require('lodash');

/**
 * Create a Document
 */
exports.create = function(req, res) {
	var document = new Document(req.body);
	document.user = req.user;

	document.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(document);
		}
	});
};

/**
 * Show the current Document
 */
exports.read = function(req, res) {
	res.jsonp(req.document);
};

/**
 * Update a Document
 */
exports.update = function(req, res) {
	var document = req.document ;

	document = _.extend(document , req.body);

	document.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(document);
		}
	});
};

/**
 * Delete an Document
 */
exports.delete = function(req, res) {
	var document = req.document ;

	document.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(document);
		}
	});
};


exports.docPatientsList = function(req, res){
	Document.find({docpatient: req.body.patientId})
	.sort('-createdDate')
	.populate('createUser', 'displayName')
	.exec(function(err, documents) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(documents);
		}
	}); 
};

/**
 * List of Documents
 */
exports.list = function(req, res) { 
	Document.find().sort('-created').populate('user', 'displayName').exec(function(err, documents) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(documents);
		}
	});
};

/**
 * Document middleware
 */
exports.documentByID = function(req, res, next, id) { 
	Document.findById(id).populate('user', 'displayName').exec(function(err, document) {
		if (err) return next(err);
		if (! document) return next(new Error('Failed to load Document ' + id));
		req.document = document ;
		next();
	});
};

/**
 * Document authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.document.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
