'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	autoIncrement = require('mongoose-auto-increment'),
	Schema = mongoose.Schema;


    autoIncrement.initialize(mongoose);

/**
 * Cita Schema
 */
var CitaSchema = new Schema({
	title: {
		type: String,
		default: '',
		trim: true
	},
	appLoc: {
		type: Schema.ObjectId,
		ref: 'locations'
	},
	appDoctor: {
		type: Schema.ObjectId,
		ref: 'User'
	},

	 appstartDate: {
	    type: Date,
	    trim: true
	 },

	 appsendDate: {
	  	type: Date,
	    trim: true
	  },

	appPatient: {
		type: Schema.ObjectId,
		ref: 'Patients'
        
	},
	appTypeStatus:{
    	type: String,
		default: '',
		trim: true
    },
	appType: {
		type: Schema.ObjectId,
        ref: 'Headermaster'
	},
    
    appReason:{
    	type: String,
		default: '',
		trim: true
    },
    duration:{
    	type: Number,
		default: '',
		trim: true
    },
   status:{
	  type: Schema.ObjectId,
      ref: 'Headermaster'
   },
   canceled:{
       type: Boolean,
	   default: '',
   },
   patientCheckIn: {
   	  type: Boolean,
	   default: '',
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

CitaSchema.plugin(autoIncrement.plugin, {
    model: 'Cita',
    field: 'appId',
    startAt: 100,
    incrementBy: 1
}
);

mongoose.model('Cita', CitaSchema);