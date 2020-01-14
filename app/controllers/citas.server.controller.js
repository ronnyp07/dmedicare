'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Cita = mongoose.model('Cita'),
	_ = require('lodash');

/**
 * Create a Cita
 */
exports.create = function(req, res) {
	var cita = new Cita(req.body);
	cita.user = req.user;

	cita.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cita);
		}
	});
};

/**
 * Show the current Cita
 */
exports.read = function(req, res) {
	res.jsonp(req.cita);
};

/**
 * Update a Cita
 */
exports.update = function(req, res) {
	var cita = req.cita;
    cita.appLoc=   req.body.appLoc;
    cita.appDoctor=  req.body.appDoctor;
    cita.appstartDate= req.body.appstartDate;
    cita.appsendDate=req.body.appsendDate;
    cita.appPatient=req.body.appPatient;
    cita.appType= req.body.appType;
    cita.appReason=req.body.appReason;
    cita.canceled=req.body.canceled;
    cita.patientCheckIn=req.body.patientCheckIn;
    cita.appTypeStatus = req.body.appTypeStatus;
    cita.status = req.body.status;

	cita.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cita);
		}
	});
};


exports.getAppByDoc = function(req, res){
  var doctorId = req.body.doctorId;
  var currectDate = new Date();

Cita.find({appDoctor: doctorId})
.sort('-created')
.populate('user', 'displayName')
.populate('appLoc')
.populate('appDoctor')
.populate('appPatient')
.populate('status')
.populate('appType')
.exec(function(err, citas) {

var options = {
      path: 'parameters._id',
      model: 'Maintain'
    };

		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
	
	Cita.populate(citas, options, function (err, citasr) {
        res.jsonp(citasr);
    });			
	}
	});
};

/**
 * Delete an Cita
 */
exports.delete = function(req, res) {
	var cita = req.cita ;

	cita.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cita);
		}
	});
};

/**
 * List of Citas
 */
exports.list = function(req, res) { 
	Cita.find().sort('-created')
	.populate('user', 'displayName')
	.populate('appLoc')
    .populate('appDoctor')
    .populate('appPatient')
    .exec(function(err, citas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(citas);
		}
	});
};

exports.getList = function(req, res){
    Cita
    .find()
    .populate('appLoc')
    .populate('appDoctor')
    .populate('appPatient')
    .exec(function(err, citas){
    	if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(citas);
		}
    });

};

/**
 * Cita middleware
 */
exports.citaByID = function(req, res, next, id) { 
	Cita.findById(id).populate('user', 'displayName').exec(function(err, cita) {
		if (err) return next(err);
		if (! cita) return next(new Error('Failed to load Cita ' + id));
		req.cita = cita ;
		next();
	});
};

/**
 * Cita authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.cita.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
