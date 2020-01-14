'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Pai = mongoose.model('Pais'),
	_ = require('lodash');

/**
 * Create a Pai
 */
exports.create = function(req, res) {
	var pai = new Pai(req.body);
	pai.user = req.user;

	pai.save(function(err) {
		if (err) {
			if(err.code === 11000){
              return res.status(401).send({
					      message: 'Pais ya existe'
			    });
            }else {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		  }
		} else {
			res.jsonp(pai);
		}
	});
};

/**
 * Show the current Pai
 */
exports.read = function(req, res) {
	res.jsonp(req.pai);
};

/**
 * Update a Pai
 */
exports.update = function(req, res) {
	var pai = req.pai ;

    pai.name = req.body.name;

	pai.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pai);
		}
	});
};

/**
 * Delete an Pai
 */
exports.delete = function(req, res) {
	var pai = req.pai ;

	pai.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pai);
		}
	});
};

/**
 * List of Pais
 */
exports.list = function(req, res) { 
	Pai.find().sort('-created').populate('user', 'displayName').exec(function(err, pais) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pais);
		}
	});
};

/**
 * Pai middleware
 */
exports.paiByID = function(req, res, next, id) { 
	Pai.findById(id).populate('user', 'displayName').exec(function(err, pai) {
		if (err) return next(err);
		if (! pai) return next(new Error('Failed to load Pai ' + id));
		req.pai = pai ;
		next();
	});
};

/**
 * Pai authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.pai.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
