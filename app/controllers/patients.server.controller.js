'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Patient = mongoose.model('Patients'),
	_ = require('lodash');
	require('mongoose-middleware').initialize(mongoose);

/**
 * Create a Patient
 */
exports.create = function(req, res) {
	var patient = new Patient(req.body);
	patient.creador = req.user;

	patient.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(patient);
		}
	});
};

/**
 * Show the current Patient
 */
exports.read = function(req, res) {
	res.jsonp(req.patient);
};

/**
 * Update a Patient
 */
exports.update = function(req, res) {
	var patient = req.patient ;
    patient.PatientCI = req.body.PatientCI;
    patient.patientEContact= req.body.patientEContact;
    patient.patientFirstName= req.body.patientFirstName;
    patient.patientLastName = req.body.patientLastName;
    patient.patientDOB = req.body.patientDOB;
    patient.patientEdad = req.body.patientEdad;
    patient.patientSexo = req.body.patientSexo;
    patient.patientEC = req.body.patientEC;
    patient.patientSeguro = req.body.patientSeguro;
    patient.patientTipoSangre = req.body.patientTipoSangre;
    patient.patientPhones = req.body.patientPhones;
    patient.patientReligion = req.body.patientReligion;
    patient.patientIdioma = req.body.patientIdioma;
    patient.patientNacionalidad = req.body.patientNacionalidad;
    patient.patientEmail = req.body.patientEmail;
    patient.patientDireccion = req.body.patientDireccion;
    patient.pais = req.body.pais;
    patient.ciudad = req.body.ciudad;
    patient.sector = req.body.sector;
    patient.updateDate = req.body.updateDate;
    patient.updateUser = req.body.updateUser;
    console.log(patient);
	patient.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: err
				//errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(patient);
		}
	});
};

/**
 * Delete an Patient
 */
exports.delete = function(req, res) {
	var patient = req.patient ;

	patient.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(patient);
		}
	});
};

/**
 * List of Patients
 */
// exports.list = function(req, res) { 
// 	Patient.find().sort('-created').populate('user', 'displayName').exec(function(err, patients) {
// 		if (err) {
// 			return res.status(400).send({
// 				message: errorHandler.getErrorMessage(err)
// 			});
// 		} else {
// 			res.jsonp(patients);
// 		}
// 	});
// };

exports.list = function(req, res) { 
     var count = req.query.count || 5;
     var page = req.query.page || 1;
     var filter = {
     	filters: {
     		field: ['name'],
     		mandatory: {
     			contains: req.query.filter
     		}
     	}
     };

     var pagination = {
     	start : (page - 1) * count,
     	count : count
     };

     var sort = {
     	sort: {
     		desc: '_id'
     	}
     };

    Patient
    .find()
    .filter(filter)
    .order(sort)
    .populate('pais')
    .populate('ciudad')
    .populate('sector')
    .populate('maintain')
    .populate('patientEC')
    .populate('patientSexo')
    .populate('patientSeguro')
    .populate('patientReligion')
    .populate('patientIdioma')
    .populate(' patientNacionalidad')
    .page(pagination, function(err, patient){
    	if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(patient);
		}
    });
};


exports.getList =  function(req, res) { 
   Patient
    .find()
    .sort('patientFirstName')
	.populate('patientSeguro')
    .exec(function(err, patient){
    	if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(patient);
		}
    });
};

/**
 * Patient middleware
 */
exports.patientByID =  function(req, res, next, id) { 
	Patient.findById(id).populate('user', 'displayName')
    .populate('patientSeguro')
    .populate('pais')
    .populate('ciudad')
    .populate('sector')
    .populate('maintain')
    .populate('patientEC')
    .populate('patientSexo')
    .populate('patientSeguro')
    .populate('patientReligion')
    .populate('patientIdioma')
    .populate(' patientNacionalidad')
    .exec(function(err, patient) {
		if (err) return next(err);
		if (! patient) return next(new Error('Failed to load Patient ' + id));
		req.patient = patient ;
		next();
	});
};

/**
 * Patient authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.patient.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
