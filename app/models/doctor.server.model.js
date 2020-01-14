'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment'),
	Schema = mongoose.Schema;


    autoIncrement.initialize(mongoose);
/**
 * Pai Schema
 */
var DoctorSchema = new Schema({

	 DoctorCI: {
	    tipo : {type: String, trim: true},
	    value: {type: String, trim: true}
	 },

	firstName:{
		type: String,
		trim: true
	},

	lastName:{
      type: String,
	  trim: true
	},

    DoctorTelefono: {
    	type: String,
		trim: true	
    },

    DoctorEmail: {
    	type: String,
		trim: true	
    },

    sexo: {
      type: String,
	  trim: true	
    },
    
    isActive:{
       type:Boolean,
       trim:true
    },

    doctorPhones : {
  	    celular : {type: String, trim: true}, 
        casa : {type: String, trim: true}
     },
    DoctorDireccion: {
    	type: String,
		trim: true	
    },
    deparment: {
 	   type: Schema.ObjectId,
	   ref: 'Maintain'
    },
    
    especialidad: {
       type: Schema.ObjectId,
	   ref: 'Maintain'
    },

    pais: {
		type: Schema.ObjectId,
		ref: 'Pais'
	},
	ciudad: {
		type: Schema.ObjectId,
		ref: 'Ciudad'
	},
	sector: {
		type: Schema.ObjectId,
		ref: 'Sector'
	},
	createDate: {
		type: Date,
		default: Date.now
	},
	createUser: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    updateUser:{
		type: Schema.ObjectId,
		ref: 'User'
	},
     updateDate:{
		type: Date,
		default: Date.now
	}
});

DoctorSchema.plugin(autoIncrement.plugin, {
    model: 'Doctor',
    field: 'DoctorId',
    startAt: 100,
    incrementBy: 1
}
);

mongoose.model('Doctors', DoctorSchema);